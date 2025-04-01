import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';

const App = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <Router>
      <div className="flex">
        <Sidebar isExpanded={isExpanded} />
        <div className="flex-1">
          <Navbar toggleSidebar={toggleSidebar} />
          <div className="p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              {/* Add more routes as needed */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
