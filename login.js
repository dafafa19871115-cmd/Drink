// =========================
// Google Apps Script API
// =========================


const API_URL =
"https://script.google.com/macros/s/AKfycbzm6Q2SWnf9VZ6vGM7AEKHjePMpXA4eAe43NJXHMB__UMravExbv4IbkIOFJP1BMG9Mvw/exec";



// =========================
// 登入
// =========================


async function login(){



const account =
document.getElementById("account").value;



const password =
document.getElementById("password").value;



if(!account || !password){


showError("請輸入帳號密碼");


return;


}



try{


const response =
await fetch(API_URL,{


method:"POST",


headers:{


"Content-Type":"text/plain"


},


body:JSON.stringify({


type:"login",


account:account,


password:password


})


});



const result =
await response.json();



if(result.success){



// 保存登入狀態

localStorage.setItem(

"shopLogin",

"true"

);



// 進後台

location.href="admin.html";



}

else{


showError(
"帳號或密碼錯誤"
);


}



}

catch(error){


console.log(error);


showError(
"登入失敗"
);


}



}



// =========================
// 顯示錯誤
// =========================


function showError(msg){


document.getElementById("error")
.innerHTML=msg;


}



window.login=login;
