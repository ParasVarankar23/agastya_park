import mongoose from "mongoose";

const OwnerSchema = new mongoose.Schema(
    {
        ownerName: {
            type: String,
            required: true,
        },

        roomNo: {
            type: String,
            required: true,
            unique: true,
        },

        email: {
            type: String,
        },

        mobile: {
            type: String,
        },

        squareFoot: {
            type: Number,
            required: true,
        },

        maintenanceRate: {
            type: Number,
            default: 1.5,
        },

        monthlyMaintenance: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

OwnerSchema.pre("save", function (next) {
    this.monthlyMaintenance =
        this.squareFoot * this.maintenanceRate;

    next();
});

export default mongoose.models.Owner ||
    mongoose.model("Owner", OwnerSchema);