// =========================
// Google Apps Script API
// =========================

const API_URL =
"https://script.google.com/macros/s/AKfycbwKn2jwJs73yCRb7kZdiv0FxPfMMTLqALMHSmyFEKSyR_VS__DRYfSq0AQ_YY5LRUYmyw/exec";



let products=[];

let cart=[];



// =========================
// 讀取商品
// =========================


async function loadProducts(){

try{


const res=await fetch(
API_URL+"?type=products"
);


products=await res.json();


renderMenu();



}

catch(e){

console.log(e);

}



}



// =========================
// 顯示商品
// =========================


function renderMenu(){


const menu=document.getElementById("menu");


menu.innerHTML="";



products.forEach((item,index)=>{


menu.innerHTML+=`


<div class="card">


<h3>

${item.name}

</h3>


<p>

${item.price} 元

</p>


<button onclick="addCart(${index})">

加入購物車

</button>


</div>



`;



});



}




// =========================
// 加入購物車
// =========================


function addCart(index){


let product=products[index];


let exist=
cart.find(
x=>x.name===product.name
);



if(exist){

exist.qty++;

}else{


cart.push({

name:product.name,

price:product.price,

qty:1


});


}


showCart();


}





// =========================
// 數量控制
// =========================


function plus(index){

cart[index].qty++;

showCart();

}



function minus(index){


cart[index].qty--;


if(cart[index].qty<=0){

cart.splice(index,1);

}


showCart();


}





// =========================
// 購物車
// =========================


function showCart(){


const box=
document.getElementById("cart");


box.innerHTML="";


let total=0;



cart.forEach((item,index)=>{


total+=item.price*item.qty;



box.innerHTML+=`


<div class="cart-item">


<b>
${item.name}
</b>

<br>

${item.price} 元


<button onclick="minus(${index})">
-
</button>


${item.qty}


<button onclick="plus(${index})">
+
</button>


</div>



`;



});



document.getElementById("total").innerHTML=

"總金額："+total+" 元";



}





// =========================
// 送出訂單
// =========================


async function submitOrder(){



if(cart.length===0){

alert("請先選擇飲料");

return;

}



let total=
cart.reduce(
(a,b)=>a+b.price*b.qty,
0
);



let qty=
cart.reduce(
(a,b)=>a+b.qty,
0
);



let productText=
cart.map(
x=>x.name+" x "+x.qty
)
.join("、");



try{


let res=
await fetch(API_URL,{


method:"POST",


headers:{

"Content-Type":"text/plain"

},


body:JSON.stringify({


type:"order",


product:productText,


qty:qty,


total:total



})



});



let result=
await res.json();



localStorage.setItem(

"orderId",

result.id

);



document.getElementById("result").innerHTML=`

<h2>

✅ 訂單完成

</h2>


<h1>

${result.orderId}

</h1>


<p>

請等待叫號

</p>


<button onclick="checkOrder()">

查看進度

</button>



`;



cart=[];

showCart();



}

catch(e){

alert("送出失敗");

console.log(e);

}




}





// =========================
// 查詢訂單
// =========================


async function checkOrder(){



let id=
localStorage.getItem("orderId");



if(!id){

return;

}



location.href=
"order.html?id="+id;



}




window.addCart=addCart;

window.plus=plus;

window.minus=minus;

window.submitOrder=submitOrder;

window.checkOrder=checkOrder;



loadProducts();
