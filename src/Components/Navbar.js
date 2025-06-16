import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav">
        <NavLink to="/" className="nav-link">
          Customer
        </NavLink>
        <NavLink to="/staff" className="nav-link">
          Staff
        </NavLink>
      </div>
    </nav>
  );
}
