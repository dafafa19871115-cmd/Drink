// 飲料資料

const products=[

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



// 顯示菜單

const menu =
document.getElementById("menu");


products.forEach(item=>{


menu.innerHTML +=`

<div class="drink">


<h3>
${item.name}
</h3>


<p>
${item.price} 元
</p>


<button onclick="addCart(${item.id})">
加入
</button>


</div>


`;


});




// 加入購物車

window.addCart=function(id){


let item =
products.find(
p=>p.id===id
);


cart.push(item);


showCart();


};




// 顯示購物車

function showCart(){


let box =
document.getElementById("cart");


box.innerHTML="";


let total=0;



cart.forEach(item=>{


box.innerHTML +=`

<p>
${item.name}
 ${item.price} 元
</p>

`;


total+=item.price;


});


document.getElementById("total")
.innerHTML=
"總金額："+total+" 元";


}




// 自動產生訂單編號

function createOrderNumber(){


let number =
localStorage.getItem(
"orderNumber"
) || 0;



number++;



localStorage.setItem(
"orderNumber",
number
);



return "A"
+
String(number)
.padStart(5,"0");


}




//送出訂單

window.submitOrder=function(){


if(cart.length===0){


alert(
"請先選擇飲料"
);


return;


}



//產生編號

let orderId =
createOrderNumber();




//建立訂單

let order={


orderId:orderId,


items:cart,


status:"待製作",


time:
new Date()
.toLocaleString()


};




//目前先顯示

console.log(order);



alert(

"訂單成立\n\n"+
"訂單編號："+
orderId

);



cart=[];


showCart();


}
