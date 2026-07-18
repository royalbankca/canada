require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

// =========================
// CONFIGURATION SEBPAY
// =========================

const SECRET_KEY = process.env.SEBPAY_SECRET_KEY || "VOTRE_SECRET_KEY";
const PUBLIC_KEY = process.env.SEBPAY_PUBLIC_KEY || "VOTRE_PUBLIC_KEY";

// =========================
// API DE RECHARGEMENT
// =========================

app.post("/api/collections", async (req, res) => {
    try {

      const payload = {
    amount: req.body.amount,
    currency: req.body.currency,
    phone: req.body.phone,
    operator: req.body.operator,
    country: req.body.country,
    external_reference: req.body.external_reference,
    description: req.body.description
};

const response = await axios.post(
    "https://newapi.sebpay.bj/api/v1/collections",
    payload,
    {
                headers: {
                    "Content-Type": "application/json",
                    "X-Secret-Key": SECRET_KEY,
                    "X-Public-Key": PUBLIC_KEY
                }
            }
        );

        res.status(200).json(response.data);

    } catch (error) {

        console.error("Erreur SEBPAY :", error.response?.data || error.message);

        res.status(500).json({
            success: false,
            error: error.response?.data || error.message
        });

    }
});

// =========================
// TEST DU SERVEUR
// =========================

app.get("/", (req, res) => {
    res.send("RBC Royal Bank API - Serveur opérationnel");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
