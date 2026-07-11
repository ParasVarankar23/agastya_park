import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            default: "admin",
        },

        profileImage: {
            type: String,
            default: "",
        },

        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        otp: {
            type: String,
            default: null,
        },

        otpExpiry: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.User ||
    mongoose.model("User", UserSchema);