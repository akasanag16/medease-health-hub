
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Heart, Calendar, Pill, TestTube, FileText, TrendingUp, Shield } from "lucide-react";
import { useSimpleNotifications } from '@/hooks/useSimpleNotifications';
import { useProfile } from '@/hooks/useProfile';
import { DashboardOverview } from './DashboardOverview';

export const PatientDashboardView = () => {
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
    <div className="space-y-6">
      {/* Patient Header with Health Theme */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-green-800">Your Health Dashboard</h2>
          <p className="text-green-600">Welcome back, {profile?.first_name} {profile?.last_name}</p>
          <p className="text-sm text-gray-500 mt-1">Tracking your wellness journey</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-600">Connected</span>
          </div>
          <div className="p-2 bg-green-100 rounded-lg">
            <Heart className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Patient-specific health cards with wellness color scheme */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="health-card-hover bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Health Score</p>
                <p className="text-3xl font-bold text-green-800">85%</p>
                <p className="text-xs text-green-600 mt-1">Overall wellness</p>
              </div>
              <div className="p-3 bg-green-500 rounded-xl">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="mt-3">
              <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                Good Health
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="health-card-hover bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Next Appointment</p>
                <p className="text-lg font-bold text-blue-800">None</p>
                <p className="text-xs text-blue-600 mt-1">Upcoming visits</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-xl">
                <Calendar className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="mt-3">
              <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                Schedule checkup
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="health-card-hover bg-gradient-to-br from-orange-50 to-orange-100 border-l-4 border-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Active Medications</p>
                <p className="text-3xl font-bold text-orange-800">0</p>
                <p className="text-xs text-orange-600 mt-1">Current prescriptions</p>
              </div>
              <div className="p-3 bg-orange-500 rounded-xl">
                <Pill className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="mt-3">
              <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">
                No medications
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="health-card-hover bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Health Alerts</p>
                <p className="text-3xl font-bold text-purple-800">{unreadCount}</p>
                <p className="text-xs text-purple-600 mt-1">Important updates</p>
              </div>
              <div className="p-3 bg-purple-500 rounded-xl">
                <Activity className="w-8 h-8 text-white" />
              </div>
            </div>
            {unreadCount > 0 && (
              <div className="mt-3">
                <Badge variant="secondary" className="text-xs bg-purple-200 text-purple-800">
                  {unreadCount} New
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Health Summary for Patients */}
      <Card className="health-card-hover border-l-4 border-green-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-green-800">Health Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700">Last Checkup</p>
                  <p className="font-semibold text-green-800">No recent visit</p>
                </div>
                <TestTube className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">Vaccination Status</p>
                  <p className="font-semibold text-blue-800">Up to date</p>
                </div>
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700">Medical Records</p>
                  <p className="font-semibold text-purple-800">Available</p>
                </div>
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Health Actions for Patients */}
      <Card className="health-card-hover border-l-4 border-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800">Quick Health Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg hover:bg-green-100 cursor-pointer transition-colors">
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-green-600" />
                <span className="font-medium text-green-800">Book Appointment</span>
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors">
              <div className="flex items-center space-x-3">
                <Heart className="w-6 h-6 text-blue-600" />
                <span className="font-medium text-blue-800">Track Mood</span>
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 cursor-pointer transition-colors">
              <div className="flex items-center space-x-3">
                <TestTube className="w-6 h-6 text-purple-600" />
                <span className="font-medium text-purple-800">View Lab Results</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed patient overview */}
      <DashboardOverview />
    </div>
  );
};
