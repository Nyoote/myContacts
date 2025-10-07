import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div style={{ textAlign: "center", marginTop: 50 }}>
            <h1>HOME</h1>
            <Button variant="contained" color="secondary" onClick={handleLogout}>
                Se déconnecter
            </Button>
        </div>
    );
}
