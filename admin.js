const API_URL =
"https://script.google.com/macros/s/AKfycbwyhSkdqqusgb13X35I5r2nfmtM6Iqd48N8XORWUGwwwv0CIlJcKmj5t7qTkjGvix5QLg/exec";


let oldOrders=[];

let firstLoad=true;

let refreshTime=3000;




// =====================
// 台灣時間
// =====================

function getTaiwanTime(){

return new Date(
new Date().toLocaleString(
"en-US",
{
timeZone:"Asia/Taipei"
}
)
);

}



function getTaiwanDate(){

let now=getTaiwanTime();


return (

now.getFullYear()

+
"-"

+
String(
now.getMonth()+1
)
.padStart(2,"0")

+
"-"

+
String(
now.getDate()
)
.padStart(2,"0")

);

}




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



console.log(
"設定:",
settings
);



checkBusinessStatus(settings);




if(settings["自動刷新秒數"]){


refreshTime =
Number(
settings["自動刷新秒數"]
)
*
1000;


}


if(settings["接單提示音"]==="OFF"){


let audio =
document.getElementById(
"ding"
);


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




if(settings["店休"]==="ON"){


box.innerHTML=
"🔴 今日店休";


return;


}




if(settings["接受訂單"]==="OFF"){


box.innerHTML=
"🟠 暫停接單";


return;


}




let now =
getTaiwanTime();



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




let openTime =
settings["開店時間"]
||
"00:00";



let closeTime =
settings["打烊時間"]
||
"23:59";



let open=false;




// 一般時間

if(openTime <= closeTime){


if(
time>=openTime
&&
time<=closeTime
){

open=true;

}


}


// 跨午夜

else{


if(
time>=openTime
||
time<=closeTime
){

open=true;

}


}





if(open){


box.innerHTML=
"🟢 目前營業中";


}
else{


box.innerHTML=
"🔴 目前休息中";


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



data =
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



if(!box)
return;



box.innerHTML="";



data.forEach(order=>{


let isNew =

!firstLoad

&&

!oldOrders.some(

x=>
x.orderId===order.orderId

);




box.innerHTML += `


<div class="order ${isNew?"new-order":""}">


${isNew?

"<span class='badge'>🔔 新訂單</span>"

:

""

}


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
<b>${order.status}</b>
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


try{


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

catch(err){


console.log(
"修改失敗",
err
);


}


}






// =====================
// 今日報表
// =====================


function updateReport(data){



let today =
getTaiwanDate();



let list=[];



data.forEach(x=>{


if(x.date===today){

list.push(x);

}


});



showReportData(list);


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



document.getElementById("reportOrders").innerHTML=orders;

document.getElementById("reportCups").innerHTML=cups;

document.getElementById("reportSales").innerHTML=sales;


if(document.getElementById("reportPending"))
document.getElementById("reportPending").innerHTML=pending;


if(document.getElementById("reportMaking"))
document.getElementById("reportMaking").innerHTML=making;


if(document.getElementById("reportDone"))
document.getElementById("reportDone").innerHTML=done;


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



showReportData(data.orders || []);


}








// =====================
// 每日結帳
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
data.message || "完成"
);


}







// =====================
// 啟動
// =====================


loadSettings();

loadOrders();



setInterval(()=>{


loadOrders();

loadSettings();


},refreshTime);
