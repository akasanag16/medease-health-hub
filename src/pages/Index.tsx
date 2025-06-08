
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
import { useProfile } from "@/hooks/useProfile";

const Index = () => {
  const [activeSection, setActiveSection] = React.useState('dashboard');
  const { profile } = useProfile();

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
      return <DoctorDashboard />;
    }

    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'appointments':
        return <AppointmentManager />;
      case 'medications':
        return <MedicationManager />;
      case 'mood':
        return <MoodTracker />;
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
        return profile?.role === 'doctor' ? <DoctorDashboard /> : <DashboardOverview />;
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
