const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({

    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },

    title: {
        type: String,
        required: true,
        trim: true
    },

    message: {
        type: String,
        required: true,
        trim: true
    },

    type: {
        type: String,
        enum: [
            "deposit",
            "withdrawal",
            "transfer",
            "payment",
            "security",
            "account",
            "system"
        ],
        default: "system"
    },

    priority: {
        type: String,
        enum: [
            "low",
            "normal",
            "high",
            "urgent"
        ],
        default: "normal"
    },

    isRead: {
        type: Boolean,
        default: false
    },

    data: {
        type: Object,
        default: {}
    }

}, {

    timestamps: true

});

module.exports = mongoose.model("Notification", notificationSchema);
