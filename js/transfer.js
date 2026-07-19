const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({

    reference: {
        type: String,
        required: true,
        unique: true
    },

    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },

    type: {
        type: String,
        enum: [
            "deposit",
            "withdrawal",
            "transfer",
            "payment",
            "collection"
        ],
        required: true
    },

    direction: {
        type: String,
        enum: [
            "credit",
            "debit"
        ],
        required: true
    },

    amount: {
        type: Number,
        required: true,
        min: 0
    },

    currency: {
        type: String,
        default: "CAD"
    },

    description: {
        type: String,
        default: ""
    },

    senderAccount: {
        type: String,
        default: ""
    },

    receiverAccount: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        enum: [
            "pending",
            "processing",
            "completed",
            "failed",
            "cancelled"
        ],
        default: "pending"
    },

    externalReference: {
        type: String,
        default: ""
    },

    metadata: {
        type: Object,
        default: {}
    }

}, {

    timestamps: true

});

module.exports = mongoose.model("Transaction", transactionSchema);
