import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

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

const Request = () => {
  const [inviteProjects, setInviteProjects] = useState<Project[]>([]);

  async function fetchInviteRequest() {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/users/invite-request",
        { withCredentials: true }
      );
      console.log(response);
      setInviteProjects(response.data.inviteProjects);
    } catch (error) {}
  }
  useEffect(() => {
    fetchInviteRequest();
  }, []);

  async function handleAcceptRequest(data: Data) {
    const { e, projectId } = data;
    e.preventDefault();
    // console.log({ e, projectId });

    // API CALL

    try {
      const response = await axios.post(
        "http://localhost:3000/api/project/accept-request",
        { projectId },
        { withCredentials: true }
      );
      //   console.log(response);
      console.log(response.data.message);
    } catch (error) {}
  }

  if (inviteProjects.length === 0) {
    return <div>No Project Found</div>;
  }

  return (
    inviteProjects && (
      <div>
        {inviteProjects.map((project) => (
          <div key={project._id}>
            <p>
              {project.title} invited by {project.createdBy.name}
            </p>
            <Button
              onClick={(e) =>
                handleAcceptRequest({ e, projectId: project._id })
              }
            >
              Accept Request
            </Button>
          </div>
        ))}
      </div>
    )
  );
};

export default Request;
