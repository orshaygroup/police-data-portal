
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-portal-900 text-white py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <p className="text-portal-200 text-sm">
              Dedicated to transparency and accountability in law enforcement through comprehensive data analysis and reporting.
              Every neighborhood deserves protection rooted in trust.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/data" className="text-portal-200 hover:text-white transition-colors text-sm">
                  Data Tool
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-portal-200 hover:text-white transition-colors text-sm">
                  Search Database
                </Link>
              </li>
              <li>
                <Link to="/lawsuits" className="text-portal-200 hover:text-white transition-colors text-sm">
                  Lawsuits Database
                </Link>
              </li>
              <li>
                <Link to="/documents" className="text-portal-200 hover:text-white transition-colors text-sm">
                  Document Repository
                </Link>
              </li>
              <li>
                <Link to="/ranking" className="text-portal-200 hover:text-white transition-colors text-sm">
                  Officer Rankings
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-portal-200 text-sm">
              For inquiries and support, please email: <br />
              <a href="mailto:support@nopddataportal.org" className="hover:text-white transition-colors">
                support@nopddataportal.org
              </a>
            </p>
            <p className="text-portal-200 text-sm mt-4">
              New Orleans Independent Police Monitor<br />
              In partnership with NOPD
            </p>
          </div>
        </div>
        <div className="border-t border-portal-700 mt-8 pt-6 text-center text-portal-300 text-sm">
          © {new Date().getFullYear()} New Orleans Police Data Portal. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
