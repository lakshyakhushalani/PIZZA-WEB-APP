const Order= require("../../../models/order");
const moment=require("moment");
function OrderController()
{
  return {
    store(req,res){
        const {phone,address}=req.body;
        if(!phone || !address)
        {
           req.flash('error','All fields are Required');
           return res.redirect("/cart");
        }

        const order = new Order({
          customerId:req.user._id,
          items:req.session.cart.items,
          address:address,
          phone:phone
        });
            
        
        order.save().then(result=>{
          Order.populate(result,( {path : 'customerId'}), (err,placedorder)=>{
               
            req.flash("success","Order Placed Succesfully");
             delete req.session.cart;

            // notify in server.js that order is placed so that server.js can send a message to client side with the new order to update in the admin/orders list
             const eventEmitter = req.app.get('eventEmitter')
             eventEmitter.emit('orderPlaced', placedorder );
             //console.log(result);

             return res.redirect("/customers/orders");

          });
             
        }).catch(err=>{
          console.log(err)
            req.flash("error","something went Wrong");
            return res.redirect("/cart");
        })
    },
    
   async index(req,res){
    const orders=await Order.find({customerId:req.user._id},null,
      {sort:{'createdAt':-1}});

      res.header('Cache-Control','no-cache,private,no-store,must-revalidate,max-stale=0,post-check=0,pre-check=0');
    res.render("customers/orders",{orders:orders,moment:moment});
   // console.log(orders);
   },

   async  show(req,res) {
    const order=await Order.findById(req.params.id);
    //console.log(req.param.id);
    //autherise user
    //agar /customer/orders/:id agar is API mai kisi ek user ne apni login id se dusre ki :id daali toh use b access miljayega dekhne kaa..
    //ise avoid krne ke autherisation ka use krenge
    if(req.user._id.toString()===order.customerId.toString())
    {
      return res.render("customers/singleOrder",{order:order});
    }
    else  {
      return res.redirect("/");
    }
 }

  }
}

module.exports=OrderController;