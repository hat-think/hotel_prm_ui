import React from 'react';
import { Menu, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/ProfilePage'); // Make sure this route is defined in your router
  };
  return (
    <div className="bg-white shadow p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <input
          type="text"
          placeholder="Search..."
          className="p-2 rounded-md bg-gray-100 focus:outline-none"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Share</button>
        <button
      className="bg-gray-100 p-2 rounded-md"
      onClick={handleProfileClick}
    >
      <User size={20} />
    </button>
      </div>
    </div>
  );
};

export default Navbar;
