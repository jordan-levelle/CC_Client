import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import '../styles/components/dropdown.css';

const DropdownMenu = ({ children, icon, positionClass }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  // Close dropdown if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div 
      className={`dropdown-trigger ${positionClass}`} 
      onClick={toggleDropdown}
      tabIndex="0" 
      ref={dropdownRef}
    >
      {icon && <FontAwesomeIcon icon={icon} className="dropdown-icon" />}
      {isOpen && (
        <div className={`custom-dropdown-menu ${isOpen ? 'active' : ''}`}>
          {children}
        </div>
      )}
    </div>
  );
};

DropdownMenu.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.object,
  positionClass: PropTypes.string.isRequired,
};

export default DropdownMenu;
