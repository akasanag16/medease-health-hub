
import React from 'react';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { UserHeader } from "@/components/UserHeader";
import { DashboardOverview } from "@/components/DashboardOverview";
import { AppointmentManager } from "@/components/AppointmentManager";
import { MedicationManager } from "@/components/MedicationManager";
import { MoodTracker } from "@/components/MoodTracker";
import { LabResults } from "@/components/LabResults";
import { MedicalReportsViewer } from "@/components/MedicalReportsViewer";
import { UploadDocuments } from "@/components/UploadDocuments";
import { ProfileManager } from "@/components/ProfileManager";
import { NotificationCenter } from "@/components/NotificationCenter";
import { DoctorDashboard } from "@/components/DoctorDashboard";
import { RealTimeDashboard } from "@/components/RealTimeDashboard";
import { MedicationReminderWidget } from "@/components/MedicationReminderWidget";
import { RoleBasedRoute } from "@/components/RoleBasedRoute";
import { useProfile } from "@/hooks/useProfile";
import { useRealTimeManager } from "@/hooks/useRealTimeManager";

const Index = () => {
  const [activeSection, setActiveSection] = React.useState('dashboard');
  const { profile } = useProfile();
  
  // Initialize real-time manager for the entire application
  useRealTimeManager();

  const handleSectionChange = (section: string) => {
    setActiveSection(section.replace('#', ''));
  };

  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        setActiveSection(hash.replace('#', ''));
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Handle initial hash

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderActiveSection = () => {
    // Check if user is a doctor and show doctor dashboard for dashboard section
    if (activeSection === 'dashboard' && profile?.role === 'doctor') {
      return (
        <div className="space-y-6">
          <RealTimeDashboard />
          <DoctorDashboard />
        </div>
      );
    }

    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <RealTimeDashboard />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <DashboardOverview />
              </div>
              <div>
                <RoleBasedRoute allowedRoles={['patient']}>
                  <MedicationReminderWidget />
                </RoleBasedRoute>
              </div>
            </div>
          </div>
        );
      case 'appointments':
        return <AppointmentManager />;
      case 'medications':
        return <MedicationManager />;
      case 'mood':
        return (
          <RoleBasedRoute allowedRoles={['patient']}>
            <MoodTracker />
          </RoleBasedRoute>
        );
      case 'lab-results':
        return <LabResults />;
      case 'medical-reports':
        return <MedicalReportsViewer />;
      case 'upload':
        return <UploadDocuments />;
      case 'profile':
        return <ProfileManager />;
      case 'notifications':
        return <NotificationCenter />;
      default:
        return profile?.role === 'doctor' ? (
          <div className="space-y-6">
            <RealTimeDashboard />
            <DoctorDashboard />
          </div>
        ) : (
          <div className="space-y-6">
            <RealTimeDashboard />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <DashboardOverview />
              </div>
              <div>
                <RoleBasedRoute allowedRoles={['patient']}>
                  <MedicationReminderWidget />
                </RoleBasedRoute>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 p-6">
            <UserHeader />
            {renderActiveSection()}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default Index;
