
import { Calendar, FileText, Heart, Home, Pill, Upload, User, TestTube } from "lucide-react"
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

const menuItems = [
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
    url: "#medical-reports",
    icon: FileText,
  },
  {
    title: "Upload Documents",
    url: "#upload",
    icon: Upload,
  },
]

export function AppSidebar() {
  return (
    <Sidebar className="bg-gradient-to-b from-blue-50 to-green-50">
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 health-gradient rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">MedEase</h1>
            <p className="text-sm text-gray-600">Your Health Dashboard</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-700 font-medium">
            Health Management
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
