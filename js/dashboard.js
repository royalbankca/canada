//====================================================
// ROYAL BANK
// dashboard.js
//====================================================

let currentUser = null;
let transactions = [];
let balanceVisible = true;
//====================================================
// PAYS ET OPERATEURS SEBPAY
//====================================================

const SEBPAY = {

BJ:{
name:"Bénin",
currency:"XOF",
prefix:"+229",
operators:[
{name:"MTN Money",slug:"mtn"},
{name:"Moov Money",slug:"moov"},
{name:"Celtiis Money",slug:"celtiis"},
{name:"Coris Money",slug:"coris"}
]
},

BF:{
name:"Burkina Faso",
currency:"XOF",
prefix:"+226",
operators:[
{name:"Moov Money",slug:"moov"},
{name:"Orange Money",slug:"orange"},
{name:"Wallet LigdiCash",slug:"wligdicash"}
]
},

CM:{
name:"Cameroun",
currency:"XAF",
prefix:"+237",
operators:[
{name:"MTN Money",slug:"mtn"},
{name:"Orange Money",slug:"orange"}
]
},

CG:{
name:"Congo",
currency:"XAF",
prefix:"+242",
operators:[
{name:"MTN Money",slug:"mtn"}
]
},

CI:{
name:"Côte d'Ivoire",
currency:"XOF",
prefix:"+225",
operators:[
{name:"MTN Money",slug:"mtn"},
{name:"Orange Money",slug:"orange"},
{name:"Moov Money",slug:"moov"},
{name:"Wave Money",slug:"wave"}
]
},

GA:{
name:"Gabon",
currency:"XAF",
prefix:"+241",
operators:[
{name:"Airtel Money",slug:"airtel"},
{name:"Moov Money",slug:"moov"}
]
},

GM:{
name:"Gambie",
currency:"GMD",
prefix:"+220",
operators:[
{name:"Afri Money",slug:"afrimoney"}
]
},

GH:{
name:"Ghana",
currency:"GHS",
prefix:"+233",
operators:[
{name:"Airtel Money",slug:"airtel"},
{name:"MTN Money",slug:"mtn"},
{name:"Telecel Cash",slug:"telecel"}
]
},

GN:{
name:"Guinée",
currency:"GNF",
prefix:"+224",
operators:[
{name:"MTN Money",slug:"mtn"},
{name:"Orange Money",slug:"orange"}
]
},

GW:{
name:"Guinée-Bissau",
currency:"XOF",
prefix:"+245",
operators:[
{name:"Orange Money",slug:"orange"}
]
},

ML:{
name:"Mali",
currency:"XOF",
prefix:"+223",
operators:[
{name:"Moov Money",slug:"moov"},
{name:"Orange Money",slug:"orange"}
]
},

NE:{
name:"Niger",
currency:"XOF",
prefix:"+227",
operators:[
{name:"Airtel Money",slug:"airtel"},
{name:"Amanata",slug:"amanata"},
{name:"Moov Money",slug:"moov"},
{name:"Nita",slug:"nita"},
{name:"Wallet LigdiCash",slug:"wligdicash"},
{name:"Zamani",slug:"zamani"}
]
},

NG:{
name:"Nigéria",
currency:"NGN",
prefix:"+234",
operators:[
{name:"Airtel",slug:"airtel"},
{name:"MTN Money",slug:"mtn"}
]
},

CD:{
name:"RDC",
currency:"CDF",
prefix:"+243",
operators:[
{name:"Afri Money",slug:"afrimoney"},
{name:"Airtel Money",slug:"airtel"},
{name:"Mpesa",slug:"mpesa"},
{name:"Orange Money",slug:"orange"},
{name:"Vodacom",slug:"vodacom"}
]
},

SN:{
name:"Sénégal",
currency:"XOF",
prefix:"+221",
operators:[
{name:"E-money",slug:"emoney"},
{name:"Free Money",slug:"free"},
{name:"Orange Money",slug:"orange"},
{name:"Wave Money",slug:"wave"}
]
},

TD:{
name:"Tchad",
currency:"XAF",
prefix:"+235",
operators:[
{name:"Airtel",slug:"airtel"},
{name:"Moov",slug:"moov"}
]
},

TG:{
name:"Togo",
currency:"XOF",
prefix:"+228",
operators:[
{name:"Moov Money",slug:"moov"},
{name:"T-Money",slug:"tmoney"}
]
}

};
//====================================================
// INITIALISATION
//====================================================

document.addEventListener("DOMContentLoaded", () => {

    loadUser();

    loadTransactions();

    updateDashboard();

    updateSummary();

    initializeEvents();
    
    loadCountries();
    
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

resetRecharge();

document.getElementById("rechargeModal").style.display="flex";

}

function closeRecharge(){

document.getElementById("rechargeModal").style.display="none";

document.getElementById("rechargeForm").reset();

document.getElementById("mobileOperator").innerHTML=
'<option value="">Choisissez d\'abord un pays</option>';

document.getElementById("mobileOperator").disabled=true;

document.getElementById("phoneNumber").disabled=true;

document.getElementById("phoneNumber").placeholder="Numéro Mobile Money";

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

const country=document.getElementById("countrySelect").value;

const amount=Number(document.getElementById("depositAmount").value);

const operator=document.getElementById("mobileOperator").value;

const phone=document.getElementById("phoneNumber").value.trim();

if(country===""){

alert("Veuillez choisir votre pays.");

return;

}

if(operator===""){

alert("Veuillez choisir votre opérateur.");

return;

}

if(phone===""){

alert("Veuillez saisir votre numéro Mobile Money.");

return;

}

if(amount<=0){

alert("Veuillez saisir un montant valide.");

return;

}

const config=SEBPAY[country];

try{

const response=await fetch("https://canada-1.onrender.com/api/collections",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

amount:amount,

currency:config.currency,

phone:phone,

operator:operator,

country:country,

external_reference:"RBC-"+Date.now(),

description:"Rechargement de compte RBC"

})

});

const result=await response.json();

if(response.ok){

alert("Votre demande de paiement a été envoyée.");

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

document.getElementById("rechargeForm").reset();

document.getElementById("mobileOperator").disabled=true;

document.getElementById("phoneNumber").disabled=true;

}else{

console.log(result);

alert(result.message||result.error||"Paiement refusé.");

}

}catch(err){

console.error(err);

alert("Impossible de contacter le serveur.");

}

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

    const response = await fetch("https://canada-1.onrender.com/api/collections", {

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

        console.log(result);

const message =
    typeof result.error === "string"
        ? result.error
        : JSON.stringify(result.error, null, 2);

alert(message || "Le paiement a échoué.");

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

//====================================================
// CHARGEMENT DES PAYS
//====================================================

function loadCountries(){

const country=document.getElementById("countrySelect");

if(!country) return;

country.innerHTML='<option value="">Sélectionnez votre pays</option>';

Object.keys(SEBPAY).forEach(code=>{

country.innerHTML+=`<option value="${code}">${SEBPAY[code].name}</option>`;

});

country.addEventListener("change",loadOperators);

}

//====================================================
// CHARGEMENT DES OPERATEURS
//====================================================

function loadOperators(){

const country=this.value;

const operator=document.getElementById("mobileOperator");

const phone=document.getElementById("phoneNumber");

operator.innerHTML="";

phone.value="";

phone.disabled=true;

if(country===""){

operator.disabled=true;

operator.innerHTML='<option value="">Choisissez d\'abord un pays</option>';

return;

}

    //====================================================
// VALIDATION DU NUMERO
//====================================================

document.addEventListener("input",function(e){

if(e.target.id!=="phoneNumber") return;

const country=document.getElementById("countrySelect").value;

if(country==="") return;

const prefix=SEBPAY[country].prefix.replace("+","");

let value=e.target.value.replace(/\D/g,"");

if(value.startsWith(prefix)){

e.target.value=value;

}else{

e.target.value=prefix+value;

}

});
    
operator.disabled=false;

operator.innerHTML='<option value="">Choisissez un opérateur</option>';

SEBPAY[country].operators.forEach(op=>{

operator.innerHTML+=`<option value="${op.slug}">${op.name}</option>`;

});

operator.addEventListener("change",function(){

if(this.value===""){

phone.disabled=true;

phone.placeholder="Numéro Mobile Money";

}else{

phone.disabled=false;

phone.placeholder=SEBPAY[country].prefix+"XXXXXXXX";

}

});

}
//====================================================
// RECHARGER LES LISTES
//====================================================

function resetRecharge(){

loadCountries();

document.getElementById("mobileOperator").disabled=true;

document.getElementById("phoneNumber").disabled=true;

}
