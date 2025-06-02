import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSocket } from "@/hooks/useSokect";
import axios from "axios";
import { Check, FileText, Mail, Plus, User, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  username: string;
}

interface Props {
  id: string; // projectId
}

const AddNewUser = ({ id: projectId }: Props) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [_isSubmitting, setIsSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [_isSearching, setIsSearching] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    if (!userEmail.trim()) {
      setSuggestions([]);
      return;
    }

    const delay = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await axios.get(
          `http://localhost:3000/api/users/search?q=${userEmail}`,
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
  }, [userEmail]);

  useEffect(() => {
    if (!socket) return;
    console.log("hello");
  }, [socket]);

  async function handleAddUser(e?: React.FormEvent) {
    e?.preventDefault();
    if (!selectedUser) return;

    setIsSubmitting(true);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/project/send-request",
        {
          memberId: selectedUser._id,
          username: selectedUser.username,
          projectId,
        }, // Adjust payload as needed
        { withCredentials: true }
      );

      console.log("API Response:", res.data);
      // You can show a toast here on success

      setUserEmail("");
      setSelectedUser(null);
      setOpenDialog(false);
    } catch (error) {
      console.error("Error sending request:", error);
      // You can show a toast here on error
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpenDialog(true)}
          className="bg-[#93deff] hover:bg-[#7bc9f0] text-[#323643] font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center gap-2"
        >
          <Plus size={18} />
          Add New User
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[#f7f7f7] border-none shadow-2xl rounded-2xl max-w-md w-full">
        <DialogHeader className="space-y-3 pb-6">
          <DialogTitle className="text-2xl font-bold text-[#323643] flex items-center gap-3">
            <div className="w-10 h-10 bg-[#93deff] rounded-xl flex items-center justify-center">
              <Plus size={20} className="text-[#323643]" />
            </div>
            Create New User
          </DialogTitle>
          <DialogDescription className="text-[#606470] text-base">
            Add a new task to your project and stay organized
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAddUser} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#323643] flex items-center gap-2">
              <FileText size={16} />
              Enter user Email :
            </label>
            <input
              type="text"
              name="email"
              value={userEmail}
              onChange={(e) => {
                setUserEmail(e.target.value);
                setSelectedUser(null); // clear selected user when typing
              }}
              required
              placeholder="Enter task title..."
              className="w-full bg-white border-2 border-[#93deff]/30 focus:border-[#93deff] px-4 py-3 rounded-xl text-[#323643] placeholder-[#606470]/60 transition-colors duration-200 focus:outline-none"
            />
            {/* Suggestion list */}
            {suggestions.length > 0 && !selectedUser && (
              <div className="bg-white border border-[#93deff]/40 rounded-xl mt-2 shadow-lg max-h-48 overflow-y-auto">
                {suggestions.map((user) => (
                  <button
                    key={user._id}
                    type="button"
                    onClick={() => {
                      setSelectedUser(user);
                      setSuggestions([]);
                      setUserEmail(user.email);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#93deff]/20 transition-colors"
                  >
                    <div className="font-medium text-[#323643]">
                      {user.name}
                    </div>
                    <div className="text-sm text-[#606470]">{user.email}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

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
                    type="button"
                    onClick={() => handleAddUser()}
                    className="bg-[#323643] hover:bg-[#323643]/90 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <UserPlus size={16} />
                    Add User
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewUser;
