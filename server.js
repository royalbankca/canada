require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");

const app = express();

// ===============================
// CONFIGURATION
// ===============================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ===============================
// MONGODB
// ===============================

mongoose.connect(process.env.MONGODB_URI, {

    autoIndex: true

})
.then(() => {

    console.log("✅ MongoDB connecté");

})
.catch((err) => {

    console.error("❌ Erreur MongoDB :", err.message);

});

// ===============================
// SEBPAY
// ===============================

const SECRET_KEY = process.env.SEBPAY_SECRET_KEY;

const PUBLIC_KEY = process.env.SEBPAY_PUBLIC_KEY;

// ===============================
// TEST API
// ===============================

app.get("/", (req, res) => {

    res.json({

        success: true,
        message: "RBC Royal Bank API fonctionne."

    });

});
// ===============================
// ROUTES SEBPAY
// ===============================

// Lancer un paiement Mobile Money
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
            callback_url: process.env.CALLBACK_URL
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

        res.json(response.data);

    } catch (error) {

        console.error("Erreur SebPay :", error.response?.data || error.message);

        res.status(500).json({
            success: false,
            error: error.response?.data || error.message
        });

    }

});

// Vérifier le statut d'un paiement
app.get("/api/collections/:id", async (req, res) => {

    try {

        const response = await axios.get(
            `https://newapi.sebpay.bj/api/v1/collections/${req.params.id}`,
            {
                headers: {
                    "X-Secret-Key": SECRET_KEY,
                    "X-Public-Key": PUBLIC_KEY
                }
            }
        );

        res.json(response.data);

    } catch (error) {

        console.error("Erreur statut :", error.response?.data || error.message);

        res.status(500).json({
            success: false,
            error: error.response?.data || error.message
        });

    }

});

// ===============================
// WEBHOOK SEBPAY
// ===============================

app.post("/api/webhook", async (req, res) => {

    console.log("Webhook reçu :", req.body);

    // Ici nous enregistrerons plus tard le paiement
    // et mettrons automatiquement à jour le solde du client.

    res.sendStatus(200);

});
// ===============================
// AUTHENTIFICATION
// ===============================

app.post("/api/login", async (req, res) => {

    try {

        const { customerId, password } = req.body;

        if (!customerId || !password) {

            return res.status(400).json({
                success: false,
                message: "Identifiants manquants."
            });

        }

        // Recherche MongoDB à ajouter
        // const customer = await Customer.findOne({ customerId });

        return res.status(501).json({
            success: false,
            message: "Authentification non encore connectée à MongoDB."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Erreur serveur."
        });

    }

});

// ===============================
// CLIENTS
// ===============================

// Liste des clients
app.get("/api/customers", async (req, res) => {

    res.json({
        success: true,
        customers: []
    });

});

// Détails d'un client
app.get("/api/customers/:id", async (req, res) => {

    res.json({
        success: true,
        customer: null
    });

});

// Création d'un client
app.post("/api/customers", async (req, res) => {

    res.status(501).json({
        success: false,
        message: "Création bientôt disponible."
    });

});

// Modification d'un client
app.put("/api/customers/:id", async (req, res) => {

    res.status(501).json({
        success: false,
        message: "Modification bientôt disponible."
    });

});

// Suppression d'un client
app.delete("/api/customers/:id", async (req, res) => {

    res.status(501).json({
        success: false,
        message: "Suppression bientôt disponible."
    });

});

// ===============================
// ADMINISTRATION
// ===============================

app.get("/api/admin/dashboard", async (req, res) => {

    res.json({

        success: true,

        statistics: {

            customers: 0,
            activeAccounts: 0,
            pendingRequests: 0,
            transactions: 0

        }

    });

});
// ===============================
// MODELS
// ===============================

const Customer = require("./models/Customer");
const Transaction = require("./models/Transaction");
const Payment = require("./models/Payment");
const Notification = require("./models/Notification");

// ===============================
// CREATION DE L'ADMINISTRATEUR
// ===============================

async function createDefaultAdmin() {

    try {

        const admin = await Customer.findOne({

            customerId: "ADMIN001"

        });

        if (admin) {

            console.log("✅ Administrateur déjà existant.");
            return;

        }

        const newAdmin = new Customer({

            customerId: "ADMIN001",

            accountNumber: "100000000001",

            accessCode: "RBCA001",

            password: "ADMIN123",

            role: "admin",

            firstName: "System",

            lastName: "Administrator",

            email: "admin@rbcroyalbank.com",

            phone: "+10000000000",

            address: "Royal Bank Headquarters",

            balance: 0,

            currency: "CAD",

            status: "active"

        });

        await newAdmin.save();

        console.log("✅ Administrateur créé.");

    } catch (error) {

        console.error("Erreur création administrateur :", error);

    }

}

mongoose.connection.once("open", async () => {

    await createDefaultAdmin();

});
