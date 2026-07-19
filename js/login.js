document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");

    if (!form) {
        console.error("Formulaire introuvable.");
        return;
    }

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const customerId = document
            .getElementById("client")
            .value
            .trim()
            .toUpperCase();

        const password = document
            .getElementById("password")
            .value
            .trim();

        // ==========================
        // CONNEXION ADMINISTRATEUR
        // ==========================

        if (
            customerId === "ADMIN" &&
            password === "ADMIN123"
        ) {

            localStorage.setItem("role", "admin");
            localStorage.setItem("isLoggedIn", "true");

            localStorage.setItem("currentUser", JSON.stringify({
                customerId: "ADMIN",
                firstName: "System",
                lastName: "Administrator"
            }));

            window.location.href = "admin.html";
            return;

        }

        try {

            const response = await fetch(
                "https://canada-1.onrender.com/api/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        customerId,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                alert(data.message || "Connexion impossible.");

                return;

            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", "client");
            localStorage.setItem("isLoggedIn", "true");

            localStorage.setItem(
                "currentUser",
                JSON.stringify(data.customer)
            );

            window.location.href = "dashboard.html";

        } catch (error) {

            console.error(error);

            alert("Impossible de contacter le serveur.");

        }

    });

});
