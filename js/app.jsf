require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Servir les fichiers de ton projet
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;

const PUBLIC_KEY = process.env.SEBPAY_PUBLIC_KEY;
const SECRET_KEY = process.env.SEBPAY_SECRET_KEY;

// ================================
// RECHARGE SEBPAY
// ================================

app.post("/api/sebpay/deposit", async (req, res) => {

    try {

        const {
            amount,
            phone,
            operator,
            country
        } = req.body;

        const reference =
            "RB-" + Date.now();

        const response = await axios.post(

            "https://newapi.sebpay.bj/api/v1/collections",

            {
                amount: Number(amount),
                currency: "XOF",
                phone: phone,
                operator: operator,
                country: country,
                external_reference: reference
            },

            {

                headers: {

                    "Content-Type": "application/json",

                    "X-Public-Key": PUBLIC_KEY,

                    "X-Secret-Key": SECRET_KEY

                }

            }

        );

        res.json(response.data);

    } catch (error) {

        console.error(error.response?.data || error.message);

        res.status(500).json({

            success: false,

            message:
                error.response?.data?.message ||
                "Erreur SebPay"

        });

    }

});

// ================================
// LANCEMENT SERVEUR
// ================================

app.listen(PORT, () => {

    console.log("Serveur lancé sur le port " + PORT);

});
