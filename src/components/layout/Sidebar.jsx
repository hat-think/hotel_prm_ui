import React, { useState, useEffect } from "react";
import {
  BarChart,
  ShoppingCart,
  TrendingUp,
  User,
  ChevronDown,
  ChevronUp,
  Package,
  Receipt,
  Users,
  Contact,
  LogOut,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";

// Menu config
const menuItems = [
  {
    label: "Dashboard",
    icon: BarChart,
    route: "/dashboard",
  },
  {
    label: "Room",
    icon: ShoppingCart,
    children: [
      { label: "Add Room", route: "/room/add-room", icon: Package },
      { label: "Book Room", route: "/room/book-room", icon: Receipt },
      { label: "View Room", route: "/room/room-view", icon: Receipt },
      { label: "Booked Room", route: "/room/Booked-Room", icon: Receipt },

    ],
  },
  {
    label: "Analytics",
    icon: TrendingUp,
    route: "/analytics",
  },
  {
    label: "CRM",
    icon: User,
    children: [
      { label: "Customers", route: "/crm/customers", icon: Users },
      { label: "Leads", route: "/crm/leads", icon: Contact },
    ],
  },
];

const Sidebar = ({ isSideMenuOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedParent, setExpandedParent] = useState("");
  const [hoveredParent, setHoveredParent] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const current = menuItems.find((item) => {
      if (item.route && location.pathname.startsWith(item.route)) return true;
      return item.children?.some((child) =>
        location.pathname.startsWith(child.route)
      );
    });

    if (current) {
      setExpandedParent(current.label);
    }
  }, [location.pathname]);

  const toggleExpand = (label) => {
    setExpandedParent((prev) => (prev === label ? "" : label));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div
      className={clsx(
        "bg-gray-900 text-white h-screen p-4 transition-all duration-300 ease-in-out relative z-30",
        isSideMenuOpen ? "w-64" : "w-20"
      )}
      style={{ overflowX: "visible", overflowY: "auto" }}
    >
      {/* Logo */}
      <div className="flex items-center justify-center mb-8">
        {isSideMenuOpen ? (
          <h1 className="text-2xl font-bold">Hotel CRM</h1>
        ) : (
          <div className="w-10 h-10 bg-blue-600 rounded-full" />
        )}
      </div>

      <ul className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isDirectRouteActive =
            item.route && location.pathname.startsWith(item.route);
          const isChildActive = item.children?.some((child) =>
            location.pathname.startsWith(child.route)
          );
          const isActive = isDirectRouteActive || isChildActive;
          const isParentActive = expandedParent === item.label;

          return (
            <li
              key={item.label}
              className="relative group z-10"
              onMouseEnter={() =>
                !isSideMenuOpen && item.children && setHoveredParent(item.label)
              }
              onMouseLeave={() =>
                !isSideMenuOpen && item.children && setHoveredParent("")
              }
            >
              {/* Direct route items like Dashboard or Analytics */}
              {item.route ? (
                <NavLink
                  to={item.route}
                  className={({ isActive }) =>
                    clsx(
                      "w-full flex items-center justify-between p-3 rounded-md text-left hover:bg-gray-800 transition-colors duration-300",
                      (isActive || isActive) && "bg-gray-800"
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} />
                    {isSideMenuOpen && <span>{item.label}</span>}
                  </div>
                </NavLink>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    isSideMenuOpen && item.children && toggleExpand(item.label)
                  }
                  className={clsx(
                    "w-full flex items-center justify-between p-3 rounded-md text-left hover:bg-gray-800 transition-colors duration-300",
                    isActive && "bg-gray-800"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} />
                    {isSideMenuOpen && <span>{item.label}</span>}
                  </div>
                  {isSideMenuOpen &&
                    item.children &&
                    (isParentActive ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    ))}
                </button>
              )}

              {/* Dropdown - children */}
              {isSideMenuOpen && item.children && (
                <ul
                  className={clsx(
                    "overflow-hidden transition-all duration-300",
                    isParentActive
                      ? "ml-7 max-h-[500px] mt-2 space-y-1"
                      : "max-h-0"
                  )}
                >
                  {item.children.map((child) => {
                    const ChildIcon = child.icon;
                    return (
                      <li key={child.label}>
                        <NavLink
                          to={child.route}
                          className={({ isActive }) =>
                            clsx(
                              "flex items-center gap-3 p-2 rounded-md text-sm transition-colors duration-300",
                              isActive
                                ? "bg-blue-600 text-white"
                                : "hover:bg-gray-800 text-white"
                            )
                          }
                        >
                          <ChildIcon size={18} />
                          <span>{child.label}</span>
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* Hover dropdown for collapsed sidebar */}
              {!isSideMenuOpen &&
                item.children &&
                hoveredParent === item.label && (
                  <ul className="absolute left-full top-0 ml-2 w-52 bg-gray-800 p-2 rounded-md shadow-xl space-y-1 z-50 min-w-max animate-fade-in">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      return (
                        <li key={child.label}>
                          <NavLink
                            to={child.route}
                            className={({ isActive }) =>
                              clsx(
                                "flex items-center gap-3 p-2 rounded-md text-sm transition-colors duration-300 whitespace-nowrap",
                                isActive
                                  ? "bg-blue-600 text-white"
                                  : "hover:bg-gray-700 text-white"
                              )
                            }
                          >
                            <ChildIcon size={18} />
                            <span>{child.label}</span>
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                )}
            </li>
          );
        })}
      </ul>

      {/* Logout */}
      {isLoggedIn && (
        <div className="absolute bottom-4 w-full left-0 px-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-md text-sm bg-red-600 hover:bg-red-700 transition-colors duration-300 text-white"
          >
            <LogOut size={18} />
            {isSideMenuOpen && <span>Logout</span>}
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
