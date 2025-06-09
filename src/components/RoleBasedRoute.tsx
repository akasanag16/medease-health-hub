
import React from 'react';
import { useProfile } from '@/hooks/useProfile';
import { Card, CardContent } from "@/components/ui/card";

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: ('patient' | 'doctor')[];
  fallback?: React.ReactNode;
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ 
  children, 
  allowedRoles, 
  fallback 
}) => {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (!profile?.role || !allowedRoles.includes(profile.role)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
            <p className="text-gray-600">
              You don't have permission to access this section.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};
