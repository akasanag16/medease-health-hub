
import React from 'react';
import { Button } from "@/components/ui/button";
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

export const UserHeader = () => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();

  const handleSignOut = async () => {
    await signOut();
  };

  const displayName = profile?.first_name 
    ? `${profile.first_name}${profile.last_name ? ` ${profile.last_name}` : ''}`
    : user?.email?.split('@')[0] || 'User';

  return (
    <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Welcome back, {displayName}!</h2>
          <p className="text-sm text-gray-600">{user?.email}</p>
        </div>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleSignOut}
        className="flex items-center space-x-2"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out</span>
      </Button>
    </div>
  );
};
