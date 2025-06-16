import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axiosInstance from "../../../../../../axiosInstance";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

const Schedule = () => {
  const calendarRef = useRef(null);
  const [currentView, setCurrentView] = useState("timeGridWeek");
  const [workingSlots, setWorkingSlots] = useState([]);

  useEffect(() => {
    const fetchExistingSlots = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await axiosInstance.get(
          `${import.meta.env.VITE_BASE_URL}/api/slots/get-schedule/${user?.id}`
        );

        const slots = response?.data?.schedule || [];

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
  }, []);

  // Toggle slot: if exists, remove; else add
  const handleSlotSelect = (selectInfo) => {
    const { start, end } = selectInfo;

    const isAlreadyPresent = workingSlots.some(
      (slot) =>
        new Date(slot.start).getTime() === new Date(start).getTime() &&
        new Date(slot.end).getTime() === new Date(end).getTime()
    );

    if (isAlreadyPresent) {
      setWorkingSlots((prev) =>
        prev.filter(
          (slot) =>
            !(
              new Date(slot.start).getTime() === new Date(start).getTime() &&
              new Date(slot.end).getTime() === new Date(end).getTime()
            )
        )
      );
    } else {
      setWorkingSlots((prev) => [
        ...prev,
        {
          id: uuidv4(),
          title: "Available Slot",
          start,
          end,
        },
      ]);
    }
  };

  const handleSlotClick = (info) => {
    const { id } = info.event;
    setWorkingSlots((prev) => prev.filter((slot) => slot.id !== id));
  };

  const handleViewChange = (viewType) => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.changeView(viewType);
    setCurrentView(viewType);
  };

  const handleToday = () => {
    calendarRef.current?.getApi().today();
  };

  const handlePrev = () => {
    calendarRef.current?.getApi().prev();
  };

  const handleNext = () => {
    calendarRef.current?.getApi().next();
  };

  const handleSaveSchedule = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    const preparedSlots = workingSlots.map((slot) => {
      const startDate = new Date(slot.start);
      const endDate = new Date(slot.end);

      const pad = (n) => n.toString().padStart(2, "0");

      const formatTime = (date) =>
        `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
          date.getSeconds()
        )}.000`;

      const formatDate = (date) =>
        `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
          date.getDate()
        )}`;

      return {
        doctor_id: user?.id,
        title: slot.title,
        start_time: formatTime(startDate),
        end_time: formatTime(endDate),
        slot_date: formatDate(startDate),
      };
    });

    try {
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/api/slots/save`,
        preparedSlots
      );
      if (response?.data?.success) {
        toast.success(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.details[0] ||
          "Failed to save schedule"
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Management</CardTitle>
        <CardDescription>
          Click on empty time slots to add/remove availability.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Custom Header */}
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          <Button variant="outline" onClick={handlePrev}>
            Prev
          </Button>
          <Button variant="outline" onClick={handleToday}>
            Today
          </Button>
          <Button variant="outline" onClick={handleNext}>
            Next
          </Button>
          <div className="ml-auto flex gap-2">
            <Button
              variant={currentView === "timeGridDay" ? "default" : "outline"}
              onClick={() => handleViewChange("timeGridDay")}
            >
              Day
            </Button>
            <Button
              variant={currentView === "timeGridWeek" ? "default" : "outline"}
              onClick={() => handleViewChange("timeGridWeek")}
            >
              Week
            </Button>
            <Button onClick={handleSaveSchedule}>Save Schedule</Button>
          </div>
        </div>

        {/* Calendar */}
        <FullCalendar
          ref={calendarRef}
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={false}
          slotDuration="00:30:00"
          allDaySlot={false}
          height="auto"
          selectable={true}
          select={handleSlotSelect}
          events={workingSlots}
          eventClick={handleSlotClick}
          dayHeaderClassNames={"bg-muted font-normal"}
          eventBackgroundColor="#155dfc"
          eventBorderColor="#155dfc"
        />
      </CardContent>
    </Card>
  );
};

export default Schedule;
