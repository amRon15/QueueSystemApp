import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import PrivateRoute from "./Components/privateRoute";
import Home from "./pages/Customer/Home";
import Dashboard from "./pages/Staff/Dashboard";
import StaffLogin from "./pages/Staff/StaffLogin";
import "./App.css";

export default function App() {
  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<StaffLogin />} />

          <Route path="/staff" element={<PrivateRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
