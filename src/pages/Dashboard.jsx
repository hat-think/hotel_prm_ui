import MainLayout from "../components/layout/MainLayout";

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Sales Dashboard</h1>
        <p className="text-gray-600">
          Welcome to your dashboard. Check your stats below.
        </p>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
