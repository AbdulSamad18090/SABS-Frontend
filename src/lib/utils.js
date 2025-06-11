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
