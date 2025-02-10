// AuthGuard.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  // Check if token exists in localStorage
  const token = localStorage.getItem('access_token');

  // If no token, redirect to the login page
  if (!token) {
    return <Navigate to='/login' />;
  }

  // Otherwise, allow access to the component
  return children;
};

export default AuthGuard;
