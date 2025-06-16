import React from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

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

// Sample slot data (replace this with your DB data)
const slotEvents = [
  {
    id: "1",
    title: "Available Slot",
    start: "2025-06-17T10:00:00",
    end: "2025-06-17T10:30:00",
  },
  {
    id: "2",
    title: "Available Slot",
    start: "2025-06-17T11:00:00",
    end: "2025-06-17T11:30:00",
  },
  {
    id: "3",
    title: "Available Slot",
    start: "2025-06-17T14:00:00",
    end: "2025-06-17T14:30:00",
  },
  {
    id: "4",
    title: "Available Slot",
    start: "2025-06-17T16:30:00",
    end: "2025-06-17T17:00:00",
  },
];

const BookAppointmentDrawer = ({ isOpen, onClose }) => {
  const handleSlotClick = (info) => {
    alert(`You clicked slot from ${info.event.start.toLocaleTimeString()}`);
    // Optionally select this slot
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="min-h-dvh flex flex-col justify-between p-4">
        <div className="flex-1 overflow-y-auto">
          <DrawerHeader className={"items-center"}>
            <DrawerTitle>Book an Appointment</DrawerTitle>
            <DrawerDescription>Choose a suitable time slot.</DrawerDescription>
          </DrawerHeader>

          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            slotDuration="00:30:00"
            slotMinTime="09:00:00"
            slotMaxTime="19:00:00"
            allDaySlot={false}
            height="auto"
            events={slotEvents}
            selectable={true}
            eventClick={handleSlotClick}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "timeGridDay,timeGridWeek",
            }}
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