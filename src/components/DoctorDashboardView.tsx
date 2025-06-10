
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, FileText, Activity, Stethoscope, ClipboardList } from "lucide-react";
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Doctor Dashboard</h2>
          <p className="text-gray-600">Welcome back, Dr. {profile?.first_name} {profile?.last_name}</p>
        </div>
        <div className="flex items-center space-x-1 text-xs">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-green-600">Online</span>
        </div>
      </div>

      {/* Doctor-specific dashboard cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="health-card-hover bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Patients</p>
                <p className="text-3xl font-bold text-blue-600">{activePatients}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                {activePatients === 0 ? 'No patients assigned' : `${activePatients} assigned`}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="health-card-hover bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-3xl font-bold text-green-600">0</p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                No appointments today
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="health-card-hover bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                <p className="text-3xl font-bold text-purple-600">0</p>
              </div>
              <ClipboardList className="w-8 h-8 text-purple-600" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                All caught up
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="health-card-hover bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Notifications</p>
                <p className="text-3xl font-bold text-orange-600">{unreadCount}</p>
              </div>
              <Activity className="w-8 h-8 text-orange-600" />
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
      </div>

      {/* Specialization info */}
      {profile?.specialization && (
        <Card className="health-card-hover">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Stethoscope className="w-5 h-5 text-blue-600" />
              <span>Specialization</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-3 bg-blue-500 rounded-lg">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-800">{profile.specialization}</p>
                {profile.license_number && (
                  <p className="text-sm text-gray-600">License: {profile.license_number}</p>
                )}
                {profile.bio && (
                  <p className="text-sm text-gray-600 mt-1">{profile.bio}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Patient management section */}
      <DoctorDashboard />
    </div>
  );
};
