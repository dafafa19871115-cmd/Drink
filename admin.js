// =========================
// Google Apps Script API
// =========================

const API_URL =
"https://script.google.com/macros/s/AKfycbxtXHzRCHRZklP_eCY16EvUk_TzvWjg9Ndmx1sXC4QRpO8rFzey1z0VCrAGeLomWNP-mg/exec";

let oldOrders = [];
let firstLoad = true;

// =========================
// 讀取訂單
// =========================

async function loadOrders(){

    try{

        const response = await fetch(API_URL);
        const data = await response.json();

        // 最新訂單排最上面
        data.reverse();

        const box = document.getElementById("orders");
        box.innerHTML = "";

        data.forEach(order=>{

            const isNew =
                !firstLoad &&
                !oldOrders.some(x=>x.id===order.id);

            let statusClass="wait";

            if(order.status==="製作中"){
                statusClass="making";
            }

            if(order.status==="完成"){
                statusClass="done";
            }

            box.innerHTML += `

            <div class="order ${isNew ? "new-order":""}">

                ${isNew ? "<span class='badge'>🔔 新訂單</span>" : ""}

                <h2>${order.orderId}</h2>

                <p>🥤 ${order.product}</p>

                <p>杯數：${order.qty}</p>

                <p>金額：${order.total} 元</p>

                <p>

                    狀態：

                    <span class="status ${statusClass}">

                        ${order.status}

                    </span>

                </p>

                <button
                    class="start"
                    onclick="updateStatus('${order.id}','製作中')">

                    開始製作

                </button>

                <button
                    class="finish"
                    onclick="updateStatus('${order.id}','完成')">

                    完成

                </button>

            </div>

            `;

        });

        // 新訂單提示音
        if(!firstLoad && data.length>oldOrders.length){

            const ding=document.getElementById("ding");

            if(ding){

                ding.currentTime=0;

                ding.play().catch(()=>{});

            }

        }

        oldOrders=[...data];

        firstLoad=false;

    }

    catch(error){

        console.error(error);

    }

}

// =========================
// 修改訂單狀態
// =========================

async function updateStatus(id,status){

    try{

        await fetch(API_URL,{

            method:"POST",

            headers:{
                "Content-Type":"text/plain"
            },

            body:JSON.stringify({

                type:"update",

                id:id,

                status:status

            })

        });

        loadOrders();

    }

    catch(error){

        console.error(error);

        alert("更新失敗");

    }

}

// =========================
// 自動更新
// =========================

loadOrders();

setInterval(loadOrders,3000);
