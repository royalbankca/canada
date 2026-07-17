// ==========================================
// RBC BANK DEMO
// Intégration officielle SebPay
// ==========================================

// ---------- CONFIGURATION ----------

const SEBPAY_BASE_URL = "https://newapi.sebpay.bj/api/v1";

// Remplace uniquement si tu régénères tes clés
const PUBLIC_KEY = "pk_live_MIqwvsFMJcYxDxX8iUXbG2ALhPfAZMP3aT2YrhRN";
const SECRET_KEY = "sk_live_cLjMQwRPSAlDn9YddCDXl6vyE7jnrktEixmE32nZtDNanKtBf9qAe06rkBOj";

// ---------- ETAT ----------

let currentCollection = null;

// ---------- DEVISES ----------

function getCurrency(country) {

    switch (country) {

        case "BJ":
        case "BF":
        case "CI":
        case "GW":
        case "ML":
        case "NE":
        case "SN":
        case "TG":
            return "XOF";

        case "CM":
        case "CG":
        case "GA":
        case "TD":
            return "XAF";

        case "GH":
            return "GHS";

        case "NG":
            return "NGN";

        case "GM":
            return "GMD";

        case "GN":
            return "GNF";

        case "CD":
            return "CDF";

        default:
            return "XOF";
    }

}

// ---------- CHARGEMENT DES OPERATEURS ----------

async function loadOperators(country) {

    const operatorSelect = document.getElementById("operator");

    operatorSelect.innerHTML =
        "<option>Chargement...</option>";

    try {

        const response = await fetch(

            `${SEBPAY_BASE_URL}/operators?country=${country}`,

            {

                method: "GET",

                headers: {

                    "X-Public-Key": PUBLIC_KEY,

                    "X-Secret-Key": SECRET_KEY

                }

            }

        );

        const result = await response.json();

        if (!result.success) {

            operatorSelect.innerHTML =
                "<option>Aucun opérateur</option>";

            return;

        }

        operatorSelect.innerHTML = "";

        result.data.forEach(operator => {

            const option = document.createElement("option");

            option.value = operator.slug;

            option.textContent = operator.name;

            option.dataset.otp = operator.otp_required;

            operatorSelect.appendChild(option);

        });

        checkOTP();

    }

    catch (error) {

        console.error(error);

        operatorSelect.innerHTML =
            "<option>Erreur de chargement</option>";

    }

}
// ==========================================
// CREATION D'UNE COLLECTION SEBPAY
// ==========================================

async function createCollection() {

    const country = document.getElementById("country").value;

    const operator = document.getElementById("operator").value;

    const phone = document.getElementById("phone").value.trim();

    const amount = Number(document.getElementById("amount").value);

    const otp = document.getElementById("otp")?.value.trim();

    if (!country || !operator || !phone || amount <= 0) {

        alert("Veuillez remplir tous les champs.");

        return;

    }

    const externalReference = "RBC-" + Date.now();

    const payload = {

        amount: amount,

        currency: getCurrency(country),

        phone: phone,

        operator: operator,

        country: country,

        external_reference: externalReference,

        callback_url: "https://example.com/webhook"

    };

    if (otp) {

        payload.otp_code = otp;

    }

    try {

        const response = await fetch(

            `${SEBPAY_BASE_URL}/collections`,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                    "X-Public-Key": PUBLIC_KEY,

                    "X-Secret-Key": SECRET_KEY

                },

                body: JSON.stringify(payload)

            }

        );

        const result = await response.json();

        console.log(result);

        if (!result.success) {

            alert(result.message || "Transaction refusée.");

            return;

        }

        currentCollection = result.data;

        localStorage.setItem(

            "lastCollection",

            JSON.stringify(currentCollection)

        );

        if (currentCollection.provider_link) {

            window.open(

                currentCollection.provider_link,

                "_blank"

            );

        }

        alert(

            currentCollection.message ||

            "Transaction créée."

        );

    }

    catch (error) {

        console.error(error);

        alert("Erreur de connexion avec SebPay.");

    }

}
// ==========================================
// VERIFIER LE STATUT D'UNE TRANSACTION
// ==========================================

async function checkCollectionStatus(reference = null) {

    try {

        let transactionReference = reference;

        if (!transactionReference) {

            const lastCollection = JSON.parse(

                localStorage.getItem("lastCollection")

            );

            if (!lastCollection) {

                alert("Aucune transaction trouvée.");

                return;

            }

            transactionReference =
                lastCollection.reference ||
                lastCollection.external_reference ||
                lastCollection.id;

        }

        const response = await fetch(

            `${SEBPAY_BASE_URL}/collections/${transactionReference}`,

            {

                method: "GET",

                headers: {

                    "X-Public-Key": PUBLIC_KEY,

                    "X-Secret-Key": SECRET_KEY

                }

            }

        );

        const result = await response.json();

        console.log(result);

        if (!result.success) {

            alert(result.message || "Impossible de récupérer le statut.");

            return;

        }

        const transaction = result.data;

        currentCollection = transaction;

        localStorage.setItem(

            "lastCollection",

            JSON.stringify(transaction)

        );

        let message = "";

        message += "Référence : " + (transaction.reference || "-") + "\n";
        message += "Statut : " + (transaction.status || "-") + "\n";
        message += "Montant : " + (transaction.amount || "-") + " " + (transaction.currency || "") + "\n";

        alert(message);

    }

    catch (error) {

        console.error(error);

        alert("Erreur lors de la vérification.");

    }

}
// ==========================================
// GESTION OTP
// ==========================================

function checkOTP() {

    const operator = document.getElementById("operator");

    const otpContainer = document.getElementById("otpContainer");

    if (!operator || !otpContainer) return;

    if (

        operator.selectedOptions.length > 0 &&

        operator.selectedOptions[0].dataset.otp === "true"

    ) {

        otpContainer.style.display = "block";

    }

    else {

        otpContainer.style.display = "none";

        const otp = document.getElementById("otp");

        if (otp) otp.value = "";

    }

}

// ==========================================
// EVENEMENTS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const country = document.getElementById("country");

    const operator = document.getElementById("operator");

    const payButton = document.getElementById("payButton");

    const statusButton = document.getElementById("statusButton");

    if (country) {

        loadOperators(country.value);

        country.addEventListener("change", function () {

            loadOperators(this.value);

        });

    }

    if (operator) {

        operator.addEventListener("change", checkOTP);

    }

    if (payButton) {

        payButton.addEventListener("click", createCollection);

    }

    if (statusButton) {

        statusButton.addEventListener("click", function () {

            checkCollectionStatus();

        });

    }

});
// ==========================================
// OUTILS
// ==========================================

function getLastCollection() {

    try {

        return JSON.parse(

            localStorage.getItem("lastCollection")

        );

    }

    catch (e) {

        return null;

    }

}

function clearLastCollection() {

    localStorage.removeItem("lastCollection");

    currentCollection = null;

}

// ==========================================
// MISE A JOUR AUTOMATIQUE DU STATUT
// ==========================================

let autoStatusInterval = null;

function startAutoStatus() {

    stopAutoStatus();

    autoStatusInterval = setInterval(async () => {

        const last = getLastCollection();

        if (!last) return;

        try {

            const response = await fetch(

                `${SEBPAY_BASE_URL}/collections/${last.reference || last.id}`,

                {

                    method: "GET",

                    headers: {

                        "X-Public-Key": PUBLIC_KEY,

                        "X-Secret-Key": SECRET_KEY

                    }

                }

            );

            const result = await response.json();

            if (!result.success) return;

            localStorage.setItem(

                "lastCollection",

                JSON.stringify(result.data)

            );

            if (

                result.data.status === "SUCCESS" ||

                result.data.status === "SUCCESSFUL"

            ) {

                stopAutoStatus();

                alert("✅ Paiement confirmé avec succès.");

            }

            if (

                result.data.status === "FAILED" ||

                result.data.status === "CANCELLED"

            ) {

                stopAutoStatus();

                alert("❌ Le paiement a échoué.");

            }

        }

        catch (e) {

            console.error(e);

        }

    }, 5000);

}

function stopAutoStatus() {

    if (autoStatusInterval) {

        clearInterval(autoStatusInterval);

        autoStatusInterval = null;

    }

}

// ==========================================
// LANCER LE SUIVI APRES LE PAIEMENT
// ==========================================

const oldCreateCollection = createCollection;

createCollection = async function () {

    await oldCreateCollection();

    startAutoStatus();

};

console.log("✅ RBC SebPay chargé avec succès.");
