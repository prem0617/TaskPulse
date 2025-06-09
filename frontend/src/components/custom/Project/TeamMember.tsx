import { UserPlus, Users } from "lucide-react";
import type { Project } from "./OneProject";

interface TeamMemberProps {
  projectData: Project;
}

const TeamMember = ({ projectData }: TeamMemberProps) => {
  return (
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
                  {member.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-[#323643]">{member.username}</p>
                <div className="flex justify-center items-center w-full gap-10">
                  <p className="text-sm text-[#606470]">{member.name}</p>
                  <p className="text-sm text-[#606470]">Team Member</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Users size={48} className="text-[#606470] mx-auto mb-4 opacity-50" />
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
                      {member?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-[#323643]">
                      {member?.username}
                    </p>
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
  );
};

export default TeamMember;
