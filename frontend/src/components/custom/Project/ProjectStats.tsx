import { Activity, Users, UserPlus, CheckCircle2 } from "lucide-react";
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

interface ProjectStatsProps {
  projectData: Project;
}

const ProjectStats = ({ projectData }: ProjectStatsProps) => {
  return (
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
  );
};

export default ProjectStats;
