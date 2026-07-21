alert("APP JS 有載入");

console.log("Bing Sha app.js 正確載入");


const API_URL =
"https://script.google.com/macros/s/AKfycbx3hPX6sq38BC3AUErsj6zSjoOPwQaF3JYnKCLN1hPZCX9rfiHLoUoDXVJe5nmKiWoFjA/exec";



let cart=[];



const products=[

{
name:"綠豆沙",
price:50
},

{
name:"葡萄冰沙",
price:50
},

{
name:"芒果冰沙",
price:50
},

{
name:"隱藏版(百香果風味冰沙)",
price:50
}

];





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





// =====================
// 讀取店家設定
// =====================

async function loadStore(){


try{


let response =
await fetch(
API_URL+"?type=settings"
);



let settings =
await response.json();



console.log(
"店家設定:",
settings
);




let status =
document.getElementById(
"storeStatus"
);



let notice =
document.getElementById(
"announcement"
);




// 公告

if(settings["公告"]){

notice.style.display="block";

notice.innerHTML=
"📢 "
+
settings["公告"];

}
else{

notice.style.display="none";

}





// 測試模式

if(settings["測試模式"]==="ON"){


status.innerHTML=
"🟢 測試營業中";


enableOrder();


return;


}





// 店休

if(settings["店休"]==="ON"){


status.innerHTML=
"🔴 今日店休";


disableOrder();


return;


}





// 接單關閉

if(settings["接受訂單"]==="OFF"){


status.innerHTML=
"🟠 暫停接單";


disableOrder();


return;


}





let now =
getTaiwanTime();



let current =
now.getHours()
.toString()
.padStart(2,"0")
+
":"
+
now.getMinutes()
.toString()
.padStart(2,"0");



let open =
formatTime(
settings["開店時間"]
);



let close =
formatTime(
settings["打烊時間"]
);



console.log(
"時間:",
current,
open,
close
);



let openStatus=false;



if(open <= close){


openStatus =
current >= open &&
current <= close;


}
else{


openStatus =
current >= open ||
current <= close;


}




if(openStatus){


status.innerHTML=
"🟢 目前營業中";


enableOrder();


}
else{


status.innerHTML=
"🔴 目前休息時間";


disableOrder();


}



}
catch(error){


console.error(
"讀取設定錯誤:",
error
);


}

}





// =====================
// 時間格式處理
// =====================

function formatTime(value){


if(!value){

return "00:00";

}


// Google Sheet 日期格式

if(value.includes("T")){


let d =
new Date(value);


return d.getHours()
.toString()
.padStart(2,"0")
+
":"
+
d.getMinutes()
.toString()
.padStart(2,"0");


}


return value.substring(0,5);


}






// =====================
// 啟用送單
// =====================

function enableOrder(){


let btn =
document.getElementById(
"submitBtn"
);



if(btn){


btn.disabled=false;


btn.innerHTML=
"送出訂單";


}


}






// =====================
// 停止送單
// =====================

function disableOrder(){


let btn =
document.getElementById(
"submitBtn"
);



if(btn){


btn.disabled=true;


btn.innerHTML=
"目前停止接單";


}


}







// =====================
// 顯示商品
// =====================


function showProducts(){


let menu =
document.getElementById(
"menu"
);



if(!menu){

console.log("找不到 menu");

return;

}



menu.innerHTML="";



products.forEach((p,i)=>{


menu.innerHTML += `


<div class="card">


<h3>
${p.name}
</h3>


<p>
${p.price} 元
</p>



<button onclick="addCart(${i})">

加入購物車

</button>


</div>


`;



});



}







// =====================
// 加購物車
// =====================


function addCart(i){


let item =
products[i];



let exist =
cart.find(
x=>x.name===item.name
);



if(exist){

exist.qty++;

}
else{


cart.push({

name:item.name,

price:item.price,

qty:1

});


}



showCart();


}







// =====================
// 顯示購物車
// =====================


function showCart(){


let box =
document.getElementById(
"cart"
);



box.innerHTML="";


let total=0;



cart.forEach(item=>{


box.innerHTML += `


<p>

${item.name}

×

${item.qty}

=

${item.price * item.qty}

元

</p>


`;


total +=
item.price * item.qty;


});



document.getElementById(
"total"
)
.innerHTML=
"總金額："
+
total
+
" 元";


}








// =====================
// 送出訂單
// =====================


async function submitOrder(){



if(cart.length===0){


alert(
"請先選擇飲料"
);


return;


}




let orderData={


product:

cart.map(x=>

x.name+" x "+x.qty

)
.join("、"),


qty:

cart.reduce(
(a,b)=>a+b.qty,
0
),


total:

cart.reduce(
(a,b)=>a+b.price*b.qty,
0
)


};





console.log(
"送出:",
orderData
);




try{


let response =
await fetch(
API_URL,
{

method:"POST",

headers:{

"Content-Type":
"text/plain"

},

body:
JSON.stringify(orderData)

}

);




let text =
await response.text();



console.log(
"回覆:",
text
);



let data =
JSON.parse(text);



if(data.success){



document.getElementById(
"result"
)
.innerHTML=

"✅ 訂單完成<br>訂單編號："
+
data.orderId;



cart=[];


showCart();


}
else{


alert(

"訂單失敗："
+
(
data.message ||
data.error ||
"未知錯誤"

)

);


}



}
catch(error){


console.error(error);


alert(
"送出失敗:"
+
error.message
);


}



}






// =====================
// 啟動
// =====================


window.onload=function(){


console.log(
"Bing Sha 啟動"
);



showProducts();


showCart();


loadStore();


};
