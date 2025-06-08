
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, Calendar, TestTube, Pill, FileText } from "lucide-react";
import { usePatientAssignments } from '@/hooks/usePatientAssignments';
import { useAppointments } from '@/hooks/useAppointments';
import { useLabResults } from '@/hooks/useLabResults';
import { useMedications } from '@/hooks/useMedications';

export const DoctorDashboard = () => {
  const [patientEmail, setPatientEmail] = useState('');
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const { assignments, loading: assignmentsLoading, assignPatient } = usePatientAssignments();
  const { appointments } = useAppointments();
  const { labResults } = useLabResults();
  const { medications } = useMedications();

  const handleAssignPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientEmail.trim()) return;

    const success = await assignPatient(patientEmail, assignmentNotes);
    if (success) {
      setPatientEmail('');
      setAssignmentNotes('');
    }
  };

  const totalPatients = assignments.length;
  const todayAppointments = appointments.filter(apt => 
    apt.appointment_date === new Date().toISOString().split('T')[0] && 
    apt.status === 'scheduled'
  ).length;
  const pendingLabResults = labResults.filter(lab => lab.status === 'pending').length;
  const activeMedications = medications.filter(med => med.is_active).length;

  return (
    <div className="space-y-6">
      {/* Dashboard Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="health-card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-3xl font-bold text-blue-600">{totalPatients}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="health-card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-3xl font-bold text-green-600">{todayAppointments}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="health-card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Lab Results</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingLabResults}</p>
              </div>
              <TestTube className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="health-card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Medications</p>
                <p className="text-3xl font-bold text-purple-600">{activeMedications}</p>
              </div>
              <Pill className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="patients" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="patients">Patient Management</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="lab-results">Lab Results</TabsTrigger>
        </TabsList>

        <TabsContent value="patients" className="space-y-6">
          {/* Assign New Patient */}
          <Card className="health-card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <span>Assign New Patient</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAssignPatient} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Patient Email</label>
                    <Input
                      type="email"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      placeholder="patient@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Notes (Optional)</label>
                    <Textarea
                      value={assignmentNotes}
                      onChange={(e) => setAssignmentNotes(e.target.value)}
                      placeholder="Assignment notes..."
                      rows={3}
                    />
                  </div>
                </div>
                <Button type="submit" className="health-gradient text-white">
                  Assign Patient
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Current Patients */}
          <Card className="health-card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Your Patients</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignmentsLoading ? (
                  <div className="text-center py-4">Loading patients...</div>
                ) : assignments.length > 0 ? (
                  assignments.map((assignment) => (
                    <div key={assignment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-800">
                            {assignment.patient_profile?.first_name} {assignment.patient_profile?.last_name}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>Assigned: {new Date(assignment.assigned_at).toLocaleDateString()}</span>
                            <Badge variant="outline" className="text-green-600">
                              Active
                            </Badge>
                          </div>
                          {assignment.notes && (
                            <p className="text-sm text-gray-600">{assignment.notes}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            View Records
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No patients assigned yet.</p>
                    <p className="text-sm">Assign patients using their email address above.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card className="health-card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Patient Appointments</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.length > 0 ? (
                  appointments.slice(0, 5).map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium text-gray-800">{appointment.doctor_name}</h4>
                          <p className="text-sm text-gray-600">
                            {appointment.appointment_date} at {appointment.appointment_time}
                          </p>
                          <p className="text-sm text-gray-600">{appointment.reason}</p>
                        </div>
                        <Badge variant={appointment.status === 'scheduled' ? 'default' : 'secondary'}>
                          {appointment.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No appointments scheduled.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lab-results">
          <Card className="health-card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TestTube className="w-5 h-5 text-blue-600" />
                <span>Patient Lab Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {labResults.length > 0 ? (
                  labResults.slice(0, 5).map((result) => (
                    <div key={result.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium text-gray-800">{result.test_name}</h4>
                          <p className="text-sm text-gray-600">Date: {result.test_date}</p>
                          {result.result_value && (
                            <p className="text-sm text-gray-600">
                              Result: {result.result_value} {result.unit}
                            </p>
                          )}
                        </div>
                        <Badge variant={
                          result.status === 'normal' ? 'default' : 
                          result.status === 'abnormal' ? 'destructive' : 
                          result.status === 'critical' ? 'destructive' : 'secondary'
                        }>
                          {result.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <TestTube className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No lab results available.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
