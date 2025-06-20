import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { getInitials } from "@/pages/dashboard/dashboardUtils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Paperclip, Send } from "lucide-react";
import { Input } from "@/components/ui/input";

const ChatDialog = ({ isOpen, onClose, appointment }) => {
  console.log(appointment);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className={"h-12 w-12 border shadow-md rounded-lg"}>
              <AvatarFallback>
                {getInitials(
                  appointment?.doctor?.full_name ||
                    appointment?.patient?.full_name
                )}
              </AvatarFallback>
              <AvatarImage
                src={
                  appointment?.doctor?.doctorProfile?.profile_image ||
                  appointment?.patient?.patientProfile?.profile_image
                }
                alt="Doctor Profile"
              />
            </Avatar>
            <div className="h-full flex flex-col justify-center">
              <DialogTitle>
                {appointment?.doctor?.full_name ? "Dr. " : ""}
                {appointment?.doctor?.full_name ||
                  appointment?.patient?.full_name}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {appointment?.doctor?.doctorProfile?.specialization ||
                  appointment?.patient?.email}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="min-h-80 max-h-80 overflow-y-auto p-4">
          {/* Chat content goes here */}
        </div>
        <DialogFooter>
          <div className="flex w-full items-center gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Type your message here..."
                className="pr-10 pl-3"
              />
              <label
                htmlFor="file-upload"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
              >
                <Paperclip className="w-4 h-4" />
              </label>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={(e) => console.log(e.target.files)}
              />
            </div>

            <Button size="icon" type="submit">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;
