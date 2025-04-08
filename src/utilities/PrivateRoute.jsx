import React, { createContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

// Create context
export const AuthContext = createContext();

const PrivateRoute = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true); // To avoid flicker

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    setCheckingAuth(false); // Done checking
  }, []);

  if (checkingAuth) return null; // Or a loading spinner

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export default PrivateRoute;
