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

        alert("Choisissez votre opérateur.");

        return;

    }

    if(phone === ""){

        alert("Entrez votre numéro Mobile Money.");

        return;

    }

    const payload = {

        amount: amount,

        operator: operator,

        phone: phone,

        country: "BJ"

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
                if(response.ok){

            if(result.success === false){

                alert(result.message || "Le paiement a échoué.");

                return;

            }

            alert("Votre demande de recharge a été envoyée avec succès.");

            addTransaction(

                "Recharge",

                "Recharge Mobile Money",

                amount

            );

            showNotification(

                "Votre demande de recharge est en cours de traitement.",

                "fa-wallet"

            );

            closeRecharge();

            rechargeForm.reset();

            console.log(result);

        }else{

            alert(result.message || "Erreur lors de la demande.");

            console.log(result);

        }

    }catch(error){

        console.error(error);

        alert("Impossible de contacter le serveur.");

    }

}
