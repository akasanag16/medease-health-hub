
import { Calendar, FileText, Heart, Home, Pill, Upload, User, TestTube, Bell, Users } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { useProfile } from "@/hooks/useProfile"
import { useNotifications } from "@/hooks/useNotifications"

const patientMenuItems = [
  {
    title: "Dashboard",
    url: "#dashboard",
    icon: Home,
  },
  {
    title: "Appointments",
    url: "#appointments",
    icon: Calendar,
  },
  {
    title: "Medications",
    url: "#medications",
    icon: Pill,
  },
  {
    title: "Mood Tracker",
    url: "#mood",
    icon: Heart,
  },
  {
    title: "Lab Results",
    url: "#lab-results",
    icon: TestTube,
  },
  {
    title: "Medical Reports",
    url: "#reports",
    icon: FileText,
  },
  {
    title: "Upload Documents",
    url: "#documents",
    icon: Upload,
  },
]

const doctorMenuItems = [
  {
    title: "Dashboard",
    url: "#dashboard",
    icon: Home,
  },
  {
    title: "Appointments",
    url: "#appointments",
    icon: Calendar,
  },
  {
    title: "Lab Results",
    url: "#lab-results",
    icon: TestTube,
  },
  {
    title: "Medical Reports",
    url: "#reports",
    icon: FileText,
  },
]

export function AppSidebar() {
  const { profile } = useProfile();
  const { unreadCount } = useNotifications();
  const isDoctor = profile?.role === 'doctor';
  const menuItems = isDoctor ? doctorMenuItems : patientMenuItems;

  return (
    <Sidebar className="bg-gradient-to-b from-blue-50 to-green-50">
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 health-gradient rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">MedEase</h1>
            <p className="text-sm text-gray-600">
              {isDoctor ? 'Doctor Portal' : 'Your Health Dashboard'}
            </p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-700 font-medium">
            {isDoctor ? 'Patient Management' : 'Health Management'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-blue-100 transition-colors">
                    <a href={item.url} className="flex items-center space-x-3 p-3">
                      <item.icon className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-gray-700 font-medium">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="hover:bg-blue-100 transition-colors">
                  <a href="#notifications" className="flex items-center space-x-3 p-3">
                    <Bell className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Notifications</span>
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="ml-auto">
                        {unreadCount}
                      </Badge>
                    )}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="hover:bg-blue-100 transition-colors">
                  <a href="#profile" className="flex items-center space-x-3 p-3">
                    <User className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Profile</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
