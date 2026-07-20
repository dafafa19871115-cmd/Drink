// 產生訂單編號
function createOrderNumber(){

    let number =
    localStorage.getItem("orderNumber") || 0;


    number++;


    localStorage.setItem(
        "orderNumber",
        number
    );


    let orderId =
    "A" + String(number).padStart(5,"0");


    return orderId;

}
