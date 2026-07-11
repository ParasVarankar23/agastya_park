import mongoose from "mongoose";

const NoticeSchema = new mongoose.Schema(
    {
        noticeTitle: {
            type: String,
            required: true,
        },

        noticeType: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        startMonth: {
            type: String,
            required: true,
        },

        endMonth: {
            type: String,
            required: true,
        },

        attachment: {
            type: String,
            default: "",
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Notice ||
    mongoose.model("Notice", NoticeSchema);