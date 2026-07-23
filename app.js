// =========================
// Google Apps Script API
// =========================

const API_URL =
"https://script.google.com/macros/s/AKfycbxtXHzRCHRZklP_eCY16EvUk_TzvWjg9Ndmx1sXC4QRpO8rFzey1z0VCrAGeLomWNP-mg/exec";


// =========================
// 商品
// =========================

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


// =========================

let cart=[];


// =========================
// 商品列表
// =========================

const menu=document.getElementById("menu");

products.forEach((item,index)=>{

    menu.innerHTML+=`

    <div class="card">

        <h3>${item.name}</h3>

        <p>${item.price} 元</p>

        <button onclick="addCart(${index})">

        加入購物車

        </button>

    </div>

    `;

});


// =========================
// 加入購物車
// =========================

function addCart(index){

    const product=products[index];

    const exist=cart.find(x=>x.name===product.name);

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
// 增加
// =========================

function plus(index){

    cart[index].qty++;

    showCart();

}


// =========================
// 減少
// =========================

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

    const box=document.getElementById("cart");

    box.innerHTML="";

    let total=0;

    cart.forEach((item,index)=>{

        total+=item.price*item.qty;

        box.innerHTML+=`

        <div class="cart-item">

            <div>

                <b>${item.name}</b>

                <br>

                $${item.price}

            </div>

            <div class="qty">

                <button onclick="minus(${index})">-</button>

                ${item.qty}

                <button onclick="plus(${index})">+</button>

            </div>

        </div>

        `;

    });

    document.getElementById("total").innerHTML=

    "總金額：" + total + " 元";

}


// =========================
// 送出訂單
// =========================

async function submitOrder(){

    if(cart.length===0){

        alert("請先選擇飲料");

        return;

    }

    const btn=document.getElementById("submitBtn");

    btn.disabled=true;

    btn.innerHTML="送出中...";

    const productText=

        cart.map(item=>item.name+" x "+item.qty)

        .join("、");

    const total=

        cart.reduce(

            (sum,item)=>sum+item.price*item.qty,

            0

        );

    const qty=

        cart.reduce(

            (sum,item)=>sum+item.qty,

            0

        );

    try{

        const response=

        await fetch(API_URL,{

            method:"POST",

            headers:{

                "Content-Type":"text/plain"

            },

            body:JSON.stringify({

                product:productText,

                qty:qty,

                total:total

            })

        });

        const result=

        await response.json();

        document.getElementById("result").innerHTML=`

        ✅ 訂單送出成功

        <br><br>

        訂單編號：

        <b>${result.orderId}</b>

        <br><br>

        <button onclick="checkOrder('${result.id}')">

        查詢訂單

        </button>

        `;

        cart=[];

        showCart();

    }

    catch(error){

        console.error(error);

        alert("送出失敗");

    }

    btn.disabled=false;

    btn.innerHTML="送出訂單";

}


// =========================
// 查詢訂單
// =========================

function checkOrder(id){

    location.href=

    "order.html?id="+id;

}


// =========================

window.addCart=addCart;

window.plus=plus;

window.minus=minus;

window.submitOrder=submitOrder;
