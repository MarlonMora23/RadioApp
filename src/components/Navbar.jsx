import { Link, useLocation } from "react-router-dom";
import { Radio, Search } from "lucide-react";
import "../styles/Navbar.css";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <Radio className="icon" />
          </div>
          <span className="logo-text">RadioApp</span>
        </Link>

        <div className="navbar-links">
          <Link
            to="/"
            className={`nav-link ${isActive("/") ? "active" : ""}`}
          >
            <Radio className="icon" />
            <span>Inicio</span>
          </Link>

          <Link
            to="/search"
            className={`nav-link ${isActive("/search") ? "active" : ""}`}
          >
            <Search className="icon" />
            <span>Buscar</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}