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
        },
    },
    {timestamps: true}
);

export default mongoose.model("Contact", contactModel);