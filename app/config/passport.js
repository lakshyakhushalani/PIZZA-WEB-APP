const LocalStrategy=require("passport-local").Strategy
const User=require("../models/user");
const bcrypt=require("bcrypt");

function Init(passport){
  passport.use(new LocalStrategy({usernameField:"email"},async (email,password,done)=>{
    //LOGIN

    //Check if email already exisit
    const user=await User.findOne({email:email});
    //User ek array of object return hoga agar find use krenge toh isliye findone use kia

    if(!user){
        return done(null,false,{message:"email does not exist"});
    }
    else{

          bcrypt.compare(password,user.password).then(match=>{
            if(match)  return done(null,user,{message:"Logged in Succesfull"});

            return done(null,false,{message:"wrong user name or Password "});
          }).catch(err=>{
            // console.log(err);
            return done(null,false,{message:"Something went Wrong "});
          })
    } 

  }));

  passport.serializeUser((user,done)=>{
    done(null,user._id);
  })

  passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{
      done(err,user);
    });
  });
}

module.exports=Init;