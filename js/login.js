// =======================================
// RBC BANK LOGIN
// login.js
// VERSION COMPLETE
// =======================================

document.addEventListener("DOMContentLoaded", () => {

    initializeClients();

    const form = document.getElementById("loginForm");

    if(!form) return;

    form.addEventListener("submit", login);

});

// =======================================
// INITIALISER LES CLIENTS
// =======================================

function initializeClients(){

    if(localStorage.getItem("clients")) return;

    if(typeof loadClients==="function"){

        loadClients();

        return;

    }

}

// =======================================
// CONNEXION
// =======================================

function login(e){

    e.preventDefault();

    const clientID=document
        .getElementById("client")
        .value
        .trim();

    const access=document
        .getElementById("access")
        .value
        .trim();

    const password=document
        .getElementById("password")
        .value
        .trim();

    // ===================================
    // ADMIN
    // ===================================

    if(

        clientID.toUpperCase()=="ADMIN"

        &&

        access=="ADMIN"

        &&

        password=="ADMIN123"

    ){

        localStorage.setItem("role","admin");

        localStorage.setItem("isLoggedIn","true");

        localStorage.setItem(

            "currentUser",

            JSON.stringify({

                id:"ADMIN",

                name:"Administrator"

            })

        );

        window.location.href="admin.html";

        return;

    }

    // ===================================
    // CLIENTS
    // ===================================

    const clients=

        JSON.parse(

            localStorage.getItem("clients")

        ) || [];

    const client=

        clients.find(c=>

            c.id===clientID

            &&

            c.access===access

            &&

            c.password===password

        );

    if(!client){

        alert(

            "Client ID, Access Code ou Password incorrect."

        );

        return;

    }

    localStorage.setItem(

        "role",

        "client"

    );

    localStorage.setItem(

        "isLoggedIn",

        "true"

    );

    localStorage.setItem(

        "currentUser",

        JSON.stringify(client)

    );

    window.location.href="dashboard.html";

}

// =======================================
// DECONNEXION
// =======================================

function logout(){

    localStorage.removeItem("currentUser");

    localStorage.removeItem("role");

    localStorage.removeItem("isLoggedIn");

    window.location.href="login.html";

}

// =======================================
// SESSION
// =======================================

function isLogged(){

    return localStorage.getItem(

        "isLoggedIn"

    )==="true";

}

function currentUser(){

    return JSON.parse(

        localStorage.getItem(

            "currentUser"

        )

    );

}

// =======================================
// GARDE SESSION ACTIVE
// =======================================

setInterval(()=>{

    if(isLogged()){

        localStorage.setItem(

            "lastActivity",

            Date.now()

        );

    }

},30000);

// =======================================
// FIN LOGIN.JS
// =======================================
