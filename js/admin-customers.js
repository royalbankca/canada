//======================================================
// ROYAL BANK CANADA
// ADMIN CUSTOMERS
//======================================================

const API_URL = "https://canada-1.onrender.com";

const table = document.getElementById("customerTable");
const search = document.getElementById("search");

let customers = [];

//==============================
// LOAD CUSTOMERS
//==============================

async function loadCustomers() {

    try {

        const response = await fetch(
            `${API_URL}/api/admin/customers`
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

        customer.email.toLowerCase().includes(keyword)

    );

    renderTable(filtered);

});

//==============================
// ACTIONS
//==============================

function editCustomer(id){

    alert("Edit Customer : " + id);

}

function creditCustomer(id){

    alert("Credit Account : " + id);

}

function resetPassword(id){

    alert("Reset Password : " + id);

}

function toggleStatus(id){

    alert("Block / Activate : " + id);

}

//==============================

loadCustomers();
