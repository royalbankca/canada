//======================================================
// ROYAL BANK CANADA
// ADMIN CUSTOMERS
//======================================================

const API_URL = "https://canada-1.onrender.com";

const token = localStorage.getItem("token");

const table = document.getElementById("customerTable");
const search = document.getElementById("search");
let selectedCustomer = null;

let customers = [];

//==============================
// LOAD CUSTOMERS
//==============================

async function loadCustomers() {

    try {

      const response = await fetch(
    `${API_URL}/api/admin/customers`,
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
);

        const result = await response.json();

        if (result.success) {

            customers = result.customers;

            renderTable(customers);

        } else {

            alert(result.message);

        }

    } catch (error) {

        console.error(error);

        alert("Unable to load customers.");

    }

}

//==============================
// RENDER TABLE
//==============================

function renderTable(list) {

    table.innerHTML = "";

    list.forEach(customer => {

        table.innerHTML += `

<tr>

<td>${customer.customerId}</td>

<td>${customer.firstName} ${customer.lastName}</td>

<td>${customer.phone || "-"}</td>

<td>${customer.accessCode || "-"}</td>

<td>${customer.accountNumber}</td>

<td>${customer.balance} ${customer.currency}</td>

<td class="${customer.status === "Active"
? "status-active"
: "status-blocked"}">

${customer.status}

</td>

<td>

<div class="actions">

<button
class="edit"
onclick="editCustomer('${customer._id}')">
Edit
</button>

<button
class="credit"
onclick="creditCustomer('${customer._id}')">
Credit
</button>

<button
class="recharge"
onclick="openRecharge('${customer._id}')">
Recharge
</button>

<button
class="password"
onclick="resetPassword('${customer._id}')">
Password
</button>

<button
class="${customer.status === "Active"
? "block"
: "activate"}"
onclick="toggleStatus('${customer._id}')">

${customer.status === "Active"
? "Block"
: "Activate"}

</button>

<button
class="delete"
onclick="deleteCustomer('${customer._id}')">
Delete
</button>

</div>
</td>

</tr>

`;

    });

}
//==============================
// SEARCH
//==============================

search.addEventListener("keyup", () => {

    const keyword = search.value.toLowerCase();

   const filtered = customers.filter(customer =>

    customer.customerId.toLowerCase().includes(keyword)

    ||

    customer.firstName.toLowerCase().includes(keyword)

    ||

    customer.lastName.toLowerCase().includes(keyword)

    ||

    (customer.phone || "").toLowerCase().includes(keyword)

    ||

    (customer.accessCode || "").toLowerCase().includes(keyword)

);
    renderTable(filtered);

});

//==============================
// EDIT CUSTOMER
//==============================

async function editCustomer(id) {

    const firstName = prompt("First Name:");
    if (firstName === null) return;

    const lastName = prompt("Last Name:");
    if (lastName === null) return;

    const phone = prompt("Phone:");
    if (phone === null) return;

    try {

        const response = await fetch(
            `${API_URL}/api/admin/customers/${id}`,
            {
                method: "PUT",
              headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
},
                body: JSON.stringify({
                    firstName,
                    lastName,
                    phone
                })
            }
        );

        const result = await response.json();

        if (result.success) {

            alert("Customer updated successfully.");

            loadCustomers();

        } else {

            alert(result.message);

        }

    } catch (error) {

        alert("Unable to update customer.");

    }

}

//==============================
// CREDIT ACCOUNT
//==============================

async function creditCustomer(id) {

    const amount = prompt("Enter amount to credit:");

    if (!amount) return;

    try {

        const response = await fetch(
            `${API_URL}/api/admin/customers/${id}/credit`,
            {
                method: "PUT",
           headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
},
                body: JSON.stringify({
                    amount
                })
            }
        );

        const result = await response.json();

        alert("New Balance : " + result.balance);

        loadCustomers();

    } catch (error) {

        alert("Unable to credit account.");

    }

}
//==============================
// RESET PASSWORD
//==============================

async function resetPassword(id) {

    const password = prompt("Enter new password:");

    if (!password) return;

    try {

        const response = await fetch(
            `${API_URL}/api/admin/customers/${id}/password`,
            {
                method: "PUT",
                headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
},
                body: JSON.stringify({
                    password
                })
            }
        );

        const result = await response.json();

        if (result.success) {

            alert(result.message);

        } else {

            alert(result.message);

        }

    } catch (error) {

        alert("Unable to reset password.");

    }

}

//==============================
// BLOCK / ACTIVATE CUSTOMER
//==============================

async function toggleStatus(id) {

    try {

        const response = await fetch(
            `${API_URL}/api/admin/customers/${id}/status`,
           {
    method: "PUT",
    headers: {
        Authorization: `Bearer ${token}`
    }
}
        );

        const result = await response.json();

        if (result.success) {

            alert("Status : " + result.status);

            loadCustomers();

        } else {

            alert(result.message);

        }

    } catch (error) {

        alert("Unable to update status.");

    }

}

//==============================
// LOGOUT
//==============================

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");

    window.location.href = "login.html";

}

//==============================
// START
//==============================

loadCustomers();
function openRecharge(id) {

    selectedCustomer = id;

    resetRecharge();

    document.getElementById("rechargeModal").style.display = "flex";

}

function closeRecharge() {

    document.getElementById("rechargeModal").style.display = "none";

    document.getElementById("rechargeForm").reset();

    document.getElementById("mobileOperator").innerHTML =
        '<option value="">Select Country First</option>';

    document.getElementById("mobileOperator").disabled = true;

    document.getElementById("phoneNumber").disabled = true;

    document.getElementById("phoneNumber").placeholder =
        "Mobile Money Number";

}
async function deleteCustomer(id){

    if(!confirm("Delete this customer permanently ?"))
        return;

    try{

        const response = await fetch(

            `${API_URL}/api/admin/customers/${id}`,

            {

                method:"DELETE",

                headers:{
                    Authorization:`Bearer ${token}`
                }

            }

        );

        const result = await response.json();

        alert(result.message);

        loadCustomers();

    }

    catch(error){

        alert("Unable to delete customer.");

    }

}
//======================================================
// SEBPAY
//======================================================

const SEBPAY = {

BJ:{
name:"Bénin",
currency:"XOF",
prefix:"+229",
operators:[
{name:"MTN Money",slug:"mtn"},
{name:"Moov Money",slug:"moov"},
{name:"Celtiis Money",slug:"celtiis"},
{name:"Coris Money",slug:"coris"}
]
},

BF:{
name:"Burkina Faso",
currency:"XOF",
prefix:"+226",
operators:[
{name:"Moov Money",slug:"moov"},
{name:"Orange Money",slug:"orange"},
{name:"Wallet LigdiCash",slug:"wligdicash"}
]
},

CM:{
name:"Cameroun",
currency:"XAF",
prefix:"+237",
operators:[
{name:"MTN Money",slug:"mtn"},
{name:"Orange Money",slug:"orange"}
]
},

CG:{
name:"Congo",
currency:"XAF",
prefix:"+242",
operators:[
{name:"MTN Money",slug:"mtn"}
]
},

CI:{
name:"Côte d'Ivoire",
currency:"XOF",
prefix:"+225",
operators:[
{name:"MTN Money",slug:"mtn"},
{name:"Orange Money",slug:"orange"},
{name:"Moov Money",slug:"moov"},
{name:"Wave Money",slug:"wave"}
]
},

GA:{
name:"Gabon",
currency:"XAF",
prefix:"+241",
operators:[
{name:"Airtel Money",slug:"airtel"},
{name:"Moov Money",slug:"moov"}
]
},

GM:{
name:"Gambie",
currency:"GMD",
prefix:"+220",
operators:[
{name:"Afri Money",slug:"afrimoney"}
]
},

GH:{
name:"Ghana",
currency:"GHS",
prefix:"+233",
operators:[
{name:"Airtel Money",slug:"airtel"},
{name:"MTN Money",slug:"mtn"},
{name:"Telecel Cash",slug:"telecel"}
]
},

GN:{
name:"Guinée",
currency:"GNF",
prefix:"+224",
operators:[
{name:"MTN Money",slug:"mtn"},
{name:"Orange Money",slug:"orange"}
]
},

GW:{
name:"Guinée-Bissau",
currency:"XOF",
prefix:"+245",
operators:[
{name:"Orange Money",slug:"orange"}
]
},

ML:{
name:"Mali",
currency:"XOF",
prefix:"+223",
operators:[
{name:"Moov Money",slug:"moov"},
{name:"Orange Money",slug:"orange"}
]
},

NE:{
name:"Niger",
currency:"XOF",
prefix:"+227",
operators:[
{name:"Airtel Money",slug:"airtel"},
{name:"Amanata",slug:"amanata"},
{name:"Moov Money",slug:"moov"},
{name:"Nita",slug:"nita"},
{name:"Wallet LigdiCash",slug:"wligdicash"},
{name:"Zamani",slug:"zamani"}
]
},

NG:{
name:"Nigéria",
currency:"NGN",
prefix:"+234",
operators:[
{name:"Airtel",slug:"airtel"},
{name:"MTN Money",slug:"mtn"}
]
},

CD:{
name:"RDC",
currency:"CDF",
prefix:"+243",
operators:[
{name:"Afri Money",slug:"afrimoney"},
{name:"Airtel Money",slug:"airtel"},
{name:"Mpesa",slug:"mpesa"},
{name:"Orange Money",slug:"orange"},
{name:"Vodacom",slug:"vodacom"}
]
},

SN:{
name:"Sénégal",
currency:"XOF",
prefix:"+221",
operators:[
{name:"E-money",slug:"emoney"},
{name:"Free Money",slug:"free"},
{name:"Orange Money",slug:"orange"},
{name:"Wave Money",slug:"wave"}
]
},

TD:{
name:"Tchad",
currency:"XAF",
prefix:"+235",
operators:[
{name:"Airtel",slug:"airtel"},
{name:"Moov",slug:"moov"}
]
},

TG:{
name:"Togo",
currency:"XOF",
prefix:"+228",
operators:[
{name:"Moov Money",slug:"moov"},
{name:"T-Money",slug:"tmoney"}
]
}

};
//======================================================
// CHARGEMENT DES PAYS
//======================================================

function loadCountries() {

    const country = document.getElementById("countrySelect");

    if (!country) return;

    country.innerHTML =
        '<option value="">Select Country</option>';

    Object.keys(SEBPAY).forEach(code => {

        country.innerHTML += `
            <option value="${code}">
                ${SEBPAY[code].name}
            </option>
        `;

    });

    country.removeEventListener("change", loadOperators);
    country.addEventListener("change", loadOperators);

}

//======================================================
// CHARGEMENT DES OPERATEURS
//======================================================

function loadOperators() {

    const country = this.value;

    const operator =
        document.getElementById("mobileOperator");

    const phone =
        document.getElementById("phoneNumber");

    operator.innerHTML = "";
    phone.value = "";
    phone.disabled = true;

    if (country === "") {

        operator.disabled = true;

        operator.innerHTML =
            '<option value="">Select Country First</option>';

        return;

    }

    operator.disabled = false;

    operator.innerHTML =
        '<option value="">Select Operator</option>';

    SEBPAY[country].operators.forEach(op => {

        operator.innerHTML += `
            <option value="${op.slug}">
                ${op.name}
            </option>
        `;

    });

    operator.onchange = function () {

        if (this.value === "") {

            phone.disabled = true;
            phone.placeholder = "Mobile Money Number";

        } else {

            phone.disabled = false;
            phone.placeholder =
                SEBPAY[country].prefix + "XXXXXXXX";

        }

    };

}

//======================================================
// RESET RECHARGE
//======================================================

function resetRecharge() {

    loadCountries();

    document.getElementById("rechargeForm").reset();

    document.getElementById("mobileOperator").disabled = true;

    document.getElementById("phoneNumber").disabled = true;

    document.getElementById("phoneNumber").placeholder =
        "Mobile Money Number";

}
//======================================================
// FORMULAIRE RECHARGE
//======================================================

const rechargeForm = document.getElementById("rechargeForm");

if (rechargeForm) {
    rechargeForm.addEventListener("submit", submitRecharge);
}

async function submitRecharge(e) {

    e.preventDefault();

    const country =
        document.getElementById("countrySelect").value;

    const operator =
        document.getElementById("mobileOperator").value;

    const phone =
        document.getElementById("phoneNumber").value.trim();

    const amount =
        Number(document.getElementById("depositAmount").value);

    if (!country) {
        alert("Please select a country.");
        return;
    }

    if (!operator) {
        alert("Please select an operator.");
        return;
    }

    if (!phone) {
        alert("Please enter a phone number.");
        return;
    }

    if (amount <= 0) {
        alert("Invalid amount.");
        return;
    }

    const config = SEBPAY[country];

    try {

        const response = await fetch(
            `${API_URL}/api/collections`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({

                    amount,

                    currency: config.currency,

                    phone,

                    operator,

                    country,

                    external_reference:
                        "ADMIN-" + Date.now(),

                    description:
                        "Customer account recharge"

                })
            }
        );

        const result = await response.json();

        if (!response.ok) {

            alert(result.message || "Payment refused.");

            return;

        }

        const transactionId =
            result.data?.transaction_id ||
            result.transaction_id;

        if (!transactionId) {

            alert("Transaction ID not found.");

            return;

        }

        closeRecharge();

        showPaymentStatus(
            "Payment in progress...",
            "Please confirm the payment on the customer's phone.",
            "fas fa-spinner fa-spin",
            "#0057a3"
        );

        verifierPaiement(
            transactionId,
            amount
        );

    }

    catch (error) {

        console.error(error);

        alert("Unable to contact the server.");

    }

}
//======================================================
// VERIFICATION DU PAIEMENT
//======================================================

async function verifierPaiement(transactionId, amount) {

    const interval = setInterval(async () => {

        try {

            const response = await fetch(
                `${API_URL}/api/collections/${transactionId}`
            );

            const result = await response.json();

            const status =
                result.data?.status || result.status;

            if (status === "approved") {

                clearInterval(interval);

                // Crédit du client sélectionné
                const recharge = await fetch(
                    `${API_URL}/api/admin/customers/${selectedCustomer}/recharge`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            amount
                        })
                    }
                );

                const rechargeResult = await recharge.json();

                if (!recharge.ok || !rechargeResult.success) {

                    showPaymentStatus(
                        "Recharge failed",
                        rechargeResult.message || "Unable to credit the customer's account.",
                        "fas fa-circle-xmark",
                        "#dc2626",
                        true
                    );

                    return;
                }

                loadCustomers();

                showPaymentStatus(
                    "Payment confirmed",
                    "The customer's account has been credited successfully.",
                    "fas fa-circle-check",
                    "#16a34a",
                    true
                );

            }

            if (status === "rejected") {

                clearInterval(interval);

                showPaymentStatus(
                    "Payment refused",
                    "The Mobile Money transaction was refused.",
                    "fas fa-circle-xmark",
                    "#dc2626",
                    true
                );

            }

        } catch (err) {

            console.error(err);

        }

    }, 5000);

}

//======================================================
// PAYMENT STATUS
//======================================================

function showPaymentStatus(
    title,
    message,
    icon,
    color,
    showButton = false
) {

    const modal =
        document.getElementById("paymentStatusModal");

    document.getElementById("paymentStatusTitle").innerText =
        title;

    document.getElementById("paymentStatusMessage").innerText =
        message;

    const statusIcon =
        document.getElementById("paymentStatusIcon");

    statusIcon.className = icon;
    statusIcon.style.color = color;

    const button =
        document.getElementById("paymentStatusButton");

    button.style.display =
        showButton ? "inline-block" : "none";

    button.onclick = closePaymentStatus;

    modal.style.display = "flex";

}

function closePaymentStatus() {

    document.getElementById(
        "paymentStatusModal"
    ).style.display = "none";

}
document.addEventListener("input", function (e) {

    if (e.target.id !== "phoneNumber") return;

    const country =
        document.getElementById("countrySelect").value;

    if (country === "") return;

    const prefix =
        SEBPAY[country].prefix.replace("+", "");

    let value =
        e.target.value.replace(/\D/g, "");

    if (value.startsWith(prefix)) {

        e.target.value = value;

    } else {

        e.target.value = prefix + value;

    }

});
