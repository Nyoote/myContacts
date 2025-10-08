import { Navigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuthentification";

export default function FallbackRedirect() {
    const { isAuthenticated } = useAuth();
    return <Navigate to={isAuthenticated ? "/contacts" : "/login"} replace />;
}
