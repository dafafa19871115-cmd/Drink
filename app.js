alert("app.js 有載入");

const API_URL =
"https://script.google.com/macros/s/AKfycbxo3Gda0zUuI8gkaHSqjJza5KaEn0CILxfjdONDkpjoIoE2cLGEojEwbTuX1kQfh3FKwg/exec";



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



let cart=[];



const menu =
document.getElementById("menu");



// 顯示商品

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
加入
</button>


</div>

`;



});




// 加入購物車

function addCart(index){


let item =
products[index];


let exist =
cart.find(
x=>x.name===item.name
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


}



window.addCart=addCart;





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

${item.price*item.qty}元


</p>

`;


total +=
item.price*item.qty;



});



document.getElementById("total")
.innerHTML =
"總金額："+total+" 元";


}




//送出訂單


async function submitOrder(){


if(cart.length===0){

alert("請先選擇飲料");

return;

}



let productText =
cart.map(item=>{

return item.name+" x "+item.qty;

})
.join("、");



let total =
cart.reduce(

(sum,item)=>
sum+
item.price*item.qty,

0

);



let data={

product:productText,

qty:cart.reduce(

(sum,item)=>
sum+item.qty,

0

),

total:total

};



let response =
await fetch(

API_URL,

{

method:"POST",

body:JSON.stringify(data)

}

);



let result =
await response.json();



document.getElementById("result")
.innerHTML =

`
✅ 訂單完成

<br>

您的訂單編號：

<b>${result.orderId}</b>

`;



cart=[];

showCart();


}



window.submitOrder=
submitOrder;
