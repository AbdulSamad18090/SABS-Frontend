import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
// import axiosInstance from "../../../../axiosInstance";

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
  }, [doctorId]);

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
          <Label>Reason</Label>
          <Textarea
            placeholder="Enter reason for the appointment"
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
              onClick={() => {
                if (!newAppointment.appointment_at || !newAppointment.reason) {
                  return toast.error(
                    "Please select a slot and provide a reason."
                  );
                }

                console.log("Booking appointment:", newAppointment);
                // You can now POST this object to your backend
                // await axiosInstance.post('/api/appointments', newAppointment)
              }}
            >
              Submit
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default BookAppointmentDrawer;
