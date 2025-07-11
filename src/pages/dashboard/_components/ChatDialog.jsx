import React, { useEffect, useState, useRef, useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Paperclip,
  Send,
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
} from "lucide-react";
import { getInitials } from "@/pages/dashboard/dashboardUtils";
import { toast } from "sonner";
import Loader from "@/components/loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatMessages, addMessage } from "@/redux/slices/chatSlice";
import { getSmartTimeFormat } from "@/lib/utils";
import axiosInstance from "../../../../axiosInstance";
import { socket } from "../../../../socket";
import { CallContext } from "../../../../context/CallContext";

const ChatDialog = ({ isOpen, onClose, appointment }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state) => state.chat);

  const [newMessage, setNewMessage] = useState({
    sender_id: user?.id,
    receiver_id: appointment?.doctor?.id || appointment?.patient?.id,
    appointment_id: appointment?.id,
    message: "",
  });

  const messagesEndRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [localStream, setLocalStream] = useState(null);
  const [videoDrawerOpen, setVideoDrawerOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);

  const { peerConnectionRef } = useContext(CallContext);

  const createPeerConnection = (otherUserId) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          to: otherUserId,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    return pc;
  };

  const startCall = async () => {
    const pc = createPeerConnection(newMessage.receiver_id);
    peerConnectionRef.current = pc;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setLocalStream(stream);
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      // Open drawer before assigning video
      setVideoDrawerOpen(true);

      // Let drawer render first
      setTimeout(() => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      }, 200);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("call-user", {
        to: newMessage.receiver_id,
        offer,
      });
    } catch (err) {
      console.error("Call start error:", err);
      toast.error("Failed to access webcam or mic.");
    }
  };

  const endCall = () => {
    const pc = peerConnectionRef.current;
    if (pc) {
      pc.close();
      peerConnectionRef.current = null;
    }

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    setVideoDrawerOpen(false);
  };

  // Re-assign video stream to video element when available
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (appointment?.id && isOpen) {
      dispatch(fetchChatMessages(appointment?.id));
    }
  }, [appointment?.id, isOpen, dispatch]);

  useEffect(() => {
    if (messages.length && isOpen && !loading) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages, isOpen, loading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.message.trim()) return;

    try {
      const res = await axiosInstance.post(
        "/api/chat/send-message",
        newMessage
      );
      setNewMessage({ ...newMessage, message: "" });
      dispatch(addMessage(res.data.data));
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.data?.details?.[0] ||
          "Failed to send message"
      );
    }
  };

  const groupMessagesByDate = (messages) => {
    const grouped = {};
    messages?.forEach((msg) => {
      const dateKey = new Date(msg.created_at).toDateString();
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(msg);
    });

    return Object.entries(grouped).map(([date, msgs]) => ({
      date: new Date(date),
      messages: msgs,
    }));
  };

  const formatDateHeader = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border shadow-md rounded-lg">
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
              <div className="flex flex-col">
                <DialogTitle>
                  {appointment?.doctor?.full_name ? "Dr. " : ""}
                  {appointment?.doctor?.full_name ||
                    appointment?.patient?.full_name}
                </DialogTitle>
                <DialogDescription>
                  {appointment?.doctor?.doctorProfile?.specialization ||
                    appointment?.patient?.email}
                </DialogDescription>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={startCall}>
              <Video className="mr-2 h-4 w-4" />
              Video Call
            </Button>
          </div>
        </DialogHeader>

        <div className="min-h-80 max-h-80 overflow-y-auto p-4">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader />
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              {groupedMessages.map((group, i) => (
                <div key={i} className="space-y-4">
                  <div className="w-full flex items-center justify-center py-2">
                    <div className="flex-grow h-px bg-border" />
                    <Badge variant="outline" className="px-6 text-xs">
                      {formatDateHeader(group.date)}
                    </Badge>
                    <div className="flex-grow h-px bg-border" />
                  </div>

                  {group.messages.map((msg) => {
                    const isCurrentUser = msg.sender_id === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex items-start space-x-3 ${
                          isCurrentUser
                            ? "flex-row-reverse space-x-reverse"
                            : ""
                        }`}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={msg.sender_profile_image}
                            alt={msg.sender_name}
                          />
                          <AvatarFallback>
                            {getInitials(msg.sender_name)}
                          </AvatarFallback>
                        </Avatar>

                        <div
                          className={`flex flex-col max-w-[70%] ${
                            isCurrentUser ? "items-end" : "items-start"
                          }`}
                        >
                          <span className="text-xs font-medium text-muted-foreground mb-1">
                            {isCurrentUser ? "You" : msg.sender_name}
                          </span>
                          <div
                            className={`relative px-4 py-3 rounded-2xl shadow-sm ${
                              isCurrentUser
                                ? "bg-primary text-white rounded-tr-none"
                                : "bg-muted border rounded-tl-none"
                            }`}
                          >
                            <p className="text-sm break-words">{msg.message}</p>
                          </div>
                          <span className="text-xs text-muted-foreground mt-1">
                            {getSmartTimeFormat(msg.created_at)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
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
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                <Paperclip className="w-4 h-4 text-muted-foreground" />
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

        <Drawer open={videoDrawerOpen} onOpenChange={setVideoDrawerOpen}>
          <DrawerContent className="min-h-dvh bg-muted flex flex-col justify-between p-0">
            <DrawerHeader className="px-4 pt-4 pb-2 border-b bg-muted">
              <DrawerTitle>In Call</DrawerTitle>
            </DrawerHeader>

            <div className="flex-1 relative overflow-hidden bg-black">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-40 h-28 rounded-md border shadow-lg absolute top-4 right-4 z-10"
              />
            </div>

            <div className="flex justify-center gap-6 items-center px-4 py-4 border-t bg-muted">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const audioTrack = localStream?.getAudioTracks()[0];
                  if (audioTrack) audioTrack.enabled = muted;
                  setMuted((prev) => !prev);
                }}
              >
                {muted ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const videoTrack = localStream?.getVideoTracks()[0];
                  if (videoTrack) videoTrack.enabled = videoOff;
                  setVideoOff((prev) => !prev);
                }}
              >
                {videoOff ? (
                  <VideoOff className="w-5 h-5" />
                ) : (
                  <Video className="w-5 h-5" />
                )}
              </Button>

              <DrawerClose asChild>
                <Button variant="destructive" size="icon" onClick={endCall}>
                  <PhoneOff className="w-5 h-5" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerContent>
        </Drawer>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;
