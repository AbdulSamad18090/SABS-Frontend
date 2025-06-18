import React from "react";
import { getInitials, getStatusBadge } from "../dashboardUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  CircleCheck,
  Clock,
  Eye,
  Mail,
  MoreHorizontal,
  Phone,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AvatarImage } from "@radix-ui/react-avatar";
import { formateDate, formatPhone } from "@/lib/utils";

const DoctorAppointmentCard = ({ appointment }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback>
                {getInitials(appointment?.patient?.full_name)}
              </AvatarFallback>
              <AvatarImage
                src={appointment?.patient?.patientProfile?.profile_image}
                alt="pic"
              />
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold">
                {appointment?.patient?.full_name}
              </h3>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {`${formateDate(appointment.appointment_at).date} at ${
                    formateDate(appointment.appointment_at).time
                  }`}
                </div>
                <span className="text-muted-foreground">•</span>
                <span>30 min</span>
                <span className="text-muted-foreground">•</span>
                <span>{appointment?.reason}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(appointment?.status)}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="left" align="start">
                <a href={`mailto:${appointment?.patient?.email}`}>
                  <DropdownMenuItem>
                    <Mail className="mr-2 h-4 w-4" />
                    Email Patient
                  </DropdownMenuItem>
                </a>
                <a
                  href={`tel:${formatPhone(
                    appointment?.patient?.patientProfile?.phone_number
                  )}`}
                >
                  <DropdownMenuItem>
                    <Phone className="mr-2 h-4 w-4" />
                    Call Patient
                  </DropdownMenuItem>
                </a>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <CircleCheck className="mr-2 h-4 w-4" />
                  Mark as Complete
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel Appointment
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorAppointmentCard;
