// =========================
// Google Apps Script API
// =========================

const API_URL =
"https://script.google.com/macros/s/AKfycbzm6Q2SWnf9VZ6vGM7AEKHjePMpXA4eAe43NJXHMB__UMravExbv4IbkIOFJP1BMG9Mvw/exec";


let oldOrders=[];
let firstLoad=true;


// =========================
// 讀取訂單
// =========================

async function loadOrders(){

try{


const response=await fetch(API_URL);

const data=await response.json();


data.reverse();



const box=document.getElementById("orders");

box.innerHTML="";



data.forEach(order=>{


const isNew =
!firstLoad &&
!oldOrders.some(x=>x.id===order.id);



let statusClass="wait";


if(order.status==="製作中")
statusClass="making";


if(order.status==="完成")
statusClass="done";



box.innerHTML += `


<div class="order ${isNew?"new-order":""}">


${isNew?
"<span class='badge'>🔔 新訂單</span>":
""}



<h2>

${order.orderId}

</h2>



<p>
🥤 ${order.product}
</p>


<p>
杯數：${order.qty}
</p>


<p>
金額：${order.total} 元
</p>



<p>

狀態：

<span class="status ${statusClass}">

${order.status}

</span>


</p>




<button class="start"

onclick="updateStatus('${order.id}','製作中')">

開始製作

</button>



<button class="finish"

onclick="finishOrder('${order.id}','${order.orderId}')">

完成叫號

</button>



<button class="cancel"

onclick="cancelOrder('${order.id}')">

取消訂單

</button>



</div>



`;



});




// 新訂單提示

if(!firstLoad && data.length>oldOrders.length){


const ding=document.getElementById("ding");


if(ding){

ding.currentTime=0;

ding.play().catch(()=>{});


}


}



oldOrders=[...data];

firstLoad=false;



// 更新 Dashboard

updateDashboard(data);



}

catch(error){

console.log(error);

}


}





// =========================
// 完成訂單 + 叫號
// =========================


async function finishOrder(id,number){


await updateStatus(id,"完成");


// 語音播報

callNumber(number);


}





// =========================
// 語音叫號
// =========================


function callNumber(number){


let text =
`${number} 已完成，請取餐`;



let speech =
new SpeechSynthesisUtterance(text);


speech.lang="zh-TW";

speech.rate=0.9;


window.speechSynthesis.speak(speech);



}




// =========================
// 修改狀態
// =========================


async function updateStatus(id,status){



await fetch(API_URL,{


method:"POST",


headers:{

"Content-Type":"text/plain"

},


body:JSON.stringify({


type:"update",

id:id,

status:status


})


});


loadOrders();



}




// =========================
// 取消訂單
// =========================


async function cancelOrder(id){



if(!confirm("確定取消此訂單？"))

return;



await fetch(API_URL,{


method:"POST",


headers:{

"Content-Type":"text/plain"

},


body:JSON.stringify({

type:"update",

id:id,

status:"取消"


})


});



loadOrders();



}




// =========================
// Dashboard
// =========================


function updateDashboard(data){



let money=0;

let count=0;



data.forEach(order=>{


if(order.status!=="取消"){


money += Number(order.total || 0);


count += Number(order.qty || 0);


}



});



const moneyBox=
document.getElementById("todayMoney");


const countBox=
document.getElementById("todayCount");



if(moneyBox)
moneyBox.innerHTML=
money+" 元";


if(countBox)
countBox.innerHTML=
count+" 杯";



}





// =========================
// 商品管理入口
// =========================


function productManage(){


location.href="product.html";


}



// =========================
// 歷史訂單
// =========================


function showHistory(){


location.href="history.html";


}



// =========================
// 登出
// =========================


function logout(){


localStorage.removeItem("shopLogin");


location.href="login.html";


}




// =========================
// 啟動
// =========================


loadOrders();


setInterval(loadOrders,3000);
