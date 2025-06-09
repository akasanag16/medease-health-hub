
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Users, Calendar, TestTube, Wifi, WifiOff } from "lucide-react";
import { useRealTimeManager } from '@/hooks/useRealTimeManager';
import { useProfile } from '@/hooks/useProfile';

export const RealTimeDashboard = () => {
  const { stats, connectionStatus, loading } = useRealTimeManager();
  const { profile } = useProfile();

  if (loading) {
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

  const ConnectionIndicator = () => (
    <div className="flex items-center space-x-1 text-xs">
      {connectionStatus === 'connected' ? (
        <>
          <Wifi className="w-3 h-3 text-green-500" />
          <span className="text-green-600">Live</span>
        </>
      ) : connectionStatus === 'connecting' ? (
        <>
          <Wifi className="w-3 h-3 text-yellow-500" />
          <span className="text-yellow-600">Connecting</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3 text-red-500" />
          <span className="text-red-600">Offline</span>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Live Dashboard</h2>
        <ConnectionIndicator />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="health-card-hover relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-3xl font-bold text-blue-600">{stats.todayAppointments}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            {stats.todayAppointments > 0 && (
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">
                  {stats.todayAppointments} scheduled
                </Badge>
              </div>
            )}
            {connectionStatus === 'connected' && (
              <div className="absolute top-2 right-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="health-card-hover relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Medication Reminders</p>
                <p className="text-3xl font-bold text-orange-600">{stats.overdueReminders}</p>
              </div>
              <TestTube className="w-8 h-8 text-orange-600" />
            </div>
            <div className="mt-2 space-x-2">
              {stats.overdueReminders > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {stats.overdueReminders} Overdue
                </Badge>
              )}
            </div>
            {connectionStatus === 'connected' && (
              <div className="absolute top-2 right-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="health-card-hover relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread Notifications</p>
                <p className="text-3xl font-bold text-purple-600">{stats.unreadNotifications}</p>
              </div>
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
            {stats.unreadNotifications > 0 && (
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs">
                  {stats.unreadNotifications} New
                </Badge>
              </div>
            )}
            {connectionStatus === 'connected' && (
              <div className="absolute top-2 right-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="health-card-hover relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {profile?.role === 'doctor' ? 'Pending Lab Results' : 'Health Score'}
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {profile?.role === 'doctor' ? stats.pendingLabResults : '85%'}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs text-green-600">
                {profile?.role === 'doctor' ? 
                  (stats.pendingLabResults > 0 ? 'Needs Review' : 'Up to Date') : 
                  'Good'
                }
              </Badge>
            </div>
            {connectionStatus === 'connected' && (
              <div className="absolute top-2 right-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {connectionStatus === 'disconnected' && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-red-700">
              <WifiOff className="w-4 h-4" />
              <p className="text-sm font-medium">
                Real-time updates are currently unavailable. Data may not be up to date.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
