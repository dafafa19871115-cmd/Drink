const API_URL =

"https://script.google.com/macros/s/AKfycbxo3Gda0zUuI8gkaHSqjJza5KaEn0CILxfjdONDkpjoIoE2cLGEojEwbTuX1kQfh3FKwg/exec";



let oldOrders=[];



async function loadOrders(){


let response = await fetch(API_URL);


let data = await response.json();



let box=document.getElementById("orders");



box.innerHTML="";



data.forEach(order=>{


let isNew =
!oldOrders.some(
x=>x.orderId===order.orderId
);



box.innerHTML += `


<div class="order ${isNew ? "new-order":""}">


${isNew ? 
"<span class='badge'>🔔 新訂單</span>"
:""}



<h2>

🧾 ${order.orderId}

</h2>


<p>

🥤 ${order.product}

</p>


<p>

數量：

${order.qty}

</p>


<p>

金額：

${order.total} 元

</p>


<p>

狀態：

<b>${order.status}</b>

</p>



<button class="start"

onclick="updateStatus('${order.orderId}','製作中')">

開始製作

</button>



<button class="finish"

onclick="updateStatus('${order.orderId}','完成')">

完成

</button>


</div>


`;



});



// 有新訂單

if(data.length > oldOrders.length){


let audio =
document.getElementById("ding");


audio.currentTime=0;


audio.play();


}



oldOrders=data;



}




async function updateStatus(id,status){



await fetch(API_URL,{

method:"POST",

body:JSON.stringify({

action:"update",

orderId:id,

status:status

})

});



loadOrders();


}




setInterval(loadOrders,3000);


loadOrders();
