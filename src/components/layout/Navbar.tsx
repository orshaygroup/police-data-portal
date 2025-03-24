
import React from 'react';
import { Link } from 'react-router-dom';
import NavLinks from './NavLinks';
import NavSearchBox from './NavSearchBox';

const Navbar = () => {
  return (
    <nav className="glass-panel fixed top-0 w-full z-50 px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-semibold text-portal-900 hover:text-portal-700 transition-colors">
          Police Data Portal
        </Link>
        
        <NavLinks />
        
        <NavSearchBox />
      </div>
    </nav>
  );
};

export default Navbar;
