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

const BookAppointmentDrawer = ({ isOpen, onClose, doctorId }) => {
  const [workingSlots, setWorkingSlots] = useState([]);

  console.log("Working Slots ==>", workingSlots);

  useEffect(() => {
    const fetchExistingSlots = async () => {
      try {
        if (!doctorId) return;
        const response = await axiosInstance.get(
          `${import.meta.env.VITE_BASE_URL}/api/slots/get-schedule/${doctorId}`
        );

        const slots = response?.data?.schedule || [];
        console.log("Slots=====>", slots);

        const mappedSlots = slots.map((slot) => {
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

    fetchExistingSlots();
  }, [doctorId]);

  const handleSlotClick = (info) => {
    alert(`You clicked slot from ${info.event.start.toLocaleTimeString()}`);
    // Optionally select this slot
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
          />
        </div>

        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default BookAppointmentDrawer;
