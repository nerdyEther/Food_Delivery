import React from 'react';
import Navbar from './Navbar';

const AppLayout = ({ children, handleLogout }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar handleLogout={handleLogout} />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;