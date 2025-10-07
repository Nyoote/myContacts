import Contact from "../models/contact.model.js";

export const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({ user: req.user._id })
            .sort({ createdAt: -1 });
        res.status(200).json(contacts);
    } catch (error) {
        console.error(error);
        res.status(404).json({message: "Error, cannot find contacts"});
    }
}

export const addContact = async (req, res) => {
    const {firstName, lastName, phone} = req.body;

    try {
        const existingContact = await Contact.findOne({ user: req.user._id, phone });
        if (existingContact) return res.status(409).json({ field: "phone", error: "Contact already exists" });

        const newContact = new Contact({
            user: req.user._id,
            firstName,
            lastName,
            phone,
        });
        await newContact.save();

        res.status(201).json({message: "Contact created successfully"});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

export const updateContact = async (req, res) => {
    const {id} = req.params;
    const {firstName, lastName, phone} = req.body;

    try {
        const contact = await Contact.findOne({ _id: id, user: req.user._id });
        if (!contact) {
            return res.status(404).json({message: "Contact not found"});
        }

        if (firstName) contact.firstName = firstName;
        if (lastName)  contact.lastName  = lastName;

        if (phone && phone !== contact.phone) {
            const existingPhone = await Contact.findOne({ user: req.user._id, phone });
            if (existingPhone) {
                return res.status(409).json({ field: "phone", error: "Phone number already in use" });
            }
            contact.phone = phone;
        }

        const updatedContact = await contact.save();
        res.status(200).json({message: "Contact updated successfully", contact: updatedContact});

    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error updating contact", error: error.message});
    }
};

export const deleteContact = async (req, res) => {
    const {id} = req.params;

    try {
        const contact = await Contact.findOneAndDelete({ _id: id, user: req.user._id });
        if (!contact) {
            return res.status(404).json({message: "Contact not found"});
        }

        res.status(200).json({message: "Contact deleted successfully", contact});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error deleting contact", error: error.message});
    }
};
