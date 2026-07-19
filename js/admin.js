//=====================================================
// RBC ADMIN PANEL
// MongoDB + JWT
//=====================================================

const API_URL = "https://canada-1.onrender.com/api";

const token = localStorage.getItem("token");

const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "{}"
);

let clients = [];
let currentClient = null;

//=====================================================
// SECURITE
//=====================================================

if (!token) {

    window.location.href = "login.html";

}

if (currentUser.role !== "admin") {

    alert("Accès refusé.");

    window.location.href = "login.html";

}

//=====================================================
// HEADERS
//=====================================================

function headers() {

    return {

        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`

    };

}

//=====================================================
// CHARGER CLIENTS
//=====================================================

async function loadClients() {

    try {

        const response = await fetch(

            API_URL + "/admin/customers",

            {

                headers: headers()

            }

        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message);

        }

        clients = data;

        renderClients();

    } catch (err) {

        console.error(err);

        alert("Impossible de charger les clients.");

    }

}

//=====================================================
// TABLEAU
//=====================================================

function renderClients() {

    const table = document.getElementById("clientTable");

    table.innerHTML = "";

    clients.forEach(client => {

        table.innerHTML += `

<tr>

<td>${client.customerId}</td>

<td>${client.firstName} ${client.lastName}</td>

<td>${client.accountNumber}</td>

<td>$${Number(client.balance).toLocaleString()}</td>

<td>

<span class="status active">

${client.status}

</span>

</td>

<td>

<button
class="edit"
onclick="viewClient('${client._id}')">

Voir

</button>

<button
class="edit"
onclick="openEditClient('${client._id}')">

Modifier

</button>

<button
class="delete"
onclick="deleteClient('${client._id}')">

Supprimer

</button>

</td>

</tr>

`;

    });

    document.getElementById("totalClients").innerHTML = clients.length;

}

//=====================================================
// RECHERCHE
//=====================================================

const search = document.getElementById("search");

if (search) {

    search.addEventListener("keyup", function () {

        const value = this.value.toLowerCase();

        document
            .querySelectorAll("#clientTable tr")
            .forEach(row => {

                row.style.display =

                    row.innerText
                        .toLowerCase()
                        .includes(value)

                        ? ""

                        : "none";

            });

    });

}
//=====================================================
// VOIR CLIENT
//=====================================================

function viewClient(id) {

    const client = clients.find(c => c._id === id);

    if (!client) return;

    document.getElementById("infoName").textContent =
        `${client.firstName} ${client.lastName}`;

    document.getElementById("infoClientID").textContent =
        client.customerId;

    document.getElementById("infoAccount").textContent =
        client.accountNumber;

    document.getElementById("infoAccess").textContent =
        client.transitNumber || "-";

    document.getElementById("infoPassword").textContent =
        "********";

    document.getElementById("infoPhone").textContent =
        client.phone || "-";

    document.getElementById("infoEmail").textContent =
        client.email || "-";

    document.getElementById("infoAddress").textContent =
        client.address || "-";

    document.getElementById("infoBalance").textContent =
        "$" + Number(client.balance).toLocaleString();

    document.getElementById("viewClientModal").style.display = "flex";

}

//=====================================================
// OUVRIR MODIFICATION
//=====================================================

function openEditClient(id) {

    currentClient = clients.find(c => c._id === id);

    if (!currentClient) return;

    document.getElementById("editName").value =
        `${currentClient.firstName} ${currentClient.lastName}`;

    document.getElementById("editAccount").value =
        currentClient.accountNumber;

    document.getElementById("editClientID").value =
        currentClient.customerId;

    document.getElementById("editAccess").value =
        currentClient.transitNumber || "";

    document.getElementById("editPassword").value = "";

    document.getElementById("editBalance").value =
        currentClient.balance;

    document.getElementById("editClientModal").style.display = "flex";

}

//=====================================================
// CREER CLIENT
//=====================================================

async function createClient() {

    const fullname =
        document.getElementById("fullname").value.trim();

    const names = fullname.split(" ");

    const firstName = names.shift() || "";

    const lastName = names.join(" ");

    const phone =
        document.getElementById("phone").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const address =
        document.getElementById("address").value.trim();

    const balance =
        Number(document.getElementById("balance").value);

    try {

        const response = await fetch(

            API_URL + "/admin/customers",

            {

                method: "POST",

                headers: headers(),

                body: JSON.stringify({

                    firstName,

                    lastName,

                    phone,

                    email,

                    address,

                    balance

                })

            }

        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message);

        }

        alert("Client créé avec succès.");

        closeCreateClient();

        loadClients();

    } catch (err) {

        console.error(err);

        alert(err.message);

    }

}
//=====================================================
// ENREGISTRER MODIFICATIONS
//=====================================================

async function saveClient() {

    if (!currentClient) return;

    const fullname =
        document.getElementById("editName").value.trim();

    const names = fullname.split(" ");

    const firstName = names.shift() || "";

    const lastName = names.join(" ");

    try {

        const response = await fetch(

            API_URL + "/admin/customers/" + currentClient._id,

            {

                method: "PUT",

                headers: headers(),

                body: JSON.stringify({

                    firstName,

                    lastName,

                    accountNumber: document.getElementById("editAccount").value,

                    transitNumber: document.getElementById("editAccess").value,

                    balance: Number(document.getElementById("editBalance").value)

                })

            }

        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message);

        }

        alert("Client modifié avec succès.");

        closeEditClient();

        loadClients();

    } catch (err) {

        console.error(err);

        alert(err.message);

    }

}

//=====================================================
// SUPPRIMER CLIENT
//=====================================================

async function deleteClient(id) {

    if (!confirm("Supprimer ce client ?")) return;

    try {

        const response = await fetch(

            API_URL + "/admin/customers/" + id,

            {

                method: "DELETE",

                headers: headers()

            }

        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message);

        }

        alert("Client supprimé.");

        loadClients();

    } catch (err) {

        console.error(err);

        alert(err.message);

    }

}

//=====================================================
// MODALES
//=====================================================

function openCreateClient() {

    document.getElementById("createClientModal").style.display = "flex";

}

function closeCreateClient() {

    document.getElementById("createClientModal").style.display = "none";

}

function closeEditClient() {

    document.getElementById("editClientModal").style.display = "none";

}

function closeViewClient() {

    document.getElementById("viewClientModal").style.display = "none";

}

window.onclick = function (event) {

    ["createClientModal", "editClientModal", "viewClientModal"]
        .forEach(id => {

            const modal = document.getElementById(id);

            if (event.target === modal) {

                modal.style.display = "none";

            }

        });

};

//=====================================================
// DECONNEXION
//=====================================================

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("role");
    localStorage.removeItem("isLoggedIn");

    window.location.href = "login.html";

}

//=====================================================
// INITIALISATION
//=====================================================

document.addEventListener("DOMContentLoaded", () => {

    loadClients();

});
