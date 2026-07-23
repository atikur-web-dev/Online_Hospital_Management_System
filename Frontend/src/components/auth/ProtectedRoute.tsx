// src/components/auth/ProtectedRoute.tsx

import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Backend integration point: Check if user is authenticated
  const isAuthenticated = false; // Replace with actual auth check
  
  if (!isAuthenticated) {
    // Redirect to login page
    window.location.href = '/login';
    return null;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;