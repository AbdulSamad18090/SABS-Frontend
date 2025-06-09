import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/home/Home";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} /> // Home route
      </Routes>
      <Footer />
    </>
  );
}

export default App;
