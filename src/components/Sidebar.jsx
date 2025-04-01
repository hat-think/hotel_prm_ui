import React from 'react';
import { User, ShoppingCart, BarChart, TrendingUp } from 'lucide-react';

const Sidebar = ({ isExpanded }) => {
  return (
    <div className={`bg-gray-900 text-white h-screen p-4 ${isExpanded ? 'w-64' : 'w-20'} transition-all`}>
      <div className="flex items-center justify-between mb-6">
        <span className="text-xl font-bold">Xintra</span>
      </div>
      <nav>
        <ul className="space-y-2">
          <li className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-md whitespace-nowrap overflow-hidden text-ellipsis">
            <BarChart size={20} />
            {isExpanded && <span>Dashboard</span>}
          </li>
          <li className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-md whitespace-nowrap overflow-hidden text-ellipsis">
            <ShoppingCart size={20} />
            {isExpanded && <span>Ecommerce</span>}
          </li>
          <li className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-md whitespace-nowrap overflow-hidden text-ellipsis">
            <TrendingUp size={20} />
            {isExpanded && <span>Analytics</span>}
          </li>
          <li className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-md whitespace-nowrap overflow-hidden text-ellipsis">
            <User size={20} />
            {isExpanded && <span>CRM</span>}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
