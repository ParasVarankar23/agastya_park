import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
    {
        expenseType: {
            type: String,
            required: true,
        },

        amount: {
            type: Number,
            required: true,
        },

        expenseDate: {
            type: Date,
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

        billImage: {
            type: String,
            default: "",
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

export default mongoose.models.Expense ||
    mongoose.model("Expense", ExpenseSchema);