// ==========================================
// admin.js
// PARTIE 1
// ==========================================

let clients = [];
let currentClient = null;

// ==========================================
// INITIALISATION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    loadClients();

    renderClients();

    updateDashboardCards();

    initSearch();

});

// ==========================================
// CHARGER LES CLIENTS
// ==========================================

function loadClients(){

    const storage = localStorage.getItem("clients");

    if(storage){

        clients = JSON.parse(storage);

        return;

    }

    clients = [

        {
            id:"100001",
            name:"Michael Johnson",
            account:"CA4587458965412",
            access:"4587",
            password:"RBC2026",
            phone:"+1 4387959811",
            email:"michael@demo.ca",
            address:"Montreal, Quebec",
            balance:45870.00,
            status:"Actif",
            transactions:[],
            notifications:[]
        },

        {
            id:"100002",
            name:"Emma Wilson",
            account:"CA4587458965413",
            access:"7625",
            password:"RBC2026",
            phone:"+1 4387959812",
            email:"emma@demo.ca",
            address:"Toronto",
            balance:12840,
            status:"Actif",
            transactions:[],
            notifications:[]
        },

        {
            id:"100003",
            name:"Daniel Brown",
            account:"CA4587458965414",
            access:"3481",
            password:"RBC2026",
            phone:"+1 4387959813",
            email:"daniel@demo.ca",
            address:"Ottawa",
            balance:8750,
            status:"Actif",
            transactions:[],
            notifications:[]
        },

        {
            id:"100004",
            name:"Sophia Martin",
            account:"CA4587458965415",
            access:"6158",
            password:"RBC2026",
            phone:"+1 4387959814",
            email:"sophia@demo.ca",
            address:"Vancouver",
            balance:96200,
            status:"Actif",
            transactions:[],
            notifications:[]
        },

        {
            id:"100005",
            name:"James Taylor",
            account:"CA4587458965416",
            access:"9002",
            password:"RBC2026",
            phone:"+1 4387959815",
            email:"james@demo.ca",
            address:"Calgary",
            balance:51400,
            status:"Actif",
            transactions:[],
            notifications:[]
        },

        {
            id:"100006",
            name:"Olivia White",
            account:"CA4587458965417",
            access:"7455",
            password:"RBC2026",
            phone:"+1 4387959816",
            email:"olivia@demo.ca",
            address:"Quebec",
            balance:36500,
            status:"Actif",
            transactions:[],
            notifications:[]
        },

        {
            id:"100007",
            name:"William Moore",
            account:"CA4587458965418",
            access:"8200",
            password:"RBC2026",
            phone:"+1 4387959817",
            email:"william@demo.ca",
            address:"Laval",
            balance:15000,
            status:"Actif",
            transactions:[],
            notifications:[]
        },

        {
            id:"100008",
            name:"Charlotte Lee",
            account:"CA4587458965419",
            access:"3318",
            password:"RBC2026",
            phone:"+1 4387959818",
            email:"charlotte@demo.ca",
            address:"Winnipeg",
            balance:22400,
            status:"Actif",
            transactions:[],
            notifications:[]
        },

        {
            id:"100009",
            name:"Lucas Harris",
            account:"CA4587458965420",
            access:"5788",
            password:"RBC2026",
            phone:"+1 4387959819",
            email:"lucas@demo.ca",
            address:"Edmonton",
            balance:68100,
            status:"Actif",
            transactions:[],
            notifications:[]
        },

        {
            id:"100010",
            name:"Amelia Walker",
            account:"CA4587458965421",
            access:"4401",
            password:"RBC2026",
            phone:"+1 4387959820",
            email:"amelia@demo.ca",
            address:"Halifax",
            balance:102500,
            status:"Actif",
            transactions:[],
            notifications:[]
        }

    ];

    saveClients();

}

function saveClients(){

    localStorage.setItem(

        "clients",

        JSON.stringify(clients)

    );

}
// ==========================================
// ADMIN.JS
// PARTIE 2
// ==========================================

function renderClients(){

    const table=document.getElementById("clientTable");

    if(!table) return;

    table.innerHTML="";

    clients.forEach(client=>{

        table.innerHTML+=`

<tr>

<td>${client.id}</td>

<td>${client.name}</td>

<td>${client.account}</td>

<td>$ ${Number(client.balance).toLocaleString("en-CA",{
minimumFractionDigits:2,
maximumFractionDigits:2
})}</td>

<td>

<span class="status active">

${client.status}

</span>

</td>

<td>

<button class="view"
onclick="viewClient('${client.id}')">

Voir

</button>

<button class="edit"
onclick="openEditClient('${client.id}')">

Modifier

</button>

</td>

</tr>

`;

    });

}

// ==========================================
// TABLEAU DE BORD ADMIN
// ==========================================

function updateDashboardCards(){

    const totalClients=document.getElementById("totalClients");

    if(totalClients){

        totalClients.innerHTML=clients.length;

    }

    const active=clients.filter(c=>c.status==="Actif").length;

    const activeCard=document.querySelectorAll(".card h1");

    if(activeCard.length>=4){

        activeCard[3].innerHTML=active;

    }

}

// ==========================================
// RECHERCHE CLIENT
// ==========================================

function initSearch(){

    const input=document.getElementById("search");

    if(!input) return;

    input.addEventListener("keyup",function(){

        const keyword=this.value.toLowerCase();

        const rows=document.querySelectorAll("#clientTable tr");

        rows.forEach(row=>{

            if(row.innerText.toLowerCase().includes(keyword)){

                row.style.display="";

            }else{

                row.style.display="none";

            }

        });

    });

}

// ==========================================
// OUVRIR MODIFICATION
// ==========================================

function openEditClient(id){

    currentClient=clients.find(c=>c.id===id);

    if(!currentClient){

        alert("Client introuvable");

        return;

    }

    document.getElementById("editName").value=currentClient.name;

    document.getElementById("editAccount").value=currentClient.account;

    document.getElementById("editClientID").value=currentClient.id;

    document.getElementById("editAccess").value=currentClient.access;

    document.getElementById("editPassword").value=currentClient.password;

    document.getElementById("editBalance").value=currentClient.balance;

    document.getElementById("editClientModal").style.display="flex";

}
// ==========================================
// ADMIN.JS
// PARTIE 3
// ==========================================

// ==========================================
// ENREGISTRER LES MODIFICATIONS
// ==========================================

function saveClient(){

    if(!currentClient) return;

    currentClient.name =
        document.getElementById("editName").value.trim();

    currentClient.account =
        document.getElementById("editAccount").value.trim();

    currentClient.id =
        document.getElementById("editClientID").value.trim();

    currentClient.access =
        document.getElementById("editAccess").value.trim();

    currentClient.password =
        document.getElementById("editPassword").value.trim();

    currentClient.balance =
        Number(document.getElementById("editBalance").value);

    saveClients();

    // Si le client est connecté,
    // on met aussi sa session à jour

    const user =
        JSON.parse(localStorage.getItem("currentUser"));

    if(user && user.id===currentClient.id){

        localStorage.setItem(
            "currentUser",
            JSON.stringify(currentClient)
        );

    }

    renderClients();

    updateDashboardCards();

    document.getElementById(
        "editClientModal"
    ).style.display="none";

    alert("Client modifié avec succès.");

}

// ==========================================
// VOIR LE PROFIL
// ==========================================

function viewClient(id){

    const client =
        clients.find(c=>c.id===id);

    if(!client){

        alert("Client introuvable");

        return;

    }

    document.getElementById("infoName").innerHTML =
        client.name;

    document.getElementById("infoClientID").innerHTML =
        client.id;

    document.getElementById("infoAccount").innerHTML =
        client.account;

    document.getElementById("infoAccess").innerHTML =
        client.access;

    document.getElementById("infoPassword").innerHTML =
        client.password;

    document.getElementById("infoPhone").innerHTML =
        client.phone;

    document.getElementById("infoEmail").innerHTML =
        client.email;

    document.getElementById("infoAddress").innerHTML =
        client.address;

    document.getElementById("infoBalance").innerHTML =
        "$ " +
        Number(client.balance).toLocaleString(
            "en-CA",
            {
                minimumFractionDigits:2,
                maximumFractionDigits:2
            }
        );

    document.getElementById(
        "viewClientModal"
    ).style.display="flex";

}

// ==========================================
// AJOUTER UNE TRANSACTION
// ==========================================

function addTransaction(

    id,

    type,

    description,

    amount

){

    const client =
        clients.find(c=>c.id===id);

    if(!client) return;

    if(!client.transactions){

        client.transactions=[];

    }

    client.transactions.unshift({

        date:new Date().toLocaleDateString("fr-CA"),

        type:type,

        description:description,

        amount:Number(amount),

        status:"Complété"

    });

    saveClients();

}
// ==========================================
// ADMIN.JS
// PARTIE 4
// ==========================================

// ==========================================
// AJOUTER UNE NOTIFICATION
// ==========================================

function addNotification(id, message){

    const client = clients.find(c => c.id === id);

    if(!client) return;

    if(!client.notifications){

        client.notifications = [];

    }

    client.notifications.unshift({

        date: new Date().toLocaleString("fr-CA"),

        message: message

    });

    saveClients();

}

// ==========================================
// MODIFIER LE SOLDE
// ==========================================

function updateBalance(id, amount, operation="add"){

    const client = clients.find(c=>c.id===id);

    if(!client) return;

    amount = Number(amount);

    if(operation==="add"){

        client.balance += amount;

    }else{

        client.balance -= amount;

    }

    saveClients();

    // mise à jour si connecté

    const user = JSON.parse(localStorage.getItem("currentUser"));

    if(user && user.id===client.id){

        localStorage.setItem(

            "currentUser",

            JSON.stringify(client)

        );

    }

    renderClients();

}

// ==========================================
// DEMANDES DE DEPOT
// ==========================================

function getDepositRequests(){

    return JSON.parse(

        localStorage.getItem("depositRequests")

    ) || [];

}

function saveDepositRequests(list){

    localStorage.setItem(

        "depositRequests",

        JSON.stringify(list)

    );

}

// ==========================================
// VALIDER DEPOT
// ==========================================

function approveDeposit(index){

    const requests = getDepositRequests();

    const request = requests[index];

    if(!request) return;

    updateBalance(

        request.clientId,

        request.amount,

        "add"

    );

    addTransaction(

        request.clientId,

        "Dépôt SebPay",

        request.operator,

        request.amount

    );

    addNotification(

        request.clientId,

        "Votre dépôt de $" +

        Number(request.amount).toLocaleString("en-CA") +

        " CAD a été validé."

    );

    requests.splice(index,1);

    saveDepositRequests(requests);

    alert("Dépôt validé.");

}

// ==========================================
// REFUSER DEPOT
// ==========================================

function rejectDeposit(index){

    const requests = getDepositRequests();

    if(!requests[index]) return;

    requests.splice(index,1);

    saveDepositRequests(requests);

    alert("Demande supprimée.");

}

// ==========================================
// RAFRAICHIR
// ==========================================

function refresh(){

    loadClients();

    renderClients();

    updateDashboardCards();

}

setInterval(refresh,5000);

// ==========================================
// FIN ADMIN.JS
// ==========================================
