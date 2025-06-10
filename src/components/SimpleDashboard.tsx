
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Users, Calendar, TestTube } from "lucide-react";
import { useSimpleNotifications } from '@/hooks/useSimpleNotifications';
import { useProfile } from '@/hooks/useProfile';

export const SimpleDashboard = () => {
  const { unreadCount, loading: notificationsLoading } = useSimpleNotifications();
  const { profile, loading: profileLoading } = useProfile();

  if (notificationsLoading || profileLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="health-card-hover animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <div className="flex items-center space-x-1 text-xs">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-green-600">Connected</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="health-card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-3xl font-bold text-blue-600">0</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                No appointments today
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="health-card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Medication Reminders</p>
                <p className="text-3xl font-bold text-orange-600">0</p>
              </div>
              <TestTube className="w-8 h-8 text-orange-600" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                All up to date
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="health-card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread Notifications</p>
                <p className="text-3xl font-bold text-purple-600">{unreadCount}</p>
              </div>
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
            {unreadCount > 0 && (
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} New
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="health-card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {profile?.role === 'doctor' ? 'Patients' : 'Health Score'}
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {profile?.role === 'doctor' ? '0' : '85%'}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs text-green-600">
                {profile?.role === 'doctor' ? 'No patients assigned' : 'Good'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
