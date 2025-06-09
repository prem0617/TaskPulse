import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import AllTasks from "../Task/AllTaks";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { useSocket } from "@/hooks/useSokect";
import type { SocketData } from "../Request";
import toast from "react-hot-toast";
import ActivityLogs from "./ActivityLogs";
import Chat from "./Chat";
import type { User } from "@/types/user.types";
import ProjectHeader from "./ProjectHeader";
import ProjectStats from "./ProjectStats";
import TeamMember from "./TeamMember";
import ErrorSkeleton from "../common/ErrorSkeleton";

export interface Project {
  createdAt: Date;
  createdBy: string;
  description: string;
  members: User[];
  pendingMembers: User[];
  title: string;
  updatedAt: Date;
}

const OneProject = () => {
  const { id } = useParams();

  const { user } = useAuthContext();

  const socket = useSocket();

  const userId = user?.id;

  const [projectData, setProjectData] = useState<Project>({
    createdAt: new Date(),
    createdBy: "",
    description: "",
    members: [],
    pendingMembers: [],
    title: "",
    updatedAt: new Date(),
  });

  // console.log(projectData);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchProject() {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/project/get-one-project/${id}`,
        { withCredentials: true }
      );
      // console.log(response);
      setProjectData(response.data.project);
    } catch (error) {
      console.log(error);
      setError("Failed to load project details");
    } finally {
      setLoading(false);
    }
  }

  console.log({ userId });
  console.log(projectData);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  useEffect(() => {
    if (!socket) return;

    console.log("socket");
    function handleAlreadyInvited(data: SocketData) {
      console.log("socket");
      console.log(data);
      setTimeout(() => {
        toast.success(data.message, {
          position: "bottom-right",
        });
      }, 300);
    }

    socket.on("invite-new-member", handleAlreadyInvited);
    console.log("hello");

    return () => {
      socket.off("invite-new-member", handleAlreadyInvited);
    };
  }, [socket]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f7] p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-[#93deff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#606470] text-lg">
                Loading project details...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorSkeleton error={error} />;
  }

  if (!id || !user) {
    return (
      <div className="min-h-screen bg-[#f7f7f7] p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-[#93deff]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-[#606470] text-2xl">❓</span>
            </div>
            <h3 className="text-xl font-semibold text-[#323643] mb-2">
              Project ID Missing
            </h3>
            <p className="text-[#606470] mb-6">
              The project ID is missing from the URL
            </p>
            <Link
              to="/projectes"
              className="inline-flex items-center gap-2 bg-[#323643] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#323643]/90 transition-colors"
            >
              <ArrowLeft size={18} />
              Back to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Chat */}
      <Chat user={user} id={id} title={projectData.title} />

      {/* Header Section */}
      <ProjectHeader id={id} projectData={projectData} userId={user.id} />

      {/* Project Stats */}
      <div className="max-w-6xl mx-auto p-8">
        <ProjectStats projectData={projectData} />

        {/* Team Members Section */}
        <TeamMember projectData={projectData} />

        {/* Tasks Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#93deff]/20">
          <div className="p-8 border-b border-[#93deff]/20">
            <h2 className="text-2xl font-bold text-[#323643] flex items-center gap-3">
              <CheckCircle2 size={28} className="text-[#93deff]" />
              Project Tasks
            </h2>
            <p className="text-[#606470] mt-2">
              Manage and track all tasks for this project
            </p>
          </div>

          <div className="p-8">
            <AllTasks id={id} />
          </div>
          <div className="p-8">
            <ActivityLogs id={id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OneProject;
