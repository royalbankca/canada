// ======================================
// RBC BANK LOGIN
// login.js
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");

    if (!loginForm) return;

    loginForm.addEventListener("submit", function(e){

        e.preventDefault();

        const client = document.getElementById("client").value.trim();
        const access = document.getElementById("access").value.trim();
        const password = document.getElementById("password").value.trim();

        if(client === "" || access === "" || password === ""){

            alert("Please complete all required fields.");

            return;

        }

        // ----------------------------
        // COMPTE ADMINISTRATEUR
        // ----------------------------

        if(
            client === "ADMIN" &&
            access === "ADMIN" &&
            password === "ADMIN123"
        ){

            localStorage.setItem("role","admin");

            window.location.href="admin.html";

            return;

        }

        // ----------------------------
        // CLIENT DE DÉMONSTRATION
        // ----------------------------

        if(
            client === "100001" &&
            access === "4587" &&
            password === "RBC2026"
        ){

            localStorage.setItem("role","client");

            localStorage.setItem("clientName","Michael Johnson");

            localStorage.setItem("clientID","100001");

            localStorage.setItem("accountNumber","CA4587458965412");

            localStorage.setItem("balance","45870.00");

            window.location.href="dashboard.html";

            return;

        }

        alert("Invalid Client ID, Access Code or Password.");

    });

});
