import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddRoom from "./pages/Room/AddRoom";
import ViewRoom from "./pages/Room/ViewRoom";
import BookedRoom from "./pages/Room/BookedRoom";
import ProfilePage from "./pages/ProfilePage";
import BookRoom from "./pages/Room/BookRoom";
import GuestDetails from "./pages/Room/GuestDetails";
import PrivateRoute from "./utilities/PrivateRoute"; // Import it
import AllEmployee from "./pages/Hrms/AllEmployee";
import AttendanceTable from "./pages/Hrms/AttendanceTable";
import Calendar from "./pages/Calendar/Calendar";


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
          path="/room/Booked-Room"
          element={
            <PrivateRoute>
              <BookedRoom />
            </PrivateRoute>
          }
        />
        <Route
          path="/room/Book-Room"
          element={
            <PrivateRoute>
              <BookRoom />
            </PrivateRoute>
          }
        />
         <Route
          path="/room/guest-details"
          element={
            <PrivateRoute>
              <GuestDetails />
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
         <Route
          path="/hrms/allemployee"
          element={
            <PrivateRoute>
              <AllEmployee />
            </PrivateRoute>
          }
        />
        <Route
          path="/hrms/Attendance"
          element={
            <PrivateRoute>
              <AttendanceTable />
            </PrivateRoute>
          }
        />
        <Route
          path="/room/Calendar"
          element={
            <PrivateRoute>
              <Calendar />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
