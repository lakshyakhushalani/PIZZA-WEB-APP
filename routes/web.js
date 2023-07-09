const home=require("../app/http/controllers/HomeControler");
const auth=require("../app/http/controllers/authControllers");
const cart=require("../app/http/controllers/customers/cartController");
const order=require("../app/http/controllers/customers/OrderController");
const adminOrderController=require("../app/http/controllers/admin/OrderController");
const statusController = require('../app/http/controllers/admin/statusController')

//middlewares
const guest=require("../app/http/middlewares/guest");
const Auth=require("../app/http/middlewares/auth");
const admin=require("../app/http/middlewares/admin");


function initrRoutes(app)
{
   
     app.get("/", home().index);
    
     app.get("/login",auth().login)
     app.post("/login",guest,auth().postlogin);
   
    
    app.get("/register",auth().register)
    app.post("/register",guest,auth().postregister);

    app.get("/cart",cart().index);

    app.post("/update-cart",cart().update);

    app.post("/logout",auth().logout);

    // //customers routes
    // app.post("/orders",Auth,order().store)
    // app.get("/customers/orders",Auth,order().index);
    // app.get('/customer/orders/:id', auth, order().show)

    // //admin controllers
    // app.get("/admin/orders",admin,adminOrderController().index);
    // app.post('/admin/order/status', admin, statusController().update)

    //customers routes
    app.post("/orders",Auth,order().store)
    app.get("/customers/orders", Auth, order().index);
    app.get("/customer/orders/:id" , order().show);

    //admin controllers
    app.get("/admin/orders",admin,adminOrderController().index);

    //admin/order/status
    app.post("/admin/order/status",statusController().update);
}

module.exports=initrRoutes;