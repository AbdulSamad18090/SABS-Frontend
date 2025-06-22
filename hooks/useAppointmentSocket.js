// useAppointmentSocket.js
import { useEffect, useRef, useCallback, useMemo } from "react";
import { socket } from "../socket";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { addNewAppointment } from "@/redux/slices/doctorSlice";

export const useAppointmentSocket = () => {
  const audioRef = useRef(null);
  const dispatch = useDispatch();

  // Memoize user data to avoid re-parsing on every render
  const user = useMemo(() => {
    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      return null;
    }
  }, []);

  // Initialize audio only once
  useEffect(() => {
    audioRef.current = new Audio("/audios/notification-sound.mp3");
    audioRef.current.preload = "auto";

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const formatDate = useCallback((timestamp) => {
    try {
      const dateObj = new Date(timestamp);

      if (isNaN(dateObj.getTime())) {
        throw new Error("Invalid timestamp");
      }

      const optionsDate = { day: "2-digit", month: "long", year: "numeric" };
      const formattedDate = dateObj.toLocaleDateString("en-US", optionsDate);

      const optionsTime = { hour: "2-digit", minute: "2-digit", hour12: true };
      const formattedTime = dateObj.toLocaleTimeString("en-US", optionsTime);

      return {
        date: formattedDate,
        time: formattedTime,
      };
    } catch (error) {
      console.error("Error formatting date:", error);
      return {
        date: "Invalid Date",
        time: "Invalid Time",
      };
    }
  }, []);

  const playNotificationSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error playing notification sound:", error);
      });
    }
  }, []);

  const handleNewAppointment = useCallback(
    (data) => {
      console.log("🆕 New appointment received!", data);

      try {
        // Validate data structure
        if (
          !data ||
          !data.doctor_id ||
          !data.patient?.full_name ||
          !data.appointment_at
        ) {
          console.error("Invalid appointment data received:", data);
          return;
        }

        if (user?.id === data.doctor_id) {
          playNotificationSound();

          const { date, time } = formatDate(data.appointment_at);
          toast.info(
            `New appointment from ${data.patient.full_name} on ${date} at ${time}`
          );
          dispatch(addNewAppointment(data));
        }
      } catch (error) {
        console.error("Error handling new appointment:", error);
      }
    },
    [user?.id, playNotificationSound, formatDate]
  );

  const handleNewMessage = useCallback(
    (data) => {
      console.log("🆕 New message received!", data);

      try {
        // Validate data structure
        if (!data || !data.sender_id || !data.receiver_id || !data.message) {
          console.error("Invalid message data received:", data);
          return;
        }

        if (user?.id === data.receiver_id) {
          playNotificationSound();

          toast.info(`New message from ${data.sender_name}`);
        }
      } catch (error) {
        console.error("Error handling new message:", error);
      }
    },
    [user?.id, playNotificationSound]
  );

  useEffect(() => {
    // Socket connection event handlers
    const handleConnect = () => {
      console.log("Socket connected");
      if (user?.id) {
        socket.emit("join", user.id); // Join personal room
        console.log("Joined room:", user.id);
      }
    };

    const handleDisconnect = (reason) => {
      console.log("Socket disconnected:", reason);
    };

    const handleConnectError = (error) => {
      console.error("Socket connection error:", error);
    };

    // Register event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("new_appointment", handleNewAppointment);
    socket.on("new_message", handleNewMessage);

    return () => {
      // Clean up all event listeners
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("new_appointment", handleNewAppointment);
      socket.off("new_message", handleNewMessage);
    };
  }, [handleNewAppointment]);

  return {
    isConnected: socket.connected,
    socket,
  };
};
