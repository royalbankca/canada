const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({

    paymentId: {
        type: String,
        unique: true,
        sparse: true
    },

    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
        required: true
    },

    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },

    provider: {
        type: String,
        default: "SebPay"
    },

    operator: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    country: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    currency: {
        type: String,
        default: "CAD"
    },

    externalReference: {
        type: String,
        required: true,
        unique: true
    },

    status: {
        type: String,
        enum: [
            "pending",
            "processing",
            "successful",
            "failed",
            "cancelled"
        ],
        default: "pending"
    },

    response: {
        type: Object,
        default: {}
    },

    webhook: {
        type: Object,
        default: {}
    }

}, {

    timestamps: true

});

module.exports = mongoose.model("Payment", paymentSchema);
