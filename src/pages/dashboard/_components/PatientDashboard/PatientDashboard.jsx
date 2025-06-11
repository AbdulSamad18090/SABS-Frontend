import React, { useState } from "react";
import {
  Calendar,
  Clock,
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
  Stethoscope,
  FileText,
  Heart,
  Pill,
  History,
  Star,
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
import { getInitials, renderStars } from "../../dashboardUtils";
import PatientAppointmentCard from "../PatientAppointmentCard";

const PatientDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - replace with actual API calls
  const patientData = {
    id: "b330006a-37c2-4c3f-92b4-15913f917109",
    full_name: "Ahmad Ali",
    email: "ahmadbaig7072@gmail.com",
    role: "patient",
    patientProfile: {
      profile_image: null,
      problem: null,
      age: 28,
      phone: "+92 300 1234567",
      address: "Shekhupura, Punjab, Pakistan",
      blood_group: "B+",
      emergency_contact: "+92 301 9876543",
    },
  };

  const upcomingAppointments = [
    {
      id: 1,
      doctor_name: "Dr. Abdul Samad",
      specialization: "Cardiology",
      date: "2025-06-12",
      time: "11:00 AM",
      type: "Consultation",
      status: "confirmed",
      clinic: "Heart Care Clinic",
      address: "Shekhupura, Punjab",
    },
    {
      id: 2,
      doctor_name: "Dr. Sarah Khan",
      specialization: "General Medicine",
      date: "2025-06-15",
      time: "02:30 PM",
      type: "Follow-up",
      status: "pending",
      clinic: "City Medical Center",
      address: "Lahore, Punjab",
    },
  ];

  const pastAppointments = [
    {
      id: 3,
      doctor_name: "Dr. Abdul Samad",
      specialization: "Cardiology",
      date: "2025-06-08",
      time: "10:00 AM",
      type: "Check-up",
      status: "completed",
      clinic: "Heart Care Clinic",
      rating: 5,
    },
    {
      id: 4,
      doctor_name: "Dr. Ahmed Hassan",
      specialization: "Orthopedics",
      date: "2025-05-25",
      time: "03:00 PM",
      type: "Consultation",
      status: "completed",
      clinic: "Bone & Joint Clinic",
      rating: 4,
    },
  ];

  const availableDoctors = [
    {
      id: 1,
      name: "Dr. Abdul Samad",
      specialization: "Cardiology",
      rating: 4.8,
      experience: "10+ years",
      clinic: "Heart Care Clinic",
      next_available: "Today 3:00 PM",
      fee: "Rs. 2,500",
    },
    {
      id: 2,
      name: "Dr. Sarah Khan",
      specialization: "General Medicine",
      rating: 4.6,
      experience: "8+ years",
      clinic: "City Medical Center",
      next_available: "Tomorrow 10:00 AM",
      fee: "Rs. 1,800",
    },
    {
      id: 3,
      name: "Dr. Ahmed Hassan",
      specialization: "Orthopedics",
      rating: 4.7,
      experience: "12+ years",
      clinic: "Bone & Joint Clinic",
      next_available: "Jun 13, 2:00 PM",
      fee: "Rs. 3,000",
    },
  ];

  const healthRecords = [
    {
      id: 1,
      type: "Lab Report",
      title: "Blood Test Results",
      date: "2025-06-08",
      doctor: "Dr. Abdul Samad",
      status: "Normal",
    },
    {
      id: 2,
      type: "Prescription",
      title: "Heart Medication",
      date: "2025-06-08",
      doctor: "Dr. Abdul Samad",
      status: "Active",
    },
    {
      id: 3,
      type: "X-Ray",
      title: "Chest X-Ray",
      date: "2025-05-25",
      doctor: "Dr. Ahmed Hassan",
      status: "Normal",
    },
  ];

  const stats = {
    upcomingAppointments: upcomingAppointments.length,
    completedAppointments: pastAppointments.length,
    totalRecords: healthRecords.length,
    activePrescriptions: healthRecords.filter(
      (record) => record.type === "Prescription" && record.status === "Active"
    ).length,
  };

  const DoctorCard = ({ doctor }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback>{getInitials(doctor.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{doctor.name}</h3>
              <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center">
                  {renderStars(Math.floor(doctor.rating))}
                  <span className="ml-1 text-sm text-muted-foreground">
                    ({doctor.rating})
                  </span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-muted-foreground">
                  {doctor.experience}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {doctor.clinic}
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-green-600 font-medium">
                  {doctor.next_available}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-foreground">{doctor.fee}</p>
            <Button size="sm" className="mt-2">
              Book Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const HealthRecordCard = ({ record }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              {record.type === "Lab Report" && (
                <Activity className="h-5 w-5 text-blue-600" />
              )}
              {record.type === "Prescription" && (
                <Pill className="h-5 w-5 text-blue-600" />
              )}
              {record.type === "X-Ray" && (
                <FileText className="h-5 w-5 text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{record.title}</h3>
              <p className="text-sm text-muted-foreground">{record.type}</p>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <span>{record.date}</span>
                <span className="text-gray-400">•</span>
                <span>{record.doctor}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={
                record.status === "Normal" || record.status === "Active"
                  ? "secondary"
                  : "outline"
              }
            >
              {record.status}
            </Badge>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-foreground">
                Patient Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search doctors..."
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
                        {getInitials(patientData.full_name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {getInitials(patientData.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{patientData.full_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {patientData.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="doctors">Find Doctors</TabsTrigger>
            <TabsTrigger value="records">Health Records</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Upcoming Appointments
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.upcomingAppointments}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Next: Tomorrow 11:00 AM
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Completed Visits
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.completedAppointments}
                  </div>
                  <p className="text-xs text-muted-foreground">This year</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Health Records
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalRecords}</div>
                  <p className="text-xs text-muted-foreground">
                    Documents available
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Prescriptions
                  </CardTitle>
                  <Pill className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.activePrescriptions}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Currently taking
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Upcoming Appointments</CardTitle>
                    <CardDescription>
                      Your scheduled medical appointments
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Book Appointment
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <PatientAppointmentCard
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
                  <Stethoscope className="h-8 w-8 mx-auto mb-4 text-primary" />
                  <CardTitle className="text-lg mb-2">Find Doctors</CardTitle>
                  <CardDescription>
                    Search and book appointments with specialists
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <FileText className="h-8 w-8 mx-auto mb-4 text-green-600" />
                  <CardTitle className="text-lg mb-2">Health Records</CardTitle>
                  <CardDescription>
                    Access your medical history and reports
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <Heart className="h-8 w-8 mx-auto mb-4 text-red-600" />
                  <CardTitle className="text-lg mb-2">Health Tracker</CardTitle>
                  <CardDescription>
                    Monitor your health metrics and vitals
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>My Appointments</CardTitle>
                    <CardDescription>
                      View and manage your appointments
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Book New Appointment
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Upcoming</h3>
                  {upcomingAppointments.map((appointment) => (
                    <PatientAppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                    />
                  ))}
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">
                    Past Appointments
                  </h3>
                  {pastAppointments.map((appointment) => (
                    <PatientAppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      showActions={false}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="doctors" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Find Doctors</CardTitle>
                    <CardDescription>
                      Search for specialists and book appointments
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {availableDoctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="records" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Health Records</CardTitle>
                <CardDescription>
                  Your medical documents and test results
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {healthRecords.map((record) => (
                  <HealthRecordCard key={record.id} record={record} />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Manage your profile details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="text-lg">
                        {getInitials(patientData.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">
                        {patientData.full_name}
                      </h3>
                      <p className="text-muted-foreground">{patientData.email}</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Change Photo
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Age
                      </label>
                      <p className="text-foreground">
                        {patientData.patientProfile.age} years
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Blood Group
                      </label>
                      <p className="text-foreground">
                        {patientData.patientProfile.blood_group}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Phone
                      </label>
                      <p className="text-foreground">
                        {patientData.patientProfile.phone}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Emergency Contact
                      </label>
                      <p className="text-foreground">
                        {patientData.patientProfile.emergency_contact}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Address
                    </label>
                    <p className="text-foreground">
                      {patientData.patientProfile.address}
                    </p>
                  </div>
                  <Button>Update Profile</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Health Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-4">
                    <Heart className="h-12 w-12 mx-auto text-red-500 mb-4" />
                    <h3 className="font-semibold">Health Dashboard</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Track your vitals, medications, and health goals
                    </p>
                    <Button variant="outline" size="sm" className="mt-4">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientDashboard;
