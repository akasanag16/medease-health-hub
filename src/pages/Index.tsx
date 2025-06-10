
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { UserHeader } from "@/components/UserHeader";
import { DoctorDashboardView } from "@/components/DoctorDashboardView";
import { PatientDashboardView } from "@/components/PatientDashboardView";
import { ProfileManager } from "@/components/ProfileManager";
import { AppointmentManager } from "@/components/AppointmentManager";
import { MedicationManager } from "@/components/MedicationManager";
import { LabResults } from "@/components/LabResults";
import { MoodTracker } from "@/components/MoodTracker";
import { MedicalReports } from "@/components/MedicalReports";
import { NotificationCenter } from "@/components/NotificationCenter";
import { UploadDocuments } from "@/components/UploadDocuments";
import { useProfile } from "@/hooks/useProfile";
import { useState } from "react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { profile, loading } = useProfile();

  const renderContent = () => {
    // Show loading state while profile is being fetched
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "dashboard":
        // Role-based dashboard routing
        if (profile?.role === 'doctor') {
          return <DoctorDashboardView />;
        } else {
          return <PatientDashboardView />;
        }
      case "profile":
        return <ProfileManager />;
      case "appointments":
        return <AppointmentManager />;
      case "medications":
        return <MedicationManager />;
      case "lab-results":
        return <LabResults />;
      case "mood":
        return <MoodTracker />;
      case "reports":
        return <MedicalReports />;
      case "notifications":
        return <NotificationCenter />;
      case "documents":
        return <UploadDocuments />;
      default:
        // Default to role-based dashboard
        if (profile?.role === 'doctor') {
          return <DoctorDashboardView />;
        } else {
          return <PatientDashboardView />;
        }
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 via-white to-green-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <UserHeader />
          <div className="flex-1 p-6 overflow-y-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
