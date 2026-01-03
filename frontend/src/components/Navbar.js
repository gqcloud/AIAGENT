import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileMenuOpen &&
        !event.target.closest(".navbar") &&
        !event.target.closest(".mobile-menu-overlay")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden"; // Prevent body scroll when menu is open
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  if (!user) {
    return null;
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand" onClick={handleLinkClick}>
            银行智能体
          </Link>
          <button
            className="hamburger-menu"
            onClick={handleMenuToggle}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
          <div className={`navbar-menu ${isMobileMenuOpen ? "mobile-open" : ""}`}>
            <Link to="/" className="navbar-link" onClick={handleLinkClick}>
              首页
            </Link>
            <Link to="/account" className="navbar-link" onClick={handleLinkClick}>
              账户
            </Link>
            <Link to="/transfer" className="navbar-link" onClick={handleLinkClick}>
              转账
            </Link>
            <Link to="/bills" className="navbar-link" onClick={handleLinkClick}>
              账单
            </Link>
            <Link to="/history" className="navbar-link" onClick={handleLinkClick}>
              交易历史
            </Link>
            <Link to="/ai-chat" className="navbar-link" onClick={handleLinkClick}>
              AI助手
            </Link>
            <span className="navbar-user">欢迎, {user.username}</span>
            <button onClick={handleLogout} className="btn btn-secondary">
              退出
            </button>
          </div>
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={handleMenuToggle}
          aria-hidden="true"
        ></div>
      )}
    </>
  );
}

export default Navbar;

