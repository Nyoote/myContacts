import mongoose from "mongoose";

const contactModel = new mongoose.Schema(
    {
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
            unique: true,
            required: true,
            minlength: [10, "Phone number must be at least 10 characters"],
            maxlength: [20, "Phone number cannot exceed 20 characters"],
        },
    },
    {timestamps: true}
);

export default mongoose.model("Contact", contactModel);