
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Users, Calendar, TestTube } from "lucide-react";
import { useRealTimeAppointments } from '@/hooks/useRealTimeAppointments';
import { useEnhancedNotifications } from '@/hooks/useEnhancedNotifications';
import { useMedicationReminders } from '@/hooks/useMedicationReminders';
import { useProfile } from '@/hooks/useProfile';

export const RealTimeDashboard = () => {
  const { appointments } = useRealTimeAppointments();
  const { unreadCount } = useEnhancedNotifications();
  const { todayReminders } = useMedicationReminders();
  const { profile } = useProfile();

  const todayAppointments = appointments.filter(apt => {
    const today = new Date().toISOString().split('T')[0];
    return apt.appointment_date === today && apt.status === 'scheduled';
  });

  const overdueReminders = todayReminders.filter(reminder => {
    const now = new Date();
    return reminder.scheduledTime <= now && !reminder.taken;
  });

  const upcomingReminders = todayReminders.filter(reminder => {
    const now = new Date();
    return reminder.scheduledTime > now && !reminder.taken;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <Card className="health-card-hover">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
              <p className="text-3xl font-bold text-blue-600">{todayAppointments.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
          {todayAppointments.length > 0 && (
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                Next: {todayAppointments[0]?.appointment_time}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="health-card-hover">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Medication Reminders</p>
              <p className="text-3xl font-bold text-orange-600">{overdueReminders.length}</p>
            </div>
            <TestTube className="w-8 h-8 text-orange-600" />
          </div>
          <div className="mt-2 space-x-2">
            {overdueReminders.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {overdueReminders.length} Overdue
              </Badge>
            )}
            {upcomingReminders.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {upcomingReminders.length} Upcoming
              </Badge>
            )}
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
                {profile?.role === 'doctor' ? 'Active Patients' : 'Health Score'}
              </p>
              <p className="text-3xl font-bold text-green-600">
                {profile?.role === 'doctor' ? '12' : '85%'}
              </p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
          <div className="mt-2">
            <Badge variant="outline" className="text-xs text-green-600">
              {profile?.role === 'doctor' ? 'Active' : 'Good'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
