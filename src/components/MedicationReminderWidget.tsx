
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Pill, Check } from "lucide-react";
import { useMedicationReminders } from '@/hooks/useMedicationReminders';

export const MedicationReminderWidget = () => {
  const { todayReminders, loading, markMedicationTaken } = useMedicationReminders();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading reminders...</div>
        </CardContent>
      </Card>
    );
  }

  const upcomingReminders = todayReminders.filter(reminder => {
    const now = new Date();
    return reminder.scheduledTime > now && !reminder.taken;
  });

  const overdueReminders = todayReminders.filter(reminder => {
    const now = new Date();
    return reminder.scheduledTime <= now && !reminder.taken;
  });

  return (
    <Card className="health-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Pill className="w-5 h-5 text-blue-600" />
          <span>Today's Medications</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {overdueReminders.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-red-600">Overdue</h4>
            {overdueReminders.map((reminder, index) => (
              <div key={`${reminder.medicationId}-${index}`} className="border rounded-lg p-3 bg-red-50">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h5 className="font-medium text-gray-800">{reminder.medicationName}</h5>
                    <p className="text-sm text-gray-600">{reminder.dosage}</p>
                    <div className="flex items-center space-x-1 text-xs text-red-600">
                      <Clock className="w-3 h-3" />
                      <span>{reminder.scheduledTime.toLocaleTimeString()}</span>
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => markMedicationTaken(reminder.medicationId, reminder.scheduledTime)}
                    className="health-gradient text-white"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Take Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {upcomingReminders.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-blue-600">Upcoming</h4>
            {upcomingReminders.slice(0, 3).map((reminder, index) => (
              <div key={`${reminder.medicationId}-${index}`} className="border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h5 className="font-medium text-gray-800">{reminder.medicationName}</h5>
                    <p className="text-sm text-gray-600">{reminder.dosage}</p>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{reminder.scheduledTime.toLocaleTimeString()}</span>
                    </div>
                  </div>
                  <Badge variant="outline">
                    Scheduled
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {todayReminders.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <Pill className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No medications scheduled for today</p>
          </div>
        )}

        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-green-600">
                {todayReminders.filter(r => r.taken).length}
              </div>
              <div className="text-xs text-gray-500">Taken</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-blue-600">
                {upcomingReminders.length}
              </div>
              <div className="text-xs text-gray-500">Upcoming</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-red-600">
                {overdueReminders.length}
              </div>
              <div className="text-xs text-gray-500">Overdue</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
