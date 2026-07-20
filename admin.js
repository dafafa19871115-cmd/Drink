const API_URL =

"https://script.google.com/macros/s/AKfycbwGFAQCqrym8WPa5lhZVWLWper73RbFNnNkcst7wBWW_j_Coxl_wH4Cy9psbsooDEDQxw/exec";



let oldOrders = [];

let firstLoad = true;




// =====================
// 讀取訂單
// =====================

async function loadOrders(){


try{


let response = await fetch(API_URL);


let data = await response.json();



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
