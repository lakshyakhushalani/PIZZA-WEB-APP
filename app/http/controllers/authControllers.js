const User=require("../../models/user");
const passport=require("passport");
const bcrypt=require("bcrypt");

function authController()
{
    const _getRedirectUrl=(req)=>{
      return req.user.role==="admin" ? "/admin/orders" : "/customer/orders";
    }

    return {

        login:(req,res)=>{
            res.render("auth/login");
        },
        
        postlogin:(req,res,next)=>{ 
          
          passport.authenticate("local",(err,user,info)=>{
            if(err){
              req.flash("error",info.message);
              return next(err);
            }
            if(!user){
              req.flash("error",info.message);
              return res.redirect("/login");
            }
            req.logIn(user,(err)=>{
              if(err){
                req.flash("error",info.message);
                return next(err);
              }

              res.redirect(_getRedirectUrl(req));
            })
          })(req,res,next)
        },

        register:(req,res)=>{
            res.render("auth/register");
        },

        postregister:async (req,res)=>{
          const {name, email, password}=req.body;

          if(!name || !email || !password){
            req.flash("error","All fields are required");
            req.flash("name",name);
            req.flash("email",email);  // isse data har frontend page pe available hojata hai ...jo ki messages naam ke object mai store hota hai

            res.redirect("/register");
          }

          User.exists({email:email},(err,result)=>{
            if(result){
            req.flash("error","Email already exists")
            req.flash("name",name);
            req.flash("email",email);
            res.redirect("/register");
            }
          })
          // hashing password

          const hashedpassword=await bcrypt.hash(password,10);

          //creating a new user

          const ok=new User({
            email:email,
            name:name,
            password:hashedpassword
          })

          ok.save().then((user)=>{
            //login
                res.redirect("/");
          }).catch(err=>{
            req.flash("error","Something Went Wrong");
            res.redirect("/register");
          })

          // console.log(req.body);
        },

        logout:function(req, res, next) {
          req.logout(function(err) {
            if (err) { return next(err); }
            res.redirect('/');
          });
        }
            
    }
}

module.exports=authController;
