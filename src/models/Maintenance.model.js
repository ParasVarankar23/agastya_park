import mongoose from "mongoose";

const MaintenanceSchema = new mongoose.Schema(
    {
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Owner",
            required: true,
        },

        roomNo: {
            type: String,
            required: true,
        },

        ownerName: {
            type: String,
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

        paidAmount: {
            type: Number,
            default: 0,
        },

        remainingAmount: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Partial",
                "Paid",
            ],
            default: "Pending",
        },
    },
    {
        timestamps: true,
    }
);

MaintenanceSchema.pre(
    "save",
    function (next) {
        this.remainingAmount =
            this.amount - this.paidAmount;

        if (this.remainingAmount <= 0) {
            this.status = "Paid";
        } else if (
            this.paidAmount > 0
        ) {
            this.status = "Partial";
        } else {
            this.status = "Pending";
        }

        next();
    }
);

export default mongoose.models.Maintenance ||
    mongoose.model(
        "Maintenance",
        MaintenanceSchema
    );