//==================================================
// RBC AUTH SECURITY
//==================================================

(function () {

    const token = localStorage.getItem("token");
    const loggedIn = localStorage.getItem("isLoggedIn");
    const role = localStorage.getItem("role");

    const page = window.location.pathname.split("/").pop();

    // Pages publiques
    const publicPages = [
        "",
        "index.html",
        "login.html",
        "open-account.html"
    ];

    if (publicPages.includes(page)) {
        return;
    }

    // Vérification de la session
    if (!loggedIn || loggedIn !== "true") {

        localStorage.clear();
        sessionStorage.clear();

        window.location.replace("login.html");
        return;

    }

    // Vérification du token pour les clients
    if (role === "client" && !token) {

        localStorage.clear();
        sessionStorage.clear();

        window.location.replace("login.html");
        return;

    }

    // Vérification du rôle ADMIN
    if (page === "admin.html" && role !== "admin") {

        window.location.replace("login.html");
        return;

    }

    // Vérification du rôle CLIENT
    if (page === "dashboard.html" && role !== "client") {

        window.location.replace("login.html");
        return;

    }

    // Empêcher le retour via le cache
    window.addEventListener("pageshow", function (event) {

        if (event.persisted) {

            window.location.reload();

        }

    });

})();
