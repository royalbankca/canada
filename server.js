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

// =========================
// CONFIGURATION
// =========================

const PORT = process.env.PORT || 3000;

const SECRET_KEY =
    process.env.SEBPAY_SECRET_KEY || "VOTRE_SECRET_KEY";

const PUBLIC_KEY =
    process.env.SEBPAY_PUBLIC_KEY || "VOTRE_PUBLIC_KEY";

const JWT_SECRET =
    process.env.JWT_SECRET || "ROYAL_BANK_SECRET";

// =========================
// CONNEXION MONGODB
// =========================

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("✅ MongoDB connecté");
})
.catch((err) => {
    console.error("Erreur MongoDB :", err);
});

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
            callback_url:
                "https://canada-1.onrender.com/api/webhook"
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

        console.error(
            "Erreur SebPay :",
            error.response?.data || error.message
        );

        res.status(500).json({
            success: false,
            error: error.response?.data || error.message
        });

    }

});
// =========================
// CRÉATION D'UN COMPTE
// =========================

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
                success: false,
                message: "Missing required fields."
            });
        }

        const alreadyExists = await Customer.findOne({ email });

        if (alreadyExists) {
            return res.status(409).json({
                success: false,
                message: "Email already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

       // Génération automatique du Client ID
let customerId = "RBC100090001";

const lastCustomer = await Customer.findOne({
    customerId: { $exists: true }
}).sort({ customerId: -1 });

if (lastCustomer) {
    const number = Number(lastCustomer.customerId.substring(3));
    customerId = "RBC" + (number + 1);
}
// Génération automatique du Code d'accès
const accessCode = Math.floor(
    1000 + Math.random() * 9000
).toString();

// Génération du numéro de compte
const accountNumber =
    "10" +
    Math.floor(1000000000 + Math.random() * 9000000000);

        const transitNumber =
            Math.floor(10000 + Math.random() * 90000).toString();

        const institutionNumber = "003";

        const debitCard =
            "4539" +
            Math.floor(100000000000 + Math.random() * 900000000000);

        const cvv =
            Math.floor(100 + Math.random() * 900).toString();

        const expiryDate = "12/31";

        const existingClient = await Customer.findOne({ customerId });

if (existingClient) {
    return res.status(500).json({
        success: false,
        message: "Unable to generate a unique Client ID. Please try again."
    });
}

        const customer = new Customer({
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
            password: hashedPassword,
            customerId,
            accessCode,
            accountNumber,
            balance: 0,
            status: "Active"
        });

        await customer.save();

       return res.status(201).json({
    success: true,
    message: "Royal Bank Canada account successfully created.",

    customerId,
    accessCode,

    accountNumber,
    transitNumber,
    institutionNumber,

    debitCard,
    expiryDate,
    cvv
});

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }

});
// =========================
// CONNEXION CLIENT
// =========================

app.post("/api/login", async (req, res) => {

    try {

        const { customerId, accessCode, password } = req.body;

        if (!customerId || !accessCode || !password) {
            return res.status(400).json({
                success: false,
                message: "Client ID, Access Code and Password are required."
            });
        }

        const customer = await Customer.findOne({
            customerId,
            accessCode
        });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Invalid Client ID or Access Code."
            });
        }

        const passwordValid = await bcrypt.compare(
            password,
            customer.password
        );

        if (!passwordValid) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password."
            });
        }

        const token = jwt.sign(
            {
                id: customer._id,
                customerId: customer.customerId
            },
            JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        return res.json({
            success: true,
            token,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }

});
        
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

        console.error(
            error.response?.data || error.message
        );

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

    // Ici tu pourras traiter automatiquement
    // les paiements validés, refusés ou expirés.

    res.sendStatus(200);

});

// =========================
// TEST DU SERVEUR
// =========================

app.get("/", (req, res) => {

    res.send("RBC Royal Bank API - Serveur opérationnel");

});

// =========================
// DÉMARRAGE DU SERVEUR
// =========================

app.listen(PORT, () => {

    console.log(`✅ Serveur démarré sur le port ${PORT}`);

});
