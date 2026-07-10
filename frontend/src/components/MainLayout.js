import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = ({ children, hideFooter = false }) => (
  <div className="d-flex flex-column min-vh-100">
    <Navbar />
    <main className="flex-grow-1">{children}</main>
    {!hideFooter && <Footer />}
  </div>
);

export default MainLayout;
