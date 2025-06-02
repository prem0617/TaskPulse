// components/SocketListener.tsx
import { useSocket } from "@/hooks/useSokect";
import { useEffect } from "react";
import toast from "react-hot-toast";
import type { Task } from "./Task/AllTaks";

export interface IBackendData {
  message: string;
  task: Task;
}

const SocketListener = () => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleAcceptMessage = (data: any) => {
      console.log(data);
      setTimeout(() => {
        toast.success(data);
      }, 300);
    };

    function handleInviteMessage(data: any) {
      console.log(data);
      setTimeout(() => {
        toast.success(data);
      }, 300);
    }

    function handleAddNewTask(data: IBackendData) {
      // console.log(data);
      setTimeout(() => {
        toast.success(data.message);
      }, 300);
    }

    function handleAssignedTask(data: any) {
      console.log(data);
      setTimeout(() => {
        toast.success(data);
      }, 300);
    }

    function handleChangeTaskStatus(data: IBackendData) {
      console.log(data);
      setTimeout(() => {
        toast.success(data.message, {
          position: "bottom-right",
        });
      }, 300);
    }

    socket.on("accept-msg", handleAcceptMessage);
    socket.on("invite-msg", handleInviteMessage);
    socket.on("new-task", handleAddNewTask);
    socket.on("assigned-task", handleAssignedTask);
    socket.on("change-task-status", handleChangeTaskStatus);

    // Clean up
    return () => {
      socket.off("accept-msg", handleAcceptMessage);
      socket.off("invite-msg", handleInviteMessage);
      socket.off("new-task", handleAddNewTask);
      socket.off("assigned-task", handleAssignedTask);
      socket.off("change-task-status", handleChangeTaskStatus);
    };
  }, [socket]);

  return null;
};

export default SocketListener;
