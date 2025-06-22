import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const handleLogout = async () => {
  await localStorage.removeItem("user");
  await localStorage.removeItem("accessToken");
  await localStorage.removeItem("refreshToken");
  window.location.href = "/";
};

export function formatDateTime(timestamp) {
  const date = new Date(timestamp);

  const formattedDate = date.toLocaleDateString(); // e.g., 6/13/2025
  const formattedTime = date.toLocaleTimeString(); // e.g., 11:45:37 AM (depends on locale)

  return `${formattedDate} at ${formattedTime}`;
}

export const formateDate = (timestamp) => {
  const dateObj = new Date(timestamp);

  const optionsDate = { day: "2-digit", month: "long", year: "numeric" };
  const formattedDate = dateObj.toLocaleDateString("en-US", optionsDate);

  const optionsTime = { hour: "2-digit", minute: "2-digit", hour12: true };
  const formattedTime = dateObj.toLocaleTimeString("en-US", optionsTime);

  return {
    date: formattedDate, // e.g., "18 June, 2025"
    time: formattedTime, // e.g., "04:30 PM"
  };
};

export const formatPhone = (number) => {
  if (!number) return null;
  return number.startsWith("+") ? number : `+92${number.replace(/^0/, "")}`;
};

export const getSmartTimeFormat = (timestamp) => {
  const now = new Date();
  const messageDate = new Date(timestamp);

  // Get date parts for comparison (ignoring time)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const messageDay = new Date(
    messageDate.getFullYear(),
    messageDate.getMonth(),
    messageDate.getDate()
  );

  // Check if message is from today
  if (messageDay.getTime() === today.getTime()) {
    // Return time ago format for today's messages
    const diffInMs = now - messageDate;
    const seconds = Math.floor(diffInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 30) {
      return "just now";
    } else if (seconds < 60) {
      return `${seconds} sec ago`;
    } else if (minutes < 60) {
      return `${minutes} min ago`;
    } else {
      return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    }
  }

  // Check if message is from tomorrow (future message)
  if (messageDay.getTime() === tomorrow.getTime()) {
    return "tomorrow";
  }

  // For all other dates, return full date and time
  return messageDate.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
