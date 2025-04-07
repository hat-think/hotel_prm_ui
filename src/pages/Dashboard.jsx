import { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { FaEllipsisV } from "react-icons/fa";
import { getdashboard } from "../components/auth/api";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalVisitors: 0,
    currentVisitors: 0,
    totalRooms: 0,
    availableRooms: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getdashboard();
        if (response.status === 1) {
          setDashboardData(response.result);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: "Arrivals",
      count: dashboardData.totalVisitors,
      subtitle: "Including check-in",
      subcount: dashboardData.totalVisitors - dashboardData.currentVisitors,
      color: "text-blue-600",
      borderColor: "border-blue-100",
    },
    {
      title: "Departures",
      count: dashboardData.totalVisitors - dashboardData.currentVisitors,
      subtitle: "Including check-out",
      subcount: 0,
      color: "text-green-600",
      borderColor: "border-green-100",
    },
    {
      title: "At the property",
      count: dashboardData.currentVisitors,
      subtitle: `Adults: ${dashboardData.currentVisitors} · Children`,
      subcount: 0,
      color: "text-orange-500",
      borderColor: "border-orange-100",
    },
    {
      title: "Reservations",
      count: dashboardData.totalRooms,
      subtitle: "Awaiting deposit",
      subcount: dashboardData.totalRooms - dashboardData.availableRooms,
      color: "text-red-500",
      borderColor: "border-red-100",
    },
  ];

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Sales Dashboard</h1>
        <p className="text-gray-600">Welcome to your dashboard. Check your stats below.</p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, index) => (
            <div
              key={index}
              className={`bg-white border ${item.borderColor} rounded-lg p-6 shadow-sm relative`}
            >
              <div className="text-gray-600 text-sm font-medium mb-2">{item.title}</div>
              <div className={`text-5xl font-semibold ${item.color}`}>{item.count}</div>
              <div className={`mt-2 ${item.color} font-medium`}>{item.title}</div>
              <div className="text-sm text-gray-500 mt-1">
                {item.subtitle}:{" "}
                <span className="font-semibold text-gray-800">{item.subcount}</span>
              </div>
              <div className="absolute top-4 right-4 text-gray-400 cursor-pointer">
                <FaEllipsisV />
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;