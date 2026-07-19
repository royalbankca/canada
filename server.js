require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Customer = require("./models/Customer");
const app = express();

app.use(cors());
app.use(express.json());
// =======================================
// ROYAL BANK CANADA DATABASE
// =======================================

mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000
})
.then(() => {
    console.log("✅ MongoDB connecté");
})
.catch((err) => {
    console.error("❌ Erreur MongoDB :", err.message);
});
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
    description: req.body.description,
    callback_url: "https://canada-1.onrender.com/api/webhook"

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
// =========================
// RÉCUPÉRER LE STATUT D'UNE TRANSACTION
// =========================

app.get("/api/collections/:id", async (req, res) => {

    try {

        const response = await axios.get(
            `https://newapi.sebpay.bj/api/v1/collections/${req.params.id}`,
            {
                headers: {
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
            error: error.response?.data || error.message
        });

    }

});
// =========================
// WEBHOOK SEBPAY
// =========================

app.post("/api/webhook", (req, res) => {

    console.log("Notification SebPay :", req.body);

    // Ici nous traiterons automatiquement
    // les paiements validés ou refusés.

    res.sendStatus(200);

});
//=========================================================
// ROYAL BANK CANADA
// OPEN ACCOUNT API
//=========================================================

const Customer = require("./models/Customer");

app.post("/api/open-account", async (req, res) => {

try {

const {

firstName,
lastName,
email,
phone,
birthDate,
gender,
nationality,
profession,
country,
city,
address,
accountType,
currency,
password

} = req.body;

if (
!firstName ||
!lastName ||
!email ||
!phone ||
!password
) {

return res.status(400).json({

success:false,

message:"Missing required fields."

});

}
if (
!firstName ||
!lastName ||
!email ||
!phone ||
!password
) {

return res.status(400).json({

success:false,

message:"Missing required fields."

});

}
const alreadyExists = customers.find(

customer => customer.email === email

);

if(alreadyExists){

return res.status(409).json({

success:false,

message:"Email already exists."

});

}

const customerId =
"RBC" +
Math.floor(100000 + Math.random()*900000);

const accountNumber =
"10" +
Math.floor(1000000000 + Math.random()*9000000000);

const transitNumber =
Math.floor(10000 + Math.random()*90000);

const institutionNumber = "003";

const debitCard =
"4539" +
Math.floor(100000000000 + Math.random()*900000000000);

const cvv =
Math.floor(100 + Math.random()*900);

const expiryDate = "12/31";

const customer = {

id:customerId,

firstName,

lastName,

email,

phone,

birthDate,

gender,

nationality,

profession,

country,

city,

address,

accountType,

currency,

accountNumber,

transitNumber,

institutionNumber,

debitCard,

expiryDate,

cvv,

balance:0,

password,

createdAt:new Date()

};

customers.push(customer);

return res.status(201).json({

success:true,

message:"Royal Bank Canada account successfully created.",

customerId,

accountNumber,

transitNumber,

institutionNumber

});

}catch(error){

console.error(error);

return res.status(500).json({

success:false,

message:"Internal server error."

});

}

});
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
