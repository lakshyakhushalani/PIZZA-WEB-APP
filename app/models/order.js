const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const OrderSchema=new Schema({
    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    items:{type:Object, required:true},
    phone:{type:String,required:true}, 
    address:{type:String,required:true}, 
    paymentType:{type:String,default:"COD"}, 
    status:{type:String,default:"Order_Placed"}, 
},{timestamps:true})

// const OrderSchema=new Schema({
//     customerId:{
//         type:{
//           type:  mongoose.Schema.Types.ObjectId
//         },
//         ref:'User',
//         required:true
//     },
//     items:{type:{type:String}, required:true},
//     phone:{type:{type:String},required:true}, 
//     address:{type:{type:String},required:true}, 
//     paymentType:{type:{type:String},default:"COD"}, 
//     status:{type:{type:String},default:"Order_Placed"}, 
// },{timestamps:true})


module.exports=mongoose.model("Order",OrderSchema);