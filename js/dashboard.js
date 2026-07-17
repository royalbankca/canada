//====================================================
// ROYAL BANK
// dashboard.js
// Version SebPay
//====================================================

let currentUser = null;
let transactions = [];
let balanceVisible = true;

//====================================================
// INITIALISATION
//====================================================

document.addEventListener("DOMContentLoaded", () => {

    loadUser();

    loadTransactions();

    updateDashboard();

    updateSummary();

    initializeEvents();

});

//====================================================
// CHARGER LE CLIENT
//====================================================

function loadUser(){

    const data = localStorage.getItem("currentUser");

    if(!data){

        window.location.href="login.html";

        return;

    }

    currentUser = JSON.parse(data);

}

//====================================================
// TABLEAU DE BORD
//====================================================

function updateDashboard(){

    document.getElementById("welcomeTitle").textContent =
        "Bonjour " + currentUser.name;

    document.getElementById("welcomeName").textContent =
        "Bienvenue sur votre espace bancaire sécurisé.";

    document.getElementById("clientName").textContent =
        currentUser.name;

    document.getElementById("cardHolder").textContent =
        currentUser.name.toUpperCase();

    document.getElementById("clientAccount").textContent =
        currentUser.account;

    document.getElementById("accountNumber").textContent =
        currentUser.account;

    document.getElementById("clientId").textContent =
        currentUser.id;

    document.getElementById("clientInfoId").textContent =
        currentUser.id;

    document.getElementById("cardNumber").textContent =
        formatCard(currentUser.account);

    refreshBalance(currentUser.balance);

}

//====================================================
// FORMAT CARTE
//====================================================

function formatCard(number){

    if(!number){

        return "**** **** **** ****";

    }

    return number.replace(/(.{4})/g,"$1 ").trim();

}

//====================================================
// SOLDE
//====================================================

function refreshBalance(balance){

    currentUser.balance = Number(balance);

    if(balanceVisible){

        document.getElementById("balance").textContent =
            formatMoney(balance);

    }else{

        document.getElementById("balance").textContent =
            "********";

    }

}

//====================================================
// FORMAT ARGENT
//====================================================

function formatMoney(amount){

    return Number(amount).toLocaleString(

        "en-CA",

        {

            style:"currency",

            currency:"CAD"

        }

    );

}

//====================================================
// MASQUER / AFFICHER LE SOLDE
//====================================================

function toggleBalance(){

    balanceVisible = !balanceVisible;

    refreshBalance(currentUser.balance);

    const icon =
        document.querySelector("#toggleBalance i");

    if(balanceVisible){

        icon.className="fas fa-eye";

    }else{

        icon.className="fas fa-eye-slash";

    }

}

//====================================================
// EVENEMENTS
//====================================================

function initializeEvents(){

    document

    .getElementById("toggleBalance")

    .addEventListener("click",toggleBalance);

}
//====================================================
// TRANSACTIONS
//====================================================

function loadTransactions(){

    const data = localStorage.getItem("transactions");

    if(data){

        transactions = JSON.parse(data);

    }else{

        transactions = [];

    }

    displayTransactions();

}

//====================================================
// AFFICHAGE DES TRANSACTIONS
//====================================================

function displayTransactions(){

    const table =
        document.getElementById("transactionsTable");

    if(!table) return;

    table.innerHTML = "";

    if(transactions.length === 0){

        table.innerHTML = `

<tr>

<td colspan="5" style="text-align:center;padding:30px;">

Aucune transaction disponible.

</td>

</tr>

`;

        return;

    }

    transactions.forEach(transaction=>{

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

${sign} ${Math.abs(transaction.amount).toLocaleString("en-CA",{

minimumFractionDigits:2

})} $

</td>

<td>

<span class="status active">

${transaction.status}

</span>

</td>

</tr>

`;

    });

}

//====================================================
// AJOUTER TRANSACTION
//====================================================

function addTransaction(type,description,amount){

    const transaction = {

        date:new Date().toLocaleDateString("fr-CA"),

        type:type,

        description:description,

        amount:Number(amount),

        status:"Complété"

    };

    transactions.unshift(transaction);

    localStorage.setItem(

        "transactions",

        JSON.stringify(transactions)

    );

    displayTransactions();

    updateSummary();

}

//====================================================
// RÉSUMÉ FINANCIER
//====================================================

function updateSummary(){

    let income = 0;

    let expense = 0;

    transactions.forEach(item=>{

        if(item.amount >= 0){

            income += item.amount;

        }else{

            expense += Math.abs(item.amount);

        }

    });

    document.getElementById("monthlyIncome").textContent =

        formatMoney(income);

    document.getElementById("monthlyExpense").textContent =

        formatMoney(expense);

    document.getElementById("savingAmount").textContent =

        formatMoney(income-expense);

}

//====================================================
// NOTIFICATIONS
//====================================================

function showNotification(message,icon="fa-circle-check"){

    const container =

        document.getElementById("notificationsContainer");

    if(!container) return;

    container.insertAdjacentHTML(

        "afterbegin",

`

<div class="notification">

<i class="fas ${icon}"></i>

<p>${message}</p>

</div>

`

    );

}
//====================================================
// RECHARGER MON COMPTE
//====================================================

function openRecharge(){

    document.getElementById("rechargeModal").style.display = "flex";

}

function closeRecharge(){

    document.getElementById("rechargeModal").style.display = "none";

}

window.onclick = function(e){

    const modal = document.getElementById("rechargeModal");

    if(e.target === modal){

        closeRecharge();

    }

};

//====================================================
// SERVICES VERROUILLÉS
//====================================================

function serviceLocked(){

    alert(
`Ce service n'est pas encore activé.

Veuillez contacter votre administrateur.`
    );

}

//====================================================
// FORMULAIRE RECHARGE
//====================================================

const rechargeForm = document.getElementById("rechargeForm");

if(rechargeForm){

    rechargeForm.addEventListener("submit", submitRecharge);

}

//====================================================
// ENVOI DE LA RECHARGE A SEBPAY
//====================================================

async function submitRecharge(e){

    e.preventDefault();

    const amount = Number(document.getElementById("depositAmount").value);

    const operator = document.getElementById("mobileOperator").value;

    const phone = document.getElementById("phoneNumber").value.trim();

    if(amount <= 0){

        alert("Montant invalide.");

        return;

    }

    if(operator === ""){

        alert("Choisissez un opérateur.");

        return;

    }

    if(phone === ""){

        alert("Entrez votre numéro Mobile Money.");

        return;

    }

    const payload = {

        amount,

        operator,

        phone,

        country:"BJ"

    };

    try{

        const response = await fetch("/api/sebpay/deposit",{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify(payload)

        });

        const result = await response.json();

        console.log(result);

        if(!response.ok){

            alert(result.message || "Erreur du serveur.");

            return;

        }

        if(result.success === false){

            alert(result.message || "Paiement refusé.");

            return;

        }

        addTransaction(

            "Recharge",

            "Recharge Mobile Money",

            amount

        );

        showNotification(

            "Votre demande de recharge a été envoyée.",

            "fa-wallet"

        );

        rechargeForm.reset();

        closeRecharge();

        alert("Votre demande a été envoyée avec succès.");

    }

    catch(error){

        console.error(error);

        alert("Impossible de contacter le serveur.");

    }

}
//====================================================
// RAFRAICHISSEMENT AUTOMATIQUE
//====================================================

function refreshDashboard(){

    loadUser();

    refreshBalance(currentUser.balance);

    displayTransactions();

    updateSummary();

}

setInterval(refreshDashboard,10000);

//====================================================
// SYNCHRONISATION ENTRE ONGLETS
//====================================================

window.addEventListener("storage",function(){

    loadUser();

    displayTransactions();

    refreshBalance(currentUser.balance);

    updateSummary();

});

//====================================================
// SAUVEGARDE AUTOMATIQUE
//====================================================

function saveCurrentUser(){

    localStorage.setItem(

        "currentUser",

        JSON.stringify(currentUser)

    );

}

setInterval(saveCurrentUser,5000);

//====================================================
// DERNIERE CONNEXION
//====================================================

const now = new Date();

const lastConnection =
    document.getElementById("lastConnection");

if(lastConnection){

    lastConnection.textContent =
        now.toLocaleString("fr-CA");

}

//====================================================
// DECONNEXION
//====================================================

function logout(){

    localStorage.removeItem("currentUser");

    localStorage.removeItem("isLoggedIn");

    window.location.href = "login.html";

}

//====================================================
// STATISTIQUES
//====================================================

function getStatistics(){

    console.log({

        client:currentUser.name,

        compte:currentUser.account,

        solde:currentUser.balance,

        operations:transactions.length

    });

}

getStatistics();

//====================================================
// FIN DU FICHIER
//====================================================
