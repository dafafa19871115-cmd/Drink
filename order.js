// =========================
// API
// =========================

const API_URL =
"https://script.google.com/macros/s/AKfycbzm6Q2SWnf9VZ6vGM7AEKHjePMpXA4eAe43NJXHMB__UMravExbv4IbkIOFJP1BMG9Mvw/exec";



// 取得訂單ID

const params =
new URLSearchParams(location.search);


let orderId =
params.get("id");



// =========================
// 查詢訂單
// =========================


async function checkOrder(){


if(!orderId){

return;

}



try{


const res =
await fetch(
API_URL+
"?action=order&id="+orderId
);



const data =
await res.json();



document.getElementById("number")
.innerHTML =
data.orderId;



let status =
document.getElementById("status");



status.className="status";



if(data.status=="待製作"){


status.innerHTML =
"⏳ 等待製作";


status.classList.add("wait");


}



else if(data.status=="製作中"){


status.innerHTML =
"🥤 製作中";


status.classList.add("making");


}



else if(data.status=="完成"){


status.innerHTML =
`
📢 ${data.orderId}
<br>
已完成，請取餐
`;



status.classList.add("done");



}



else if(data.status=="取消"){


status.innerHTML =
"❌ 訂單已取消";


}



}

catch(e){

console.log(e);

}



}



// 啟動

checkOrder();


// 每3秒同步

setInterval(checkOrder,3000);
