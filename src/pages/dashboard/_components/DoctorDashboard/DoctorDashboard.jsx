import React, { useEffect, useState } from "react";
import { User, Bell, Settings, LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Link } from "react-router-dom";
import Schedule from "./_components/Schedule";
import Overview from "./_components/Overview";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctorAppointments } from "@/redux/slices/doctorSlice";
import Appointments from "./_components/Appointments";

const DoctorDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    today: 0,
    upcoming: 0,
    cancelled: 0,
    completed: 0,
  });
  const user = JSON.parse(localStorage.getItem("user"));

  const dispatch = useDispatch();
  const { todayAppointments, upcomingAppointments } = useSelector(
    (state) => state.doctor
  );

  useEffect(() => {
    dispatch(fetchDoctorAppointments(user?.id));
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (!todayAppointments || !upcomingAppointments) return;

    const allAppointments = [...todayAppointments, ...upcomingAppointments];

    setStats({
      today: todayAppointments.length || 0,
      upcoming: upcomingAppointments.length || 0,
      cancelled: allAppointments.filter((app) => app.status === "cancelled")
        .length,
      completed: allAppointments.filter((app) => app.status === "completed")
        .length,
    });
  }, [todayAppointments, upcomingAppointments]);

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
                        {getInitials(user?.full_name)}
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
                        {getInitials(user?.full_name)}
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Overview stats={stats} todayAppointments={todayAppointments} />
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Appointments
              todayAppointments={todayAppointments}
              upcomingAppointments={upcomingAppointments}
            />
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Schedule />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DoctorDashboard;
