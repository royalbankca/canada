/*==================================================
RBC DEMO BANK
dashboard.js
PARTIE 1
==================================================*/

"use strict";

/*====================================
SESSION
====================================*/

const clientName =
localStorage.getItem("clientName") || "John Smith";

const accountNumber =
localStorage.getItem("accountNumber") || "001245879";

const balance =
parseFloat(
localStorage.getItem("balance") || "25480.75"
);

const currency =
localStorage.getItem("currency") || "CAD";

/*====================================
ELEMENTS
====================================*/

const balanceElement =
document.getElementById("totalBalance");

const profileName =
document.getElementById("profileName");

const welcomeName =
document.getElementById("welcomeName");

const accountElement =
document.getElementById("accountNumber");

const popup =
document.getElementById("notificationPopup");

const popupMessage =
document.getElementById("popupMessage");

const loader =
document.getElementById("loader");

/*====================================
INITIALISATION
====================================*/

window.addEventListener("load",()=>{

setTimeout(()=>{

loader.style.display="none";

showPopup(
"Bienvenue " + clientName + " !"
);

},1200);

});

/*====================================
AFFICHAGE UTILISATEUR
====================================*/

if(profileName)
profileName.textContent=clientName;

if(welcomeName)
welcomeName.textContent=clientName;

if(accountElement)
accountElement.textContent=
accountNumber;

if(balanceElement){

balanceElement.textContent=

currency+" "+balance.toLocaleString(
undefined,
{
minimumFractionDigits:2
}
);

}

/*====================================
POPUP
====================================*/

function showPopup(message){

popupMessage.textContent=message;

popup.classList.add("show");

setTimeout(()=>{

popup.classList.remove("show");

},3500);

}

/*====================================
DATE
====================================*/

const options={

weekday:"long",

year:"numeric",

month:"long",

day:"numeric"

};

const today=new Date();

const currentDate=document.getElementById("currentDate");

if(currentDate){

currentDate.textContent=

today.toLocaleDateString(
"en-CA",
options
);

}

/*====================================
SALUTATION
====================================*/

const greeting=document.getElementById("greeting");

if(greeting){

const hour=new Date().getHours();

if(hour<12){

greeting.textContent="Good Morning";

}else if(hour<18){

greeting.textContent="Good Afternoon";

}else{

greeting.textContent="Good Evening";

}

}
/*==================================================
RBC DEMO BANK
dashboard.js
PARTIE 2
==================================================*/

/*====================================
MODE SOMBRE
====================================*/

const darkButton =
document.getElementById("darkMode");

if(localStorage.getItem("theme")==="dark"){

document.body.classList.add("dark");

}

if(darkButton){

darkButton.addEventListener("click",()=>{

document.body.classList.toggle("dark");

if(document.body.classList.contains("dark")){

localStorage.setItem("theme","dark");

showPopup("Dark mode activated");

}else{

localStorage.setItem("theme","light");

showPopup("Light mode activated");

}

});

}

/*====================================
GRAPHIQUE DES DEPENSES
====================================*/

const chartCanvas =
document.getElementById("expenseChart");

if(chartCanvas){

new Chart(chartCanvas,{

type:"line",

data:{

labels:[
"Jan",
"Feb",
"Mar",
"Apr",
"May",
"Jun",
"Jul",
"Aug",
"Sep",
"Oct",
"Nov",
"Dec"
],

datasets:[{

label:"Expenses",

data:[
2400,
1850,
2100,
2600,
2300,
2800,
3000,
2700,
2550,
3100,
2950,
3400
],

borderWidth:3,

fill:true,

tension:.35

}]

},

options:{

responsive:true,

maintainAspectRatio:false,

plugins:{

legend:{

display:true

}

},

scales:{

y:{

beginAtZero:true

}

}

}

});

}

/*====================================
ANIMATION DES STATISTIQUES
====================================*/

document.querySelectorAll(".stat-value").forEach(element=>{

const target=
parseInt(element.dataset.value);

let value=0;

const speed=20;

const timer=setInterval(()=>{

value+=Math.ceil(target/40);

if(value>=target){

value=target;

clearInterval(timer);

}

element.textContent=value.toLocaleString();

},speed);

});

/*====================================
HORLOGE
====================================*/

const liveClock =
document.getElementById("liveClock");

if(liveClock){

setInterval(()=>{

const now=new Date();

liveClock.textContent=

now.toLocaleTimeString("en-CA");

},1000);

}

/*====================================
NOTIFICATIONS ALEATOIRES
====================================*/

const notifications=[

"Your account is secure.",

"New statement available.",

"Visa card renewed successfully.",

"Monthly report generated.",

"No suspicious activity detected.",

"Your transfer has been completed."

];

setInterval(()=>{

const random=

notifications[
Math.floor(
Math.random()*notifications.length
)
];

showPopup(random);

},60000);

/*====================================
ACTIONS RAPIDES
====================================*/

const quickButtons=

document.querySelectorAll(".quick-action");

quickButtons.forEach(button=>{

button.addEventListener("click",()=>{

const page=

button.dataset.page;

if(page){

window.location.href=page;

}

});

});

/*====================================
RECHERCHE
====================================*/

const searchInput=

document.getElementById("searchInput");

if(searchInput){

searchInput.addEventListener("keyup",()=>{

const value=

searchInput.value.toLowerCase();

document
.querySelectorAll(".search-item")
.forEach(item=>{

item.style.display=

item.textContent
.toLowerCase()
.includes(value)

? ""

: "none";

});

});

}
/*==================================================
RBC DEMO BANK
dashboard.js
PARTIE 3
==================================================*/

/*====================================
BOUTONS PRINCIPAUX
====================================*/

const depositBtn =
document.getElementById("depositBtn");

const transferBtn =
document.getElementById("transferBtn");

const withdrawBtn =
document.getElementById("withdrawBtn");

if(depositBtn){

depositBtn.addEventListener("click",()=>{

window.location.href="deposit.html";

});

}

if(transferBtn){

transferBtn.addEventListener("click",()=>{

window.location.href="transfer.html";

});

}

if(withdrawBtn){

withdrawBtn.addEventListener("click",()=>{

window.location.href="withdraw.html";

});

}

/*====================================
ACTUALISATION DU SOLDE
====================================*/

function refreshBalance(){

const value=parseFloat(

localStorage.getItem("balance") || balance

);

if(balanceElement){

balanceElement.textContent=

currency+" "+

value.toLocaleString(undefined,{

minimumFractionDigits:2,

maximumFractionDigits:2

});

}

}

setInterval(refreshBalance,5000);

/*====================================
ACTIVITÉ UTILISATEUR
====================================*/

let lastActivity=Date.now();

["click","mousemove","keydown","touchstart"]

.forEach(event=>{

document.addEventListener(event,()=>{

lastActivity=Date.now();

});

});

/*====================================
EXPIRATION DE SESSION
====================================*/

const SESSION_TIMEOUT=30*60*1000;

setInterval(()=>{

if(Date.now()-lastActivity>SESSION_TIMEOUT){

alert("Your session has expired.");

logout();

}

},60000);

/*====================================
LOGOUT
====================================*/

function logout(){

localStorage.removeItem("logged");

window.location.href="login.html";

}

const logoutButton=

document.getElementById("logout");

if(logoutButton){

logoutButton.addEventListener("click",logout);

}

/*====================================
VÉRIFICATION DE SESSION
====================================*/

if(

localStorage.getItem("logged")!=="true"

){

window.location.href="login.html";

}

/*====================================
SIMULATION DES TAUX DE CHANGE
====================================*/

function updateExchangeRates(){

document.querySelectorAll(".exchange-rate")

.forEach(rate=>{

const base=

parseFloat(rate.dataset.base);

const variation=

(Math.random()*0.04)-0.02;

const value=

(base+variation).toFixed(4);

rate.textContent=value;

});

}

updateExchangeRates();

setInterval(updateExchangeRates,15000);

/*====================================
SIMULATION DES NOTIFICATIONS
====================================*/

function addNotification(text){

const list=

document.getElementById("notificationList");

if(!list) return;

const item=document.createElement("li");

item.innerHTML=`

<i class="fa-solid fa-circle-info"></i>

<span>${text}</span>

`;

list.prepend(item);

while(list.children.length>8){

list.removeChild(list.lastChild);

}

}

setInterval(()=>{

const messages=[

"Exchange rates updated.",

"Daily statement available.",

"Your balance has been synchronized.",

"Security scan completed.",

"System backup successful."

];

const message=

messages[

Math.floor(

Math.random()*messages.length

)

];

addNotification(message);

},90000);

/*====================================
RACCOURCIS CLAVIER
====================================*/

document.addEventListener("keydown",(e)=>{

if(e.altKey && e.key==="t"){

window.location.href="transfer.html";

}

if(e.altKey && e.key==="h"){

window.location.href="history.html";

}

if(e.altKey && e.key==="a"){

window.location.href="accounts.html";

}

});

/*====================================
INITIALISATION
====================================*/

refreshBalance();

console.log(

"RBC Demo Bank Dashboard Ready"

);

/*==================================================
FIN DU FICHIER dashboard.js
==================================================*/
