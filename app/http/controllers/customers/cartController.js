

function CartController(){
    return {
        index:(req,res)=>{
            res.render("customers/cart");
        },

        update:(req,res)=>{

            //for the first time creating cart and adding basic object structure
            if(!req.session.cart)
            {
                req.session.cart={
                    items:{},
                    totalQty:0,
                    totalprice:0,
                }

            }
            let cart=req.session.cart;
         //check-if pizza is already in cart or not

           if(!cart.items[req.body._id])
           {
               cart.items[req.body._id]={
                   item:req.body,
                   qty:1
               }
               
               cart.totalQty++;
               cart.totalprice+=req.body.price;
           }
           else
           {
            cart.items[req.body._id].qty++;
            cart.totalQty++;
            cart.totalprice+=req.body.price;
           }
            res.json({totalQty:req.session.cart.totalQty});
        }
       
    }
}

module.exports=CartController;
