// hooks/useSocket.ts
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000"; // Change to your server's URL

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Connect
    socketRef.current = io(SOCKET_URL, {
      withCredentials: true, // optional, based on your backend CORS setup
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to socket server with ID:", socketRef.current!.id);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return socketRef.current;
};
