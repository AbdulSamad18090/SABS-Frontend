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
