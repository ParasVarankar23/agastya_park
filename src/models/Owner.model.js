import mongoose from "mongoose";

const OwnerSchema = new mongoose.Schema(
    {
        ownerName: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        mobileNumber: {
            type: String,
            required: true,
        },

        alternateNumber: {
            type: String,
            default: "",
        },

        roomNumber: {
            type: String,
            required: true,
            unique: true,
        },

        floor: {
            type: String,
            required: true,
        },

        carpetArea: {
            type: Number,
            default: 0,
        },

        builtUpArea: {
            type: Number,
            required: true,
        },

        maintenanceRate: {
            type: Number,
            default: 1.5,
        },

        monthlyMaintenance: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Owner ||
    mongoose.model("Owner", OwnerSchema);