//====================================================
// ROYAL BANK
// dashboard.js
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
// CHARGER UTILISATEUR
//====================================================

function
    function loadUser(){

    const data = localStorage.getItem("currentUser");

    if(!data){

        window.location.href = "login.html";

        return;

    }

    currentUser = JSON.parse(data);

}

//====================================================
// MISE A JOUR TABLEAU DE BORD
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
// FORMAT NUMERO CARTE
//====================================================

function formatCard(number){

    if(!number){

        return "**** **** **** ****";

    }

    return number.replace(/(.{4})/g,"$1 ").trim();

}

//====================================================
// AFFICHAGE SOLDE
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

function formatMoney(amount){

    return Number(amount).toLocaleString(

        "en-CA",

        {

            style:"currency",

            currency:"CAD"

        }

    );

}

function toggleBalance(){

    balanceVisible = !balanceVisible;

    refreshBalance(currentUser.balance);

    const icon =
        document.querySelector("#toggleBalance i");

    if(balanceVisible){

        icon.className = "fas fa-eye";

    }else{

        icon.className = "fas fa-eye-slash";

    }

}

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
// AJOUTER UNE TRANSACTION
//====================================================

function addTransaction(type,description,amount,status="Complété"){

    const transaction = {

        date:new Date().toLocaleDateString("fr-CA"),

        type,

        description,

        amount:Number(amount),

        status

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
        formatMoney(income - expense);

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
// RECHARGE
//====================================================

function openRecharge(){

    document.getElementById("rechargeModal").style.display="flex";

}

function closeRecharge(){

    document.getElementById("rechargeModal").style.display="none";

}

window.onclick=function(e){

    const modal=document.getElementById("rechargeModal");

    if(e.target===modal){

        closeRecharge();

    }

};

const rechargeForm=document.getElementById("rechargeForm");

if(rechargeForm){

    rechargeForm.addEventListener("submit",submitRecharge);

}
//====================================================
// ENVOI RECHARGE SEBPAY
//====================================================

async function submitRecharge(e){

    e.preventDefault();

    const amount =
        Number(document.getElementById("depositAmount").value);

    const operator =
        document.getElementById("mobileOperator").value;

    const phone =
        document.getElementById("phoneNumber").value.trim();

    const otpField =
        document.getElementById("otpCode");

    const otp_code =
        otpField ? otpField.value.trim() : "";

    if(amount <= 0){

        alert("Montant invalide.");

        return;

    }

    if(operator === ""){

        alert("Sélectionnez un opérateur.");

        return;

    }

    if(phone === ""){

        alert("Numéro Mobile Money obligatoire.");

        return;

    }

    const payload = {

        amount,

        operator,

        phone,

        country:"BJ"

    };

    if(otp_code !== ""){

        payload.otp_code = otp_code;

    }

    try{

        const response = await fetch("/api/sebpay/deposit",{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify(payload)

        });

        const result = await response.json();

        if(!response.ok){

            alert(result.message || "Erreur serveur.");

            return;

        }

        if(!result.success){

            alert(result.message || "Transaction refusée.");

            return;

        }

        if(result.data && result.data.provider_link){

            window.open(

                result.data.provider_link,

                "_blank"

            );

        }

        addTransaction(

            "Recharge",

            "Recharge Mobile Money",

            amount,

            result.data?.status || "En attente"

        );

        showNotification(

            result.message || "Recharge envoyée.",

            "fa-wallet"

        );

        rechargeForm.reset();

        closeRecharge();

    }catch(error){

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
// SYNCHRONISATION
//====================================================

window.addEventListener("storage",()=>{

    loadUser();

    loadTransactions();

    refreshBalance(currentUser.balance);

    updateSummary();

});

//====================================================
// SAUVEGARDE UTILISATEUR
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

const lastConnection =
    document.getElementById("lastConnection");

if(lastConnection){

    lastConnection.textContent =
        new Date().toLocaleString("fr-CA");

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

        client:currentUser?.name,

        compte:currentUser?.account,

        solde:currentUser?.balance,

        operations:transactions.length

    });

}

getStatistics();

//====================================================
// FIN DU FICHIER
//====================================================
