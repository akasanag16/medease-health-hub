
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAppointments } from './useAppointments';
import { useMedications } from './useMedications';

interface Notification {
  id: string;
  type: 'appointment' | 'medication';
  title: string;
  message: string;
  time: string;
  priority: 'low' | 'medium' | 'high';
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();
  const { appointments } = useAppointments();
  const { medications } = useMedications();

  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date();
      const upcoming: Notification[] = [];

      // Check upcoming appointments (within next 24 hours)
      appointments.forEach(appointment => {
        if (appointment.status === 'scheduled') {
          const appointmentDateTime = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`);
          const hoursUntil = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
          
          if (hoursUntil > 0 && hoursUntil <= 24) {
            upcoming.push({
              id: `appointment-${appointment.id}`,
              type: 'appointment',
              title: 'Upcoming Appointment',
              message: `${appointment.doctor_name} at ${appointment.appointment_time}`,
              time: appointmentDateTime.toLocaleString(),
              priority: hoursUntil <= 2 ? 'high' : hoursUntil <= 12 ? 'medium' : 'low'
            });
          }
        }
      });

      // Check medication reminders (active medications)
      medications.forEach(medication => {
        if (medication.is_active) {
          const frequency = medication.frequency;
          let shouldNotify = false;
          let priority: 'low' | 'medium' | 'high' = 'medium';

          // Simple logic for medication reminders based on frequency
          if (frequency === 'once_daily' || frequency === 'twice_daily' || frequency === 'three_times_daily') {
            // Daily medications - check if it's a typical medication time
            const hour = now.getHours();
            if (hour === 8 || hour === 12 || hour === 18) { // 8 AM, 12 PM, 6 PM
              shouldNotify = true;
              priority = 'high';
            }
          }

          if (shouldNotify) {
            upcoming.push({
              id: `medication-${medication.id}`,
              type: 'medication',
              title: 'Medication Reminder',
              message: `Time to take ${medication.name} (${medication.dosage})`,
              time: now.toLocaleString(),
              priority
            });
          }
        }
      });

      setNotifications(upcoming);

      // Show toast notifications for high priority items
      upcoming
        .filter(notif => notif.priority === 'high')
        .forEach(notif => {
          toast({
            title: notif.title,
            description: notif.message,
            duration: 10000, // 10 seconds
          });
        });
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [appointments, medications, toast]);

  return { notifications };
};
