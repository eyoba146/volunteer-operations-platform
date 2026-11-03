import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Role, PermissionModule, PermissionAction } from '../../types';
import { can } from '../../utils/permissions';
import { Skeleton } from '../ui';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
  requiredModule?: PermissionModule;
  requiredAction?: PermissionAction;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requiredModule,
  requiredAction,
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas p-6 flex items-center justify-center">
        <div className="max-w-md w-full space-y-4">
          <Skeleton variant="text" className="h-6 w-1/3" />
          <Skeleton variant="rect" className="h-32" />
          <Skeleton variant="text" className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredModule && !can(user, requiredModule, requiredAction || 'view')) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

