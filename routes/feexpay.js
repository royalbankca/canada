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
// FEEXPAY API
// =========================

const API =
"https://api-v2.feexpay.me/api/transactions/public";

// =========================
// URLS API
// =========================

const URLS = {

    // ========= BENIN =========

    MTN: `${API}/requesttopay/mtn`,

    MOOV: `${API}/requesttopay/moov`,

    CELTIIS: `${API}/requesttopay/celtiis_bj`,

    CORIS: `${API}/requesttopay/coris`,

    // ========= BURKINA FASO =========

    ORANGE_BF: `${API}/requesttopay/orange_bf`,

    MOOV_BF: `${API}/requesttopay/moov_bf`,

WAVE_BF: `${API}/requesttopay/wave_bf`,
// ========= COTE D'IVOIRE =========

MTN_CI: `${API}/requesttopay/mtn_ci`,

MOOV_CI: `${API}/requesttopay/moov_ci`,

ORANGE_CI: `${API}/requesttopay/orange_ci`,

WAVE_CI: `${API}/requesttopay/wave_ci`,

// ========= MALI =========

ORANGE_ML: `${API}/requesttopay/orange_ml`,

MOBICASH: `${API}/requesttopay/mobicash_ml`,

// ========= SENEGAL =========

ORANGE_SN: `${API}/requesttopay/orange_sn`,

FREE_SN: `${API}/requesttopay/free_sn`,

WAVE_SN: `${API}/requesttopay/wave_sn`,

// ========= TOGO =========

TOGOCOM: `${API}/requesttopay/togocom_tg`,

MOOV_TG: `${API}/requesttopay/moov_tg`,

// ========= CONGO =========

MTN_CG: `${API}/requesttopay/mtn_cg`
};

// =========================
// PAYMENT REQUEST
// =========================

router.post("/pay", async (req, res) => {

    try {

        const {
    firstName,
    lastName,
    email,
    phone,
    amount,
    paymentMethod,
    country
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
const method = String(paymentMethod || "").toUpperCase();

        // =========================
// CARD PAYMENT (VISA / MASTERCARD)
// =========================

if (method === "VISA" || method === "MASTERCARD") {

    const response = await axios.post(

        "https://api-v2.feexpay.me/api/feexlink/api-create",

        {

            shop: FEEXPAY_SHOP_ID,

            amount: amountXOF,

            description: "Canada Immigration Fees",

            paymentMethod: "CARD",

            range: 1,

            expireIn: 30,

            callback_url: "https://cgbfinance.com/payment-success.html",

            callback_error: "https://cgbfinance.com/payment-error.html"

        },

        {

            headers: {

                Authorization: `Bearer ${FEEXPAY_API_KEY}`,

                "Content-Type": "application/json"

            }

        }

    );

    return res.json({

        success: true,

        paymentUrl: response.data.urlPay

    });

}

// =========================
// PAYMENT MAPPING
// =========================

const PAYMENT_MAP = {

    // ========= BENIN =========

    BJ: {
        MTN: "MTN",
        MOOV: "MOOV",
        CELTIIS: "CELTIIS",
        CORIS: "CORIS"
    },

    // ========= BURKINA =========

    BF: {
        ORANGE: "ORANGE_BF",
        MOOV: "MOOV_BF",
        WAVE: "WAVE_BF"
    },

    // ========= COTE D'IVOIRE =========

    CI: {
        MTN: "MTN_CI",
        ORANGE: "ORANGE_CI",
        MOOV: "MOOV_CI",
        WAVE: "WAVE_CI"
    },

    // ========= MALI =========

    ML: {
        ORANGE: "ORANGE_ML",
        MOBICASH: "MOBICASH"
    },

    // ========= SENEGAL =========

    SN: {
        ORANGE: "ORANGE_SN",
        FREE: "FREE_SN",
        WAVE: "WAVE_SN"
    },

    // ========= TOGO =========

    TG: {
        TOGOCOM: "TOGOCOM",
        MOOV: "MOOV_TG"
    },

    // ========= CONGO =========

    CG: {
        MTN: "MTN_CG"
    }

};

const endpointKey =
    PAYMENT_MAP[country]?.[method];

const endpoint = URLS[endpointKey];

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
    paymentMethod: method,
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
