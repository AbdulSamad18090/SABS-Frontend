import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Plus } from "lucide-react";
import DoctorAppointmentCard from "./DoctorAppointmentCard";
import { Link } from "react-router-dom";

const Appointments = ({ todayAppointments, upcomingAppointments }) => {
  return (
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
            <Link to={"/doctors"}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Book Appointment
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <h3 className="font-semibold">Today</h3>
          {todayAppointments?.length <= 0 && (
            <p className="text-center">No today's appointments</p>
          )}
          {todayAppointments.map((appointment) => (
            <DoctorAppointmentCard
              key={appointment.id}
              appointment={appointment}
            />
          ))}
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold">Upcoming</h3>
          {upcomingAppointments?.length <= 0 && (
            <p className="text-center">No upcoming appointments</p>
          )}

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
  );
};

export default Appointments;
