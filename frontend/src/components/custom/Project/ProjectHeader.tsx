import { Link } from "react-router";
import {
  ArrowLeft,
  Calendar,
  Users,
  FolderOpen,
  Clock,
  UserPlus,
} from "lucide-react";
import AddTaskDialog from "../Task/AddTaskDialog";
import AddNewUser from "../Task/AddNewUser";
import type { User } from "@/types/user.types";

interface Project {
  createdAt: Date;
  createdBy: string;
  description: string;
  members: User[];
  pendingMembers: User[];
  title: string;
  updatedAt: Date;
}

interface ProjectHeaderProps {
  projectData: Project;
  userId: string | undefined;
  id: string;
}

const ProjectHeader = ({ projectData, userId, id }: ProjectHeaderProps) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
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
  );
};

export default ProjectHeader;
