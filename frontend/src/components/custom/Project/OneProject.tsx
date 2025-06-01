import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import AddTaskDialog from "../Task/AddTaskDialog";
import AllTasks from "../Task/AllTaks";
import {
  ArrowLeft,
  Calendar,
  Users,
  FolderOpen,
  Clock,
  UserPlus,
  Activity,
  CheckCircle2,
} from "lucide-react";
import AddNewUser from "../Task/AddNewUser";
import { useAuthContext } from "@/context/AuthContext";

interface Project {
  createdAt: Date;
  createdBy: string;
  description: string;
  members: string[];
  pendingMembers: string[];
  title: string;
  updatedAt: Date;
}

const OneProject = () => {
  const { id } = useParams();

  const { user } = useAuthContext();

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchProject() {
    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:3000/api/project/get-one-project/${id}`,
        { projectId: id },
        { withCredentials: true }
      );
      console.log(response);
      setProjectData(response.data.project);
    } catch (error) {
      console.log(error);
      setError("Failed to load project details");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

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
    return (
      <div className="min-h-screen bg-[#f7f7f7] p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h3 className="text-xl font-semibold text-[#323643] mb-2">
              Error Loading Project
            </h3>
            <p className="text-[#606470] mb-6">{error}</p>
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

  if (!id) {
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
      {/* Header Section */}
      <div className="bg-white border-b border-[#93deff]/20 shadow-sm">
        <div className="max-w-6xl mx-auto p-8">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-[#606470] hover:text-[#323643] font-medium transition-colors duration-200"
            >
              <ArrowLeft size={20} />
              All Projects
            </Link>
          </div>

          {/* Project Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-[#93deff] rounded-3xl flex items-center justify-center flex-shrink-0">
                <FolderOpen size={40} className="text-[#323643]" />
              </div>

              <div className="flex-1">
                <h1 className="text-4xl font-bold text-[#323643] mb-3">
                  {projectData.title}
                </h1>
                <p className="text-[#606470] text-lg leading-relaxed mb-6 max-w-3xl">
                  {projectData.description}
                </p>

                {/* Project Meta Info */}
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-[#606470]" />
                    <span className="text-[#606470]">
                      Created {formatDate(projectData.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-[#606470]" />
                    <span className="text-[#606470]">
                      Updated {formatDate(projectData.updatedAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users size={18} className="text-[#606470]" />
                    <span className="text-[#606470]">
                      {projectData.members.length} member
                      {projectData.members.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {projectData.pendingMembers.length > 0 && (
                    <div className="flex items-center gap-2">
                      <UserPlus size={18} className="text-[#606470]" />
                      <span className="text-[#606470]">
                        {projectData.pendingMembers.length} pending invitation
                        {projectData.pendingMembers.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {projectData.createdBy === userId && (
              <div className="flex flex-col gap-4">
                <div className="flex-shrink-0">
                  <AddTaskDialog id={id} />
                </div>
                <div className="flex-shrink-0">
                  <AddNewUser id={id} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project Stats */}
      <div className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#93deff]/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#93deff]/20 rounded-xl flex items-center justify-center">
                <Activity size={24} className="text-[#323643]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#323643]">
                  {Math.ceil(
                    (new Date().getTime() -
                      new Date(projectData.createdAt).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}
                </p>
                <p className="text-sm text-[#606470]">Days Active</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#93deff]/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#93deff]/20 rounded-xl flex items-center justify-center">
                <Users size={24} className="text-[#323643]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#323643]">
                  {projectData.members.length}
                </p>
                <p className="text-sm text-[#606470]">Team Members</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#93deff]/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#93deff]/20 rounded-xl flex items-center justify-center">
                <UserPlus size={24} className="text-[#323643]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#323643]">
                  {projectData.pendingMembers.length}
                </p>
                <p className="text-sm text-[#606470]">Pending Invites</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#93deff]/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#323643]">
                  {projectData.members.length > 0 ? "Active" : "Inactive"}
                </p>
                <p className="text-sm text-[#606470]">Project Status</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#93deff]/20 mb-8">
          <h2 className="text-2xl font-bold text-[#323643] mb-6 flex items-center gap-3">
            <Users size={28} className="text-[#93deff]" />
            Team Members
          </h2>

          {projectData.members.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectData.members.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-[#f7f7f7] rounded-xl"
                >
                  <div className="w-10 h-10 bg-[#93deff] rounded-full flex items-center justify-center">
                    <span className="text-[#323643] font-semibold">
                      {member.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-[#323643]">{member}</p>
                    <p className="text-sm text-[#606470]">Team Member</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users
                size={48}
                className="text-[#606470] mx-auto mb-4 opacity-50"
              />
              <p className="text-[#606470] text-lg">No team members yet</p>
              <p className="text-[#606470] text-sm">
                Invite members to collaborate on this project
              </p>
            </div>
          )}

          {projectData.pendingMembers.length > 0 && (
            <>
              <div className="border-t border-[#93deff]/20 mt-8 pt-8">
                <h3 className="text-lg font-semibold text-[#323643] mb-4 flex items-center gap-2">
                  <UserPlus size={20} className="text-[#93deff]" />
                  Pending Invitations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projectData.pendingMembers.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl"
                    >
                      <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center">
                        <span className="text-yellow-800 font-semibold">
                          {member.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-[#323643]">{member}</p>
                        <p className="text-sm text-yellow-700">
                          Invitation Pending
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

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
        </div>
      </div>
    </div>
  );
};

export default OneProject;
