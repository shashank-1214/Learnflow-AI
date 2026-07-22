import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { adminAuthService } from '@/services/admin.service';

/**
 * Protects all /admin/* routes.
 * Redirects to /admin/login if the admin JWT is absent.
 * Normal users who do NOT have an admin token will also be redirected.
 */
export default function AdminRoute() {
  const isAuthenticated = adminAuthService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
