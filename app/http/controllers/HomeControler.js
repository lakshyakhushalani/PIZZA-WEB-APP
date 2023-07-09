
const Menu=require("../../models/menu");

function homeController(){
    return {
        index: async (req,res)=>{
            
            const AllPizza=await Menu.find();  //fetching all the pizzas from db
            res.render("home",{pizzas:AllPizza});
        }
    }
}

module.exports=homeController;
