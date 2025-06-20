import React, { useState } from "react";
import { getInitials, getStatusBadge } from "../../../dashboardUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  Dot,
  Eye,
  Mail,
  MapPin,
  MessageCircleMore,
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
import { formateDate, formatPhone } from "@/lib/utils";
import { toast } from "sonner";
import { updateAppointmentStatus } from "@/redux/slices/doctorSlice";
import { useDispatch } from "react-redux";
import axiosInstance from "../../../../../../axiosInstance";
import ChatDialog from "../../ChatDialog";

const PatientAppointmentCard = ({ appointment, showActions = true }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const dispatch = useDispatch();
  const handleCancel = async (appointmentId) => {
    try {
      if (!appointmentId) return;

      const toastId = toast.loading("Cancelling appointment...");

      const response = await axiosInstance.put(
        `/api/appointment/cancel/${appointmentId}`
      );

      if (response.status === 200) {
        toast.dismiss(toastId);
        toast.success(
          response?.data?.message || "Appointment cancelled successfully"
        );
        dispatch(updateAppointmentStatus(response?.data?.appointment));
      } else {
        toast.dismiss(toastId);
        toast.error("Unexpected response from server.");
      }
    } catch (error) {
      toast.dismiss();
      toast.error(
        error.response?.data?.message || "Failed to cancel appointment"
      );
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback>
                  {getInitials(appointment?.doctor?.full_name)}
                </AvatarFallback>
                <AvatarImage
                  src={appointment?.doctor?.doctorProfile?.profile_image}
                  alt={appointment?.doctor?.full_name}
                />
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  Dr. {appointment?.doctor?.full_name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {appointment?.doctor?.doctorProfile?.specialization}
                </p>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formateDate(appointment?.appointment_at).date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formateDate(appointment?.appointment_at).time}
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <span>{appointment?.reason}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {appointment?.doctor?.doctorProfile?.address ||
                      "Clinic Address Not Provided"}
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
                  <DropdownMenuContent side="bottom" align="end">
                    <a href={`mailto:${appointment?.doctor?.email}`}>
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        Email Doctor
                      </DropdownMenuItem>
                    </a>
                    <a
                      href={`tel:${formatPhone(
                        appointment?.doctor?.doctorProfile?.phone_number
                      )}`}
                    >
                      <DropdownMenuItem>
                        <Phone className="mr-2 h-4 w-4" />
                        Call Doctor
                      </DropdownMenuItem>
                    </a>
                    <DropdownMenuItem
                      onClick={() => setIsChatOpen(true)}
                      className={"items-center"}
                    >
                      <MessageCircleMore className="mr-2 h-4 w-4" />
                      Live Consultation
                      <div className="flex items-center justify-center mr-2 h-3 w-3 animate-ping bg-green-500/20 rounded-full">
                        <div className="h-1 w-1 rounded-full bg-green-700 dark:bg-green-500 animate-pulse" />
                      </div>
                    </DropdownMenuItem>
                    {appointment.status !== "completed" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            handleCancel(appointment.id);
                          }}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancel Appointment
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <ChatDialog
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        appointment={appointment}
      />
    </>
  );
};

export default PatientAppointmentCard;
