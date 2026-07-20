const API_URL =
"https://script.google.com/macros/s/AKfycbxN60Cp5tE9ygEFsP7N6CLp3cxZq4bVk2ywebHLT87jjfnbSOlgvgiG8PXf7hJ0L2hJ7A/exec";


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
// 取得台灣時間
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
// 讀取設定
// =====================

async function loadStore(){

try{


let res =
await fetch(
API_URL+"?type=settings"
);


let settings =
await res.json();


console.log("目前設定:",settings);



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

return;

}




// 店休

if(settings["店休"]==="ON"){


status.innerHTML=
"🔴 今日店休";


disableOrder();


return;

}




// 接單設定

if(settings["接受訂單"]==="OFF"){


status.innerHTML=
"🟠 暫停接單";


disableOrder();


return;

}




// 台灣時間

let now =
getTaiwanTime();



let currentTime =
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



console.log(
"現在時間:",
currentTime,
"開店:",
openTime,
"打烊:",
closeTime
);




// 營業時間判斷

let open =
false;



if(openTime <= closeTime){


// 一般時間

if(
currentTime >= openTime &&
currentTime <= closeTime
){

open=true;

}


}
else{


// 跨午夜

if(
currentTime >= openTime ||
currentTime <= closeTime
){

open=true;

}


}




if(open){


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
// 啟用接單
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
// 停止接單
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

let menu =
document.getElementById(
"menu"
);



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







function showCart(){


let box =
document.getElementById(
"cart"
);


box.innerHTML="";


let total=0;



cart.forEach(x=>{


box.innerHTML += `

<p>

${x.name}

×

${x.qty}

=

${x.price*x.qty}

元

</p>

`;


total +=
x.price*x.qty;


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







async function submitOrder(){


if(cart.length===0){


alert(
"請先選擇飲料"
);


return;

}



let product =
cart.map(x=>

x.name+" x "+x.qty

)
.join("、");



let qty =
cart.reduce(
(a,b)=>a+b.qty,
0
);



let total =
cart.reduce(
(a,b)=>a+b.price*b.qty,
0
);



try{


let res =
await fetch(API_URL,{

method:"POST",

headers:{

"Content-Type":"text/plain"

},

body:JSON.stringify({

product,

qty,

total

})

});



let data =
await res.json();



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
data.error ||
"送出失敗"
);


}


}
catch(error){


console.error(error);

alert(
"送出失敗"
);


}



}





loadStore();
