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
                method: "GET",
                headers: headers()
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(
                data.message || "Impossible de charger les clients."
            );
        }

        clients = data.customers || [];

        renderClients();

    } catch (err) {

        console.error(err);

        alert(err.message);

    }

}
//=====================================================
// TABLEAU
//=====================================================

function renderClients() {

    const table = document.getElementById("clientTable");

    table.innerHTML = "";

    if (!clients.length) {

        table.innerHTML = `
        <tr>
            <td colspan="6" style="text-align:center;">
                Aucun client trouvé.
            </td>
        </tr>
        `;

        document.getElementById("totalClients").textContent = "0";
        return;
    }

    clients.forEach(client => {

        const statusClass =
            (client.status || "").toLowerCase();

        table.innerHTML += `

<tr>

<td>${client.customerId || "-"}</td>

<td>${client.firstName || ""} ${client.lastName || ""}</td>

<td>${client.accountNumber || "-"}</td>

<td>$${Number(client.balance || 0).toLocaleString()}</td>

<td>

<span class="status ${statusClass}">
${client.status || "Active"}
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

    document.getElementById("totalClients").textContent = clients.length;

}

//=====================================================
// RECHERCHE
//=====================================================

const search = document.getElementById("search");

if (search) {

    search.addEventListener("keyup", function () {

        const value = this.value.toLowerCase();

        document.querySelectorAll("#clientTable tr")
            .forEach(row => {

                row.style.display = row.innerText
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

    if (!client) {
        alert("Client introuvable.");
        return;
    }

    document.getElementById("infoName").textContent =
        `${client.firstName || ""} ${client.lastName || ""}`;

    document.getElementById("infoClientID").textContent =
        client.customerId || "-";

    document.getElementById("infoAccount").textContent =
        client.accountNumber || "-";

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
        "$" + Number(client.balance || 0).toLocaleString();

    document.getElementById("viewClientModal").style.display = "flex";

}
//=====================================================
// OUVRIR MODIFICATION
//=====================================================

function openEditClient(id) {

    currentClient = clients.find(c => c._id === id);

    if (!currentClient) {
        alert("Client introuvable.");
        return;
    }

    document.getElementById("editName").value =
        `${currentClient.firstName || ""} ${currentClient.lastName || ""}`;

    document.getElementById("editAccount").value =
        currentClient.accountNumber || "";

    document.getElementById("editClientID").value =
        currentClient.customerId || "";

    document.getElementById("editAccess").value =
        currentClient.transitNumber || "";

    document.getElementById("editPassword").value = "";

    document.getElementById("editBalance").value =
        currentClient.balance || 0;

    document.getElementById("editClientModal").style.display = "flex";

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

    const body = {

        firstName,
        lastName,

        customerId:
            document.getElementById("editClientID").value,

        accountNumber:
            document.getElementById("editAccount").value,

        transitNumber:
            document.getElementById("editAccess").value,

        balance:
            Number(document.getElementById("editBalance").value)

    };

    try {

        const response = await fetch(

            API_URL + "/admin/customers/" + currentClient._id,

            {

                method: "PUT",

                headers: headers(),

                body: JSON.stringify(body)

            }

        );

        const data = await response.json();

        if (!response.ok || !data.success) {

            throw new Error(
                data.message || "Impossible de modifier le client."
            );

        }

        alert("Client modifié avec succès.");

        closeEditClient();

        await loadClients();

    } catch (err) {

        console.error(err);

        alert(err.message);

    }

}

//=====================================================
// CREATION DESACTIVEE
//=====================================================

function createClient() {

    alert(
        "La création de client est désactivée pour le moment."
    );

}
//=====================================================
// SUPPRIMER CLIENT
//=====================================================

async function deleteClient(id) {

    const client = clients.find(c => c._id === id);

    if (!client) {
        alert("Client introuvable.");
        return;
    }

    if (!confirm(`Supprimer ${client.firstName} ${client.lastName} ?`)) {
        return;
    }

    try {

        const response = await fetch(
            API_URL + "/admin/customers/" + id,
            {
                method: "DELETE",
                headers: headers()
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {

            throw new Error(
                data.message || "Suppression impossible."
            );

        }

        alert("Client supprimé avec succès.");

        await loadClients();

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

    currentClient = null;

    document.getElementById("editClientModal").style.display = "none";

}

function closeViewClient() {

    document.getElementById("viewClientModal").style.display = "none";

}

window.onclick = function (event) {

    [
        "createClientModal",
        "editClientModal",
        "viewClientModal"
    ].forEach(id => {

        const modal = document.getElementById(id);

        if (modal && event.target === modal) {

            modal.style.display = "none";

        }

    });

};

//=====================================================
// DECONNEXION
//=====================================================

function logout() {

    if (!confirm("Voulez-vous vous déconnecter ?")) {
        return;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("role");
    localStorage.removeItem("isLoggedIn");

    window.location.href = "login.html";

}

//=====================================================
// INITIALISATION
//=====================================================

document.addEventListener("DOMContentLoaded", async () => {

    try {

        await loadClients();

    } catch (err) {

        console.error(err);

    }

});
