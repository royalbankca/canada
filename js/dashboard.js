// ===========================================
// DEMO BANK
// dashboard.js
// ===========================================

let currentUser = null;
let transactions = [];

// ===========================================
// INITIALISATION
// ===========================================

document.addEventListener("DOMContentLoaded", initDashboard);

function initDashboard() {

    loadUser();

    loadTransactions();

    updateDashboard();

    updateCard();

    updateNotifications();

    updateSummary();

}

// ===========================================
// CHARGER LE CLIENT
// ===========================================

function loadUser() {

    const user = localStorage.getItem("currentUser");

    if (!user) {

        window.location.href = "login.html";

        return;

    }

    currentUser = JSON.parse(user);

}

// ===========================================
// MISE À JOUR DASHBOARD
// ===========================================

function updateDashboard() {

    document.getElementById("welcomeName").textContent = currentUser.name;

    document.getElementById("clientName").textContent = currentUser.name;

    document.getElementById("clientAccount").textContent = currentUser.account;

    document.getElementById("accountNumber").textContent = currentUser.account;

    document.getElementById("accessCode").textContent = currentUser.access;

    document.getElementById("clientId").textContent = currentUser.id;

    document.getElementById("balance").textContent =
        "$ " + Number(currentUser.balance).toLocaleString();

}

// ===========================================
// CARTE BANCAIRE
// ===========================================

function updateCard() {

    document.getElementById("cardHolder").textContent =
        currentUser.name.toUpperCase();

    document.getElementById("cardLastDigits").textContent =
        currentUser.account.slice(-4);

}
// ===========================================
// CHARGEMENT DES TRANSACTIONS
// ===========================================

function loadTransactions() {

    const data = localStorage.getItem("transactions");

    if (data) {

        transactions = JSON.parse(data);

    } else {

        transactions = [

            {
                date: "15/07/2026",
                type: "Virement reçu",
                description: "Salaire",
                amount: 2850,
                status: "Complété"
            },

            {
                date: "14/07/2026",
                type: "Paiement",
                description: "Internet",
                amount: -89.99,
                status: "Complété"
            },

            {
                date: "13/07/2026",
                type: "Retrait",
                description: "Guichet automatique",
                amount: -300,
                status: "Complété"
            }

        ];

        localStorage.setItem(
            "transactions",
            JSON.stringify(transactions)
        );

    }

    displayTransactions();

}

// ===========================================
// AFFICHAGE DES TRANSACTIONS
// ===========================================

function displayTransactions() {

    const table = document.getElementById("transactionsTable");

    if (!table) return;

    table.innerHTML = "";

    transactions.forEach(function(transaction){

        const amountClass =
            transaction.amount >= 0
            ? "credit"
            : "debit";

        const sign =
            transaction.amount >= 0
            ? "+"
            : "-";

        table.innerHTML += `

<tr>

<td>${transaction.date}</td>

<td>${transaction.type}</td>

<td>${transaction.description}</td>

<td class="${amountClass}">

${sign} ${Math.abs(transaction.amount).toLocaleString()} $

</td>

<td>

<span class="status success">

${transaction.status}

</span>

</td>

</tr>

`;

    });

}
// ===========================================
// NOTIFICATIONS
// ===========================================

function updateNotifications() {

    const notifications = [

        "Connexion sécurisée réussie.",
        "Aucune opération suspecte détectée.",
        "Votre compte est protégé."

    ];

    const container = document.querySelectorAll(".notification");

    container.forEach(function(item,index){

        if(notifications[index]){

            const p = item.querySelector("p");

            if(p){

                p.textContent = notifications[index];

            }

        }

    });

}

// ===========================================
// RÉSUMÉ FINANCIER
// ===========================================

function updateSummary() {

    let income = 0;

    let expense = 0;

    transactions.forEach(function(transaction){

        if(transaction.amount >= 0){

            income += transaction.amount;

        }else{

            expense += Math.abs(transaction.amount);

        }

    });

    const saving = income - expense;

    document.getElementById("monthlyIncome").textContent =
        "+ " + income.toLocaleString() + " $";

    document.getElementById("monthlyExpense").textContent =
        "- " + expense.toLocaleString() + " $";

    document.getElementById("savingAmount").textContent =
        saving.toLocaleString() + " $";

}

// ===========================================
// DATE ET HEURE
// ===========================================

function getCurrentDateTime(){

    const now = new Date();

    return now.toLocaleString("fr-CA");

}
// ===========================================
// FORMAT DU SOLDE
// ===========================================

function formatMoney(amount){

    return "$ " + Number(amount).toLocaleString("en-CA",{

        minimumFractionDigits:2,
        maximumFractionDigits:2

    });

}

// ===========================================
// ACTUALISER LE SOLDE
// ===========================================

function refreshBalance(newBalance){

    currentUser.balance = Number(newBalance);

    document.getElementById("balance").textContent =
        formatMoney(currentUser.balance);

    localStorage.setItem(
        "currentUser",
        JSON.stringify(currentUser)
    );

}

// ===========================================
// AJOUTER UNE TRANSACTION
// ===========================================

function addTransaction(type,description,amount){

    const today = new Date();

    const transaction = {

        date: today.toLocaleDateString("fr-CA"),

        type: type,

        description: description,

        amount: Number(amount),

        status: "Complété"

    };

    transactions.unshift(transaction);

    localStorage.setItem(

        "transactions",

        JSON.stringify(transactions)

    );

    displayTransactions();

    updateSummary();

}

// ===========================================
// RAFRAÎCHISSEMENT AUTOMATIQUE
// ===========================================

setInterval(function(){

    if(currentUser){

        refreshBalance(currentUser.balance);

    }

},5000);
// ===========================================
// RECHERCHE D'UNE TRANSACTION
// ===========================================

function searchTransaction(keyword){

    keyword = keyword.toLowerCase();

    return transactions.filter(function(transaction){

        return (

            transaction.type.toLowerCase().includes(keyword) ||

            transaction.description.toLowerCase().includes(keyword)

        );

    });

}

// ===========================================
// EXPORT DU RELEVÉ
// ===========================================

function exportStatement(){

    const data = JSON.stringify(transactions,null,2);

    const blob = new Blob([data],{

        type:"application/json"

    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "releve-transactions.json";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}

// ===========================================
// DERNIÈRE CONNEXION
// ===========================================

function saveLastLogin(){

    const login = getCurrentDateTime();

    localStorage.setItem(

        "lastLogin",

        login

    );

}

function getLastLogin(){

    return localStorage.getItem("lastLogin") || "Première connexion";

}

// ===========================================
// SAUVEGARDE DE LA SESSION
// ===========================================

saveLastLogin();
// ===========================================
// MESSAGES D'ACCUEIL
// ===========================================

function showWelcomeMessage(){

    const hour = new Date().getHours();

    let message = "Bienvenue";

    if(hour < 12){

        message = "Bonjour";

    }else if(hour < 18){

        message = "Bon après-midi";

    }else{

        message = "Bonsoir";

    }

    const title = document.querySelector("header h1");

    if(title){

        title.textContent = message + ", " + currentUser.name;

    }

}

showWelcomeMessage();

// ===========================================
// DERNIÈRE MISE À JOUR
// ===========================================

function updateLastRefresh(){

    const now = new Date();

    console.log(

        "Dernière mise à jour : " +

        now.toLocaleTimeString("fr-CA")

    );

}

setInterval(updateLastRefresh,60000);

// ===========================================
// SESSION
// ===========================================

function keepSessionAlive(){

    localStorage.setItem(

        "session",

        Date.now()

    );

}

setInterval(keepSessionAlive,30000);

// ===========================================
// DÉCONNEXION AUTOMATIQUE
// ===========================================

let inactivityTimer;

function resetInactivityTimer(){

    clearTimeout(inactivityTimer);

    inactivityTimer = setTimeout(function(){

        alert("Votre session a expiré.");

        logout();

    },15 * 60 * 1000);

}

document.addEventListener("mousemove",resetInactivityTimer);
document.addEventListener("keydown",resetInactivityTimer);
document.addEventListener("click",resetInactivityTimer);

resetInactivityTimer();
// ===========================================
// BOUTONS D'ACTIONS RAPIDES
// ===========================================

function openTransfer(){

    window.location.href = "transfer.html";

}

function openTransactions(){

    window.location.href = "transactions.html";

}

function openProfile(){

    window.location.href = "profile.html";

}

function openSettings(){

    window.location.href = "settings.html";

}

// ===========================================
// VÉRIFICATION DE L'ÉTAT DU COMPTE
// ===========================================

function checkAccountStatus(){

    if(currentUser.status){

        if(currentUser.status.toLowerCase() === "blocked"){

            alert("Votre compte est actuellement bloqué.");

            logout();

            return;

        }

    }

}

checkAccountStatus();

// ===========================================
// SAUVEGARDE AUTOMATIQUE
// ===========================================

function saveCurrentUser(){

    localStorage.setItem(

        "currentUser",

        JSON.stringify(currentUser)

    );

}

setInterval(saveCurrentUser,10000);

// ===========================================
// MISE À JOUR DE L'HEURE
// ===========================================

function updateClock(){

    const now = new Date();

    const clock = document.getElementById("currentTime");

    if(clock){

        clock.textContent = now.toLocaleTimeString("fr-CA");

    }

}

setInterval(updateClock,1000);

updateClock();
// ===========================================
// DÉCONNEXION
// ===========================================

function logout(){

    localStorage.removeItem("currentUser");
    localStorage.removeItem("session");

    window.location.href = "login.html";

}

// ===========================================
// RAFRAÎCHISSEMENT DES DONNÉES
// ===========================================

function refreshDashboard(){

    loadUser();

    loadTransactions();

    updateDashboard();

    updateCard();

    updateNotifications();

    updateSummary();

}

setInterval(refreshDashboard,30000);

// ===========================================
// STATISTIQUES
// ===========================================

function getStatistics(){

    const totalTransactions = transactions.length;

    let credits = 0;

    let debits = 0;

    transactions.forEach(function(transaction){

        if(transaction.amount >= 0){

            credits++;

        }else{

            debits++;

        }

    });

    console.log({

        client: currentUser.name,

        compte: currentUser.account,

        operations: totalTransactions,

        credits: credits,

        debits: debits,

        solde: currentUser.balance

    });

}

// ===========================================
// INITIALISATION
// ===========================================

window.addEventListener("load",function(){

    refreshDashboard();

    getStatistics();

});

// ===========================================
// FIN DU FICHIER
// ===========================================
