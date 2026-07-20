console.log("Bing Sha app.js 正確載入");

const API_URL =
"https://script.google.com/macros/s/AKfycbwyhSkdqqusgb13X35I5r2nfmtM6Iqd48N8XORWUGwwwv0CIlJcKmj5t7qTkjGvix5QLg/exec";


console.log("Bing Sha app.js 載入");


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

notice.innerHTML =
"📢 "
+
settings["公告"];

}


// 測試模式

if(settings["測試模式"]==="ON"){


status.innerHTML =
"🟢 測試營業中";


enableOrder();

return;

}


// 店休

if(settings["店休"]==="ON"){


status.innerHTML =
"🔴 今日店休";


disableOrder();

return;

}


// 暫停接單

if(settings["接受訂單"]==="OFF"){


status.innerHTML =
"🟠 暫停接單";


disableOrder();

return;

}


// 營業時間

let now =
new Date();


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
settings["開店時間"];


let close =
settings["打烊時間"];




if(
current >= open &&
current <= close
){


status.innerHTML =
"🟢 目前營業中";


enableOrder();


}
else{


status.innerHTML =
"🔴 目前休息時間";


disableOrder();


}


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




// 暫停接單

if(settings["接受訂單"]==="OFF"){


status.innerHTML=
"🟠 暫停接單";


disableOrder();


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



let open =
settings["開店時間"]
||
"00:00";


let close =
settings["打烊時間"]
||
"23:59";



console.log(
"時間:",
time,
"開店:",
open,
"打烊:",
close
);





let isOpen=false;



if(open <= close){


if(
time>=open &&
time<=close
){

isOpen=true;

}


}
else{


if(
time>=open ||
time<=close
){

isOpen=true;

}


}




if(isOpen){


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
"讀取設定錯誤",
error
);


}

}





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
// 商品顯示
// =====================


let menu =
document.getElementById("menu");


if(menu){

products.forEach((p,i)=>{


menu.innerHTML += `


<div class="card">


<h3>${p.name}</h3>


<p>${p.price} 元</p>


<button onclick="addCart(${i})">

加入購物車

</button>


</div>


`;


});


}
else{

console.log("找不到 menu");

}






// =====================
// 加入購物車
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
document.getElementById("cart");



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



document.getElementById("total")
.innerHTML =
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





let product =
cart.map(item=>{


return (

item.name
+
" x "
+
item.qty

);


})
.join("、");






let qty =
cart.reduce(

(sum,item)=>

sum + item.qty,

0

);






let total =
cart.reduce(

(sum,item)=>

sum + item.price * item.qty,

0

);






let orderData={


product:product,


qty:qty,


total:total


};





console.log(
"送出資料:",
orderData
);





try{


let response =
await fetch(API_URL,{


method:"POST",


mode:"cors",


headers:{


"Content-Type":
"text/plain;charset=utf-8"


},


body:
JSON.stringify(orderData)


});






let text =
await response.text();



console.log(
"API回覆:",
text
);






let data;



try{


data =
JSON.parse(text);


}

catch(e){


alert(
"API格式錯誤\n\n"
+
text
);


return;


}







if(data.success){



document.getElementById("result")
.innerHTML =


`

✅ 訂單完成

<br>

訂單編號：

<b>${data.orderId}</b>

`;





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





}

catch(error){



console.error(
"送單錯誤:",
error
);



alert(

"送出失敗："

+

error.message

);



}



}





// =====================
// 啟動
// =====================


window.onload = function(){

console.log("開始讀取店家設定");

showCart();


loadStore();
