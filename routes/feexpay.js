const express = require("express");
const axios = require("axios");

const router = express.Router();

// =========================
// CONFIGURATION FEEXPAY
// =========================

const FEEXPAY_API_KEY = process.env.FEEXPAY_API_KEY;

const FEEXPAY_SHOP_ID = process.env.FEEXPAY_SHOP_ID;

const CAD_TO_XOF = Number(
    process.env.CAD_TO_XOF || 430
);

// =========================
// OPERATEURS
// =========================

const NETWORKS = {

    mtn: "mtn",

    moov: "moov",

    celtiis: "celtiis"

};

// =========================
// URLS API
// =========================

const URLS = {

    mtn:
    "https://api-v2.feexpay.me/api/transactions/public/requesttopay/mtn"

};
// =========================
// PAYMENT REQUEST
// =========================

router.post("/pay", async (req, res) => {

    try {

        const {
            firstName,
            lastName,
            phone,
            amount,
            paymentMethod
        } = req.body;

      // =========================
// CONVERSION CAD -> XOF
// =========================

const amountXOF = Math.round(
    Number(amount) * CAD_TO_XOF
);

      if (!FEEXPAY_API_KEY || !FEEXPAY_SHOP_ID) {

    return res.status(500).json({
        success: false,
        message: "FeezPay configuration missing."
    });

}
const endpoint = URLS[paymentMethod];

if (!endpoint) {

    return res.status(400).json({
        success: false,
        message: "Unsupported payment method."
    });

}

// =========================
// DEBUG FEEXPAY REQUEST
// =========================

console.log("===== FEEXPAY REQUEST =====");

console.log({
    endpoint,
    shop: FEEXPAY_SHOP_ID,
    amountCAD: amount,
    amountXOF,
    phone,
    paymentMethod,
    firstName,
    lastName
});

        const response = await axios.post(

            endpoint,

            {

                shop: FEEXPAY_SHOP_ID,

                amount: amountXOF,

                phoneNumber: phone,

                first_name: firstName,

                last_name: lastName,

                description: "mafiride paiement"

            },

            {

                headers: {

                    Authorization: `Bearer ${FEEXPAY_API_KEY}`,

                    "Content-Type": "application/json"

                }

            }

        );
      // =========================
// DEBUG FEEXPAY RESPONSE
// =========================

console.log("===== FEEXPAY RESPONSE =====");

console.log(response.data);

        return res.json({

            success: true,

            reference: response.data.reference,

            status: response.data.status

        });

    }

    catch(error){

        console.error(error.response?.data || error.message);

        return res.status(500).json({

            success:false,

            message:error.response?.data || error.message

        });

    }

});
// =========================
// PAYMENT STATUS
// =========================

router.get("/status/:reference", async (req, res) => {

    try {

        const response = await axios.get(

            `https://api-v2.feexpay.me/api/transactions/public/single/status/${req.params.reference}`,

            {

                headers: {

                    Authorization: `Bearer ${FEEXPAY_API_KEY}`

                }

            }

        );
        console.log(response.data);

        const transaction = response.data;

        let status = "PENDING";

        if (transaction.status === "SUCCESS") {

            status = "SUCCESS";

        }

        if (transaction.status === "FAILED") {

            status = "FAILED";

        }

        return res.json({

            success: true,

            reference: transaction.reference,

            amount: transaction.amount,

            status

        });

    }

    catch(error){

        console.error(error.response?.data || error.message);

        return res.status(500).json({

            success:false,

            message:error.response?.data || error.message

        });

    }

});
// =========================
// EXPORT
// =========================

module.exports = router;
