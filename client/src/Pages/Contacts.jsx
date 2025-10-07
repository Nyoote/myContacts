import {Alert, Button, Container, List, ListItem, ListItemText, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {fetchContacts} from "../Api/contacts.js";

export default function Contacts() {
    const [contacts, setContacts] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchContacts();
                setContacts(data);
            } catch (e) {
                setError(e?.response?.data?.message || "Unable to load contacts");
            }
        })();
    }, []);

    return (
        <>
            <Container sx={{mt: 4}}>
                <Typography variant="h5" gutterBottom>Mes contacts</Typography>
                {error && <Alert severity="error">{error}</Alert>}
                {!error && contacts.length === 0 && <Alert severity="info">Aucun contact</Alert>}

                <List>
                    {contacts.map((c) => (
                        <ListItem key={c._id} divider>
                            <ListItemText
                                primary={`${c.firstName} ${c.lastName}`}
                                secondary={c.phone}
                            />
                        </ListItem>
                    ))}
                </List>
            </Container>
            <div style={{textAlign: "center", marginTop: 50}}>
                <h1>HOME</h1>
                <Button variant="contained" color="secondary" onClick={handleLogout}>
                    Se déconnecter
                </Button>
            </div>
        </>
    );
}
