import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuthentification.js";

export default function PublicRoute() {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Navigate to="/contacts" replace /> : <Outlet />;
}
