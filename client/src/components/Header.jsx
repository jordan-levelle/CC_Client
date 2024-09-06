import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCaretDown } from '@fortawesome/free-solid-svg-icons';
import '../styles/components/header.css';

const Header = () => {
  const { logout } = useLogout();
  const { user, isSubscribed } = useAuthContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest('.nav-menu') && !event.target.closest('.dropdown')) {
        setMenuOpen(false);
      }
      if (dropdownOpen && !event.target.closest('.dropdown')) {
        setDropdownOpen(false);
      }
    };

    document.body.addEventListener('click', handleClickOutside);
    return () => {
      document.body.removeEventListener('click', handleClickOutside);
    };
  }, [menuOpen, dropdownOpen]);

  const handleLogout = () => {
    logout();
  };

  const toggleMenu = (event) => {
    event.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  const toggleDropdown = (event) => {
    event.stopPropagation();
    setDropdownOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <header className="header">
      <nav className="navbar">
        <Link to="/" className="logo-link">
          <h1 className="logo">
            Consensus Check
            <span className="beta">(beta)</span>
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
            <Link to="/subscriptions" className="nav-link" onClick={closeMenu}>
              {user ? 'Upgrade' : 'Pricing'}
            </Link>
          </li>
          <li className="dropdown">
            {user ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Link
                    to="/profile"
                    className="nav-link"
                    onClick={closeMenu}
                    style={{ textDecoration: 'none', color: 'var(--text-color)', marginLeft: '6px', padding: '10px', display: 'inline-flex', alignItems: 'center' }}
                  >
                    Profile
                  </Link>
                  <FontAwesomeIcon
                    icon={faSquareCaretDown}
                    className="dropdown-icon"
                    onClick={toggleDropdown}
                    style={{ cursor: 'pointer', fontSize: '16px', marginLeft: '8px' }}
                  />
                </div>
                <div className={`dropdown-content ${dropdownOpen ? 'active' : ''}`}>
                  <Link to="/profile" onClick={closeDropdown}>
                    Proposals
                  </Link>
                  {isSubscribed && (
                    <Link to="/teams" onClick={closeDropdown}>
                      Teams
                    </Link>
                  )}
                  <Link to="/settings" onClick={closeDropdown}>
                    Settings
                  </Link>
                  <span className="logout-link" onClick={handleLogout}>
                    Logout
                  </span>
                </div>
              </div>
            ) : (
              <Link to="/auth" className="nav-link" onClick={closeMenu}>
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


