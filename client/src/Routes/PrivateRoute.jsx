import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuthentification.js";

export default function PrivateRoute() {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Outlet /> : <Navigate to="/register" replace />;
}
