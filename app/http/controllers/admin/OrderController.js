const Order= require("../../../models/order");

function OrderController()
{
    return{
        index(req,res){
         Order.find({status:{$ne:'completed'}},null,{sort : {'createdAt':-1 }} ).populate('customerId','-password').exec((err,orders)=>{
             
            //console.log(req.xhr);
            if(req.xhr){  //agar page ko refresh nahi kia gya hai toh ajax request ho rahii
                res.json(orders);
            }
            else 
            {
                res.render('admin/orders');}
            //populate order wali customer id ka use krke user database se pura data nikalke de raha us customr id ka
         })
        },
        async show(req, res) {
            const order = await Order.findById(req.params.id)
            // Authorize user
            if(req.user._id.toString() === order.customerId.toString()) {
                return res.render('customers/singleOrder', { order })
            }
            return  res.redirect('/')
        }
    }
    
}

module.exports=OrderController;