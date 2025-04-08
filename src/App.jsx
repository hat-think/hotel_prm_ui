import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddRoom from "./pages/Room/AddRoom";
import ViewRoom from "./pages/Room/ViewRoom";
import ProfilePage from "./pages/ProfilePage";
import PrivateRoute from "./utilities/PrivateRoute"; // Import it

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/room/add-room"
          element={
            <PrivateRoute>
              <AddRoom />
            </PrivateRoute>
          }
        />
        <Route
          path="/room/room-view"
          element={
            <PrivateRoute>
              <ViewRoom />
            </PrivateRoute>
          }
        />
        <Route
          path="/ProfilePage"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
