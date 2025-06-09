import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Search, User, Check, UserPlus, Mail } from "lucide-react";
import { useParams } from "react-router";

import { DialogContent, Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useActivityLogger from "@/hooks/useActivityLogger";

interface Props {
  taskId: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

const AssignTaskDialog = ({ taskId }: Props) => {
  const { id: projectId } = useParams();

  const [userDetail, setUserDetails] = useState("");
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [dueDate, setDueDate] = useState<string>("");

  const { addActivityLog } = useActivityLogger();

  useEffect(() => {
    if (!userDetail.trim()) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const delay = setTimeout(async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/users/search?q=${userDetail}`,
          { withCredentials: true }
        );
        setSuggestions(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [userDetail]);

  const assignUser = async () => {
    if (!selectedUser) return;
    if (!dueDate) {
      toast.error("Please select a due date");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/task/assign-task",
        {
          userId: selectedUser._id,
          taskId,
          projectId,
          dueDate, // Send dueDate to backend
          email: selectedUser.email,
        },
        { withCredentials: true }
      );
      console.log(response);
      toast.success("Task assigned successfully!");
      setUserDetails("");
      setSuggestions([]);
      setSelectedUser(null);
      setDueDate(""); // Reset dueDate after success

      await addActivityLog({
        projectId: projectId!,
        action: "Assigned task",
        extraInfo: `Task : ${response.data.task.title} is assigned to ${selectedUser.name}`,
      });
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to assign task");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setUserDetails(user.name);
    setSuggestions([]);
  };

  const clearSelection = () => {
    setSelectedUser(null);
    setUserDetails("");
    setSuggestions([]);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 transition-colors">
          Assign Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="w-full space-y-3">
          {/* Search Input */}
          <div className="relative">
            <div className="pb-3">Search User</div>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#606470]"
              />
              <input
                type="text"
                placeholder="Search users to assign..."
                value={userDetail}
                onChange={(e) => {
                  setUserDetails(e.target.value);
                  setSelectedUser(null);
                }}
                className="w-full bg-white border-2 border-[#93deff]/30 focus:border-[#93deff] pl-10 pr-4 py-3 rounded-xl text-[#323643] placeholder-[#606470]/60 transition-all duration-200 focus:outline-none focus:shadow-lg"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-[#93deff]/30 border-t-[#93deff] rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && !selectedUser && (
              <div className="absolute top-full left-0 right-0 bg-white border-2 border-[#93deff]/30 rounded-xl shadow-2xl z-20 mt-2 max-h-48 overflow-y-auto">
                {suggestions.map((user, index) => (
                  <div
                    key={user._id}
                    onClick={() => handleUserSelect(user)}
                    className={`px-4 py-3 hover:bg-[#93deff]/10 cursor-pointer transition-colors duration-150 flex items-center gap-3 ${
                      index !== suggestions.length - 1
                        ? "border-b border-[#93deff]/20"
                        : ""
                    }`}
                  >
                    <div className="w-10 h-10 bg-[#93deff]/20 rounded-full flex items-center justify-center">
                      <User size={18} className="text-[#323643]" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-[#323643]">
                        {user.name}
                      </div>
                      <div className="text-sm text-[#606470] flex items-center gap-1">
                        <Mail size={12} />
                        {user.email}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Due Date Input */}
          {/* Due Date & Time Input */}
          <div className="pt-4">
            <label
              htmlFor="dueDate"
              className="block pb-1 text-sm font-medium text-[#323643]"
            >
              Due Date & Time
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-white border-2 border-[#93deff]/30 focus:border-[#93deff] px-4 py-2 rounded-xl text-[#323643] placeholder-[#606470]/60 transition-all duration-200 focus:outline-none focus:shadow-lg"
            />
          </div>

          {/* Selected User Display */}
          {selectedUser && (
            <div className="bg-[#93deff]/10 border-2 border-[#93deff]/30 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#93deff] rounded-full flex items-center justify-center">
                    <User size={20} className="text-[#323643]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#323643] flex items-center gap-2">
                      <Check size={16} className="text-green-600" />
                      {selectedUser.name}
                    </div>
                    <div className="text-sm text-[#606470] flex items-center gap-1">
                      <Mail size={12} />
                      {selectedUser.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={clearSelection}
                    className="text-[#606470] hover:text-[#323643] px-3 py-1.5 text-sm font-medium transition-colors duration-200"
                  >
                    Change
                  </button>
                  <button
                    onClick={assignUser}
                    disabled={loading || !dueDate}
                    className="bg-[#323643] hover:bg-[#323643]/90 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Assigning...
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} />
                        Assign Task
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* No Results Message */}
          {userDetail.trim() &&
            suggestions.length === 0 &&
            !isSearching &&
            !selectedUser && (
              <div className="text-center py-6 text-[#606470]">
                <User size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  No users found matching "{userDetail}"
                </p>
              </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignTaskDialog;
