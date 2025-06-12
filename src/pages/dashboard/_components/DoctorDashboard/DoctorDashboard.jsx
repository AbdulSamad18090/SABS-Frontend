import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  User,
  Bell,
  Settings,
  LogOut,
  Search,
  Plus,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  MapPin,
  Activity,
  MoreHorizontal,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { handleLogout } from "@/lib/utils";
import { getInitials } from "../../dashboardUtils";
import DoctorAppointmentCard from "../DoctorAppointmentCard";
import { Link } from "react-router-dom";

const DoctorDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  // Mock data - replace with actual API calls
  const doctorData = {
    id: "fd4f2074-3d9d-4dcf-a049-99ba063ac64f",
    full_name: "Dr. Abdul Samad",
    email: "abdulsamad18090@gmail.com",
    role: "doctor",
    doctorProfile: {
      profile_image: null,
      bio: "Experienced cardiologist with 10+ years of practice",
      specialization: "Cardiology",
      phone: "+92 300 1234567",
      clinic_address: "Heart Care Clinic, Shekhupura, Punjab",
    },
  };

  const todayAppointments = [
    {
      id: 1,
      patient_name: "Ahmad Ali",
      time: "09:00 AM",
      type: "Consultation",
      status: "confirmed",
      phone: "+92 301 2345678",
      duration: "30 min",
    },
    {
      id: 2,
      patient_name: "Fatima Khan",
      time: "10:30 AM",
      type: "Follow-up",
      status: "confirmed",
      phone: "+92 302 3456789",
      duration: "15 min",
    },
    {
      id: 3,
      patient_name: "Hassan Ahmed",
      time: "02:00 PM",
      type: "Check-up",
      status: "pending",
      phone: "+92 303 4567890",
      duration: "45 min",
    },
    {
      id: 4,
      patient_name: "Ayesha Malik",
      time: "03:30 PM",
      type: "Consultation",
      status: "confirmed",
      phone: "+92 304 5678901",
      duration: "30 min",
    },
  ];

  const upcomingAppointments = [
    {
      id: 5,
      patient_name: "Muhammad Usman",
      date: "2025-06-12",
      time: "11:00 AM",
      type: "Consultation",
      status: "confirmed",
      duration: "30 min",
    },
    {
      id: 6,
      patient_name: "Zainab Sheikh",
      date: "2025-06-13",
      time: "09:30 AM",
      type: "Follow-up",
      status: "pending",
      duration: "20 min",
    },
    {
      id: 7,
      patient_name: "Ali Hassan",
      date: "2025-06-14",
      time: "02:00 PM",
      type: "Check-up",
      status: "confirmed",
      duration: "45 min",
    },
  ];

  const stats = {
    todayAppointments: todayAppointments.length,
    pendingAppointments: [...todayAppointments, ...upcomingAppointments].filter(
      (apt) => apt.status === "pending"
    ).length,
    totalPatients: 156,
    completedToday: 2,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center flex-wrap gap-4 py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-foreground">
                Doctor Dashboard
              </h1>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search patients..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {getInitials(doctorData.full_name)}
                      </AvatarFallback>
                      <AvatarImage
                        src={user?.doctorProfile?.profile_image}
                        alt="pic"
                      />
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {getInitials(doctorData.full_name)}
                      </AvatarFallback>
                      <AvatarImage
                        src={user?.doctorProfile?.profile_image}
                        alt={"pic"}
                      />
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.full_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user?.doctorProfile?.specialization}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <Link to={"/profile"}>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <Link to={"/settings"}>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Today's Appointments
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.todayAppointments}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +2 from yesterday
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Appointments
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.pendingAppointments}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Requires attention
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Patients
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.totalPatients}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +12 this month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Completed Today
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.completedToday}
                  </div>
                  <p className="text-xs text-muted-foreground">Good progress</p>
                </CardContent>
              </Card>
            </div>

            {/* Today's Appointments */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Today's Appointments</CardTitle>
                    <CardDescription>
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Appointment
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <DoctorAppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                  />
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-4 text-blue-600" />
                  <CardTitle className="text-lg mb-2">
                    Manage Schedule
                  </CardTitle>
                  <CardDescription>
                    View and edit your availability
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 mx-auto mb-4 text-green-600" />
                  <CardTitle className="text-lg mb-2">
                    Patient Records
                  </CardTitle>
                  <CardDescription>
                    Access patient history and files
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <Activity className="h-8 w-8 mx-auto mb-4 text-purple-600" />
                  <CardTitle className="text-lg mb-2">Reports</CardTitle>
                  <CardDescription>View analytics and reports</CardDescription>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Appointments</CardTitle>
                    <CardDescription>
                      Manage your upcoming and past appointments
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      New Appointment
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Today</h3>
                  {todayAppointments.map((appointment) => (
                    <DoctorAppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                    />
                  ))}
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Upcoming</h3>
                  {upcomingAppointments.map((appointment) => (
                    <DoctorAppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      showDate={true}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Patient Management</CardTitle>
                <CardDescription>
                  View and manage your patient records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Patient Records
                  </h3>
                  <p className="text-muted-foreground">
                    Patient management features will be available here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Schedule Management</CardTitle>
                <CardDescription>
                  Set your availability and working hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Schedule Settings
                  </h3>
                  <p className="text-muted-foreground">
                    Schedule management features will be available here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DoctorDashboard;
