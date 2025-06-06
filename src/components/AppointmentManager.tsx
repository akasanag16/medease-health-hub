import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock, Plus, MapPin, User, Download, FileText } from "lucide-react";
import { useAppointments } from '@/hooks/useAppointments';
import { SearchAndFilter } from './SearchAndFilter';
import { useExport } from '@/hooks/useExport';

export const AppointmentManager = () => {
  const { appointments, loading, createAppointment, updateAppointment } = useAppointments();
  const { exportToCSV, exportToPDF } = useExport();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<any>({});
  const [formData, setFormData] = useState({
    doctor_name: '',
    specialty: '',
    appointment_date: '',
    appointment_time: '',
    reason: '',
    location: '',
    notes: '',
    status: 'scheduled' as const
  });

  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      // Search filter
      const matchesSearch = !searchQuery || 
        appointment.doctor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.location?.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus = !filters.status || appointment.status === filters.status;

      // Date range filter
      const matchesDateRange = !filters.dateRange || (() => {
        const appointmentDate = new Date(appointment.appointment_date);
        const today = new Date();
        
        switch (filters.dateRange) {
          case 'upcoming':
            return appointmentDate >= today;
          case 'past':
            return appointmentDate < today;
          case 'this_week':
            const weekFromNow = new Date(today);
            weekFromNow.setDate(today.getDate() + 7);
            return appointmentDate >= today && appointmentDate <= weekFromNow;
          case 'this_month':
            return appointmentDate.getMonth() === today.getMonth() && 
                   appointmentDate.getFullYear() === today.getFullYear();
          default:
            return true;
        }
      })();

      return matchesSearch && matchesStatus && matchesDateRange;
    });
  }, [appointments, searchQuery, filters]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createAppointment(formData);
    if (success) {
      setFormData({
        doctor_name: '',
        specialty: '',
        appointment_date: '',
        appointment_time: '',
        reason: '',
        location: '',
        notes: '',
        status: 'scheduled'
      });
      setIsDialogOpen(false);
    }
  };

  const handleExportCSV = () => {
    exportToCSV(filteredAppointments, 'appointments');
  };

  const handleExportPDF = () => {
    exportToPDF({ appointments: filteredAppointments }, 'appointments-report');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no_show':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading appointments...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <SearchAndFilter
        onSearch={setSearchQuery}
        onFilter={setFilters}
        placeholder="Search appointments by doctor, specialty, reason, or location..."
        filterOptions={{
          statuses: ['scheduled', 'completed', 'cancelled', 'no_show'],
          dateRanges: ['upcoming', 'past', 'this_week', 'this_month']
        }}
      />

      <Card className="health-card-hover">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Appointments ({filteredAppointments.length})</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleExportCSV} size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" onClick={handleExportPDF} size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="health-gradient text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Appointment
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Schedule New Appointment</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="doctor_name">Doctor Name</Label>
                      <Input
                        id="doctor_name"
                        value={formData.doctor_name}
                        onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialty">Specialty</Label>
                      <Input
                        id="specialty"
                        value={formData.specialty}
                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="appointment_date">Date</Label>
                        <Input
                          id="appointment_date"
                          type="date"
                          value={formData.appointment_date}
                          onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="appointment_time">Time</Label>
                        <Input
                          id="appointment_time"
                          type="time"
                          value={formData.appointment_time}
                          onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason</Label>
                      <Input
                        id="reason"
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <Button type="submit" className="w-full health-gradient text-white">
                      Schedule Appointment
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-gray-800 flex items-center">
                          <User className="w-4 h-4 mr-2 text-blue-600" />
                          {appointment.doctor_name}
                        </h4>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      {appointment.specialty && (
                        <p className="text-sm text-gray-600">{appointment.specialty}</p>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(appointment.appointment_date)}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatTime(appointment.appointment_time)}
                        </span>
                      </div>
                      {appointment.location && (
                        <p className="text-sm text-gray-600 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {appointment.location}
                        </p>
                      )}
                      {appointment.reason && (
                        <p className="text-sm text-gray-600">Reason: {appointment.reason}</p>
                      )}
                      {appointment.notes && (
                        <p className="text-sm text-gray-600">Notes: {appointment.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No appointments found.</p>
                {searchQuery || Object.keys(filters).length > 0 ? (
                  <p className="text-sm">Try adjusting your search or filters.</p>
                ) : (
                  <p className="text-sm">Click "Schedule Appointment" to add your first appointment.</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
