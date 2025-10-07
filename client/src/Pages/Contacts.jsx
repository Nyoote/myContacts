import {useEffect, useState} from "react";
import {
    Container, Typography, Button, Table, TableHead, TableRow, TableCell,
    TableBody, Paper, IconButton, Alert, Stack, Tooltip
} from "@mui/material";
import {Edit, Delete, Add} from "@mui/icons-material";
import {deleteContact, fetchContacts} from "../Api/contacts";
import SnackbarAlert from "../Components/SnackbarAlert.jsx";
import AddContactDialog from "../Components/AddContactDialog.jsx";
import ConfirmDeleteDialog from "../Components/ConfirmDeleteDialog.jsx";
import EditContactDialog from "../Components/EditContactDialog.jsx";

export default function Contacts() {
    const [contacts, setContacts] = useState([]);
    const [error, setError] = useState("");
    const [openAdd, setOpenAdd] = useState(false);
    const [snack, setSnack] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [editContact, setEditContact] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);

    const loadContacts = async () => {
        setError("");
        try {
            const data = await fetchContacts();
            setContacts(data);
        } catch (e) {
            setError(e?.response?.data?.message || "Unable to load contacts");
        }
    };

    useEffect(() => {
        loadContacts();
    }, []);

    const handleAdded = async () => {
        await loadContacts();
        setSnack({message: "Contact added successfully", severity: "success"});
    };

    const openEditDialog = (contact) => {
        setEditContact(contact);
        setOpenEdit(true);
    };
    const handleEdited = async () => {
        await loadContacts();
        setSnack({message: "Contact updated successfully", severity: "success"});
    };

    const askDelete = (contact) => {
        setSelectedContact(contact);
        setOpenDelete(true);
    };

    const confirmDelete = async () => {
        if (!selectedContact) return;
        try {
            await deleteContact(selectedContact._id);
            setOpenDelete(false);
            setSelectedContact(null);
            await loadContacts();
            setSnack({message: "Contact deleted successfully", severity: "success"});
        } catch (e) {
            setOpenDelete(false);
            setSelectedContact(null);
            setSnack({
                message: e?.response?.data?.message || "Error while deleting contact",
                severity: "error",
            });
        }
    };

    return (
        <Container maxWidth="md" sx={{mt: 4, mb: 6}}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{mb: 2}}>
                <Typography variant="h5">My contacts</Typography>
                <Button variant="contained" startIcon={<Add/>} onClick={() => setOpenAdd(true)}>
                    Add contact
                </Button>
            </Stack>

            {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}

            <Paper variant="outlined">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>First name</TableCell>
                            <TableCell>Last name</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contacts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <Alert severity="info">No contacts yet</Alert>
                                </TableCell>
                            </TableRow>
                        ) : (
                            contacts.map((c) => (
                                <TableRow key={c._id} hover>
                                    <TableCell>{c.firstName}</TableCell>
                                    <TableCell>{c.lastName}</TableCell>
                                    <TableCell>{c.phone}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Edit">
                                            <span>
                                                <IconButton size="small" onClick={() => openEditDialog(c)}>
                                                    <Edit fontSize="small"/>
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <span>
                                            <IconButton size="small" color="error" onClick={() => askDelete(c)}>
                                              <Delete fontSize="small"/>
                                            </IconButton>
                                          </span>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Paper>

            <AddContactDialog
                open={openAdd}
                onClose={() => setOpenAdd(false)}
                onSuccess={handleAdded}
            />

            <EditContactDialog
                open={openEdit}
                onClose={() => {
                    setOpenEdit(false);
                    setEditContact(null);
                }}
                onSuccess={handleEdited}
                contact={editContact}
            />

            <ConfirmDeleteDialog
                open={openDelete}
                onClose={() => {
                    setOpenDelete(false);
                    setSelectedContact(null);
                }}
                onConfirm={confirmDelete}
                contact={selectedContact}
            />

            <SnackbarAlert
                open={!!snack}
                onClose={() => setSnack(null)}
                message={snack?.message}
                severity={snack?.severity || "success"}
            />
        </Container>
    );
}
