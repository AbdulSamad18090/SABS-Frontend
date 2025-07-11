import React, { useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CallContext } from "../../../context/CallContext";
import { socket } from "../../../socket";

const GlobalIncomingCallDialog = () => {
  const {
    incomingCall,
    setIncomingCall,
    showIncomingPopup,
    setShowIncomingPopup,
    peerConnectionRef,
  } = useContext(CallContext);

  const acceptCall = async () => {
    setShowIncomingPopup(false);

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnectionRef.current = pc;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    await pc.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socket.emit("answer-call", {
      to: incomingCall.from,
      answer,
    });

    setIncomingCall(null);
  };

  const rejectCall = () => {
    setShowIncomingPopup(false);
    setIncomingCall(null);
    // Optional: Notify caller that call was rejected
  };

  return (
    <Dialog open={showIncomingPopup} onOpenChange={setShowIncomingPopup}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Incoming Call</DialogTitle>
          <DialogDescription>
            You have an incoming video call. Do you want to accept it?
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-4 pt-4">
          <Button variant="secondary" onClick={rejectCall}>
            Reject
          </Button>
          <Button onClick={acceptCall}>Accept</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalIncomingCallDialog;
