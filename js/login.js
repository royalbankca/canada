// =======================================
// RBC BANK LOGIN
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
            localStorage.setItem("isLoggedIn", "true");

            localStorage.setItem("currentUser", JSON.stringify({
                id: "ADMIN",
                name: "Administrator",
                access: "ADMIN",
                account: "ADMIN",
                balance: 0
            }));

            alert("Connexion Administrateur réussie.");
            window.location.href = "admin.html";
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
            localStorage.setItem("isLoggedIn", "true");

            localStorage.setItem("currentUser", JSON.stringify({
                id: "100001",
                name: "Michael Johnson",
                access: "4587",
                account: "CA4587458965412",
                balance: 45870.00
            }));

            alert("Connexion Client réussie.");
            window.location.href = "dashboard.html";
            return;
        }

        alert("Client ID, Access Code ou Password incorrect.");

    });

});
