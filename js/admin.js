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

    document.getElementById("rechargeModal").style.display = "block";

    loadCountries();

}

function closeRecharge(){

    document.getElementById("rechargeModal").style.display = "none";

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
