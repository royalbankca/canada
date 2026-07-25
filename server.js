require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const { randomUUID } = require("crypto");

const Customer = require("./models/Customer");

const Transaction = require("./models/Transaction");

const app = express();

app.use(cors());
app.use(express.json());

// =========================
// CONFIGURATION MULTER
// =========================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, "uploads/");

    },

    filename: function (req, file, cb) {

        const extension = path.extname(file.originalname);

        cb(
            null,
            Date.now() + extension
        );

    }

});

const upload = multer({

    storage: storage,

    limits: {

        fileSize: 5 * 1024 * 1024

    },

    fileFilter: (req, file, cb) => {

        const allowed = /jpg|jpeg|png|webp/i;

        const extension =
            allowed.test(path.extname(file.originalname));

        const mime =
            allowed.test(file.mimetype);

        if (extension && mime) {

            return cb(null, true);

        }

        cb(new Error("Image non autorisée."));

    }

});

app.use("/uploads", express.static("uploads"));
// =========================
// CONFIGURATION
// =========================

const PORT = process.env.PORT || 3000;

const PAWAPAY_API_KEY =
    process.env.PAWAPAY_API_KEY;

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

        const {

    usdAmount,
    phone,
    operator,
    country,
    customerId
} = req.body;
        
       
        const COUNTRIES = {

            BJ: { code: "BEN", currency: "XOF" },
            BF: { code: "BFA", currency: "XOF" },
            CI: { code: "CIV", currency: "XOF" },
            SN: { code: "SEN", currency: "XOF" },
            TG: { code: "TGO", currency: "XOF" },
            GW: { code: "GNB", currency: "XOF" },
            ML: { code: "MLI", currency: "XOF" },
            NE: { code: "NER", currency: "XOF" },

            CM: { code: "CMR", currency: "XAF" },
            CG: { code: "COG", currency: "XAF" },
            GA: { code: "GAB", currency: "XAF" },
            TD: { code: "TCD", currency: "XAF" },

            CD: { code: "COD", currency: "CDF" },

            GH: { code: "GHA", currency: "GHS" },

            GM: { code: "GMB", currency: "GMD" },

            GN: { code: "GIN", currency: "GNF" },

            NG: { code: "NGA", currency: "NGN" }

        };

        const USD_RATES = {

            XOF: 600,

            XAF: 600,

            CDF: 2850,

            GHS: 12,

            GMD: 72,

            GNF: 8700,

            NGN: 1650

        };

        const config = COUNTRIES[country];

        if (!config) {

            return res.status(400).json({

                success: false,

                message: "Pays non pris en charge."

            });

        }

        const localAmount = Math.round(
    Number(usdAmount) *
    USD_RATES[config.currency]
);
        
    // Tu pourras ajouter les autres pays progressivement.
        
const CORRESPONDENTS = {
    BJ: {
        mtn: "MTN_MOMO_BEN",
        moov: "MOOV_MONEY_BEN"
    }
};

const payload = {
    depositId: randomUUID(),
    amount: String(localAmount),
    currency: config.currency,
    country: config.code,
    correspondent: CORRESPONDENTS[country][operator],
    customerTimestamp: new Date().toISOString(),
    statementDescription: "Canada Global Bank",
    metadata: {
        customerId
    },
    payer: {
        type: "MSISDN",
        address: {
            value: phone
        }
    }
};
        const customer = await Customer.findOne({ customerId });

if (!customer) {

    return res.status(404).json({
        success: false,
        message: "Customer not found."
    });

}

    await Transaction.create({

    depositId: payload.depositId,

    customerId,

    amount: Number(usdAmount),

    currency: customer.currency,

    status: "PENDING"

});
console.log("===== REQUÊTE PAWAPAY =====");
console.log("API KEY :", PAWAPAY_API_KEY ? "OK" : "MANQUANTE");
console.log("Payload :", JSON.stringify(payload, null, 2));
const response = await axios.post(

    "https://api.pawapay.io/v1/deposits",

    payload,

    {

        headers: {

            Authorization: `Bearer ${PAWAPAY_API_KEY}`,

            "Content-Type": "application/json"

        }

    }

);

return res.status(200).json(response.data);

   } catch (error) {

    console.error("===== ERREUR COMPLÈTE =====");
    console.error("Message :", error.message);

    if (error.response) {
        console.error("Status :", error.response.status);
        console.error("Data :", JSON.stringify(error.response.data, null, 2));
    }

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

      const lastCustomer = await Customer
    .findOne({
        customerId: { $regex: /^CGB\d+$/ }
    })
    .sort({ customerId: -1 });

let customerId = "CGB100090001";

if (lastCustomer) {
    const number = parseInt(
        lastCustomer.customerId.replace("CGB", ""),
        10
    );

    customerId = "CGB" + (number + 1);
}

        const accountNumber =
            "10" + Math.floor(1000000000 + Math.random() * 9000000000);

        const transitNumber =
            Math.floor(10000 + Math.random() * 90000).toString();

        const institutionNumber = "003";

        const debitCard =
            "4539" +
            Math.floor(100000000000 + Math.random() * 900000000000);

        const cvv =
            Math.floor(100 + Math.random() * 900).toString();

        const expiryDate = "12/31";

        const accessCode =
    Math.floor(1000 + Math.random() * 9000).toString();

      const customer = new Customer({
    customerId,
    accessCode,
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
    accountNumber,
    transitNumber,
    institutionNumber,
    debitCard,
    cvv,
    expiryDate,
    balance: 0,
    status: "Active"
});
        await customer.save();

       return res.status(201).json({
    success: true,
    message: "Canada Global Bank account successfully created.",

    customerId: customer.customerId,
    accessCode: customer.accessCode,
    accountNumber: customer.accountNumber,
    transitNumber: customer.transitNumber,
    institutionNumber: customer.institutionNumber,

    debitCard: customer.debitCard,
    expiryDate: customer.expiryDate,
    cvv: customer.cvv,

    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email
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
        message: "Customer ID, Access Code and Password are required."
    });

}

        const customer = await Customer.findOne({ customerId });

if (!customer) {

    return res.status(404).json({
        success: false,
        message: "Customer not found."
    });

}

if (customer.accessCode !== accessCode) {

    return res.status(401).json({
        success: false,
        message: "Invalid Access Code."
    });

}
        
        const passwordValid = await bcrypt.compare(
            password,
            customer.password
        );

        if (!passwordValid) {

            return res.status(401).json({
                success: false,
                message: "Invalid password."
            });

        }

if (customer.status === "Blocked") {

    return res.status(403).json({
        success: false,
        message: "Votre compte a été temporairement bloqué. Pour obtenir de l'aide ou réactiver votre accès, veuillez contacter notre service clientèle au +1 902 600 0017."
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
    customer: {
        _id: customer._id,
        customerId: customer.customerId,
        firstName: customer.firstName,
        lastName: customer.lastName,
        profileImage: customer.profileImage,
        email: customer.email,
        phone: customer.phone,
        accountNumber: customer.accountNumber,
        transitNumber: customer.transitNumber,
        institutionNumber: customer.institutionNumber,
        balance: customer.balance,
        status: customer.status,
        accountType: customer.accountType,
        currency: customer.currency
    }
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
// RÉCUPÉRER LE STATUT D'UN DÉPÔT PAWAPAY
// =========================
app.get("/api/collections/:id", async (req, res) => {
    try {

        const response = await axios.get(
            `https://api.pawapay.io/v2/deposits/${req.params.id}`,
            {
                headers: {
                    Authorization: `Bearer ${PAWAPAY_API_KEY}`,
                    Accept: "application/json"
                }
            }
        );

        res.json(response.data);

    } catch (error) {

        console.error(
            "Erreur statut PawaPay :",
            error.response?.data || error.message
        );

        res.status(500).json({
            success: false,
            error: error.response?.data || error.message
        });

    }
});

// =========================
// WEBHOOK PAWAPAY
// =========================

app.post("/api/webhook", async (req, res) => {

    try {

        console.log("Notification PawaPay :", req.body);

       const {

    depositId,
    status,
    amount,
    currency,
    country,
    metadata

} = req.body;

const customerId = metadata?.customerId;

       const transaction = await Transaction.findOne({ depositId });

if (!transaction) {

    return res.sendStatus(404);

}

const customer = await Customer.findOne({
    customerId: transaction.customerId
});

if (
    customer &&
    status === "COMPLETED" &&
    transaction.status !== "COMPLETED"
) {
    customer.balance += transaction.amount;

    await customer.save();

    transaction.status = "COMPLETED";

    await transaction.save();

    console.log(
        `Compte ${customer.customerId} crédité de ${transaction.amount} ${transaction.currency}`
    );

}

        if (status === "FAILED") {

            console.log(
                `Dépôt ${depositId} échoué.`
            );

        }

        res.sendStatus(200);

    } catch (error) {

        console.error(error);

        res.sendStatus(500);

    }

});

// =========================
// TEST DU SERVEUR
// =========================

app.get("/", (req, res) => {

    res.send("CGB Canada Global Bank API - Serveur opérationnel");

});

// =========================
// DÉMARRAGE DU SERVEUR
// =========================

//======================================================
// ADMIN - GET ALL CUSTOMERS
//======================================================

app.get("/api/admin/customers", async (req, res) => {

    try {

        const customers = await Customer
            .find()
            .sort({ createdAt: -1 })
            .select("-password");

        res.json({
            success: true,
            customers
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to retrieve customers."
        });

    }

});// UPDATE CUSTOMER

app.put("/api/admin/customers/:id", async (req, res) => {

    try {

        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json({
            success: true,
            customer
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Unable to update customer."
        });

    }

});
// CHANGE STATUS

app.put("/api/admin/customers/:id/status", async (req, res) => {

    try {

        const customer = await Customer.findById(req.params.id);

        if (!customer) {

            return res.status(404).json({
                success: false,
                message: "Customer not found."
            });

        }

        customer.status =
            customer.status === "Active"
            ? "Blocked"
            : "Active";

        await customer.save();

        res.json({
            success: true,
            status: customer.status
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Unable to update status."
        });

    }

});
// CREDIT ACCOUNT

app.put("/api/admin/customers/:id/credit", async (req, res) => {

    try {

        const { amount } = req.body;

        const customer = await Customer.findById(req.params.id);

        if (!customer) {

            return res.status(404).json({
                success: false,
                message: "Customer not found."
            });

        }

        customer.balance += Number(amount);

        await customer.save();

        res.json({
            success: true,
            balance: customer.balance
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Unable to credit account."
        });

    }

});
// RESET PASSWORD

app.put("/api/admin/customers/:id/password", async (req, res) => {

    try {

        const { password } = req.body;

        const hashedPassword =
            await bcrypt.hash(password, 10);

        await Customer.findByIdAndUpdate(
            req.params.id,
            { password: hashedPassword }
        );

        res.json({
            success: true,
            message: "Password updated successfully."
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Unable to reset password."
        });

    }

});

//======================================================
// DELETE CUSTOMER
//======================================================

app.delete("/api/admin/customers/:id", async (req, res) => {

    try {

        const customer = await Customer.findById(req.params.id);

        if (!customer) {

            return res.status(404).json({
                success: false,
                message: "Customer not found."
            });

        }

        await Customer.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Customer deleted successfully."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to delete customer."
        });

    }

});
//======================================================
// UPLOAD PHOTO DE PROFIL
//======================================================

app.post("/api/customers/:id/photo", upload.single("photo"), async (req, res) => {

    try {

        const customer = await Customer.findById(req.params.id);

        if (!customer) {

            return res.status(404).json({
                success: false,
                message: "Customer not found."
            });

        }

        customer.profileImage = "/uploads/" + req.file.filename;

        await customer.save();

        res.json({
            success: true,
            image: customer.profileImage
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Impossible d'enregistrer la photo."
        });

    }

});

app.listen(PORT, () => {

    console.log(`✅ Serveur démarré sur le port ${PORT}`);

});
