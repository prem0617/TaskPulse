// AllTasks.tsx
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FileText } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { useSocket } from "@/hooks/useSokect";
import type { IBackendData } from "../SocketListener";
import type { Project } from "../Project/AllProjects";
import useActivityLogger from "@/hooks/useActivityLogger";
import LoadingSpinner from "./LoadingSpinner";
import TaskStats from "./TaskStats";
import TaskColumn from "./TaskColumn";

interface Props {
  id: string; // projectId
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: "To Do" | "In Progress" | "Done";
  projectId: Project;
  assignedTo: AssignTo;
  priority: "low" | "medium" | "high";
  labels: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface AssignTo {
  name: string;
  email: string;
  id: string;
}

interface Data {
  taskId: string;
  status: string;
}

const AllTasks = ({ id }: Props) => {
  const socket = useSocket();
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const { addActivityLog } = useActivityLogger();

  async function fetchTasks() {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/project/get-tasks",
        { projectId: id },
        { withCredentials: true }
      );
      setTasks(response.data.tasks);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  async function handleChangeStatus(data: Data) {
    const { status, taskId } = data;
    try {
      const response = await axios.post(
        "http://localhost:3000/api/task/modify-task-status",
        { taskId: taskId, status: status },
        { withCredentials: true }
      );

      await addActivityLog({
        projectId: id,
        action: "Task Status Changed",
        extraInfo: `Task : ${response.data.task.title} status is changed`,
      });
    } catch (error) {
      console.log(error);
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/task/delete-task?taskId=${taskId}`,
        { withCredentials: true }
      );

      await addActivityLog({
        projectId: id,
        action: "Task Deleted",
        extraInfo: `Task : ${response.data.task.title} is deleted`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const { ToDoTasks, InProgressTasks, DoneTasks } = useMemo(() => {
    const ToDoTasks = tasks.filter((t) => t.status === "To Do");
    const InProgressTasks = tasks.filter((t) => t.status === "In Progress");
    const DoneTasks = tasks.filter((t) => t.status === "Done");
    return { ToDoTasks, InProgressTasks, DoneTasks };
  }, [tasks]);

  useEffect(() => {
    if (!socket) return;

    function handleChangeTaskStatus(data: IBackendData) {
      const { task } = data;
      setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
    }

    function handleAddNewTask(data: IBackendData) {
      const { task } = data;
      setTasks((prev) => [...prev, task]);
    }

    function handleDeleteTask(data: Task) {
      setTasks((prev) => prev.filter((t) => t._id !== data._id));
    }

    socket.on("change-task-status", handleChangeTaskStatus);
    socket.on("new-task", handleAddNewTask);
    socket.on("delete-task", handleDeleteTask);

    return () => {
      socket.off("change-task-status", handleChangeTaskStatus);
      socket.off("new-task", handleAddNewTask);
      socket.off("delete-task", handleDeleteTask);
    };
  }, [socket]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-8 bg-[#f7f7f7] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-[#323643] rounded-2xl flex items-center justify-center">
              <FileText size={24} className="text-[#93deff]" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#323643]">All Tasks</h2>
              <p className="text-[#606470]">
                Manage and track your project tasks
              </p>
            </div>
          </div>

          <TaskStats
            toDoCount={ToDoTasks.length}
            inProgressCount={InProgressTasks.length}
            doneCount={DoneTasks.length}
          />
        </div>

        {/* Tasks Grid */}
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-[#93deff]/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <FileText size={32} className="text-[#606470]" />
            </div>
            <h3 className="text-xl font-semibold text-[#323643] mb-2">
              No tasks yet
            </h3>
            <p className="text-[#606470]">
              Create your first task to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            <TaskColumn
              title="To Do"
              tasks={ToDoTasks}
              status="To Do"
              user={user}
              onChangeStatus={handleChangeStatus}
              onDeleteTask={handleDeleteTask}
            />
            <TaskColumn
              title="In Progress"
              tasks={InProgressTasks}
              status="In Progress"
              user={user}
              onChangeStatus={handleChangeStatus}
              onDeleteTask={handleDeleteTask}
            />
            <TaskColumn
              title="Done"
              tasks={DoneTasks}
              status="Done"
              user={user}
              onChangeStatus={handleChangeStatus}
              onDeleteTask={handleDeleteTask}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTasks;
