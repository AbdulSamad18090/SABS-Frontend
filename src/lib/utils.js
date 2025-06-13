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