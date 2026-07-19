//====================================================
// TABLEAU DE BORD
//====================================================

function updateDashboard(){

    const fullName =
        `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim();

    document.getElementById("welcomeTitle").textContent =
        "Bonjour " + fullName;

    document.getElementById("welcomeName").textContent =
        "Bienvenue sur votre espace bancaire sécurisé.";

    document.getElementById("clientName").textContent =
        fullName;

    document.getElementById("cardHolder").textContent =
        fullName.toUpperCase();

    document.getElementById("clientAccount").textContent =
        currentUser.accountNumber || "-";

    document.getElementById("accountNumber").textContent =
        currentUser.accountNumber || "-";

    document.getElementById("clientId").textContent =
        currentUser.customerId || "-";

    document.getElementById("clientInfoId").textContent =
        currentUser.customerId || "-";

    document.getElementById("cardNumber").textContent =
        formatCard(currentUser.accountNumber || "");

    refreshBalance(currentUser.balance || 0);

    const accountType =
        document.getElementById("accountType");

    if(accountType){

        accountType.textContent =
            currentUser.accountType || "Business Account";

    }

    const currency =
        document.getElementById("currency");

    if(currency){

        currency.textContent =
            currentUser.currency || "CAD";

    }

    document.querySelectorAll(".status.active")
    .forEach(item=>{

        item.textContent =
            currentUser.status || "Active";

    });

}
//====================================================
// RAFRAÎCHISSEMENT AUTOMATIQUE
//====================================================

function refreshDashboard(){

    loadUser();

    updateDashboard();

    displayTransactions();

    updateSummary();

}

setInterval(refreshDashboard,10000);

//====================================================
// SYNCHRONISATION
//====================================================

window.addEventListener("storage",function(){

    loadUser();

    updateDashboard();

    displayTransactions();

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

const now = new Date();

const lastConnection =
    document.getElementById("lastConnection");

if(lastConnection){

    lastConnection.textContent =
        now.toLocaleString("fr-CA");

}

//====================================================
// DÉCONNEXION
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

    if(!currentUser) return;

    console.log({

        client:
            `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim(),

        customerId:
            currentUser.customerId,

        accountNumber:
            currentUser.accountNumber,

        transitNumber:
            currentUser.transitNumber,

        institutionNumber:
            currentUser.institutionNumber,

        accountType:
            currentUser.accountType,

        currency:
            currentUser.currency,

        status:
            currentUser.status,

        balance:
            currentUser.balance,

        operations:
            transactions.length

    });

}

getStatistics();
//====================================================
// CHARGER LE CLIENT
//====================================================

function loadUser(){

    const data = localStorage.getItem("currentUser");

    if(!data){

        window.location.href = "login.html";
        return;

    }

    currentUser = JSON.parse(data);

    // Compatibilité ancienne / nouvelle structure

    if(!currentUser.firstName && currentUser.name){

        const names = currentUser.name.split(" ");

        currentUser.firstName = names.shift() || "";

        currentUser.lastName = names.join(" ");

    }

    if(!currentUser.accountNumber && currentUser.account){

        currentUser.accountNumber = currentUser.account;

    }

    if(!currentUser.customerId && currentUser.id){

        currentUser.customerId = currentUser.id;

    }

    if(!currentUser.balance){

        currentUser.balance = 0;

    }

    if(!currentUser.currency){

        currentUser.currency = "CAD";

    }

    if(!currentUser.accountType){

        currentUser.accountType = "Business Account";

    }

    if(!currentUser.status){

        currentUser.status = "Active";

    }

}

//====================================================
// FORMAT CARTE
//====================================================

function formatCard(number){

    if(!number){

        return "**** **** **** ****";

    }

    const value = String(number).replace(/\s/g,"");

    return value.replace(/(.{4})/g,"$1 ").trim();

}

//====================================================
// SOLDE
//====================================================

function refreshBalance(balance){

    currentUser.balance = Number(balance || 0);

    if(balanceVisible){

        document.getElementById("balance").textContent =
            formatMoney(currentUser.balance);

    }else{

        document.getElementById("balance").textContent =
            "********";

    }

    saveCurrentUser();

}

//====================================================
// FORMAT ARGENT
//====================================================

function formatMoney(amount){

    return Number(amount || 0).toLocaleString(

        "en-CA",

        {

            style:"currency",

            currency:currentUser.currency || "CAD"

        }

    );

}
//====================================================
// SUPPORT CLIENT
//====================================================

function openWhatsApp(){

    window.open(
        "https://wa.me/19026000017",
        "_blank"
    );

}

function callSupport(){

    window.location.href =
        "tel:+19026000017";

}

function emailSupport(){

    window.location.href =
        "mailto:clientsupport@rbc-montreal.com";

}

//====================================================
// INFORMATIONS CLIENT
//====================================================

function updateClientInformation(){

    if(!currentUser) return;

    const fullName =
        `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim();

    const map = {

        clientName: fullName,

        clientAccount:
            currentUser.accountNumber || "-",

        accountNumber:
            currentUser.accountNumber || "-",

        clientId:
            currentUser.customerId || "-",

        clientInfoId:
            currentUser.customerId || "-",

        cardHolder:
            fullName.toUpperCase(),

        cardNumber:
            formatCard(currentUser.accountNumber || "")

    };

    Object.keys(map).forEach(id=>{

        const el = document.getElementById(id);

        if(el){

            el.textContent = map[id];

        }

    });

    const accountType =
        document.getElementById("accountType");

    if(accountType){

        accountType.textContent =
            currentUser.accountType || "Business Account";

    }

    const currency =
        document.getElementById("currency");

    if(currency){

        currency.textContent =
            currentUser.currency || "CAD";

    }

    const transit =
        document.getElementById("transitNumber");

    if(transit){

        transit.textContent =
            currentUser.transitNumber || "-";

    }

    const institution =
        document.getElementById("institutionNumber");

    if(institution){

        institution.textContent =
            currentUser.institutionNumber || "-";

    }

    const status =
        document.getElementById("accountStatus");

    if(status){

        status.textContent =
            currentUser.status || "Active";

    }

}

//====================================================
// INITIALISATION
//====================================================

document.addEventListener("DOMContentLoaded",()=>{

    loadUser();

    updateDashboard();

    updateClientInformation();

    loadTransactions();

    updateSummary();

    initializeEvents();

    loadCountries();

    const whatsapp =
        document.getElementById("btnWhatsapp");

    if(whatsapp){

        whatsapp.onclick = openWhatsApp;

    }

    const phone =
        document.getElementById("btnPhone");

    if(phone){

        phone.onclick = callSupport;

    }

    const email =
        document.getElementById("btnEmail");

    if(email){

        email.onclick = emailSupport;

    }

});
//====================================================
// MISE À JOUR DES DONNÉES APRÈS CONNEXION
//====================================================

function syncDashboardUser(){

    const data = localStorage.getItem("currentUser");

    if(!data) return;

    currentUser = JSON.parse(data);

    updateDashboard();

    updateClientInformation();

    updateSummary();

    displayTransactions();

}

//====================================================
// OBSERVATEUR
//====================================================

window.addEventListener("focus",syncDashboardUser);

window.addEventListener("pageshow",syncDashboardUser);

document.addEventListener("visibilitychange",()=>{

    if(!document.hidden){

        syncDashboardUser();

    }

});

//====================================================
// MISE À JOUR DU SOLDE
//====================================================

function setBalance(value){

    currentUser.balance = Number(value);

    refreshBalance(currentUser.balance);

    saveCurrentUser();

    updateSummary();

}

//====================================================
// AJOUT D'UNE TRANSACTION
//====================================================

function addTransaction(transaction){

    if(!Array.isArray(transactions)){

        transactions = [];

    }

    transactions.unshift(transaction);

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

    displayTransactions();

    updateSummary();

}

//====================================================
// RECHARGEMENT COMPLET
//====================================================

function reloadDashboard(){

    loadUser();

    loadTransactions();

    updateDashboard();

    updateClientInformation();

    displayTransactions();

    updateSummary();

}

//====================================================
// LANCEMENT
//====================================================

reloadDashboard();
