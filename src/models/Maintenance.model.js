import mongoose from "mongoose";

const MaintenanceSchema = new mongoose.Schema(
    {
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Owner",
            required: true,
        },

        month: {
            type: String,
            required: true,
        },

        year: {
            type: Number,
            required: true,
        },

        amount: {
            type: Number,
            required: true,
        },

        paymentStatus: {
            type: String,
            enum: ["Paid", "Pending", "Unpaid"],
            default: "Pending",
        },

        paymentMode: {
            type: String,
            enum: [
                "Cash",
                "Society Account",
                "Personal Account",
            ],
        },

        transactionId: {
            type: String,
            default: "",
        },

        paymentDate: {
            type: Date,
            default: null,
        },

        remarks: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Maintenance ||
    mongoose.model(
        "Maintenance",
        MaintenanceSchema
    );