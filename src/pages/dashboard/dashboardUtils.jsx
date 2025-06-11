import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export const getStatusBadge = (status) => {
  switch (status) {
    case "confirmed":
      return (
        <Badge variant="secondary" className="bg-green-500/10 text-green-600">
          Confirmed
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">
          Pending
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="secondary" className="bg-red-500/10 text-red-600">
          Cancelled
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export const renderStars = (rating) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-4 w-4 ${
        i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
      }`}
    />
  ));
};
