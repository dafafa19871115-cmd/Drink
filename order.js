const API_URL =
"https://script.google.com/macros/s/AKfycbzJy17jslTbD4H2ijPrDl-LsWVbV23155i8FFLCl7BdDXGYrWKPYP39Hfkx3kdJXct09g/exec";



const params =
new URLSearchParams(
location.search
);


const id =
params.get("id");





async function loadOrder(){



try{


const res =
await fetch(
API_URL+
"?type=order&id="+id
);



const order =
await res.json();



let statusClass="wait";

let message="等待製作";



if(order.status=="製作中"){


statusClass="making";

message="正在製作";



}



if(order.status=="完成"){


statusClass="done";

message="📢 請取餐";


}



if(order.status=="取消"){


message="訂單取消";


}





document.getElementById("order")
.innerHTML=`


<div class="order-number">

${order.orderId}

</div>



<h3>

${order.status}

</h3>



<div class="status ${statusClass}">

${message}

</div>



<p>

🥤 ${order.product||""}

</p>



<p>

杯數：
${order.qty||""}

</p>



<p>

金額：
${order.total||""} 元

</p>



${

order.status=="完成"

?

`

<div class="notice">

📢 ${order.orderId}
已完成，請取餐

</div>

`

:

""

}



`;



}

catch(e){

console.log(e);

}



}





loadOrder();


// 每3秒同步

setInterval(
loadOrder,
3000
);
