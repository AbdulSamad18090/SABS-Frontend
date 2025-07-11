// context/CallContext.js
import React, { createContext, useState, useEffect, useRef } from "react";
import { socket } from "../socket";

export const CallContext = createContext();

export const CallProvider = ({ children }) => {
  const [incomingCall, setIncomingCall] = useState(null);
  const [showIncomingPopup, setShowIncomingPopup] = useState(false);
  const peerConnectionRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join", user?.id);

    socket.on("incoming-call", ({ from, offer }) => {
      setIncomingCall({ from, offer });
      setShowIncomingPopup(true);
    });

    return () => {
      socket.off("incoming-call");
    };
  }, [user?.id]);

  const value = {
    incomingCall,
    showIncomingPopup,
    setShowIncomingPopup,
    setIncomingCall,
    peerConnectionRef,
  };

  return (
    <CallContext.Provider value={value}>
      {children}
    </CallContext.Provider>
  );
};
