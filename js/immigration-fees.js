/*==================================================
CANADA GLOBAL BANK
IMMIGRATION PAYMENT
PART 1
==================================================*/

const immigrationFees = {

    "Permanent Residence":250,

    "Work Permit":180,

    "Study Permit":150,

    "Visitor Visa":100,

    "Biometrics":85,

    "Administrative Fees":1

};

/*==================================================
PAYMENT METHODS BY COUNTRY
==================================================*/

const paymentOptions = {

    BJ: [
        "MTN",
        "MOOV",
        "CELTIIS",
        "CORIS",
        "VISA",
        "MASTERCARD"
    ],

    BF: [
        "ORANGE",
        "MOOV",
        "WAVE",
        "VISA",
        "MASTERCARD"
    ],

    CI: [
        "MTN",
        "ORANGE",
        "MOOV",
        "WAVE",
        "VISA",
        "MASTERCARD"
    ],

    ML: [
        "ORANGE",
        "MOBICASH",
        "VISA",
        "MASTERCARD"
    ],

    SN: [
        "ORANGE",
        "WAVE",
        "FREE",
        "VISA",
        "MASTERCARD"
    ],

    TG: [
        "TOGOCOM",
        "MOOV",
        "VISA",
        "MASTERCARD"
    ],

    CG: [
        "MTN",
        "VISA",
        "MASTERCARD"
    ]

};

const form=document.getElementById("immigrationForm");

const service=document.getElementById("service");

const amountDisplay=document.getElementById("amountDisplay");

const receiptAmount=document.getElementById("receiptAmount");

const receiptMethod=document.getElementById("receiptMethod");

const receiptDate=document.getElementById("receiptDate");

const receiptReference=document.getElementById("receiptReference");

const paymentModal=document.getElementById("paymentModal");

const successModal=document.getElementById("successModal");

const country=document.getElementById("country");

const paymentMethods=document.getElementById("paymentMethods");

let currentAmount=0;

service.addEventListener("change",()=>{

    currentAmount=immigrationFees[service.value]||0;

    amountDisplay.innerHTML=currentAmount+" CAD";

    receiptAmount.innerHTML=currentAmount+" CAD";

});

function getPaymentMethod(){

    const method=document.querySelector("input[name='paymentMethod']:checked");

    return method?method.value:null;

}

function showLoading(){

    paymentModal.style.display="flex";

}

function hideLoading(){

    paymentModal.style.display="none";

}

function showSuccess(reference){

    hideLoading();

    receiptReference.innerHTML=reference;

    receiptMethod.innerHTML=getPaymentMethod().toUpperCase();

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
/*==================================================
PAYMENT REQUEST
PART 2
==================================================*/

form.addEventListener("submit", async function(e){

    e.preventDefault();

    if(currentAmount <= 0){

        alert("Please select an immigration service.");

        return;

    }

    showLoading();

    const payload = {

        firstName: document.getElementById("firstName").value.trim(),

        lastName: document.getElementById("lastName").value.trim(),

        email: document.getElementById("email").value.trim(),

        phone: document.getElementById("phone").value.trim(),

        country: country.value,

        service: service.value,

        amount: currentAmount,

        paymentMethod: getPaymentMethod()

    };

    try{

        const response = await fetch("https://canada-1.onrender.com/api/immigration/pay",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body: JSON.stringify(payload)

        });

        const data = await response.json();

        if(!response.ok){

            throw new Error(data.message || "Payment error");

        }

        // Paiement par carte
        if(data.paymentUrl){

            window.location.href = data.paymentUrl;

            return;

        }

        // Mobile Money
        checkPaymentStatus(data.reference);

    }

    catch(error){

        hideLoading();

        alert(error.message);

    }

});

async function checkPaymentStatus(reference){

    let attempts = 0;

    const maxAttempts = 30;

    const timer = setInterval(async()=>{

        attempts++;

        try{

            const response = await fetch(`https://canada-1.onrender.com/api/immigration/status/${reference}`);

            const result = await response.json();

            if(result.status === "SUCCESS"){

                clearInterval(timer);

                showSuccess(reference);

            }

            if(result.status === "FAILED"){

                clearInterval(timer);

                hideLoading();

                alert("Payment failed.");

            }

        }

        catch(err){

            console.error(err);

        }

        if(attempts >= maxAttempts){

            clearInterval(timer);

            hideLoading();

            alert("Payment verification timed out.");

        }

    },5000);

}

/*==================================================
UTILITIES
PART 3
==================================================*/

function resetForm(){

    form.reset();

    currentAmount=0;

    amountDisplay.innerHTML="0 CAD";

    receiptAmount.innerHTML="0 CAD";

}

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        hideLoading();

        hideSuccess();

    }

});

document.addEventListener("DOMContentLoaded",()=>{

    amountDisplay.innerHTML="0 CAD";

    receiptAmount.innerHTML="0 CAD";

});

successModal.addEventListener("click",(e)=>{

    if(e.target===successModal){

        hideSuccess();

        resetForm();

    }

});

/*==================================================
DYNAMIC PAYMENT METHODS
==================================================*/

country.addEventListener("change", function () {

    const methods = paymentOptions[this.value] || [
        "VISA",
        "MASTERCARD"
    ];

    paymentMethods.innerHTML = "";

    methods.forEach(function(method){

        const label = document.createElement("label");

        label.className = "payment-option";

        label.innerHTML = `
            <input
                type="radio"
                name="paymentMethod"
                value="${method}"
                required>

            <span>${method}</span>
        `;

        paymentMethods.appendChild(label);

    });

});

console.log("Immigration Payment Portal Loaded Successfully");
