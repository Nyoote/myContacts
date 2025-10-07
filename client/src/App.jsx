import './App.css'
import {Navigate, Route, Routes} from "react-router-dom";
import Register from "./Pages/Register.jsx";
import Login from "./Pages/Login.jsx";
import Home from "./Pages/Home.jsx";
import NavBar from "./Components/NavBar.jsx";
import PublicRoute from "./Routes/PublicRoute.jsx";
import PrivateRoute from "./Routes/PrivateRoute.jsx";

const App = () => {
    return (
        <>
            <NavBar/>
            <Routes>
                <Route element={<PublicRoute />}>
                    <Route path="/register" element={<Register />}/>
                    <Route path="/login" element={<Login />}/>
                    <Route path="/" element={<Navigate to="/register" replace/>}/>
                </Route>

                <Route element={<PrivateRoute />}>
                    <Route path="/home" element={<Home />}/>
                </Route>
            </Routes>
        </>
    )
}

export default App
