// ==========================================
// dashboard.js
// PARTIE 1
// ==========================================

let currentUser = null;
let clients = [];

document.addEventListener("DOMContentLoaded", () => {

    checkSession();

    loadClients();

    loadCurrentUser();

    refreshDashboard();

    setInterval(refreshDashboard,3000);

});

// ==========================================
// VERIFIER SESSION
// ==========================================

function checkSession(){

    const logged = localStorage.getItem("isLoggedIn");

    const role = localStorage.getItem("role");

    if(logged !== "true" || role !== "client"){

        window.location.href = "login.html";

    }

}

// ==========================================
// CHARGER CLIENTS
// ==========================================

function loadClients(){

    clients = JSON.parse(

        localStorage.getItem("clients")

    ) || [];

}

// ==========================================
// CHARGER UTILISATEUR
// ==========================================

function loadCurrentUser(){

    const session = JSON.parse(

        localStorage.getItem("currentUser")

    );

    if(!session){

        window.location.href="login.html";

        return;

    }

    currentUser = clients.find(

        c => c.id === session.id

    );

    if(!currentUser){

        window.location.href="login.html";

        return;

    }

    localStorage.setItem(

        "currentUser",

        JSON.stringify(currentUser)

    );

}

// ==========================================
// RAFRAICHIR TABLEAU DE BORD
// ==========================================

function refreshDashboard(){

    loadClients();

    loadCurrentUser();

    updateProfile();

    updateBalance();

    loadTransactions();

    loadNotifications();

}

// ==========================================
// PROFIL CLIENT
// ==========================================

function updateProfile(){

    const name = document.getElementById("clientName");

    if(name){

        name.innerHTML = currentUser.name;

    }

    const account = document.getElementById("accountNumber");

    if(account){

        account.innerHTML = currentUser.account;

    }

    const client = document.getElementById("clientID");

    if(client){

        client.innerHTML = currentUser.id;

    }

}
// ==========================================
// dashboard.js
// PARTIE 2
// ==========================================

// ==========================================
// AFFICHAGE DU SOLDE
// ==========================================

function updateBalance(){

    const balance = document.getElementById("balance");

    if(balance){

        balance.innerHTML =

            "$ " +

            Number(currentUser.balance).toLocaleString(

                "en-CA",

                {

                    minimumFractionDigits:2,

                    maximumFractionDigits:2

                }

            );

    }

}

// ==========================================
// CHARGER LES TRANSACTIONS
// ==========================================

function loadTransactions(){

    const table = document.getElementById("transactionTable");

    if(!table) return;

    table.innerHTML = "";

    if(

        !currentUser.transactions ||

        currentUser.transactions.length===0

    ){

        table.innerHTML =

        `

<tr>

<td colspan="5" style="text-align:center">

Aucune transaction disponible.

</td>

</tr>

`;

        return;

    }

    currentUser.transactions.forEach(transaction=>{

        table.innerHTML += `

<tr>

<td>${transaction.date}</td>

<td>${transaction.type}</td>

<td>${transaction.description}</td>

<td>

$ ${Number(transaction.amount).toLocaleString(

"en-CA",

{

minimumFractionDigits:2,

maximumFractionDigits:2

}

)}

</td>

<td>${transaction.status}</td>

</tr>

`;

    });

}

// ==========================================
// DERNIERE TRANSACTION
// ==========================================

function getLastTransaction(){

    if(

        !currentUser.transactions ||

        currentUser.transactions.length===0

    ){

        return null;

    }

    return currentUser.transactions[0];

}

// ==========================================
// CARTE DERNIERE OPERATION
// ==========================================

function updateLastTransactionCard(){

    const card = document.getElementById("lastTransaction");

    if(!card) return;

    const last = getLastTransaction();

    if(!last){

        card.innerHTML =

        "Aucune opération.";

        return;

    }

    card.innerHTML =

        last.type +

        " - $" +

        Number(last.amount).toLocaleString(

            "en-CA"

        );

}
// ==========================================
// dashboard.js
// PARTIE 3
// ==========================================

// ==========================================
// CHARGER LES NOTIFICATIONS
// ==========================================

function loadNotifications(){

    const list = document.getElementById("notificationList");

    if(!list) return;

    list.innerHTML = "";

    if(

        !currentUser.notifications ||

        currentUser.notifications.length===0

    ){

        list.innerHTML =

        "<li>Aucune notification.</li>";

        return;

    }

    currentUser.notifications.forEach(notification=>{

        list.innerHTML += `

<li>

<strong>${notification.date}</strong>

<br>

${notification.message}

</li>

`;

    });

}

// ==========================================
// DEMANDES DE DEPOT
// ==========================================

function sendDepositRequest(

    amount,

    operator,

    phone

){

    let requests =

        JSON.parse(

            localStorage.getItem(

                "depositRequests"

            )

        ) || [];

    requests.push({

        clientId:currentUser.id,

        clientName:currentUser.name,

        amount:Number(amount),

        operator:operator,

        phone:phone,

        date:new Date().toLocaleString("fr-CA"),

        status:"En attente"

    });

    localStorage.setItem(

        "depositRequests",

        JSON.stringify(requests)

    );

    alert(

        "Votre demande de dépôt a été envoyée."

    );

}

// ==========================================
// FORMULAIRE DEPOT
// ==========================================

function submitDeposit(){

    const amount =

        document.getElementById("depositAmount").value;

    const operator =

        document.getElementById("depositOperator").value;

    const phone =

        document.getElementById("depositPhone").value;

    if(

        amount==="" ||

        Number(amount)<=0

    ){

        alert("Montant invalide.");

        return;

    }

    sendDepositRequest(

        amount,

        operator,

        phone

    );

    document.getElementById(

        "depositAmount"

    ).value="";

    document.getElementById(

        "depositPhone"

    ).value="";

}

// ==========================================
// DECONNEXION
// ==========================================

function logout(){

    localStorage.removeItem("currentUser");

    localStorage.removeItem("role");

    localStorage.removeItem("isLoggedIn");

    window.location.href="login.html";

}

// ==========================================
// SYNCHRONISATION
// ==========================================

window.addEventListener("storage",()=>{

    refreshDashboard();

});

setInterval(()=>{

    refreshDashboard();

    updateLastTransactionCard();

},5000);

// ==========================================
// FIN dashboard.js
// ==========================================
