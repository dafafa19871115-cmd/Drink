const API_URL =
"https://script.google.com/macros/s/你的網址/exec";



let oldCount=0;



async function loadOrders(){


let res=
await fetch(API_URL);



let orders=
await res.json();



let today=
new Date()
.toISOString()
.substring(0,10);



let todayOrders =
orders.filter(
x=>x.date===today
);



let box=
document.getElementById("orders");


box.innerHTML="";



if(todayOrders.length>oldCount){

let sound =
new Audio("sound.mp3");

sound.play();

}


oldCount=
todayOrders.length;



todayOrders.reverse()
.forEach(order=>{


box.innerHTML +=`

<div class="card">


<h2>
${order.orderId}
</h2>


<p>
${order.product}
</p>


<p>
金額：
${order.total} 元
</p>


<p>
狀態：

<select
onchange="changeStatus('${order.orderId}',this.value)"
>


<option ${order.status=="待製作"?"selected":""}>
待製作
</option>


<option ${order.status=="製作中"?"selected":""}>
製作中
</option>


<option ${order.status=="完成"?"selected":""}>
完成
</option>


</select>


</p>


</div>


`;


});



showHot(todayOrders);


}



async function changeStatus(id,status){


await fetch(

API_URL,

{

method:"POST",

body:JSON.stringify({

type:"update",

orderId:id,

status:status

})

}

);



loadOrders();


}




function showHot(data){


let count={};



data.forEach(order=>{


order.product
.split("、")
.forEach(item=>{


let arr =
item.split(" x ");


count[arr[0]] =
(count[arr[0]]||0)
+
Number(arr[1]);


});


});



let box=
document.getElementById("hot");


box.innerHTML="";


Object.entries(count)

.sort((a,b)=>b[1]-a[1])

.forEach((x,i)=>{


box.innerHTML +=`

<p>
${i+1}️⃣
${x[0]}
${x[1]}杯
</p>

`;

});


}



loadOrders();


setInterval(
loadOrders,
10000
);
