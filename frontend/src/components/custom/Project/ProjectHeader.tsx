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
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-[#606470] hover:text-[#323643] font-medium transition-colors duration-200 text-sm sm:text-base"
          >
            <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
            All Projects
          </Link>
        </div>

        {/* Project Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 flex-1">
            {/* Project Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#93deff] rounded-2xl sm:rounded-3xl flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
              <FolderOpen
                size={32}
                className="sm:w-10 sm:h-10 text-[#323643]"
              />
            </div>

            {/* Project Details */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#323643] mb-2 sm:mb-3 break-words">
                {projectData.title}
              </h1>
              <p className="text-[#606470] text-sm sm:text-base lg:text-lg leading-relaxed mb-4 sm:mb-6 max-w-3xl">
                {projectData.description}
              </p>

              {/* Project Meta Info */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-center gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <Calendar
                    size={16}
                    className="text-[#606470] flex-shrink-0"
                  />
                  <span className="text-[#606470]">
                    Created {formatDate(projectData.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-[#606470] flex-shrink-0" />
                  <span className="text-[#606470]">
                    Updated {formatDate(projectData.updatedAt)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Users size={16} className="text-[#606470] flex-shrink-0" />
                  <span className="text-[#606470]">
                    {projectData.members.length} member
                    {projectData.members.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {projectData.pendingMembers.length > 0 && (
                  <div className="flex items-center gap-2">
                    <UserPlus
                      size={16}
                      className="text-[#606470] flex-shrink-0"
                    />
                    <span className="text-[#606470]">
                      {projectData.pendingMembers.length} pending invitation
                      {projectData.pendingMembers.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {projectData.createdBy === userId && (
            <div className="flex flex-row sm:flex-col gap-3 sm:gap-4 justify-center sm:justify-start">
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
