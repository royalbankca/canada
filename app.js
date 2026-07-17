require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;

const PUBLIC_KEY = process.env.SEBPAY_PUBLIC_KEY;
const SECRET_KEY = process.env.SEBPAY_SECRET_KEY;

// ==========================================
// DEPOT MOBILE MONEY
// ==========================================

app.post("/api/sebpay/deposit", async (req, res) => {

    try {

        const {

            amount,
            phone,
            operator,
            country = "BJ",
            otp_code

        } = req.body;

        if (!amount || !phone || !operator) {

            return res.status(400).json({

                success: false,
                message: "Informations manquantes."

            });

        }

        const reference = "RB-" + Date.now();

        const payload = {

            amount: Number(amount),

            currency: "XOF",

            phone,

            operator,

            country,

            external_reference: reference,

            callback_url:
                "https://canada-7fct.onrender.com/api/sebpay/callback"

        };

        if (otp_code) {

            payload.otp_code = otp_code;

        }

        const response = await axios.post(

            "https://newapi.sebpay.bj/api/v1/collections",

            payload,

            {

                headers: {

                    "Content-Type": "application/json",

                    "X-Public-Key": PUBLIC_KEY,

                    "X-Secret-Key": SECRET_KEY

                }

            }

        );

        return res.status(200).json({

            success: response.data.success,

            data: response.data.data,

            message: response.data.message

        });

    } catch (error) {

        console.error("Erreur SebPay");

        console.error(error.response?.data || error.message);

        return res.status(500).json({

            success: false,

            message:

                error.response?.data?.message ||

                "Erreur de communication avec SebPay"

        });

    }

});

// ==========================================
// RECUPERER LE STATUT D'UNE TRANSACTION
// ==========================================

app.get("/api/sebpay/status/:reference", async (req, res) => {

    try {
                const { reference } = req.params;

        const response = await axios.get(

            `https://newapi.sebpay.bj/api/v1/collections/${reference}`,

            {

                headers: {

                    "X-Public-Key": PUBLIC_KEY,

                    "X-Secret-Key": SECRET_KEY

                }

            }

        );

        return res.status(200).json({

            success: response.data.success,

            data: response.data.data,

            message: response.data.message

        });

    } catch (error) {

        console.error("Erreur récupération statut");

        console.error(error.response?.data || error.message);

        return res.status(500).json({

            success: false,

            message:
                error.response?.data?.message ||
                "Impossible de récupérer le statut."

        });

    }

});

// ==========================================
// CALLBACK SEBPAY
// ==========================================

app.post("/api/sebpay/callback", (req, res) => {

    console.log("Notification SebPay reçue");

    console.log(req.body);

    return res.status(200).json({

        success: true

    });

});

// ==========================================
// TEST API
// ==========================================

app.get("/", (req, res) => {

    res.send("Royal Bank API fonctionne.");

});

// ==========================================
// LANCEMENT DU SERVEUR
// ==========================================

app.listen(PORT, () => {

    console.log(`Serveur démarré sur le port ${PORT}`);

});
