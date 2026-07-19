document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");

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

        // Connexion administrateur
        if (
            customerId === "ADMIN" &&
            password === "ADMIN123"
        ) {
            localStorage.setItem("role", "admin");
            window.location.href = "admin.html";
            return;
        }

        try {

            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    customerId,
                    password
                })
            });

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

        } catch (err) {

            console.error(err);
            alert("Erreur de connexion au serveur.");

        }

    });

});
