
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavLinks = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'text-portal-900 font-semibold' : 'text-portal-600 hover:text-portal-900';
  };

  return (
    <div className="flex items-center space-x-6">
      <Link to="/data" className={`transition-colors ${isActive('/data')}`}>
        Data Tool
      </Link>
      <Link to="/search" className={`transition-colors ${isActive('/search')}`}>
        Search
      </Link>
      <Link to="/documents" className={`transition-colors ${isActive('/documents')}`}>
        Documents
      </Link>
      <Link to="/lawsuits" className={`transition-colors ${isActive('/lawsuits')}`}>
        Lawsuits
      </Link>
      <Link to="/ranking" className={`transition-colors ${isActive('/ranking')}`}>
        Rankings
      </Link>
      <Link to="/chat" className={`transition-colors ${isActive('/chat')}`}>
        AI Assistant
      </Link>
    </div>
  );
};

export default NavLinks;
