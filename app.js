console.log("Bing Sha app.js 已載入");


// Google Apps Script API

const API_URL =
"https://script.google.com/macros/s/AKfycby-mrlZ-yU1xs8OXXQK0PoDEqMg3_O1RGTRUKG4syTlk9BajybMw7pcZF7V5GT9Awj-SA/exec";



// 商品資料

const products = [

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



let cart = [];



// ======================
// 顯示商品
// ======================

const menu = document.getElementById("menu");


if(menu){


products.forEach((item,index)=>{


menu.innerHTML += `

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


}else{


console.error("找不到 menu");


}




// ======================
// 加入購物車
// ======================

function addCart(index){


let item = products[index];


let exist =
cart.find(
x => x.name === item.name
);



if(exist){


exist.qty++;


}else{


cart.push({

name:item.name,

price:item.price,

qty:1

});


}



showCart();


alert(
item.name + " 已加入購物車"
);


}



window.addCart = addCart;




// ======================
// 顯示購物車
// ======================

function showCart(){


let box =
document.getElementById("cart");


if(!box) return;



box.innerHTML="";


let total = 0;



cart.forEach(item=>{


box.innerHTML += `


<div class="card">


<p>

${item.name}

<br>


數量：

${item.qty}


<br>


小計：

${item.price * item.qty}

元


</p>


</div>


`;



total += item.price * item.qty;


});



let totalBox =
document.getElementById("total");



if(totalBox){


totalBox.innerHTML =

"總金額：" + total + " 元";


}



}





// ======================
// 送出訂單
// ======================


async function submitOrder(){



if(cart.length===0){


alert("請先選擇飲料");


return;


}



let productText =


cart.map(item=>{


return item.name + " x " + item.qty;


}).join("、");





let total =


cart.reduce(

(sum,item)=>

sum + item.price * item.qty,

0

);




let data = {


product:productText,


qty:

cart.reduce(

(sum,item)=>

sum + item.qty,

0

),


total:total


};




try{



let response = await fetch(

API_URL,

{

method:"POST",


headers:{


"Content-Type":"text/plain"


},


body:JSON.stringify(data)


}

);




let result = await response.json();



document.getElementById("result").innerHTML = `


✅ 訂單完成

<br>


訂單編號：

<b>

${result.orderId}

</b>


`;



cart=[];


showCart();



}


catch(error){


console.error(
"送出錯誤:",
error
);



alert(
"訂單送出失敗，請檢查網路或 API"
);


}



}



window.submitOrder = submitOrder;
