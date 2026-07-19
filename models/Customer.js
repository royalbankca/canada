const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({

    customerId: {
        type: String,
        required: true,
        unique: true
    },

    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    phone: {
        type: String,
        required: true
    },

    birthDate: String,

    gender: String,

    nationality: String,

    profession: String,

    country: String,

    city: String,

    address: String,

    accountType: String,

    currency: {
        type: String,
        default: "CAD"
    },

    password: {
        type: String,
        required: true
    },

    transitNumber: {
        type: String
    },

    institutionNumber: {
        type: String,
        default: "003"
    },

    accountNumber: {
        type: String,
        unique: true
    },

    balance: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        default: "Active"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Customer", customerSchema);
