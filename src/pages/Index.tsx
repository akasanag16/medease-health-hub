
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { UserHeader } from "@/components/UserHeader";
import { SimpleDashboard } from "@/components/SimpleDashboard";
import { DashboardOverview } from "@/components/DashboardOverview";
import { ProfileManager } from "@/components/ProfileManager";
import { AppointmentManager } from "@/components/AppointmentManager";
import { MedicationManager } from "@/components/MedicationManager";
import { LabResults } from "@/components/LabResults";
import { MoodTracker } from "@/components/MoodTracker";
import { MedicalReports } from "@/components/MedicalReports";
import { NotificationCenter } from "@/components/NotificationCenter";
import { DoctorDashboard } from "@/components/DoctorDashboard";
import { RoleBasedRoute } from "@/components/RoleBasedRoute";
import { UploadDocuments } from "@/components/UploadDocuments";
import { useState } from "react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <SimpleDashboard />
            <DashboardOverview />
          </div>
        );
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
      case "doctor":
        return (
          <RoleBasedRoute allowedRoles={['doctor']}>
            <DoctorDashboard />
          </RoleBasedRoute>
        );
      case "documents":
        return <UploadDocuments />;
      default:
        return (
          <div className="space-y-6">
            <SimpleDashboard />
            <DashboardOverview />
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 via-white to-green-50">
        <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
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
