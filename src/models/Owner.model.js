import mongoose from "mongoose";

const OwnerSchema = new mongoose.Schema(
    {
        ownerName: {
            type: String,
            required: true,
            trim: true,
        },

        floor: {
            type: String,
            required: true,
            enum: [
                "Ground",
                "First",
                "Second",
                "Third",
                "Fourth",
            ],
        },

        roomNo: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        email: {
            type: String,
            default: "",
            trim: true,
        },

        mobile: {
            type: String,
            default: "",
            trim: true,
        },

        squareFoot: {
            type: Number,
            required: true,
            min: 0,
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