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

    if(!number) return "**** **** **** ****";

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
// AFFICHER / MASQUER LE SOLDE
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

    table.innerHTML="";

    if(transactions.length===0){

        table.innerHTML=`

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
            transaction.amount>=0
            ? "credit"
            : "debit";

        const sign =
            transaction.amount>=0
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

    const transaction={

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
// RESUME FINANCIER
//====================================================

function updateSummary(){

    let income=0;

    let expense=0;

    transactions.forEach(item=>{

        if(item.amount>=0){

            income+=item.amount;

        }else{

            expense+=Math.abs(item.amount);

        }

    });

    document.getElementById("monthlyIncome").textContent=

        formatMoney(income);

    document.getElementById("monthlyExpense").textContent=

        formatMoney(expense);

    document.getElementById("savingAmount").textContent=

        formatMoney(income-expense);

}

//====================================================
// NOTIFICATIONS
//====================================================

function showNotification(message,icon="fa-circle-check"){

    const container=

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

const rechargeForm=document.getElementById("rechargeForm");

if(rechargeForm){

rechargeForm.addEventListener("submit",submitRecharge);

}

async function submitRecharge(e){

e.preventDefault();

const amount=
Number(document.getElementById("depositAmount").value);

const operator=
document.getElementById("mobileOperator").value;

const phone=
document.getElementById("phoneNumber").value.trim();

if(amount<=0){

alert("Montant invalide.");

return;

}

if(operator===""){

alert("Choisissez un opérateur.");

return;

}

if(phone===""){

alert("Entrez votre numéro.");

return;

}

//==========================================
// SEBPAY
//==========================================

const payload={

amount:amount,

operator:operator,

phone:phone,

customerId:currentUser.id,

accountNumber:currentUser.account,

customerName:currentUser.name

};

//================================================
// ICI TU CONNECTERAS TON API SEBPAY
//================================================

// Exemple :

/*

const response=await fetch("/api/sebpay/deposit",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(payload)

});

const result=await response.json();

if(result.success){

...

}

*/

try {

    const response = await fetch("http://localhost:3000/api/collections", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            amount: amount,
            currency: "XAF",
            phone: phone,
            operator: operator,
            country: "CM",
            external_reference: "RBC-" + Date.now(),
            description: "Rechargement de compte RBC"
        })

    });

    const result = await response.json();

    if (response.ok) {

        alert("Votre demande de paiement a été envoyée avec succès.");

        addTransaction(
            "Recharge",
            "Paiement Mobile Money",
            amount
        );

        showNotification(
            "Paiement transmis à SEBPAY.",
            "fa-wallet"
        );

        closeRecharge();

        rechargeForm.reset();

    } else {

        alert(result.error || "Le paiement a échoué.");

    }

} catch (error) {

    console.error(error);

    alert("Impossible de joindre le serveur.");

}

}

//====================================================
// RAFRAÎCHISSEMENT AUTOMATIQUE
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

window.addEventListener("storage",function(){

loadUser();

displayTransactions();

refreshBalance(currentUser.balance);

updateSummary();

});

//====================================================
// SAUVEGARDE
//====================================================

function saveCurrentUser(){

localStorage.setItem(

"currentUser",

JSON.stringify(currentUser)

);

}

setInterval(saveCurrentUser,5000);

//====================================================
// DERNIÈRE CONNEXION
//====================================================

const now=new Date();

document.getElementById("lastConnection").textContent=

now.toLocaleString("fr-CA");

//====================================================
// DÉCONNEXION
//====================================================

function logout(){

localStorage.removeItem("currentUser");

localStorage.removeItem("isLoggedIn");

window.location.href="login.html";

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
// FIN
//====================================================
