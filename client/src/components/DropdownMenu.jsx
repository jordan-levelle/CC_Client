import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import '../styles/components/dropdown.css';

const DropdownMenu = ({ children, icon, positionClass }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div className={`dropdown-trigger ${positionClass}`} onClick={toggleDropdown} onBlur={closeDropdown} tabIndex="0">
      {icon && <FontAwesomeIcon icon={icon} className="dropdown-icon" />}
      <div className={`custom-dropdown-menu ${isOpen ? 'active' : ''}`}>
        {children}
      </div>
    </div>
  );
};

DropdownMenu.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.object,
  positionClass: PropTypes.string.isRequired,
};

export default DropdownMenu;
