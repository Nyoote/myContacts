import {useState} from "react";
import {
    Dialog, DialogTitle, DialogContent, Stack,
    TextField, Button, Alert
} from "@mui/material";
import {createContact} from "../Api/contacts";

export default function AddContactDialog({open, onClose, onSuccess}) {
    const [formData, setFormData] = useState({firstName: "", lastName: "", phone: ""});
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const phoneRegex = /^[0-9]+$/;

    const handleChange = (e) => {
        setFormData((p) => ({...p, [e.target.name]: e.target.value}));
        setErrors((p) => ({...p, [e.target.name]: ""}));
        setServerError("");
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = "First name required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name required";
        if (!formData.phone.trim()) newErrors.phone = "Phone required";
        else if (formData.phone.length < 10 || formData.phone.length > 20)
            newErrors.phone = "Phone must be 10–20 characters";
        else if (!phoneRegex.test(formData.phone))
            newErrors.phone = "Phone must be numbers only";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const reset = () => {
        setFormData({firstName: "", lastName: "", phone: ""});
        setErrors({});
        setServerError("");
    };

    const handleClose = () => {
        if (!submitting) {
            reset();
            onClose?.();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");

        if (!validate()) return;

        setSubmitting(true);
        try {
            await createContact(formData);
            reset();
            onSuccess?.();
            onClose?.();
        } catch (err) {
            const data = err?.response?.data;
            if (!data) {
                setServerError("Network error, cannot connect to the server");
            } else if (data.field && data.error) {
                setErrors((p) => ({...p, [data.field]: data.error}));
            } else {
                const msg = data.error || data.message || "Error, cannot add contact";
                setServerError(msg);
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Add a contact</DialogTitle>
            <DialogContent>
                <Stack component="form" autoComplete="off" noValidate onSubmit={handleSubmit} sx={{mt: 1, gap: 2}}>
                    {serverError && <Alert severity="error" aria-live="polite">{serverError}</Alert>}

                    <TextField
                        label="First name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                        required
                        fullWidth
                    />

                    <TextField
                        label="Last name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                        required
                        fullWidth
                    />

                    <TextField
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        error={!!errors.phone}
                        helperText={errors.phone}
                        required
                        fullWidth
                        inputProps={{minLength: 10, maxLength: 20, pattern: phoneRegex}}
                    />

                    <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{mt: 1, mb: 1}}>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" variant="contained">
                            Add
                        </Button>
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}
