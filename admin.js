const API_URL =
"https://script.google.com/macros/s/AKfycbzoQK8CDdnOsfjytLWq5WoWguIEJ6Q_XYg2kssNYbcZr6gVz3wIdsc576yLYE3U7YKs6Q/exec";


let oldOrders=[];

let firstLoad=true;

let refreshTime=3000;



// =====================
// 讀取設定
// =====================

async function loadSettings(){


try{


let res =
await fetch(
API_URL+"?type=settings"
);



let settings =
await res.json();



checkBusinessStatus(settings);



if(settings["自動刷新秒數"]){


refreshTime =
Number(settings["自動刷新秒數"])
*1000;


}



if(settings["接單提示音"]==="OFF"){


let audio =
document.getElementById("ding");


if(audio){

audio.remove();

}


}



}
catch(err){

console.log(
"設定讀取失敗",
err
);

}


}







// =====================
// 營業狀態
// =====================

function checkBusinessStatus(settings){



let box =
document.getElementById(
"businessStatus"
);



if(!box)
return;



let now =
new Date();



let time =
now.getHours()
.toString()
.padStart(2,"0")
+
":"
+
now.getMinutes()
.toString()
.padStart(2,"0");




if(settings["店休"]==="ON"){


box.innerHTML=
"🔴 今日店休";


box.className=
"status close";


return;


}




if(settings["接受訂單"]==="OFF"){


box.innerHTML=
"🟠 暫停接單";


box.className=
"status close";


return;


}



if(
time >= settings["開店時間"]
&&
time <= settings["打烊時間"]
){


box.innerHTML=
"🟢 目前營業中";


box.className=
"status open";


}
else{


box.innerHTML=
"🔴 目前休息中";


box.className=
"status close";


}



}








// =====================
// 讀取訂單
// =====================

async function loadOrders(){


try{


let res =
await fetch(API_URL);



let data =
await res.json();



// 最新訂單在前

data.reverse();



renderOrders(data);


updateReport(data);



}

catch(err){


console.log(
"訂單讀取錯誤",
err
);


}


}







// =====================
// 顯示訂單
// =====================

function renderOrders(data){



let box =
document.getElementById(
"orders"
);



box.innerHTML="";



data.forEach(order=>{


let isNew =
!firstLoad
&&
!oldOrders.some(
x=>x.orderId===order.orderId
);




box.innerHTML += `


<div class="order ${isNew?"new-order":""}">


${isNew?
"<span class='badge'>🔔 新訂單</span>"
:
""}



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

💰 ${order.total} 元

</p>



<p>

狀態：

<b>

${order.status}

</b>

</p>




<button class="start"

onclick="updateStatus('${order.orderId}','製作中')">

🔥 開始製作

</button>




<button class="finish"

onclick="updateStatus('${order.orderId}','完成')">

✅ 完成

</button>


</div>


`;



});





// 新單提示音

if(
!firstLoad
&&
data.length>oldOrders.length
){



let audio =
document.getElementById(
"ding"
);



if(audio){


audio.currentTime=0;


audio.play()
.catch(()=>{});


}


}



oldOrders=data;

firstLoad=false;



}







// =====================
// 修改狀態
// =====================

async function updateStatus(id,status){



await fetch(API_URL,{

method:"POST",

headers:{

"Content-Type":"text/plain"

},


body:JSON.stringify({


type:"update",

orderId:id,

status:status


})


});



loadOrders();



}







// =====================
// 指定日期報表
// =====================

async function searchReport(){



let date =
document.getElementById(
"reportDateInput"
).value;



if(!date){

alert(
"請選擇日期"
);

return;

}



let res =
await fetch(
API_URL+
"?type=report&date="
+
date
);



let data =
await res.json();



showReport(data);


}







function updateReport(data){



let today =
new Date()
.toISOString()
.substring(0,10);



let result=[];



data.forEach(x=>{


if(x.date===today){

result.push(x);

}


});



showReportData(result);


}







function showReport(data){


document.getElementById(
"reportOrders"
).innerHTML=data.orders || 0;


document.getElementById(
"reportCups"
).innerHTML=data.cups || 0;


document.getElementById(
"reportSales"
).innerHTML=data.sales || 0;


}







function showReportData(data){


let orders=0;

let cups=0;

let sales=0;

let pending=0;

let making=0;

let done=0;



data.forEach(x=>{


orders++;

cups+=Number(x.qty);

sales+=Number(x.total);


if(x.status==="待製作")
pending++;


if(x.status==="製作中")
making++;


if(x.status==="完成")
done++;


});



showReport({

orders,

cups,

sales,

pending,

making,

done

});



}







// =====================
// 今日結帳
// =====================

async function checkoutToday(){



let res =
await fetch(API_URL,{

method:"POST",

headers:{

"Content-Type":"text/plain"

},


body:JSON.stringify({

type:"checkout"

})


});



let data =
await res.json();



alert(
data.message
||
"完成"
);


}







// 初始化


loadSettings();

loadOrders();



// 每3秒刷新

setInterval(

()=>{

loadOrders();

loadSettings();

},

3000

);
