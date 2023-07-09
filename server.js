require("dotenv").config();
const express=require("express");
const ejs=require("ejs");
const expressLayout=require("express-ejs-layouts");
const path=require("path");
const session=require("express-session");
const flash=require("express-flash");
const MongoDbstore=require("connect-mongo")(session);
const passport=require("passport");
const Emitter=require("events");



const app=express();

const PORT=3000 || process.env.PORT;

//database
const mongoose=require("mongoose");
mongoose.set('strictQuery', true);

mongoose.connect("mongodb://127.0.0.1:27017/Pizza",{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{console.log("database connected")})
.catch((e)=>{console.log("Not connected") }); 

//session 
let mongostore= new MongoDbstore({
    mongooseConnection: mongoose.connection,
    collection:'session'
})

//event emitter
const eventEmitter=new Emitter();
// agar do file mai communincate krna hai jaise  yaha or statuscontroller.js ke beech kr rahe hai toh eventeMITTER KA SAME INSTANCE CHAHIYE HOGAAA
//isliye use app.set use krke store kr rahe app mai
app.set('eventEmitter',eventEmitter);
//app.set se evenEmitter naam ka event app mai bind hogyaaa...ab koi b get request mai req varibale ke andar req.app.eventeMITTER se ham is
//event ko access kr sakte hai

//sessions
app.use(session({
    secret:process.env.SECRET_KEY,
    resave:false,
    store:mongostore,
    saveUninitialized:false,
    cookie: {maxAge:1000*60*60*24}
}))

//passport config
const passportInit=require("./app/config/passport");
passportInit(passport);

//passport
app.use(passport.initialize());
app.use(passport.session());

app.use(flash())  // isi se databasde mai save ho raha session

//assest
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//set template engine

app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views" )); 
app.set("view engine","ejs");

//global middlewares   // isliye use kia taki layouts mai ejs mai session wali key use kr sake
app.use((req,res,next)=>{
    res.locals.session=req.session;
    res.locals.user=req.user;
    next();
})
//routes
require("./routes/web")(app);

const server=app.listen(PORT,()=>{
    console.log(`server is listening to the port ${PORT}`);
});

//socket
const io=require("socket.io")(server);

io.on('connection',(socket)=>{
   (
    socket.on('join',(room_no)=>{
       // console.log(room_no);
        socket.join(room_no);
    }))
});

eventEmitter.on('orderUpdated',(data)=>{
    io.to(`order_${data.id}`).emit('orderUpdated',data);
})

eventEmitter.on('orderPlaced',(data)=>{
   //console.log(data);
    io.to('adminRoom').emit('orderPlaced',data);
})

