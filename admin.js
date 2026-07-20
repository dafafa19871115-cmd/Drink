const API_URL =

"https://script.google.com/macros/s/AKfycbxo3Gda0zUuI8gkaHSqjJza5KaEn0CILxfjdONDkpjoIoE2cLGEojEwbTuX1kQfh3FKwg/exec";



let oldOrders = [];

let firstLoad = true;
let todayReport = [];




// =====================
// 讀取訂單
// =====================

async function loadOrders(){


try{


let response = await fetch(API_URL);


let data = await response.json();
updateReport(data);



let box =
document.getElementById("orders");



box.innerHTML="";



data.forEach(order=>{


let isNew =

!firstLoad &&

!oldOrders.some(

x=>x.orderId === order.orderId

);



box.innerHTML += `


<div class="order ${isNew ? "new-order":""}">


${isNew ?

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




// 新訂單提示音

if(!firstLoad && data.length > oldOrders.length){


let audio =
document.getElementById("ding");


if(audio){


audio.currentTime = 0;


audio.play()
.catch(()=>{});


}


}




oldOrders = data;


firstLoad = false;



}

catch(error){


console.error(
"讀取訂單錯誤:",
error
);


}


}







// =====================
// 修改訂單狀態
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

catch(error){


console.error(
"更新狀態錯誤:",
error
);


}



}






// 每3秒更新

setInterval(
loadOrders,
3000
);



loadOrders();

// =====================
// 今日報表
// =====================

function updateReport(data){


let today =
new Date()
.toISOString()
.substring(0,10);



let orders = 0;

let cups = 0;

let sales = 0;

let pending = 0;

let making = 0;

let done = 0;



data.forEach(order=>{


if(order.time){


orders++;


cups += Number(order.qty);


sales += Number(order.total);



if(order.status=="待製作"){

pending++;

}


if(order.status=="製作中"){

making++;

}


if(order.status=="完成"){

done++;

}


}



});





document.getElementById("reportDate")
.innerHTML = today;



document.getElementById("reportOrders")
.innerHTML = orders;



document.getElementById("reportCups")
.innerHTML = cups;



document.getElementById("reportSales")
.innerHTML = sales;



document.getElementById("reportPending")
.innerHTML = pending;



document.getElementById("reportMaking")
.innerHTML = making;



document.getElementById("reportDone")
.innerHTML = done;



}
