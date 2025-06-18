import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axiosInstance from "../../../../axiosInstance";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LoaderCircle } from "lucide-react";

const BookAppointmentDrawer = ({
  isOpen,
  onClose,
  doctorId,
  availableSlots,
}) => {
  const [workingSlots, setWorkingSlots] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [newAppointment, setNewAppointment] = useState({
    patient_id: user?.id,
    doctor_id: doctorId,
    slot_id: "",
    appointment_at: "",
    reason: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const prepareAvailableSlots = async () => {
      try {
        // if (!doctorId) return;
        // const response = await axiosInstance.get(
        //   `${import.meta.env.VITE_BASE_URL}/api/slots/get-schedule/${doctorId}`
        // );

        // const slots = response?.data?.schedule || [];

        const mappedSlots = availableSlots.map((slot) => {
          const date = new Date(slot.slot_date); // already has full ISO timestamp

          const [startHours, startMinutes, startSeconds] = slot.start_time
            .slice(0, 8)
            .split(":")
            .map(Number);

          const [endHours, endMinutes, endSeconds] = slot.end_time
            .slice(0, 8)
            .split(":")
            .map(Number);

          const start = new Date(date);
          start.setHours(startHours, startMinutes, startSeconds || 0, 0);

          const end = new Date(date);
          end.setHours(endHours, endMinutes, endSeconds || 0, 0);

          return {
            id: slot.id,
            title: slot.title,
            start,
            end,
          };
        });

        setWorkingSlots(mappedSlots);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            error.response?.data?.details[0] ||
            "Failed to load schedule"
        );
      }
    };

    prepareAvailableSlots();
  }, [doctorId, availableSlots]);

  const handleSlotClick = (info) => {
    const start = info.event.start;

    const formattedDate = `${start.getFullYear()}-${
      start.getMonth() + 1
    }-${start.getDate()}`;
    const formattedTime = start.toTimeString().split(" ")[0]; // HH:MM:SS

    setNewAppointment((prev) => ({
      ...prev,
      appointment_at: `${formattedDate} ${formattedTime}`, // e.g. 2025-6-18 14:00:00
      slot_id: info.event.id, // set slot_id
    }));

    toast.success(`Selected slot: ${formattedDate} ${formattedTime}`);
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!newAppointment.appointment_at) {
      return toast.error("Please select a slot.");
    }
    if (!newAppointment.reason) {
      return toast.error("Please provide a reason.");
    }
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/api/appointment/book`,
        newAppointment
      );
      if (response?.data?.success) {
        // Remove the booked slot from the calendar
        setWorkingSlots((prevSlots) =>
          prevSlots.filter((slot) => slot.id !== newAppointment.slot_id)
        );

        // Reset the appointment form
        setNewAppointment({
          patient_id: user?.id,
          doctor_id: doctorId,
          slot_id: "",
          appointment_at: "",
          reason: "",
        });

        toast.success(response?.data?.message);

        onClose();
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.details[0] ||
          error.response?.data?.message ||
          "Failed to book appointment. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="min-h-dvh flex flex-col justify-between p-4">
        <DrawerHeader className={"items-center"}>
          <DrawerTitle>Book an Appointment</DrawerTitle>
          <DrawerDescription>Choose a suitable time slot.</DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto">
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            slotDuration="00:30:00"
            allDaySlot={false}
            height="auto"
            selectable={true}
            events={workingSlots}
            eventClick={handleSlotClick}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "timeGridDay,timeGridWeek",
            }}
            dayHeaderClassNames={"bg-muted font-normal"}
            eventBackgroundColor="#155dfc"
            eventBorderColor="#155dfc"
            eventClassNames={(arg) => {
              return arg.event.id === newAppointment.slot_id
                ? ["selected-slot cursor-pointer transition-all"]
                : ["cursor-pointer active:scale-105"];
            }}
          />
        </div>

        <DrawerFooter className={"p-0 pt-4 border-t"}>
          <Label htmlFor="reason">Reason</Label>
          <Textarea
            id="reason"
            placeholder="Please write reason for the appointment"
            value={newAppointment?.reason}
            onChange={(e) =>
              setNewAppointment((prev) => ({
                ...prev,
                reason: e.target.value,
              }))
            }
          />
          <div className="flex items-center justify-end gap-4">
            <DrawerClose>
              <Button
                variant="outline"
                onClick={() =>
                  setNewAppointment({
                    patient_id: user?.id,
                    doctor_id: doctorId,
                    slot_id: "",
                    appointment_at: "",
                    reason: "",
                  })
                }
              >
                Cancel
              </Button>
            </DrawerClose>
            <Button
              disabled={isLoading}
              className={"w-1/5"}
              onClick={handleBookAppointment}
            >
              {isLoading && <LoaderCircle className="animate-spin" />}
              {isLoading ? "Booking..." : "Book"}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default BookAppointmentDrawer;
