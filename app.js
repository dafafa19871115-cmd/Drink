const products = [

{
id:1,
name:"綠豆沙",
price:60
},

{
id:2,
name:"葡萄冰沙",
price:70
},

{
id:3,
name:"芒果冰沙",
price:80
}

];


let cart=[];



const menu =
document.getElementById("menu");


products.forEach(item=>{


menu.innerHTML += `

<div class="drink">

<h3>${item.name}</h3>

<p>${item.price} 元</p>


<button onclick="addCart(${item.id})">
加入
</button>


</div>

`;

});



window.addCart=function(id){


let item =
products.find(p=>p.id===id);


cart.push(item);


showCart();

}



function showCart(){


let box=
document.getElementById("cart");


box.innerHTML="";


cart.forEach(item=>{


box.innerHTML +=`

<p>
${item.name}
${item.price}元
</p>

`;

});


}



window.submitOrder=function(){


if(cart.length===0){

alert("請先選擇飲料");

return;

}


alert("訂單送出成功");


cart=[];

showCart();


}
