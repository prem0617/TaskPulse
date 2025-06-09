import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import {
  FolderOpen,
  Calendar,
  Users,
  Clock,
  Plus,
  ArrowRight,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSocket } from "@/hooks/useSokect";

export interface Project {
  _id: string;
  title: string;
  description: string;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  createdBy: string; // User ID
  members: string[]; // Array of user IDs
  pendingMembers: string[]; // Array of user IDs
  __v: number; // Version key used by Mongoose
}

interface DeleteProjectData {
  e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>;
  projectId: string;
}

const AllProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const socket = useSocket();

  const fetchAllProjects = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/project/get-project",
        {
          withCredentials: true,
        }
      );
      console.log(response);
      setProjects(response.data.projects); // assuming response has { projects: [...] }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProjects();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDelete = async (data: DeleteProjectData) => {
    const { e, projectId } = data;
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:3000/api/project/delete-project",
        { projectId },
        { withCredentials: true }
      );

      // Remove from UI
      // setProjects((prev: Project[]) => prev.filter((p) => p._id !== projectId));
      toast.success("Project deleted!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete project");
    }
  };

  useEffect(() => {
    if (!socket) return;

    function handleDeleteProject({ projectId }: { projectId: string }) {
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
    }

    socket.on("delete-project", handleDeleteProject);

    return () => {
      socket.off("delete-project", handleDeleteProject);
    };
  }, [socket]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f7] p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-[#93deff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#606470] text-lg">Loading your projects...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#323643] rounded-3xl flex items-center justify-center">
                <FolderOpen size={32} className="text-[#93deff]" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-[#323643]">
                  My Projects
                </h1>
                <p className="text-[#606470] text-lg">
                  Manage and organize your work
                </p>
              </div>
            </div>

            <Link to="/createproject">
              <button className="bg-[#93deff] hover:bg-[#7bc9f0] text-[#323643] font-semibold px-6 py-3 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center gap-2">
                <Plus size={20} />
                New Project
              </button>
            </Link>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-[#93deff]/20">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#93deff]/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <FolderOpen size={24} className="text-[#323643]" />
              </div>
              <p className="text-3xl font-bold text-[#323643]">
                {projects.length}
              </p>
              <p className="text-[#606470]">Total Projects</p>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {projects?.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-[#93deff]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FolderOpen size={48} className="text-[#606470]" />
            </div>
            <h3 className="text-2xl font-semibold text-[#323643] mb-3">
              No projects yet
            </h3>
            <p className="text-[#606470] mb-6 max-w-md mx-auto">
              Get started by creating your first project to organize your tasks
              and collaborate with your team.
            </p>
            <Link to="/createproject">
              <button className="bg-[#323643] hover:bg-[#323643]/90 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl flex items-center gap-2 mx-auto">
                <Plus size={20} />
                Create Your First Project
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects?.map((project: Project) => (
              <Link
                key={project._id}
                to={`/project/${project._id}`}
                className="group"
              >
                <div className="bg-white border-2 border-[#93deff]/20 hover:border-[#93deff]/60 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] h-full">
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-[#93deff]/20 rounded-2xl flex items-center justify-center">
                      <FolderOpen size={28} className="text-[#323643]" />
                    </div>
                    <div className="flex justify-center items-center gap-5">
                      <button
                        onClick={(e) =>
                          handleDelete({ projectId: project._id, e })
                        }
                        className="cursor-pointer px-2 py-2 bg-red-100 rounded-md"
                      >
                        <Trash2 className="bg-transparent text-red-500" />
                      </button>
                    </div>
                  </div>

                  {/* Project Title */}
                  <h3 className="text-xl font-bold text-[#323643] mb-3 line-clamp-2 min-h-[3.5rem]">
                    {project.title}
                  </h3>

                  {/* Project Description */}
                  <p className="text-[#606470] mb-6 line-clamp-3 leading-relaxed min-h-[4.5rem]">
                    {project.description}
                  </p>

                  {/* Project Stats */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <Users size={16} className="text-[#606470]" />
                      <span className="text-sm text-[#606470]">
                        {project.members.length} member
                        {project.members.length !== 1 ? "s" : ""}
                      </span>
                      {project.pendingMembers.length > 0 && (
                        <span className="text-xs bg-[#93deff]/20 text-[#323643] px-2 py-1 rounded-full">
                          +{project.pendingMembers.length} pending
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-[#606470]" />
                      <span className="text-sm text-[#606470]">
                        Created {formatDate(project.createdAt)}
                      </span>
                    </div>

                    {project.updatedAt !== project.createdAt && (
                      <div className="flex items-center gap-3">
                        <Clock size={16} className="text-[#606470]" />
                        <span className="text-sm text-[#606470]">
                          Updated {formatDate(project.updatedAt)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Project Footer */}
                  <div className="pt-4 border-t border-[#93deff]/20">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[#323643]">
                        View Project
                      </span>
                      <div className="w-8 h-8 bg-[#93deff] rounded-full flex items-center justify-center group-hover:bg-[#323643] transition-colors duration-300">
                        <ArrowRight
                          size={16}
                          className="text-[#323643] group-hover:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProjects;
