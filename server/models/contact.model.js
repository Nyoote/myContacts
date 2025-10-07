import mongoose from "mongoose";

const contactModel = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
            minlength: [10, "Phone number must be at least 10 characters"],
            maxlength: [20, "Phone number cannot exceed 20 characters"],
        },
    },
    {timestamps: true}
);

contactModel.index({ user: 1, phone: 1 }, { unique: true });

export default mongoose.model("Contact", contactModel);