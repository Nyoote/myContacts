import './App.css'
import {Route, Routes} from "react-router-dom";
import Register from "./Pages/Register.jsx";
import Login from "./Pages/Login.jsx";
import NavBar from "./Components/NavBar.jsx";

const App = () => {
  return (
      <>
        <NavBar />
      <Routes>
        <Route path="/" element={<h1>HOME</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      </>
  )
}

export default App
