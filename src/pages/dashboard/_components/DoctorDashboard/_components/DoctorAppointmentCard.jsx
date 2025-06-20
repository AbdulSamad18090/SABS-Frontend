import React, { useState } from "react";
import { getInitials, getStatusBadge } from "../../../dashboardUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  CircleCheck,
  Clock,
  Eye,
  Mail,
  MessageCircleMore,
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
import { toast } from "sonner";
import axiosInstance from "../../../../../../axiosInstance";
import { useDispatch } from "react-redux";
import { updateAppointmentStatus } from "@/redux/slices/doctorSlice";
import ChatDialog from "../../ChatDialog";

const DoctorAppointmentCard = ({ appointment }) => {
  const [isChatDialogOpen, setIsChatDialogOpen] = useState(false);
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

  const handleMarkAsCompleted = async (appointmentId) => {
    try {
      if (!appointmentId) return;

      const toastId = toast.loading("Marking appointment as completed...");

      const response = await axiosInstance.put(
        `/api/appointment/complete/${appointmentId}`
      );

      if (response.status === 200) {
        toast.dismiss(toastId);
        toast.success(
          response?.data?.message || "Appointment marked as completed"
        );
        dispatch(updateAppointmentStatus(response?.data?.appointment));
      } else {
        toast.dismiss(toastId);
        toast.error("Unexpected response from server.");
      }
    } catch (error) {
      toast.dismiss();
      toast.error(
        error.response?.data?.message ||
          "Failed to mark appointment as completed"
      );
    }
  };
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
              <DropdownMenuContent side="bottom" align="end">
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
                {appointment?.status === "scheduled" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        handleMarkAsCompleted(appointment.id);
                      }}
                    >
                      <CircleCheck className="mr-2 h-4 w-4" />
                      Mark as Complete
                    </DropdownMenuItem>
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
            <Button
              size={"icon"}
              variant={"ghost"}
              onClick={() => setIsChatDialogOpen(true)}
            >
              <MessageCircleMore />
            </Button>
          </div>
        </div>
      </CardContent>
      <ChatDialog
        isOpen={isChatDialogOpen}
        onClose={() => setIsChatDialogOpen(false)}
        appointment={appointment}
      />
    </Card>
  );
};

export default DoctorAppointmentCard;
