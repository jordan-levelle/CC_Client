import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';

const Header = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest('.nav-menu')) {
        setMenuOpen(false);
      }
    };

    document.body.addEventListener('click', handleClickOutside);
    return () => {
      document.body.removeEventListener('click', handleClickOutside);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
  };

  const toggleMenu = (event) => {
    event.stopPropagation(); // Prevent event propagation
    setMenuOpen((prevMenuOpen) => !prevMenuOpen);
  };
  
  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <nav className="navbar">
        <Link to="/" className="logo-link">
          <h1 className="logo">
            <span className="logo-text">Consensus Check</span>
          </h1>
        </Link>
        <button className="hamburger" onClick={toggleMenu}>
          <span className="hamburger-icon">&#9776;</span>
        </button>
        <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/" className="nav-link" onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/create" className="nav-link" onClick={closeMenu}>
              Create Proposal
            </Link>
          </li>
          <li>
            <Link to="/basics" className="nav-link" onClick={closeMenu}>
              Consensus Basics
            </Link>
          </li>
          <li>
            <Link to="/teams" className="nav-link" onClick={closeMenu}>
              {user ? 'Upgrade' : 'Pricing'}
            </Link>
          </li>
          <li className="dropdown">
            {user ? (
              <>
                <Link to="/profile" className="dropbtn" onClick={closeMenu}>
                  Profile
                </Link>
                <div className="dropdown-content">
                  <Link to="/profile" onClick={closeMenu}>Proposals</Link>
                  <Link to="/settings" onClick={closeMenu}>Settings</Link>
                  <span className="logout-link" onClick={handleLogout}>Logout</span>
                </div>
              </>
            ) : (
              <Link to="/auth" className="dropbtn" onClick={closeMenu}>
                Login
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;




