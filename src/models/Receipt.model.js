import mongoose from "mongoose";

const ReceiptSchema = new mongoose.Schema(
    {
        maintenanceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Maintenance",
            required: true,
        },

        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Owner",
            required: true,
        },

        receiptNumber: {
            type: String,
            required: true,
            unique: true,
        },

        amount: {
            type: Number,
            required: true,
        },

        paymentMode: {
            type: String,
            required: true,
        },

        paymentDate: {
            type: Date,
            required: true,
        },

        receiptPdf: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Receipt ||
    mongoose.model("Receipt", ReceiptSchema);