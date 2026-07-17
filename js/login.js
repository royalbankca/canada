// =======================================
// RBC BANK LOGIN
// Version 2
// =======================================

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("loginForm");

    if (!form) {
        console.error("Formulaire loginForm introuvable !");
        return;
    }

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const client = document.getElementById("client").value.trim().toUpperCase();
        const access = document.getElementById("access").value.trim();
        const password = document.getElementById("password").value.trim();

        // =============================
        // ADMIN
        // =============================

        if (
            client === "ADMIN" &&
            access === "ADMIN" &&
            password === "ADMIN123"
        ) {

            localStorage.setItem("role", "admin");

            alert("Connexion Administrateur réussie.");

            window.location.replace("admin.html");

            return;
        }

        // =============================
        // CLIENT
        // =============================

        if (
            client === "100001" &&
            access === "4587" &&
            password === "RBC2026"
        ) {

            localStorage.setItem("role", "client");
            localStorage.setItem("clientName", "Michael Johnson");
            localStorage.setItem("clientID", "100001");
            localStorage.setItem("accountNumber", "CA4587458965412");
            localStorage.setItem("balance", "45870.00");

            alert("Connexion Client réussie.");

            window.location.replace("dashboard.html");

            return;
        }

        alert("Client ID, Access Code ou Password incorrect.");

    });

});
