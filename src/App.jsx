import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/home/Home";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Auth from "./pages/auth/Auth";
import Dashboard from "./pages/dashboard/Dashboard";
import Doctors from "./pages/doctors/Doctors";
import Profile from "./pages/profile/Profile";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} /> // Home route
        <Route path="/auth" element={<Auth />} /> // Auth route
        <Route path="/dashboard" element={<Dashboard />} /> // Dashboard route
        <Route path="/doctors" element={<Doctors />} /> // Doctors route
        <Route path="/profile" element={<Profile/>} /> // Profile route
      </Routes>
      <Footer />
    </>
  );
}

export default App;
