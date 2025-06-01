"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowRight,
  Calendar,
  Clock,
  FolderOpen,
  Plus,
  Users,
} from "lucide-react";
import { Link } from "react-router";

interface Project {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  members: string[];
  pendingMembers: string[];
  __v: number;
}

const InvitedProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInvitedProjects = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/project/invited-projects",
          { withCredentials: true }
        );
        console.log(response);
        setProjects(response.data.invitedProjects);
      } catch (err) {
        setError("Failed to fetch invited projects");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitedProjects();
  }, []);

  if (loading) return <div>Loading invited projects...</div>;
  if (error) return <div>{error}</div>;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    projects && (
      <div>
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
                      Invited Projects
                    </h1>
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-[#93deff]/20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#93deff]/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <FolderOpen size={24} className="text-[#323643]" />
                    </div>
                    <p className="text-3xl font-bold text-[#323643]">
                      {projects.length}
                    </p>
                    <p className="text-[#606470]">Total Invited Projects</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#93deff]/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Users size={24} className="text-[#323643]" />
                    </div>
                    <p className="text-3xl font-bold text-[#323643]">
                      {projects.reduce(
                        (total, project) => total + project.members.length,
                        0
                      )}
                    </p>
                    <p className="text-[#606470]">Team Members</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#93deff]/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Clock size={24} className="text-[#323643]" />
                    </div>
                    <p className="text-3xl font-bold text-[#323643]">
                      {
                        projects.filter(
                          (p) =>
                            new Date(p.updatedAt) >
                            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                        ).length
                      }
                    </p>
                    <p className="text-[#606470]">Active This Week</p>
                  </div>
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
                  Get started by creating your first project to organize your
                  tasks and collaborate with your team.
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
                        <ArrowRight
                          size={20}
                          className="text-[#606470] group-hover:text-[#323643] group-hover:translate-x-1 transition-all duration-300"
                        />
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
      </div>
    )
  );
};

export default InvitedProjects;
