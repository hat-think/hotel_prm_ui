import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const SIDEBAR_WIDTH = "w-64"; // Tailwind width class

const MainLayout = ({ children }) => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSideMenuOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      {/* Sidebar (Fixed) */}
      <div
        className={`${SIDEBAR_WIDTH} fixed top-0 left-0 h-screen bg-white shadow-md z-30 transition-transform duration-300 ${
          isSideMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar isSideMenuOpen={isSideMenuOpen} />
      </div>

      {/* Main Content Area */}
      <div
        className={`ml-0 transition-all duration-300 ${
          isSideMenuOpen ? "ml-64" : "ml-0"
        }`}
      >
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="p-6 min-h-screen bg-gray-50">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
