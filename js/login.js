//==========================================
// RBC DEMO BANK
// login.js
//==========================================

const loginForm = document.getElementById("loginForm");
const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");
const username = document.getElementById("username");
const cardNumber = document.getElementById("cardNumber");
const remember = document.getElementById("remember");

//==========================================
// PASSWORD
//==========================================

togglePassword.addEventListener("click", () => {

    if(password.type==="password"){

        password.type="text";

        togglePassword.innerHTML='<i class="fa-solid fa-eye-slash"></i>';

    }else{

        password.type="password";

        togglePassword.innerHTML='<i class="fa-solid fa-eye"></i>';

    }

});

//==========================================
// CARD FORMAT
//==========================================

cardNumber.addEventListener("input",e=>{

    let value=e.target.value.replace(/\D/g,'');

    value=value.substring(0,16);

    value=value.replace(/(.{4})/g,"$1 ").trim();

    e.target.value=value;

});

//==========================================
// REMEMBER
//==========================================

window.addEventListener("load",()=>{

    if(localStorage.getItem("remember")==="true"){

        username.value=localStorage.getItem("username");

        cardNumber.value=localStorage.getItem("card");

        remember.checked=true;

    }

});

//==========================================
// LOGIN
//==========================================

loginForm.addEventListener("submit",(e)=>{

    e.preventDefault();

    const user=username.value.trim();

    const pass=password.value.trim();

    const card=cardNumber.value.trim();

    if(card===""){

        alert("Enter your card number");

        return;

    }

    if(user===""){

        alert("Enter your username");

        return;

    }

    if(pass===""){

        alert("Enter your password");

        return;

    }

    if(remember.checked){

        localStorage.setItem("remember",true);

        localStorage.setItem("username",user);

        localStorage.setItem("card",card);

    }else{

        localStorage.clear();

    }

    login();

});

//==========================================
// LOGIN FUNCTION
//==========================================

function login(){

    const btn=document.querySelector(".login-btn");

    btn.disabled=true;

    btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Connecting...';

    setTimeout(()=>{

        sessionStorage.setItem("logged",true);

        sessionStorage.setItem("clientName","John Smith");

        sessionStorage.setItem("accountNumber","001245879");

        sessionStorage.setItem("balance","25480.75");

        sessionStorage.setItem("currency","CAD");

        window.location.href="dashboard.html";

    },1800);

}
//==========================================
// NOTIFICATIONS
//==========================================

function showMessage(message,type="success"){

    const toast=document.createElement("div");

    toast.className="toast";

    toast.innerHTML=`
        <i class="fa-solid ${
            type==="success"
            ? "fa-circle-check"
            : "fa-circle-xmark"
        }"></i>
        <span>${message}</span>
    `;

    toast.style.position="fixed";
    toast.style.top="30px";
    toast.style.right="30px";
    toast.style.padding="18px 25px";
    toast.style.borderRadius="12px";
    toast.style.background=
        type==="success"
        ?"#23c16b"
        :"#ea4335";

    toast.style.color="#fff";
    toast.style.display="flex";
    toast.style.alignItems="center";
    toast.style.gap="10px";
    toast.style.fontWeight="600";
    toast.style.zIndex="99999";
    toast.style.boxShadow="0 15px 30px rgba(0,0,0,.2)";

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.style.opacity="0";
        toast.style.transform="translateY(-20px)";

    },2500);

    setTimeout(()=>{

        toast.remove();

    },3000);

}

//==========================================
// ENTER KEY
//==========================================

document.addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){

        loginForm.requestSubmit();

    }

});

//==========================================
// SESSION CHECK
//==========================================

if(sessionStorage.getItem("logged")==="true"){

    console.log("User already authenticated.");

}

//==========================================
// NETWORK STATUS
//==========================================

window.addEventListener("offline",()=>{

    showMessage("No Internet Connection","error");

});

window.addEventListener("online",()=>{

    showMessage("Connection Restored");

});

//==========================================
// LOADER
//==========================================

window.addEventListener("load",()=>{

    document.body.style.opacity="1";

});

//==========================================
// LOGOUT
//==========================================

function logout(){

    sessionStorage.clear();

    window.location.href="login.html";

}

//==========================================
// DEMO USERS
//==========================================

const demoUsers=[

{

card:"1111 2222 3333 4444",

username:"john",

password:"123456",

name:"John Smith",

balance:"25480.75",

currency:"CAD"

},

{

card:"5555 6666 7777 8888",

username:"admin",

password:"admin123",

name:"Administrator",

balance:"999999.00",

currency:"CAD"

}

];

//==========================================
// DEMO AUTH
//==========================================

function authenticate(card,user,pass){

    return demoUsers.find(u=>

        u.card===card &&

        u.username===user &&

        u.password===pass

    );

}

//==========================================
// FUTURE FIREBASE LOGIN
//==========================================

// authenticate()
// sera remplacé par Firebase Authentication
// dans la version finale.

//==========================================
// FIN DU FICHIER
// login.js
//==========================================
