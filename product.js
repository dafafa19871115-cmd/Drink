// =========================
// API
// =========================


const API_URL =
"https://script.google.com/macros/s/AKfycbzm6Q2SWnf9VZ6vGM7AEKHjePMpXA4eAe43NJXHMB__UMravExbv4IbkIOFJP1BMG9Mvw/exec";




// =========================
// 載入商品
// =========================


async function loadProducts(){


const res =
await fetch(
API_URL+"?type=products"
);



const data =
await res.json();



const box =
document.getElementById("products");



box.innerHTML="";



data.forEach(p=>{


box.innerHTML+=`

<div class="product">


<div>

<b>
${p.name}
</b>

<br>

${p.price} 元


</div>



<div>


<button onclick="editProduct('${p.id}','${p.name}',${p.price})">

修改

</button>


<button class="off"

onclick="disableProduct('${p.id}')">

下架

</button>


</div>


</div>


`;



});



}





// =========================
// 新增商品
// =========================


async function addProduct(){



const name =
document.getElementById("name").value;



const price =
document.getElementById("price").value;



if(!name || !price){

alert("請輸入商品資料");

return;

}



await fetch(API_URL,{


method:"POST",


headers:{


"Content-Type":"text/plain"


},


body:JSON.stringify({


type:"product",


action:"add",


name:name,


price:price



})


});



alert("新增完成");



loadProducts();


}





// =========================
// 修改商品
// =========================


async function editProduct(id,name,price){



let newName =
prompt(
"商品名稱",
name
);



let newPrice =
prompt(
"價格",
price
);



if(!newName || !newPrice)

return;



await fetch(API_URL,{


method:"POST",


headers:{

"Content-Type":"text/plain"

},


body:JSON.stringify({


type:"product",


action:"edit",


id:id,


name:newName,


price:newPrice



})


});



loadProducts();


}





// =========================
// 下架
// =========================


async function disableProduct(id){


if(!confirm("確定下架？"))

return;



await fetch(API_URL,{


method:"POST",


headers:{

"Content-Type":"text/plain"

},


body:JSON.stringify({


type:"product",


action:"disable",


id:id


})


});



loadProducts();


}





function backAdmin(){

location.href="admin.html";

}



loadProducts();
