import React, { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { getInitials } from "@/pages/dashboard/dashboardUtils";
import { Button } from "@/components/ui/button";
import { Paperclip, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import axiosInstance from "../../../../axiosInstance";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, fetchChatMessages } from "@/redux/slices/chatSlice";
import Loader from "@/components/loader/Loader";
import { formatDateTime } from "@/lib/utils";

const ChatDialog = ({ isOpen, onClose, appointment }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [newMessage, setNewMessage] = useState({
    sender_id: user?.id,
    receiver_id: appointment?.doctor?.id || appointment?.patient?.id,
    appointment_id: appointment?.id,
    message: "",
  });
  
  // Create ref for messages container
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.chat);
  console.log(messages, loading, error);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end"
      });
    }
  };

  // Scroll to bottom when dialog opens and messages load
  useEffect(() => {
    if (appointment?.id && isOpen) {
      dispatch(fetchChatMessages(appointment?.id));
    }
  }, [appointment?.id, isOpen, dispatch]);

  // Scroll to bottom when messages change or dialog opens
  useEffect(() => {
    if (isOpen && messages.length > 0 && !loading) {
      // Add a small delay to ensure DOM is updated
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen, loading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.message.trim()) {
      return;
    }
    try {
      const response = await axiosInstance.post(
        "/api/chat/send-message",
        newMessage
      );
      setNewMessage({ ...newMessage, message: "" });
      dispatch(addMessage(response?.data?.data));
      // Scroll to bottom after sending message
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message ||
          error?.data?.details[0] ||
          "Failed to send message"
      );
    }
  };

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
                alt="Profile"
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
        <div 
          ref={messagesContainerRef}
          className="min-h-80 max-h-80 overflow-y-auto p-4"
        >
          {loading && (
            <div className="w-full h-full flex items-center justify-center">
              <Loader />
            </div>
          )}
          <div className="flex flex-col space-y-4 p-4">
            {messages?.map((msg) => {
              const isCurrentUser = msg.sender_id === user?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-3 ${
                    isCurrentUser ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  {/* Avatar */}
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage
                      src={msg?.sender_profile_image}
                      alt={msg?.sender_name}
                    />
                    <AvatarFallback>
                      {getInitials(msg.sender_name)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Message Content */}
                  <div
                    className={`flex flex-col max-w-[70%] ${
                      isCurrentUser ? "items-end" : "items-start"
                    }`}
                  >
                    {/* Sender Name */}
                    <span
                      className={`text-xs font-medium text-muted-foreground mb-1 ${
                        isCurrentUser ? "text-right" : "text-left"
                      }`}
                    >
                      {isCurrentUser ? "You" : msg.sender_name}
                    </span>

                    {/* Message Bubble */}
                    <div
                      className={`relative px-4 py-3 rounded-2xl shadow-sm ${
                        isCurrentUser
                          ? "bg-primary text-white rounded-tr-none"
                          : "bg-muted-foreground text-white border rounded-tr-none"
                      }`}
                    >
                      <p className="text-sm leading-relaxed break-words">
                        {msg?.message}
                      </p>
                    </div>

                    {/* Timestamp */}
                    <span
                      className={`text-xs text-muted-foreground mt-1 ${
                        isCurrentUser ? "text-right" : "text-left"
                      }`}
                    >
                      {formatDateTime(msg.created_at)}
                    </span>
                  </div>
                </div>
              );
            })}
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <DialogFooter>
          <form
            onSubmit={handleSendMessage}
            className="flex w-full items-center gap-2"
          >
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Type your message here..."
                className="pr-10 pl-3"
                value={newMessage.message}
                onChange={(e) =>
                  setNewMessage({ ...newMessage, message: e.target.value })
                }
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
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;