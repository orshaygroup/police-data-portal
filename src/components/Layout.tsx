
import React from 'react';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-portal-50">
      <Navbar />
      <main className="pt-24 pb-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
