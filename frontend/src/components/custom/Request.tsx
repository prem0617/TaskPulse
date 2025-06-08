import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useSocket } from "@/hooks/useSokect";
import toast from "react-hot-toast";
import {
  Mail,
  User,
  Calendar,
  Clock,
  Check,
  Users,
  FolderOpen,
} from "lucide-react";
import useActivityLogger from "@/hooks/useActivityLogger";
import { useAuthContext } from "@/context/AuthContext";

interface CreatedBy {
  name: string;
  email: string;
  id: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  createdBy: CreatedBy;
  members: string[];
  pendingMembers: string[];
  createdAt: string;
  updatedAt: string;
}

interface Data {
  projectId: string;
  e: React.FormEvent;
}

export interface SocketData {
  message: string;
  project: Project;
}

const Request = () => {
  const [inviteProjects, setInviteProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingRequests, setAcceptingRequests] = useState<string[]>([]);

  const { user } = useAuthContext();

  const { addActivityLog } = useActivityLogger(); // use the hook

  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    function handleAcceptMessage(data: SocketData) {
      console.log(data);
      const { project, message } = data;
      console.log({ project, message });

      setInviteProjects((prevProject) =>
        prevProject.filter((p) => p._id !== project._id)
      );

      toast.success(data.message);
    }

    function handleInviteUser(data: SocketData) {
      console.log(data);
      const { project, message } = data;
      console.log({ project, message });

      setInviteProjects((prevProject) => [...prevProject, project]);

      toast.success(data.message);
    }

    socket.on("accept-msg", handleAcceptMessage);
    socket.on("invite-member", handleInviteUser);
  }, [socket]);

  async function fetchInviteRequest() {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3000/api/users/invite-request",
        { withCredentials: true }
      );
      console.log(response);
      setInviteProjects(response.data.inviteProjects);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInviteRequest();
  }, []);

  async function handleAcceptRequest(data: Data) {
    const { e, projectId } = data;
    e.preventDefault();

    setAcceptingRequests((prev) => [...prev, projectId]);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/project/accept-request",
        { projectId },
        { withCredentials: true }
      );

      console.log(response.data.message);

      // ✅ Log the activity
      await addActivityLog({
        projectId,
        action: "Accepted invite request",
        extraInfo: `${user?.name} accepted invitation to project ${projectId}`,
      });
    } catch (error) {
      console.error("Error accepting request or adding log:", error);
    } finally {
      setAcceptingRequests((prev) => prev.filter((id) => id !== projectId));
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  return (
    <div className="p-8 bg-[#f7f7f7] min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-[#323643] rounded-2xl flex items-center justify-center">
              <Mail size={24} className="text-[#93deff]" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#323643]">
                Project Invitations
              </h2>
              <p className="text-[#606470]">
                Manage your pending project invitations
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-[#93deff]/20 inline-flex items-center gap-3">
            <div className="w-10 h-10 bg-[#93deff]/20 rounded-xl flex items-center justify-center">
              <Users size={20} className="text-[#323643]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#323643]">
                {inviteProjects.length}
              </p>
              <p className="text-sm text-[#606470]">Pending Invitations</p>
            </div>
          </div>
        </div>

        {/* Invitations List */}
        {inviteProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-[#93deff]/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Mail size={32} className="text-[#606470]" />
            </div>
            <h3 className="text-xl font-semibold text-[#323643] mb-2">
              No pending invitations
            </h3>
            <p className="text-[#606470]">
              You're all caught up! No project invitations at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {inviteProjects.map((project) => (
              <div
                key={project._id}
                className="bg-white border border-[#93deff]/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-[#93deff]/40"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#93deff]/20 to-[#93deff]/10 rounded-2xl flex items-center justify-center">
                      <FolderOpen size={24} className="text-[#323643]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#323643] mb-2">
                        {project.title}
                      </h3>
                      <p className="text-[#606470] leading-relaxed mb-4">
                        {project.description}
                      </p>

                      {/* Project Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-[#606470]" />
                          <div>
                            <span className="text-sm font-medium text-[#323643]">
                              Invited by
                            </span>
                            <p className="text-sm text-[#606470]">
                              {project.createdBy.name}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-[#606470]" />
                          <div>
                            <span className="text-sm font-medium text-[#323643]">
                              Invited on
                            </span>
                            <p className="text-sm text-[#606470]">
                              {formatDate(project.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-[#606470]" />
                          <div>
                            <span className="text-sm font-medium text-[#323643]">
                              Team size
                            </span>
                            <p className="text-sm text-[#606470]">
                              {project.members.length} member
                              {project.members.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-[#606470]" />
                          <div>
                            <span className="text-sm font-medium text-[#323643]">
                              Created
                            </span>
                            <p className="text-sm text-[#606470]">
                              {formatDate(project.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Invitation Badge */}
                      <div className="inline-flex items-center gap-2 bg-[#93deff]/10 text-[#323643] px-3 py-1.5 rounded-full text-sm font-medium">
                        <Mail size={14} />
                        Pending Invitation
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Section */}
                <div className="border-t border-[#93deff]/20 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-[#606470]">
                      Join{" "}
                      <span className="font-medium text-[#323643]">
                        {project.title}
                      </span>{" "}
                      to start collaborating
                    </div>
                    <Button
                      onClick={(e) =>
                        handleAcceptRequest({ e, projectId: project._id })
                      }
                      disabled={acceptingRequests.includes(project._id)}
                      className="bg-[#323643] hover:bg-[#323643]/90 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {acceptingRequests.includes(project._id) ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Accepting...
                        </>
                      ) : (
                        <>
                          <Check size={16} />
                          Accept Invitation
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Request;
