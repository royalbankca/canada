const API_URL = "https://canada-1.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const customerId = document.getElementById("customerId").value.trim();
        const accessCode = document.getElementById("accessCode").value.trim();
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    customerId,
                    accessCode,
                    password
                })
            });

            const result = await response.json();

            if (!result.success) {
                alert(result.message);
                return;
            }

            localStorage.setItem("token", result.token);
            localStorage.setItem("currentUser", JSON.stringify(result.customer));

            window.location.href = "dashboard.html";

        } catch (err) {
            console.error(err);
            alert("Connexion impossible.");
        }
    });
});
