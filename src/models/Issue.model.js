import mongoose from "mongoose";

const IssueSchema = new mongoose.Schema(
    {
        issueTitle: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        priority: {
            type: String,
            enum: [
                "Low",
                "Medium",
                "High",
                "Emergency",
            ],
            default: "Low",
        },

        estimatedCost: {
            type: Number,
            default: 0,
        },

        actualCost: {
            type: Number,
            default: 0,
        },

        beforeImages: [
            {
                type: String,
            },
        ],

        afterImages: [
            {
                type: String,
            },
        ],

        billImage: {
            type: String,
            default: "",
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Approved",
                "In Progress",
                "On Hold",
                "Completed",
                "Cancelled",
            ],
            default: "Pending",
        },

        startDate: Date,

        expectedCompletionDate: Date,

        completedDate: Date,

        remarks: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Issue ||
    mongoose.model("Issue", IssueSchema);