const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({

    customerId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    accountNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    accessCode: {
        type: String,
        required: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer"
    },

    firstName: {
        type: String,
        required: true,
        trim: true
    },

    lastName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    phone: {
        type: String,
        required: true,
        trim: true
    },

    address: {
        type: String,
        default: ""
    },

    balance: {
        type: Number,
        default: 0
    },

    currency: {
        type: String,
        default: "CAD"
    },

    status: {
        type: String,
        enum: ["active", "pending", "blocked"],
        default: "active"
    },

    lastLogin: {
        type: Date
    }

}, {

    timestamps: true

});

module.exports = mongoose.model("Customer", customerSchema);
