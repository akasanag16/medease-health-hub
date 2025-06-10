
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, FileText, Activity, Stethoscope, ClipboardList, TrendingUp, AlertCircle } from "lucide-react";
import { usePatientAssignments } from '@/hooks/usePatientAssignments';
import { useSimpleNotifications } from '@/hooks/useSimpleNotifications';
import { useProfile } from '@/hooks/useProfile';
import { DoctorDashboard } from './DoctorDashboard';

export const DoctorDashboardView = () => {
  const { assignments, loading: assignmentsLoading } = usePatientAssignments();
  const { unreadCount, loading: notificationsLoading } = useSimpleNotifications();
  const { profile, loading: profileLoading } = useProfile();

  if (assignmentsLoading || notificationsLoading || profileLoading) {
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

  const activePatients = assignments.filter(assignment => assignment.is_active).length;

  return (
    <div className="space-y-6">
      {/* Doctor Header with Medical Theme */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-blue-800">Doctor Portal</h2>
          <p className="text-blue-600">Welcome back, Dr. {profile?.first_name} {profile?.last_name}</p>
          <p className="text-sm text-gray-500 mt-1">Providing excellent patient care</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-600">Online</span>
          </div>
          <div className="p-2 bg-blue-100 rounded-lg">
            <Stethoscope className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Doctor-specific KPI cards with medical color scheme */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="health-card-hover bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Active Patients</p>
                <p className="text-3xl font-bold text-blue-800">{activePatients}</p>
                <p className="text-xs text-blue-600 mt-1">Under your care</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-xl">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="mt-3">
              <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                {activePatients === 0 ? 'No patients assigned' : `${activePatients} assigned`}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="health-card-hover bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Today's Consultations</p>
                <p className="text-3xl font-bold text-green-800">0</p>
                <p className="text-xs text-green-600 mt-1">Scheduled appointments</p>
              </div>
              <div className="p-3 bg-green-500 rounded-xl">
                <Calendar className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="mt-3">
              <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                No consultations today
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="health-card-hover bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Pending Reviews</p>
                <p className="text-3xl font-bold text-purple-800">0</p>
                <p className="text-xs text-purple-600 mt-1">Lab results & reports</p>
              </div>
              <div className="p-3 bg-purple-500 rounded-xl">
                <ClipboardList className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="mt-3">
              <Badge variant="outline" className="text-xs border-purple-300 text-purple-700">
                All caught up
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="health-card-hover bg-gradient-to-br from-orange-50 to-orange-100 border-l-4 border-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Medical Alerts</p>
                <p className="text-3xl font-bold text-orange-800">{unreadCount}</p>
                <p className="text-xs text-orange-600 mt-1">Requiring attention</p>
              </div>
              <div className="p-3 bg-orange-500 rounded-xl">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            {unreadCount > 0 && (
              <div className="mt-3">
                <Badge variant="secondary" className="text-xs bg-orange-200 text-orange-800">
                  {unreadCount} New Alerts
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Doctor's specialization info */}
      {profile?.specialization && (
        <Card className="health-card-hover border-l-4 border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Stethoscope className="w-5 h-5 text-blue-600" />
              <span className="text-blue-800">Medical Specialization</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
              <div className="p-3 bg-blue-500 rounded-lg">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-blue-800">{profile.specialization}</p>
                {profile.license_number && (
                  <p className="text-sm text-blue-600">License: {profile.license_number}</p>
                )}
                {profile.bio && (
                  <p className="text-sm text-gray-600 mt-1">{profile.bio}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions for Doctors */}
      <Card className="health-card-hover border-l-4 border-green-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-green-800">Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors">
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-blue-600" />
                <span className="font-medium text-blue-800">Schedule Appointment</span>
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg hover:bg-green-100 cursor-pointer transition-colors">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-green-600" />
                <span className="font-medium text-green-800">Review Lab Results</span>
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 cursor-pointer transition-colors">
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-purple-600" />
                <span className="font-medium text-purple-800">Patient Management</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient management section */}
      <DoctorDashboard />
    </div>
  );
};
