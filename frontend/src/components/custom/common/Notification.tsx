// import { useAuthContext } from "@/context/AuthContext";
// import { useSocket } from "@/hooks/useSokect";
import { Bell } from "lucide-react";
// import { useEffect } from "react";

const Notification = () => {
  // const socket = useSocket();
  // const { user } = useAuthContext();

  // useEffect(() => {
  //   if (!socket) return;

  //   function handleNotification(data) {
  //     console.log(data);
  //   }

  //   socket.on("notification", handleNotification);

  //   return () => {
  //     socket.off("notification", handleNotification);
  //   };
  // }, [socket, user]);

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#93deff]/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#93deff]/20 rounded-xl flex items-center justify-center">
          <Bell size={20} className="text-[#323643]" />
        </div>
        <h3 className="text-xl font-semibold text-[#323643]">
          Recent Activity
        </h3>
      </div>

      <div className="text-center py-8">
        <div className="w-16 h-16 bg-[#93deff]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Bell size={24} className="text-[#606470]" />
        </div>
        <p className="text-[#606470]">No recent activity to show</p>
        <p className="text-sm text-[#606470] mt-1">
          Start collaborating on projects to see your activity here
        </p>
      </div>
    </div>
  );
};

export default Notification;
