import axios from "axios";
import Noty from "noty";
import { initAdmin } from './admin'
import moment from 'moment'

let addToCart=document.querySelectorAll(".add-to-cart");
let cartcounter=document.querySelector("#cartcounter");

function updatecart(pizza){

    axios.post("/update-cart",pizza).then(res=>{
        console.log(res);
       cartcounter.innerText=res.data.totalQty;
        
       new Noty({
        type:"success",
        timeout:1000,
        progressBar:false,
        text:"Item added to cart"
        }).show();

    }).catch(err=>{

        new Noty({
            type:"error",
            timeout:1000,
            progressBar:false,
            text:"something went wrong"
            }).show();

    })

   
}

addToCart.forEach((btn)=>{
    btn.addEventListener('click', (e)=>{
        let pizza=JSON.parse(btn.dataset.pizza);
        updatecart(pizza);
    })
})

const alertMsg=document.querySelector("#success-alert");
if(alertMsg){
    setTimeout( ()=> {
       alertMsg.remove();
    },2000)
}



// Change order status
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order) {

    //real time communication mai orange colour ka text hatega ni update hone ke bad isliye yeh use kr rahe
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })

    let stepCompleted = true;
    statuses.forEach((status) => {
       let dataProp = status.dataset.status
       if(stepCompleted) {
            status.classList.add('step-completed')
       }
       if(dataProp === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
           if(status.nextElementSibling) {
            status.nextElementSibling.classList.add('current')
           }
       }
    })

}

updateStatus(order);

//socket.io

let socket=io();



if(order){
    socket.emit('join',`order_${order._id}`);
}

let adminpath=window.location.pathname;
//console.log(adminpath);
if(adminpath.includes('admin')){
   // console.log("connected")
   initAdmin(socket);
   socket.emit('join','adminRoom');
}

socket.on('orderUpdated',(data)=>{
    //order variable ki copy le rahe hai neeche wali line mai
    const updatedorder={...order};
    updatedorder.updatedAt=moment().format();
    updatedorder.status=data.status;
    updateStatus(updatedorder);

    new Noty({
        type:"success",
        timeout:1000,
        progressBar:false,
        text:"order updated"
        }).show();

})

