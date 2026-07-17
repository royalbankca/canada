// ===========================================
// RBC DEMO BANK
// transfer.js
// Intégration SebPay
// ===========================================

const SEBPAY_BASE_URL = "https://newapi.sebpay.bj/api/v1";

const PUBLIC_KEY = "";
const SECRET_KEY = "";

let currentTransaction = null;
let depositHistory = [];

const $ = (id) => document.getElementById(id);

function getCurrency(country){

switch(country){

case "BJ":
case "BF":
case "CI":
case "GW":
case "ML":
case "NE":
case "SN":
case "TG":
return "XOF";

case "CM":
case "CG":
case "GA":
case "TD":
return "XAF";

case "GH":
return "GHS";

case "NG":
return "NGN";

case "GM":
return "GMD";

case "GN":
return "GNF";

case "CD":
return "CDF";

default:
return "XOF";

}

}

function headers(){

return{

"Content-Type":"application/json",

"X-Public-Key":PUBLIC_KEY,

"X-Secret-Key":SECRET_KEY

};

}

function formatMoney(value){

return Number(value || 0).toLocaleString("fr-FR",{

minimumFractionDigits:2,

maximumFractionDigits:2

});

}

function loadUser(){

const user=JSON.parse(localStorage.getItem("currentUser"));

if(!user){

window.location.href="login.html";

return null;

}

$("senderAccount").value=user.account;

$("summaryAccount").textContent=user.account;

$("availableBalance").textContent=formatMoney(user.balance)+" $";

$("summaryBalance").textContent=formatMoney(user.balance)+" $";

$("walletBalance").textContent=formatMoney(user.balance)+" $";

return user;

}

document.addEventListener("DOMContentLoaded",()=>{

loadUser();

});
async function loadOperators(country){

const operator=$("operator");

operator.innerHTML="<option>Chargement...</option>";

try{

const response=await fetch(

`${SEBPAY_BASE_URL}/operators?country=${country}`,

{

method:"GET",

headers:headers()

}

);

const result=await response.json();

if(!result.success){

operator.innerHTML="<option>Aucun opérateur</option>";

return;

}

operator.innerHTML="";

result.data.forEach(item=>{

const option=document.createElement("option");

option.value=item.slug;

option.textContent=item.name;

option.dataset.otp=item.otp_required;

operator.appendChild(option);

});

toggleOTP();

}

catch(e){

console.error(e);

operator.innerHTML="<option>Erreur</option>";

}

}

function toggleOTP(){

const operator=$("operator");

const otpContainer=$("otpContainer");

if(!operator.selectedOptions.length){

otpContainer.style.display="none";

return;

}

otpContainer.style.display=

operator.selectedOptions[0].dataset.otp==="true"

?"block"

:"none";

}

document.addEventListener("DOMContentLoaded",()=>{

loadOperators($("country").value);

$("country").addEventListener("change",()=>{

loadOperators($("country").value);

});

$("operator").addEventListener("change",toggleOTP);

});
async function createCollection(){

const payload={

amount:Number($("amount").value),

currency:getCurrency($("country").value),

phone:$("phone").value.trim(),

operator:$("operator").value,

country:$("country").value,

external_reference:"RBC-"+Date.now(),

callback_url:"https://example.com/webhook"

};

if($("otp").value.trim()!==""){

payload.otp_code=$("otp").value.trim();

}

if(

!payload.phone||

!payload.operator||

payload.amount<=0

){

alert("Veuillez remplir correctement tous les champs.");

return;

}

try{

const response=await fetch(

`${SEBPAY_BASE_URL}/collections`,

{

method:"POST",

headers:headers(),

body:JSON.stringify(payload)

}

);

const result=await response.json();

if(!result.success){

alert(result.message);

return;

}

currentTransaction=result.data;

localStorage.setItem(

"lastCollection",

JSON.stringify(currentTransaction)

);

$("depositReference").textContent=

currentTransaction.reference||"-";

$("depositStatus").textContent=

currentTransaction.status||"En attente";

$("depositAmount").textContent=

formatMoney(currentTransaction.amount);

$("depositResult").textContent=

currentTransaction.message||"Transaction créée";

if(currentTransaction.provider_link){

window.open(

currentTransaction.provider_link,

"_blank"

);

}

}

catch(error){

console.error(error);

alert("Erreur de connexion avec SebPay.");

}

}

document.addEventListener("DOMContentLoaded",()=>{

$("payButton").addEventListener(

"click",

createCollection

);

});
async function checkCollectionStatus(reference=null){

try{

let transactionReference=reference;

if(!transactionReference){

const last=JSON.parse(

localStorage.getItem("lastCollection")

);

if(!last){

alert("Aucune transaction trouvée.");

return;

}

transactionReference=

last.reference||

last.external_reference||

last.id;

}

const response=await fetch(

`${SEBPAY_BASE_URL}/collections/${transactionReference}`,

{

method:"GET",

headers:headers()

}

);

const result=await response.json();

if(!result.success){

alert(result.message);

return;

}

currentTransaction=result.data;

localStorage.setItem(

"lastCollection",

JSON.stringify(currentTransaction)

);

$("lastReference").textContent=

currentTransaction.reference||"-";

$("lastTransactionId").textContent=

currentTransaction.id||"-";

$("lastStatus").textContent=

currentTransaction.status||"-";

$("lastMessage").textContent=

currentTransaction.message||"-";

$("lastCountry").textContent=

currentTransaction.country||"-";

$("lastOperator").textContent=

currentTransaction.operator||"-";

$("lastPhone").textContent=

currentTransaction.phone||"-";

$("requestedAmount").textContent=

formatMoney(currentTransaction.amount);

$("receivedAmount").textContent=

formatMoney(

currentTransaction.received_amount||

currentTransaction.amount

);

$("receivedCurrency").textContent=

currentTransaction.currency||"-";

$("createdAt").textContent=

currentTransaction.created_at||"-";

$("updatedAt").textContent=

currentTransaction.updated_at||"-";

$("paymentResult").textContent=

currentTransaction.status||"-";

$("depositReference").textContent=

currentTransaction.reference||"-";

$("depositStatus").textContent=

currentTransaction.status||"-";

$("depositAmount").textContent=

formatMoney(currentTransaction.amount);

}

catch(error){

console.error(error);

alert("Impossible de récupérer le statut.");

}

}

document.addEventListener("DOMContentLoaded",()=>{

$("statusButton").addEventListener(

"click",

()=>checkCollectionStatus()

);

$("refreshStatus").addEventListener(

"click",

()=>checkCollectionStatus()

);

});
function previewDeposit(){

$("confirmAccount").textContent=$("senderAccount").value;

$("confirmCountry").textContent=

$("country").options[$("country").selectedIndex].text;

$("confirmOperator").textContent=

$("operator").options[$("operator").selectedIndex]?.text||"-";

$("confirmPhone").textContent=

$("phone").value;

$("confirmAmount").textContent=

formatMoney($("amount").value);

$("confirmCurrency").textContent=

getCurrency($("country").value);

$("confirmReference").textContent=

currentTransaction?.reference||"---------";

$("confirmStatus").textContent=

currentTransaction?.status||"En attente";

}

function saveHistory(){

if(!currentTransaction) return;

let history=

JSON.parse(localStorage.getItem("depositHistory"))||[];

history.unshift(currentTransaction);

localStorage.setItem(

"depositHistory",

JSON.stringify(history)

);

}

function loadDepositHistory(){

const tbody=$("depositHistory");

const history=

JSON.parse(localStorage.getItem("depositHistory"))||[];

tbody.innerHTML="";

if(history.length===0){

tbody.innerHTML=`

<tr>

<td colspan="5">

Aucun dépôt disponible.

</td>

</tr>

`;

return;

}

history.forEach(item=>{

tbody.innerHTML+=`

<tr>

<td>${item.reference||"-"}</td>

<td>${formatMoney(item.amount)}</td>

<td>${item.operator||"-"}</td>

<td>${item.status||"-"}</td>

<td>${item.created_at||"-"}</td>

</tr>

`;

});

}

function clearDepositHistory(){

localStorage.removeItem("depositHistory");

loadDepositHistory();

}

document.addEventListener("DOMContentLoaded",()=>{

$("previewButton").addEventListener(

"click",

previewDeposit

);

$("reloadHistory").addEventListener(

"click",

loadDepositHistory

);

$("clearHistory").addEventListener(

"click",

clearDepositHistory

);

loadDepositHistory();

});
function loadActivity(){

const tbody=$("activityHistory");

const history=

JSON.parse(localStorage.getItem("depositHistory"))||[];

tbody.innerHTML="";

if(history.length===0){

tbody.innerHTML=`

<tr>

<td colspan="5">

Aucune activité.

</td>

</tr>

`;

return;

}

history.slice(0,10).forEach(item=>{

tbody.innerHTML+=`

<tr>

<td>${item.updated_at||item.created_at||"-"}</td>

<td>${item.reference||"-"}</td>

<td>Dépôt</td>

<td>${formatMoney(item.amount)} ${item.currency||""}</td>

<td>${item.status||"-"}</td>

</tr>

`;

});

}

function updateStatistics(){

const history=

JSON.parse(localStorage.getItem("depositHistory"))||[];

let total=0;

let success=0;

let failed=0;

history.forEach(item=>{

total+=Number(item.amount||0);

if(

item.status==="SUCCESS"||

item.status==="SUCCESSFUL"

){

success++;

}

if(

item.status==="FAILED"||

item.status==="CANCELLED"

){

failed++;

}

});

$("totalDeposits").textContent=

formatMoney(total)+" $";

$("depositCount").textContent=

history.length;

$("successCount").textContent=

success;

$("failedCount").textContent=

failed;

if(history.length){

const last=history[0];

$("lastDepositAmount").textContent=

formatMoney(last.amount)+" "+(last.currency||"");

$("lastDepositStatus").textContent=

last.status||"-";

$("lastSync").textContent=

new Date().toLocaleString("fr-FR");

}

}

function downloadReceipt(){

if(!currentTransaction){

alert("Aucun reçu disponible.");

return;

}

const receipt=`

RBC DEMO BANK

----------------------------

Référence : ${currentTransaction.reference||"-"}

Montant : ${currentTransaction.amount||0} ${currentTransaction.currency||""}

Téléphone : ${currentTransaction.phone||"-"}

Opérateur : ${currentTransaction.operator||"-"}

Statut : ${currentTransaction.status||"-"}

Date : ${currentTransaction.created_at||"-"}

`;

$("receiptContent").innerHTML=

"<pre>"+receipt+"</pre>";

const blob=new Blob([receipt],{

type:"text/plain"

});

const url=URL.createObjectURL(blob);

const a=document.createElement("a");

a.href=url;

a.download="recu-sebpay.txt";

a.click();

URL.revokeObjectURL(url);

}

document.addEventListener("DOMContentLoaded",()=>{

$("refreshActivity").addEventListener(

"click",

loadActivity

);

$("downloadReceipt").addEventListener(

"click",

downloadReceipt

);

loadActivity();

updateStatistics();

});
function updateWalletBalance(){

const user=JSON.parse(localStorage.getItem("currentUser"));

if(!user) return;

const history=

JSON.parse(localStorage.getItem("depositHistory"))||[];

let credited=0;

history.forEach(item=>{

if(

item.status==="SUCCESS"||

item.status==="SUCCESSFUL"

){

credited+=Number(

item.received_amount||

item.amount||

0

);

}

});

$("walletBalance").textContent=

formatMoney(user.balance+credited)+" $";

$("summaryBalance").textContent=

formatMoney(user.balance+credited)+" $";

$("availableBalance").textContent=

formatMoney(user.balance+credited)+" $";

}

function notify(message,type="success"){

const box=document.createElement("div");

box.className=`notification ${type}`;

box.textContent=message;

document.body.appendChild(box);

setTimeout(()=>{

box.classList.add("show");

},100);

setTimeout(()=>{

box.classList.remove("show");

setTimeout(()=>{

box.remove();

},300);

},3500);

}

function autoRefresh(){

setInterval(async()=>{

const last=

JSON.parse(localStorage.getItem("lastCollection"));

if(!last) return;

await checkCollectionStatus(

last.reference||

last.id

);

saveHistory();

loadDepositHistory();

loadActivity();

updateStatistics();

updateWalletBalance();

if(

currentTransaction &&

(

currentTransaction.status==="SUCCESS"||

currentTransaction.status==="SUCCESSFUL"

)

){

notify(

"Dépôt confirmé avec succès."

);

}

},30000);

}

document.addEventListener("DOMContentLoaded",()=>{

updateWalletBalance();

autoRefresh();

});
function logout(){

if(confirm("Voulez-vous vous déconnecter ?")){

localStorage.removeItem("currentUser");

window.location.href="login.html";

}

}

function initializeTransfer(){

const form=$("depositForm");

if(form){

form.reset();

}

const user=loadUser();

if(user){

updateWalletBalance();

}

loadDepositHistory();

loadActivity();

updateStatistics();

$("depositStatus").textContent="-";

$("depositReference").textContent="-";

$("depositAmount").textContent="0.00";

}

window.addEventListener("online",()=>{

notify("Connexion Internet rétablie.","success");

});

window.addEventListener("offline",()=>{

notify("Connexion Internet perdue.","error");

});

document.addEventListener("DOMContentLoaded",()=>{

initializeTransfer();

const logoutBtn=$("logoutButton");

if(logoutBtn){

logoutBtn.addEventListener("click",logout);

}

});
// ============================================
// FIN DU FICHIER
// transfer.js
// Intégration SebPay terminée
// ============================================
