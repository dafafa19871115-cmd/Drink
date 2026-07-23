const API_URL =
"https://script.google.com/macros/s/AKfycbxtXHzRCHRZklP_eCY16EvUk_TzvWjg9Ndmx1sXC4QRpO8rFzey1z0VCrAGeLomWNP-mg/exec";

const params =
new URLSearchParams(location.search);

const id =
params.get("id");

if(!id){

document.body.innerHTML="<h2>找不到訂單</h2>";

throw new Error("No Order");

}

async function loadOrder(){

try{

const response =
await fetch(

API_URL +
"?action=order&id=" +
encodeURIComponent(id)

);

const order =
await response.json();

if(!order.id){

document.getElementById("status").innerHTML="找不到訂單";

return;

}

document.getElementById("orderId").innerHTML=
order.orderId;

document.getElementById("product").innerHTML=
order.product;

document.getElementById("qty").innerHTML=
order.qty;

document.getElementById("total").innerHTML=
order.total;

const status =
document.getElementById("status");

if(order.status=="待製作"){

status.className="wait";

status.innerHTML="🟡 待製作";

}

else if(order.status=="製作中"){

status.className="making";

status.innerHTML="🔵 製作中";

}

else{

status.className="done";

status.innerHTML="🟢 完成";

}

}

catch(error){

console.error(error);

}

}

loadOrder();

setInterval(loadOrder,3000);
