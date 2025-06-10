import { useAuthContext } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  FolderOpen,
  LogOut,
  Home as HomeIcon,
  ArrowRight,
  LinkIcon,
} from "lucide-react";
import Notification from "./common/Notification";

const Home = () => {
  const { user, setUser } = useAuthContext();
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;
  console.log(apiUrl);

  async function handleLogout() {
    try {
      localStorage.removeItem("tmtoken");
      await axios.get(`${apiUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      toast.success("Logout Successful");
      setUser(null);
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 300);
    } catch (error) {
      console.log(error);
      toast.error("Logout failed");
    }
  }

  const navigationCards = [
    {
      title: "My Profile",
      description: "View and manage your profile information",
      icon: User,
      link: `/profile/${user?.id}`,
      color: "from-blue-500/20 to-blue-600/10",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      title: "Project Requests",
      description: "Manage pending project invitations",
      icon: Mail,
      link: "/invite-request",
      color: "from-green-500/20 to-green-600/10",
      iconColor: "text-green-600",
      borderColor: "border-green-200",
    },
    {
      title: "Invited Projects",
      description: "Access your invited projects",
      icon: FolderOpen,
      link: "/invited-projects",
      color: "from-purple-500/20 to-purple-600/10",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200",
    },
    {
      title: "My Projects",
      description: "Access your projects",
      icon: LinkIcon,
      link: "/projects",
      color: "from-yellow-500/20 to-yellow-600/10",
      iconColor: "text-yellow-600",
      borderColor: "border-purple-200",
    },
  ];

  return (
    <div className="p-8 bg-[#f7f7f7] min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col gap-5 sm:flex-row items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="hidden md:flex w-16 h-16 bg-gradient-to-br from-[#323643] to-[#323643]/80 rounded-3xl  items-center justify-center shadow-lg">
                <HomeIcon size={32} className="text-[#93deff]" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-[#323643] mb-2">
                  Welcome back, {user?.name || "User"}!
                </h1>
                <p className="text-[#606470] text-sm sm:text-base md:text-lg">
                  Manage your projects and collaborate with your team
                </p>
              </div>
            </div>

            {/* User Avatar & Logout */}
            {user && (
              <Button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </Button>
            )}
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#323643] mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {navigationCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <Link
                  key={index}
                  to={card.link}
                  className="group block bg-white border border-[#93deff]/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-[#93deff]/40 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}
                    >
                      <IconComponent size={28} className={card.iconColor} />
                    </div>
                    <ArrowRight
                      size={20}
                      className="text-[#606470] group-hover:text-[#323643] transition-colors group-hover:translate-x-1"
                    />
                  </div>

                  <h3 className="text-xl font-semibold text-[#323643] mb-2 group-hover:text-[#323643]">
                    {card.title}
                  </h3>
                  <p className="text-[#606470] text-sm leading-relaxed">
                    {card.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-[#93deff]/10">
                    <span className="text-sm font-medium text-[#323643] group-hover:text-[#93deff] transition-colors">
                      Get Started →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        <Notification />
      </div>
    </div>
  );
};

export default Home;
