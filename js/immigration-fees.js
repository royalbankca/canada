/*==================================================
CANADA GLOBAL BANK
IMMIGRATION PAYMENT
PART 1 / 4
==================================================*/

const immigrationFees = {

    "Permanent Residence":250,

    "Work Permit":180,

    "Study Permit":150,

    "Visitor Visa":100,

    "Biometrics":85,

    "Administrative Fees":1

};

const paymentOptions = {

    BJ:["MTN","MOOV","CELTIIS","CORIS","VISA","MASTERCARD"],

    BF:["ORANGE","MOOV","WAVE","VISA","MASTERCARD"],

    CI:["MTN","ORANGE","MOOV","WAVE","VISA","MASTERCARD"],

    ML:["ORANGE","MOBICASH","VISA","MASTERCARD"],

    SN:["ORANGE","FREE","WAVE","VISA","MASTERCARD"],

    TG:["TOGOCOM","MOOV","VISA","MASTERCARD"],

    CG:["MTN","VISA","MASTERCARD"]

};

const form=document.getElementById("immigrationForm");

const service=document.getElementById("service");

const country=document.getElementById("country");

const countryCode=document.getElementById("countryCode");

const countryCodes={

BJ:"+229",

BF:"+226",

CI:"+225",

CG:"+242",

ML:"+223",

SN:"+221",

TG:"+228"

};

const paymentMethod=document.getElementById("paymentMethod");

const amountDisplay=document.getElementById("amountDisplay");

const amountView=document.getElementById("amountView");

const serviceName=document.getElementById("serviceName");

const networkName=document.getElementById("networkName");

const receiptAmount=document.getElementById("receiptAmount");

const receiptMethod=document.getElementById("receiptMethod");

const receiptDate=document.getElementById("receiptDate");

const receiptReference=document.getElementById("receiptReference");

const paymentModal=document.getElementById("paymentModal");

const successModal=document.getElementById("successModal");

let currentAmount=0;

service.addEventListener("change",()=>{

currentAmount=immigrationFees[service.value]||0;

amountDisplay.innerHTML=currentAmount+" CAD";

amountView.value=currentAmount+" CAD";

receiptAmount.innerHTML=currentAmount+" CAD";

serviceName.innerHTML=service.value||"Not selected";

});

country.addEventListener("change",()=>{

countryCode.innerHTML=

countryCodes[country.value]||"+";

paymentMethod.innerHTML=

"<option value=''>Select payment network</option>";

const methods=

paymentOptions[country.value]||[];

methods.forEach(method=>{

const option=document.createElement("option");

option.value=method;

option.textContent=method;

paymentMethod.appendChild(option);

});

networkName.innerHTML="Not selected";

});

paymentMethod.addEventListener("change",()=>{

networkName.innerHTML=

paymentMethod.value||"Not selected";

});
/*==================================================
CANADA GLOBAL BANK
IMMIGRATION PAYMENT
PART 2 / 4
==================================================*/

function showLoading(){

    paymentModal.style.display="flex";

}

function hideLoading(){

    paymentModal.style.display="none";

}

function showSuccess(reference){

    hideLoading();

    receiptReference.innerHTML=reference;

    receiptMethod.innerHTML=paymentMethod.value;

    receiptDate.innerHTML=new Date().toLocaleString();

    successModal.style.display="flex";

}

function hideSuccess(){

    successModal.style.display="none";

}

window.addEventListener("click",(e)=>{

    if(e.target===successModal){

        hideSuccess();

    }

});

document.getElementById("printReceipt").addEventListener("click",()=>{

    window.print();

});

form.addEventListener("submit",async function(e){

    e.preventDefault();

    if(currentAmount<=0){

        alert("Please select an immigration service.");

        return;

    }

    if(!paymentMethod.value){

        alert("Please select a payment network.");

        return;

    }

    showLoading();

    const payload={

        firstName:document.getElementById("firstName").value.trim(),

        lastName:document.getElementById("lastName").value.trim(),

        email:document.getElementById("email").value.trim(),

        phone:document.getElementById("phone").value.trim(),

        country:country.value,

        service:service.value,

        amount:currentAmount,

        paymentMethod:paymentMethod.value

    };

    try{

        const response=await fetch("https://canada-1.onrender.com/api/immigration/pay",{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify(payload)

        });

        const data=await response.json();

        if(!response.ok){

            throw new Error(data.message||"Payment error");

        }

        if(data.paymentUrl){

            const popup = window.open(
    data.paymentUrl,
    "FeexPayPayment",
    "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=520,height=760,left=300,top=40"
);

if (!popup) {
    alert("Veuillez autoriser les fenêtres popup pour effectuer le paiement.");
}

            hideLoading();

            return;

        }

        checkPaymentStatus(data.reference);

    }

    catch(error){

        hideLoading();

        alert(error.message);

    }

});
/*==================================================
CANADA GLOBAL BANK
IMMIGRATION PAYMENT
PART 3 / 4
==================================================*/

async function checkPaymentStatus(reference){

    let attempts=0;

    const maxAttempts=30;

    const timer=setInterval(async()=>{

        attempts++;

        try{

            const response=await fetch(

                `https://canada-1.onrender.com/api/immigration/status/${reference}`

            );

            const result=await response.json();

            if(result.status==="SUCCESS"){

                clearInterval(timer);

                showSuccess(reference);

                return;

            }

            if(result.status==="FAILED"){

                clearInterval(timer);

                hideLoading();

                alert("Payment failed.");

                return;

            }

        }

        catch(error){

            console.error(error);

        }

        if(attempts>=maxAttempts){

            clearInterval(timer);

            hideLoading();

            alert("Payment verification timed out.");

        }

    },5000);

}

function resetForm(){

    form.reset();

    currentAmount=0;

    amountDisplay.innerHTML="0 CAD";

    amountView.value="0 CAD";

    receiptAmount.innerHTML="0 CAD";

    serviceName.innerHTML="Not selected";

    networkName.innerHTML="Not selected";

    paymentMethod.innerHTML=`

        <option value="">

            Select payment network

        </option>

    `;

}
/*==================================================
CANADA GLOBAL BANK
IMMIGRATION PAYMENT
PART 4 / 4
==================================================*/

document.addEventListener("DOMContentLoaded",()=>{

    amountDisplay.innerHTML="0 CAD";

    amountView.value="0 CAD";

    receiptAmount.innerHTML="0 CAD";

    serviceName.innerHTML="Not selected";

    networkName.innerHTML="Not selected";

});

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        hideLoading();

        hideSuccess();

    }

});

successModal.addEventListener("click",(e)=>{

    if(e.target===successModal){

        hideSuccess();

        resetForm();

    }

});

window.addEventListener("pageshow",()=>{

    hideLoading();

});

window.addEventListener("focus",()=>{

    hideLoading();

});

console.log("========================================");

console.log("Canada Global Bank");

console.log("Immigration Payment Portal");

console.log("Version 2.0 Loaded Successfully");

console.log("========================================");
