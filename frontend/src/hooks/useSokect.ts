// hooks/useSocket.ts
import { useAuthContext } from "@/context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const apiUrl = import.meta.env.VITE_API_URL;

const SOCKET_URL = apiUrl;

export const useSocket = (): Socket | null => {
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user || !user.id) return;

    const s = io(SOCKET_URL, {
      withCredentials: true,
      auth: {
        userId: user.id,
      },
    });

    socketRef.current = s;
    setSocket(s); // ✅ trigger re-render with ready socket

    s.on("connect", () => {
      console.log("✅ Connected to socket server with ID:", s.id);
    });

    // Cleanup on unmount or user change
    return () => {
      s.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [user]);

  return socket;
};
