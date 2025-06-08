import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { User, Mail, Calendar, ArrowLeft, Edit, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
}

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [editForm, setEditForm] = useState({
    name: "",
    username: "",
  });
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  async function fetchUser() {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/getUser",
        { userId: id },
        { withCredentials: true }
      );
      setUser(response.data.user || null);
    } catch (error) {
      console.log(error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  const handleEditClick = () => {
    if (user) {
      setEditForm({
        name: user.name,
        username: user.username,
      });
      setIsEditDialogOpen(true);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsUpdating(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/editProfile",
        {
          userId: user.id,
          name: editForm.name,
          username: editForm.username,
        },
        { withCredentials: true }
      );
      console.log(response);
      if (response.data.success) {
        // Update the user state with new data
        setUser({
          ...user,
          name: editForm.name,
          username: editForm.username,
        });
        setIsEditDialogOpen(false);
        console.log("Profile updated successfully");
      }
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      toast.error(error.message || error.data.error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="p-8 bg-[#f7f7f7] min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-[#93deff] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 bg-[#f7f7f7] min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <User size={32} className="text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-[#323643] mb-2">
              User Not Found
            </h3>
            <p className="text-[#606470] mb-6">
              The user you're looking for doesn't exist or has been removed.
            </p>
            <Button
              onClick={() => navigate(-1)}
              className="bg-[#323643] hover:bg-[#323643]/90 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 mx-auto"
            >
              <ArrowLeft size={16} />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#f7f7f7] min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-[#323643] rounded-2xl flex items-center justify-center">
              <User size={24} className="text-[#93deff]" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#323643]">
                User Profile
              </h2>
              <p className="text-[#606470]">
                View user information and account details
              </p>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white border border-[#93deff]/20 rounded-2xl shadow-lg overflow-hidden mb-8">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-[#323643] to-[#323643]/90 p-8 text-white">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-[#93deff]/20 rounded-3xl flex items-center justify-center text-2xl font-bold text-[#93deff]">
                {getInitials(user.name)}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                <div className="flex items-center gap-2 text-[#93deff]/80">
                  <Mail size={16} />
                  <span>{user.email}</span>
                </div>
              </div>
              <Button
                onClick={handleEditClick}
                className="bg-[#93deff]/20 hover:bg-[#93deff]/30 text-[#93deff] border-[#93deff]/30 px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
              >
                <Edit size={16} />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="gap-6">
          {/* Contact Information */}
          <div className="bg-white border border-[#93deff]/20 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#93deff]/20 rounded-xl flex items-center justify-center">
                <Mail size={20} className="text-[#323643]" />
              </div>
              <h3 className="text-xl font-semibold text-[#323643]">
                Contact Information
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-[#f7f7f7] rounded-xl">
                <User size={16} className="text-[#606470]" />
                <div>
                  <p className="text-sm text-[#606470]">Full Name</p>
                  <p className="font-medium text-[#323643]">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#f7f7f7] rounded-xl">
                <Mail size={16} className="text-[#606470]" />
                <div>
                  <p className="text-sm text-[#606470]">Email Address</p>
                  <p className="font-medium text-[#323643]">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#f7f7f7] rounded-xl">
                <Calendar size={16} className="text-[#606470]" />
                <div>
                  <p className="text-sm text-[#606470]">Username</p>
                  <p className="font-medium text-[#323643] font-mono text-sm">
                    {user.username}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#f7f7f7] rounded-xl">
                <Calendar size={16} className="text-[#606470]" />
                <div>
                  <p className="text-sm text-[#606470]">User ID</p>
                  <p className="font-medium text-[#323643] font-mono text-sm">
                    {user.id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Dialog */}
        {isEditDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Dialog Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#93deff]/20 rounded-xl flex items-center justify-center">
                    <Edit size={20} className="text-[#323643]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#323643]">
                    Edit Profile
                  </h3>
                </div>
                <Button
                  onClick={() => setIsEditDialogOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  variant="ghost"
                >
                  <X size={20} className="text-[#606470]" />
                </Button>
              </div>

              {/* Dialog Content */}
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#323643] mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#93deff]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#93deff]/50 focus:border-[#93deff] transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#323643] mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) =>
                        handleInputChange("username", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-[#93deff]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#93deff]/50 focus:border-[#93deff] transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Dialog Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setIsEditDialogOpen(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-[#606470] px-4 py-3 rounded-xl font-medium transition-all duration-200"
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={
                      isUpdating ||
                      !editForm.name.trim() ||
                      !editForm.username.trim()
                    }
                    className="flex-1 bg-[#323643] hover:bg-[#323643]/90 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {isUpdating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
