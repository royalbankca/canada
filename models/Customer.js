const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
{
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
    country: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    accountNumber: {
        type: String,
        unique: true
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
        default: "Active"
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Customer", customerSchema);
