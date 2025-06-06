
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Pill, FileText, TrendingUp } from "lucide-react"
import { useAppointments } from '@/hooks/useAppointments'
import { useMedications } from '@/hooks/useMedications'
import { useMedicalDocuments } from '@/hooks/useMedicalDocuments'
import { useMoodLogs } from '@/hooks/useMoodLogs'

export const DashboardOverview = () => {
  const { appointments } = useAppointments();
  const { medications } = useMedications();
  const { documents } = useMedicalDocuments();
  const { moodLogs } = useMoodLogs();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute for real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Get upcoming appointments (next 7 days)
  const upcomingAppointments = appointments
    .filter(apt => {
      const appointmentDate = new Date(`${apt.appointment_date}T${apt.appointment_time}`);
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return appointmentDate >= today && appointmentDate <= nextWeek && apt.status === 'scheduled';
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.appointment_date}T${a.appointment_time}`);
      const dateB = new Date(`${b.appointment_date}T${b.appointment_time}`);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 3);

  // Get active medications
  const activeMedications = medications.filter(med => med.is_active).slice(0, 3);

  // Get recent documents
  const recentDocuments = documents.slice(0, 2);

  // Get next appointment
  const nextAppointment = upcomingAppointments[0];

  // Get next medication time (simplified logic)
  const getNextMedicationTime = () => {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour < 8) return "8:00 AM";
    if (hour < 12) return "12:00 PM";
    if (hour < 18) return "6:00 PM";
    return "Tomorrow 8:00 AM";
  };

  // Get latest mood
  const latestMood = moodLogs[0];
  const getMoodEmoji = (moodLevel: string) => {
    const emojiMap = {
      'very_sad': '😢',
      'sad': '😔', 
      'neutral': '😐',
      'happy': '🙂',
      'very_happy': '😄'
    } as const;
    return emojiMap[moodLevel as keyof typeof emojiMap] || '😐';
  };

  return (
    <div className="space-y-6">
      {/* Real-time stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="health-card-hover bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Next Appointment</p>
                <p className="text-lg font-semibold text-gray-800">
                  {nextAppointment ? new Date(nextAppointment.appointment_date).toLocaleDateString() : 'None scheduled'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="health-card-hover bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500 rounded-lg">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Medications</p>
                <p className="text-lg font-semibold text-gray-800">{activeMedications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="health-card-hover bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Medical Documents</p>
                <p className="text-lg font-semibold text-gray-800">{documents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="health-card-hover bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-500 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Next Medication</p>
                <p className="text-lg font-semibold text-gray-800">{getNextMedicationTime()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current mood display */}
      {latestMood && (
        <Card className="health-card-hover">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span>Current Mood</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <span className="text-4xl">{getMoodEmoji(latestMood.mood_level)}</span>
              <div>
                <p className="font-medium text-gray-800 capitalize">{latestMood.mood_level.replace('_', ' ')}</p>
                <p className="text-sm text-gray-600">
                  Logged on {new Date(latestMood.log_date).toLocaleDateString()}
                </p>
                {latestMood.note && (
                  <p className="text-sm text-gray-600 mt-1">"{latestMood.note}"</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Appointments */}
      <Card className="health-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>Upcoming Appointments</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium text-gray-800">{appointment.doctor_name}</h4>
                    <p className="text-sm text-gray-600">{appointment.specialty}</p>
                    <p className="text-sm text-gray-600">{appointment.reason}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">
                      {new Date(appointment.appointment_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">{appointment.appointment_time}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Medications */}
      <Card className="health-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Pill className="w-5 h-5 text-green-600" />
            <span>Current Medications</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeMedications.length > 0 ? (
              activeMedications.map((medication) => (
                <div key={medication.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium text-gray-800">{medication.name}</h4>
                    <p className="text-sm text-gray-600">{medication.dosage} - {medication.frequency.replace('_', ' ')}</p>
                    {medication.prescribed_by && (
                      <p className="text-sm text-gray-500">Prescribed by: {medication.prescribed_by}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">
                      Active
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No active medications</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Documents */}
      {recentDocuments.length > 0 && (
        <Card className="health-card-hover">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <span>Recent Documents</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentDocuments.map((document) => (
                <div key={document.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">{document.file_name}</h4>
                    <p className="text-sm text-gray-600">{document.document_type}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(document.upload_date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
