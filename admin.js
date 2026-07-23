// =========================
// Google Apps Script API
// =========================

const API_URL =
"https://script.google.com/macros/s/AKfycbzJy17jslTbD4H2ijPrDl-LsWVbV23155i8FFLCl7BdDXGYrWKPYP39Hfkx3kdJXct09g/exec";



let oldOrders=[];
let firstLoad=true;

let allOrders=[];



// =========================
// 頁面切換
// =========================


function showPage(page){


const box=document.getElementById("content");



switch(page){


case "dashboard":

showDashboard();

break;



case "orders":

showOrders();

break;



case "products":

showProducts();

break;



case "history":

showHistory();

break;


}


}





// =========================
// Dashboard
// =========================


async function showDashboard(){


document.getElementById("content").innerHTML=`

<h1>📊 今日營運</h1>


<div class="dashboard">


<div class="card">

<h3>今日營業額</h3>

<div class="number" id="money">

讀取中

</div>

</div>



<div class="card">

<h3>今日杯數</h3>

<div class="number" id="cups">

讀取中

</div>

</div>



<div class="card">

<h3>🔥 熱賣排行</h3>

<div id="hot">

讀取中

</div>

</div>


</div>

`;



loadOrders();


}




// =========================
// 訂單頁
// =========================


function showOrders(){


document.getElementById("content").innerHTML=`

<h1>📦 訂單管理</h1>


<div id="orders"></div>


`;



loadOrders();


}




// =========================
// 商品頁
// =========================


function showProducts(){


document.getElementById("content").innerHTML=`

<h1>🔍 商品管理</h1>


<div id="products">

商品管理載入中...

</div>

`;



loadProducts();


}





// =========================
// 歷史訂單
// =========================


function showHistory(){


document.getElementById("content").innerHTML=`

<h1>📅 歷史訂單</h1>


<div id="history">

載入中...

</div>

`;



loadHistory();


}





// =========================
// 讀取訂單
// =========================


async function loadOrders(){


try{


const response =
await fetch(API_URL);



let data =
await response.json();



data.reverse();



allOrders=data;



const box =
document.getElementById("orders");



if(box){


box.innerHTML="";



data.forEach(order=>{


const isNew =
!firstLoad &&
!oldOrders.some(
x=>x.id===order.id
);



let statusClass="wait";


if(order.status==="製作中")
statusClass="making";


if(order.status==="完成")
statusClass="done";



box.innerHTML+=`


<div class="order">


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

📢 完成叫號

</button>



<button class="cancel"

onclick="cancelOrder('${order.id}')">

❌ 取消

</button>


</div>


`;



});



}




if(!firstLoad &&
data.length>oldOrders.length){


let ding=
document.getElementById("ding");


if(ding){

ding.play().catch(()=>{});

}


}



oldOrders=[...data];

firstLoad=false;



updateDashboard(data);



}

catch(e){

console.log(e);

}


}




// =========================
// 完成叫號
// =========================


async function finishOrder(id,number){


await updateStatus(id,"完成");


callNumber(number);


}





function callNumber(number){


let speech =
new SpeechSynthesisUtterance(

`${number} 已完成，請取餐`

);


speech.lang="zh-TW";

speech.rate=0.9;



speechSynthesis.speak(speech);


}




// =========================
// 更新狀態
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



if(!confirm("確定取消訂單？"))

return;



await updateStatus(id,"取消");


}





// =========================
// Dashboard統計
// =========================


function updateDashboard(data){



let money=0;

let cups=0;

let hot={};



data.forEach(order=>{


if(order.status!="取消"){


money+=Number(order.total||0);


cups+=Number(order.qty||0);



let name=order.product;


hot[name]=
(hot[name]||0)+
Number(order.qty||0);



}


});



let moneyBox=
document.getElementById("money");


let cupsBox=
document.getElementById("cups");



if(moneyBox)
moneyBox.innerHTML=
money+" 元";


if(cupsBox)
cupsBox.innerHTML=
cups+" 杯";



let hotBox=
document.getElementById("hot");



if(hotBox){


let list=
Object.entries(hot)
.sort((a,b)=>b[1]-a[1])
.slice(0,5);



hotBox.innerHTML=
list.map(
(x,i)=>
`${i+1}. ${x[0]} (${x[1]}杯)`
)
.join("<br>");

}


}




// =========================
// 商品管理
// =========================


async function loadProducts(){



let box=
document.getElementById("products");



if(box)

box.innerHTML=

`
請使用商品管理模組
`;



}





// =========================
// 歷史訂單
// =========================


function loadHistory(){



let box=
document.getElementById("history");



if(!box)return;



box.innerHTML="";



allOrders.forEach(o=>{


box.innerHTML+=`

<div class="order">

<h3>
${o.orderId}
</h3>

<p>
${o.product}
</p>

<p>
${o.status}
</p>

</div>

`;

});


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


showPage("dashboard");


setInterval(loadOrders,3000);



// 給 HTML onclick 使用

window.showPage=showPage;

window.logout=logout;

window.updateStatus=updateStatus;

window.finishOrder=finishOrder;

window.cancelOrder=cancelOrder;
