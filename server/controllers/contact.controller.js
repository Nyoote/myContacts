import Contact from "../models/contact.model.js";

export const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        console.error(error);
        res.status(404).json({message: "Error, cannot find contacts"});
    }
}

export const addContact = async (req, res) => {
    const {firstName, lastName, phone} = req.body;

    try {
        const existingContact = await Contact.findOne({phone});
        if (existingContact)
            return res.status(400).json({error: "Contact already exists"});

        const newContact = new Contact({firstName, lastName, phone});
        await newContact.save();

        res.status(201).json({message: "Contact created successfully"});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

export const updateContact = async (req, res) => {
    const {id} = req.params;
    const {firstName, lastName, phone} = req.body;

    try {
        const contact = await Contact.findById(id);
        if (!contact) {
            return res.status(404).json({message: "Contact not found"});
        }

        if (phone !== contact.phone) {
            const existingPhone = await Contact.findOne({phone});
            if (existingPhone) {
                return res.status(400).json({message: "Phone number already in use"});
            }
        }

        if (firstName) contact.firstName = firstName;
        if (lastName) contact.lastName = lastName;
        if (phone) contact.phone = phone;

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
        const contact = await Contact.findByIdAndDelete(id);

        if (!contact) {
            return res.status(404).json({message: "Contact not found"});
        }

        res.status(200).json({message: "Contact deleted successfully", contact});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error deleting contact", error: error.message});
    }
};
