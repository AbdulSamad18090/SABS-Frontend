import React from "react";
import { getInitials, getStatusBadge } from "../dashboardUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  Eye,
  MapPin,
  MoreHorizontal,
  Phone,
  Star,
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

const PatientAppointmentCard = ({ appointment, showActions = true }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback>
                {getInitials(appointment.doctor_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {appointment.doctor_name}
              </h3>
              <p className="text-sm text-gray-600">
                {appointment.specialization}
              </p>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {appointment.date}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {appointment.time}
                </div>
                <span className="text-gray-400">•</span>
                <span>{appointment.type}</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {appointment.clinic}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(appointment.status)}
            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  {appointment.status !== "completed" && (
                    <>
                      <DropdownMenuItem>
                        <Calendar className="mr-2 h-4 w-4" />
                        Reschedule
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel
                      </DropdownMenuItem>
                    </>
                  )}
                  {appointment.status === "completed" && (
                    <DropdownMenuItem>
                      <Star className="mr-2 h-4 w-4" />
                      Rate Doctor
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientAppointmentCard;
