import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Star,
  Clock,
  GraduationCap,
  Eye,
  X,
  CalendarCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

const DoctorCard = ({ doctor, profile, rating, reviews }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getAvailabilityColor = (availability) => {
    if (availability?.includes("Today"))
      return "bg-green-500/10 text-green-600";
    if (availability?.includes("Tomorrow"))
      return "bg-blue-500/10 text-blue-600";
    return "bg-gray-500/10 text-gray-600";
  };

  return (
    <>
      <Card
        key={doctor.id}
        className="hover:shadow-lg transition-shadow duration-300"
      >
        <CardHeader className="pb-4">
          <div className="flex items-start space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={profile.profile_image || "/placeholder.svg"}
                alt={doctor.full_name}
              />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-semibold">
                {doctor.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground truncate">
                {doctor.full_name}
              </h3>
              <p className="text-primary font-medium">
                {profile.specialization || "Specialty N/A"}
              </p>
              <div className="flex items-center mt-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm text-muted-foreground">
                  {rating} ({reviews} reviews)
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <GraduationCap className="h-4 w-4 mr-2" />
              <span>{profile.university || "N/A"}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-2" />
              <span>{profile.experience || "N/A"} year(s) experience</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{profile.address || "N/A"}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Badge className={getAvailabilityColor("Available Today")}>
              Available Today
            </Badge>
          </div>
          <div className="flex space-x-2 pt-2">
            <Button
              size="sm"
              className="flex-1"
              onClick={() => setIsOpen(true)}
            >
              <Eye />
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Doctor Details Dialog */}
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent className={"sm:max-w-3xl"}>
          <DialogHeader>
            <DialogTitle>Doctor Details</DialogTitle>
            <DialogDescription>
              Here is a complete doctot details.
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-80 overflow-y-auto">{doctor?.full_name}</div>
          <DialogFooter>
            <DialogClose>
              <Button variant={"outline"}>
                <X />
                Close
              </Button>
            </DialogClose>
            <Button>
              <CalendarCheck /> Book Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DoctorCard;
