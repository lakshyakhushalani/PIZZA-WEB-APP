const express=require("express");
const ejs=require("ejs");
const expressLayout=require("express-ejs-layouts");
const path=require("path");

const app=express();

const PORT=3000 || process.env.PORT;

//set template engine

//app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views" )); 
app.set("view engine","ejs");

app.get("/",(req,res)=>{
    res.render("home");
})

app.listen(PORT,()=>{
    console.log(`server is listening to the port ${PORT}`);
})