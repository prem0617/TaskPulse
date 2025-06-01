import { useEffect, useState } from "react";
import axios from "axios";
import AssignTaskDialog from "./AssignTask";
import {
  Calendar,
  CheckCircle2,
  Circle,
  PlayCircle,
  User,
  FileText,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";

interface Props {
  id: string; // projectId
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: "To Do" | "In Progress" | "Done";
  projectId?: string;
  assignedTo: AssignTo;
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAuthContext();
  // console.log(tasks);
  const [loading, setLoading] = useState(true);
  console.log(id);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Done":
        return <CheckCircle2 size={16} className="text-green-600" />;
      case "In Progress":
        return <PlayCircle size={16} className="text-blue-600" />;
      default:
        return <Circle size={16} className="text-[#606470]" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue = (dueDate: Date) => {
    return (
      new Date(dueDate) < new Date() &&
      new Date(dueDate).toDateString() !== new Date().toDateString()
    );
  };

  const tasksByStatus = {
    "To Do": tasks.filter((task) => task.status === "To Do"),
    "In Progress": tasks.filter((task) => task.status === "In Progress"),
    Done: tasks.filter((task) => task.status === "Done"),
  };

  async function handleChangeStatus(data: Data) {
    const { status, taskId } = data;
    // API CALL
    try {
      const response = await axios.post(
        "http://localhost:3000/api/task/modify-task-status",
        {
          taskId: taskId,
          status: status,
        },
        { withCredentials: true }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  if (loading) {
    return (
      <div className="p-8 bg-[#f7f7f7] min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-[#93deff] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
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

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-[#93deff]/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Circle size={20} className="text-[#606470]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#323643]">
                    {tasksByStatus["To Do"].length}
                  </p>
                  <p className="text-sm text-[#606470]">To Do</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-lg border border-[#93deff]/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <PlayCircle size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#323643]">
                    {tasksByStatus["In Progress"].length}
                  </p>
                  <p className="text-sm text-[#606470]">In Progress</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-lg border border-[#93deff]/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle2 size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#323643]">
                    {tasksByStatus["Done"].length}
                  </p>
                  <p className="text-sm text-[#606470]">Completed</p>
                </div>
              </div>
            </div>
          </div>
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
            {/* To Do Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Circle size={20} className="text-[#606470]" />
                <h3 className="text-lg font-semibold text-[#323643]">To Do</h3>
                <span className="bg-gray-100 text-[#606470] text-xs px-2 py-1 rounded-full">
                  {tasksByStatus["To Do"].length}
                </span>
              </div>
              {tasksByStatus["To Do"].map((task) => (
                <div
                  key={task._id}
                  className="bg-white border border-[#93deff]/20 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-[#93deff]/40"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="mt-1">{getStatusIcon(task.status)}</div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-[#323643] mb-2">
                        {task.title}
                      </h4>
                      <p className="text-[#606470] text-sm leading-relaxed mb-3">
                        {task.description}
                      </p>

                      <div className="flex items-center gap-2 mb-3">
                        <Calendar size={12} className="text-[#606470]" />
                        <span
                          className={`text-xs ${
                            isOverdue(task.dueDate)
                              ? "text-red-600 font-medium"
                              : "text-[#606470]"
                          }`}
                        >
                          {formatDate(task.dueDate)}
                          {isOverdue(task.dueDate) && (
                            <span className="ml-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                              Overdue
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Move Task Button */}
                  <div className="flex justify-between items-center pt-3 border-t border-[#93deff]/20">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-[#606470]" />
                      {task.assignedTo ? (
                        <div>Assigned To {task.assignedTo.name}</div>
                      ) : (
                        <AssignTaskDialog taskId={task._id} />
                      )}
                    </div>
                    {task.assignedTo.id === user?.id && (
                      <button
                        onClick={() =>
                          handleChangeStatus({
                            taskId: task._id,
                            status: "In Progress",
                          })
                        }
                        className="flex items-center gap-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-full transition-colors"
                      >
                        <ArrowRight size={12} />
                        Start
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* In Progress Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <PlayCircle size={20} className="text-blue-600" />
                <h3 className="text-lg font-semibold text-[#323643]">
                  In Progress
                </h3>
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                  {tasksByStatus["In Progress"].length}
                </span>
              </div>
              {tasksByStatus["In Progress"].map((task) => (
                <div
                  key={task._id}
                  className="bg-white border border-[#93deff]/20 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-[#93deff]/40"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="mt-1">{getStatusIcon(task.status)}</div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-[#323643] mb-2">
                        {task.title}
                      </h4>
                      <p className="text-[#606470] text-sm leading-relaxed mb-3">
                        {task.description}
                      </p>

                      <div className="flex items-center gap-2 mb-3">
                        <Calendar size={12} className="text-[#606470]" />
                        <span
                          className={`text-xs ${
                            isOverdue(task.dueDate)
                              ? "text-red-600 font-medium"
                              : "text-[#606470]"
                          }`}
                        >
                          {formatDate(task.dueDate)}
                          {isOverdue(task.dueDate) && (
                            <span className="ml-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                              Overdue
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Move Task Buttons */}
                  <div className="flex justify-between items-center pt-3 border-t border-[#93deff]/20">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-[#606470]" />
                      {task.assignedTo ? (
                        <div>Assigned To {task.assignedTo.name}</div>
                      ) : (
                        <AssignTaskDialog taskId={task._id} />
                      )}
                    </div>
                    <div className="flex gap-2">
                      {task.assignedTo.id === user?.id && (
                        <button
                          onClick={() =>
                            handleChangeStatus({
                              taskId: task._id,
                              status: "To Do",
                            })
                          }
                          className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors"
                        >
                          <ArrowLeft size={12} />
                          Back
                        </button>
                      )}
                      {task.assignedTo.id === user?.id && (
                        <button
                          onClick={() =>
                            handleChangeStatus({
                              taskId: task._id,
                              status: "Done",
                            })
                          }
                          className="flex items-center gap-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-full transition-colors"
                        >
                          <ArrowRight size={12} />
                          Done
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Done Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 size={20} className="text-green-600" />
                <h3 className="text-lg font-semibold text-[#323643]">Done</h3>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                  {tasksByStatus["Done"].length}
                </span>
              </div>
              {tasksByStatus["Done"].map((task) => (
                <div
                  key={task._id}
                  className="bg-white border border-[#93deff]/20 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-[#93deff]/40 opacity-90"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="mt-1">{getStatusIcon(task.status)}</div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-[#323643] mb-2">
                        {task.title}
                      </h4>
                      <p className="text-[#606470] text-sm leading-relaxed mb-3">
                        {task.description}
                      </p>

                      <div className="flex items-center gap-2 mb-3">
                        <Calendar size={12} className="text-[#606470]" />
                        <span className="text-xs text-[#606470]">
                          {formatDate(task.dueDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Move Task Button */}
                  <div className="flex justify-between items-center pt-3 border-t border-[#93deff]/20">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-[#606470]" />
                      {task.assignedTo ? (
                        <div>Assigned To {task.assignedTo.name}</div>
                      ) : (
                        <AssignTaskDialog taskId={task._id} />
                      )}
                    </div>
                    {task._id === user?.id && (
                      <button
                        onClick={() =>
                          handleChangeStatus({
                            taskId: task._id,
                            status: "In Progress",
                          })
                        }
                        className="flex items-center gap-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-full transition-colors"
                      >
                        <ArrowLeft size={12} />
                        Reopen
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTasks;
