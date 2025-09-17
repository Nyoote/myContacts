import User from "../models/user.model.js";
export const users = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: "Error, cannot find users" });
    }
};
