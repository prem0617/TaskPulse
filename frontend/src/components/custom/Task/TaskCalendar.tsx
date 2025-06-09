// TaskCalendar.tsx
import { useEffect, useMemo, useState, useRef } from "react";
import axios from "axios";
import {
  Calendar as CalendarIcon,
  FileText,
  List,
  Calendar,
} from "lucide-react";
import { useSocket } from "@/hooks/useSokect";
import { useAuthContext } from "@/context/AuthContext";
import useActivityLogger from "@/hooks/useActivityLogger";
import type { IBackendData } from "../SocketListener";
import type { Project } from "../Project/AllProjects";

import LoadingSpinner from "./LoadingSpinner";
import TaskStats from "./TaskStats";
import TaskColumn from "./TaskColumn";

// FullCalendar imports
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import SelectedTask from "./SelectedTask";

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

const TaskCalendar = ({ id }: Props) => {
  const socket = useSocket();
  const { user } = useAuthContext();
  const { addActivityLog } = useActivityLogger();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"calendar" | "tasks">("tasks");
  const calendarRef = useRef<FullCalendar>(null);

  const [showTask, setShowTask] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task>();

  // Fetch tasks function
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

  // Handle task status change
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

  // Handle task deletion
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

  // Memoized task categorization
  const { ToDoTasks, InProgressTasks, DoneTasks } = useMemo(() => {
    const ToDoTasks = tasks.filter((t) => t.status === "To Do");
    const InProgressTasks = tasks.filter((t) => t.status === "In Progress");
    const DoneTasks = tasks.filter((t) => t.status === "Done");
    return { ToDoTasks, InProgressTasks, DoneTasks };
  }, [tasks]);

  // Socket listeners
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

    function handleAssignTask(data: IBackendData) {
      const { task } = data;
      setTasks((prev) => [...prev, task]);
    }

    socket.on("change-task-status", handleChangeTaskStatus);
    socket.on("new-task", handleAddNewTask);
    socket.on("delete-task", handleDeleteTask);
    socket.on("assign-task-general", handleAssignTask);

    return () => {
      socket.off("change-task-status", handleChangeTaskStatus);
      socket.off("new-task", handleAddNewTask);
      socket.off("delete-task", handleDeleteTask);
    };
  }, [socket]);

  // Convert tasks to FullCalendar events format

  const calendarEvents = useMemo(() => {
    return tasks
      .filter((task) => task.dueDate) // Only include tasks that have a due date
      .map((task) => {
        let backgroundColor = "#3788d8";
        let borderColor = "#3788d8";

        // Set colors based on status
        switch (task.status) {
          case "To Do":
            backgroundColor = "#3788d8";
            borderColor = "#3788d8";
            break;
          case "In Progress":
            backgroundColor = "#f59e0b";
            borderColor = "#f59e0b";
            break;
          case "Done":
            backgroundColor = "#10b981";
            borderColor = "#10b981";
            break;
        }

        // Adjust opacity based on priority
        if (task.priority === "high") {
          backgroundColor += "ff";
        } else if (task.priority === "medium") {
          backgroundColor += "cc";
        } else {
          backgroundColor += "99";
        }

        return {
          id: task._id,
          title: task.title,
          start: new Date(task.dueDate).toISOString().split("T")[0],
          backgroundColor,
          borderColor,
          extendedProps: {
            description: task.description,
            status: task.status,
            priority: task.priority,
            assignedTo: task.assignedTo,
            labels: task.labels,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
            projectId: task.projectId,
          },
        };
      });
  }, [tasks]);
  // Handle event click

  const handleEventClick = (eventInfo: any) => {
    const event = eventInfo.event;
    const extendedProps = event.extendedProps;

    // Reconstruct the Task object from the FullCalendar event
    const taskFromEvent: Task = {
      _id: event.id,
      title: event.title,
      description: extendedProps.description,
      dueDate: new Date(event.start), // Convert back to Date object
      status: extendedProps.status,
      projectId: extendedProps.projectId || id, // Use from extendedProps or fallback to current id
      assignedTo: extendedProps.assignedTo,
      priority: extendedProps.priority,
      labels: extendedProps.labels || [], // Ensure it's always an array
      createdAt: new Date(extendedProps.createdAt),
      updatedAt: new Date(extendedProps.updatedAt),
    };

    console.log("Selected task:", taskFromEvent);
    setSelectedTask(taskFromEvent);
    setShowTask(true);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#323643] rounded-2xl flex items-center justify-center">
              {viewMode === "calendar" ? (
                <CalendarIcon size={24} className="text-[#93deff]" />
              ) : (
                <FileText size={24} className="text-[#93deff]" />
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#323643]">
                {viewMode === "calendar" ? "Task Calendar" : "All Tasks"}
              </h3>
              <p className="text-[#606470]">
                {viewMode === "calendar"
                  ? "View and manage tasks in calendar format"
                  : "Manage and track your project tasks"}
              </p>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-white rounded-xl p-2 shadow-lg border border-[#93deff]/20">
            <button
              onClick={() => setViewMode("tasks")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === "tasks"
                  ? "bg-[#323643] text-white"
                  : "text-[#606470] hover:bg-gray-50"
              }`}
            >
              <List size={18} />
              Tasks
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === "calendar"
                  ? "bg-[#323643] text-white"
                  : "text-[#606470] hover:bg-gray-50"
              }`}
            >
              <Calendar size={18} />
              Calendar
            </button>
          </div>
        </div>

        {/* Task Stats */}
        <TaskStats
          toDoCount={ToDoTasks.length}
          inProgressCount={InProgressTasks.length}
          doneCount={DoneTasks.length}
        />

        {/* Legend for Calendar View */}
        {viewMode === "calendar" && (
          <div className="flex items-center gap-6 text-sm text-[#606470] bg-gray-50 p-4 rounded-lg mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>To Do</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Done</span>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span>Priority:</span>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-400 rounded" title="Low"></div>
                <div
                  className="w-3 h-3 bg-gray-600 rounded"
                  title="Medium"
                ></div>
                <div className="w-3 h-3 bg-gray-800 rounded" title="High"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Calendar View */}
      {viewMode === "calendar" && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek",
            }}
            events={calendarEvents}
            eventClick={handleEventClick}
            editable={false}
            dayMaxEvents={true}
            weekends={true}
            height="auto"
            eventDisplay="block"
            displayEventTime={false}
            eventClassNames="cursor-pointer hover:opacity-80 transition-opacity"
            dayCellClassNames="hover:bg-gray-50 transition-colors"
            // Custom styling
            eventDidMount={(info) => {
              // Add custom tooltip or styling here if needed
              info.el.title = `${info.event.title} - ${info.event.extendedProps.status}`;
            }}
          />
        </div>
      )}

      {/* tasks Board View */}
      {viewMode === "tasks" && (
        <div className="">
          {tasks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4">
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
      )}
      {showTask && selectedTask && (
        <SelectedTask selectedTask={selectedTask} setShowTask={setShowTask} />
      )}
    </div>
  );
};

export default TaskCalendar;
