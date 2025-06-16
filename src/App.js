import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Customer/Home";
import Dashboard from "./pages/Staff/Dashboard";
import Navbar from "./Components/Navbar";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/staff" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
