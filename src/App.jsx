import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/home/Home";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Auth from "./pages/auth/Auth";
import Dashboard from "./pages/dashboard/Dashboard";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} /> // Home route
        <Route path="/auth" element={<Auth />} /> // Auth route
        <Route path="/dashboard" element={<Dashboard />} /> // Dashboard route
      </Routes>
      <Footer />
    </>
  );
}

export default App;
