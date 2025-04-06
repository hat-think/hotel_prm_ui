import { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { FaEllipsisV } from "react-icons/fa";
import { ApiCaller } from "../utilities/network";

const stats = [
  {
    title: "Arrivals",
    count: 0,
    subtitle: "Including check-in",
    subcount: 0,
    color: "text-blue-600",
    borderColor: "border-blue-100",
  },
  {
    title: "Departures",
    count: 0,
    subtitle: "Including check-out",
    subcount: 0,
    color: "text-green-600",
    borderColor: "border-green-100",
  },
  {
    title: "At the property",
    count: 0,
    subtitle: "Adults: 0 · Children",
    subcount: 0,
    color: "text-orange-500",
    borderColor: "border-orange-100",
  },
  {
    title: "Reservations",
    count: 0,
    subtitle: "Awaiting deposit",
    subcount: 0,
    color: "text-red-500",
    borderColor: "border-red-100",
  },
];

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);

  useEffect(() => {
    const res = ApiCaller.get(`/getdashboard-data`);

    console.log(res, "res");
    setDashboardData(res?.data?.result);
  }, []);

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Sales Dashboard</h1>
        <p className="text-gray-600">
          Welcome to your dashboard. Check your stats below.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, index) => (
            <div
              key={index}
              className={`bg-white border ${item.borderColor} rounded-lg p-6 shadow-sm relative`}
            >
              <div className="text-gray-600 text-sm font-medium mb-2">
                {item.title}
              </div>
              <div className={`text-5xl font-semibold ${item.color}`}>
                {item.count}
              </div>
              <div className={`mt-2 ${item.color} font-medium`}>
                {item.title}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {item.subtitle}:{" "}
                <span className="font-semibold text-gray-800">
                  {item.subcount}
                </span>
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
