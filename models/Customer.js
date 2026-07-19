const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({

    customerId: {
        type: String,
        required: true,
        unique: true,
        trim: true
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

    birthDate: {
        type: String,
        default: ""
    },

    gender: {
        type: String,
        default: ""
    },

    nationality: {
        type: String,
        default: ""
    },

    profession: {
        type: String,
        default: ""
    },

    country: {
        type: String,
        default: ""
    },

    city: {
        type: String,
        default: ""
    },

    address: {
        type: String,
        default: ""
    },

    accountType: {
        type: String,
        default: "Checking"
    },

    currency: {
        type: String,
        default: "CAD"
    },

    password: {
        type: String,
        required: true
    },

    transitNumber: {
        type: String,
        default: ""
    },

    institutionNumber: {
        type: String,
        default: "003"
    },

    accountNumber: {
        type: String,
        unique: true,
        sparse: true
    },

    balance: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: ["Active", "Blocked", "Pending", "Closed"],
        default: "Active"
    },

    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer"
    },

    lastLogin: {
        type: Date,
        default: null
    },

    profilePhoto: {
        type: String,
        default: ""
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Customer", customerSchema);
