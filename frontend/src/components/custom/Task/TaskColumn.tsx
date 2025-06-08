// TaskColumn.tsx
import { CheckCircle2, Circle, PlayCircle } from "lucide-react";
import type { Task } from "./AllTaks";
import TaskCard from "./TaskCard";

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  status: "To Do" | "In Progress" | "Done";
  user: any;
  onChangeStatus: (data: { taskId: string; status: string }) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskColumn = ({
  title,
  tasks,
  status,
  user,
  onChangeStatus,
  onDeleteTask,
}: TaskColumnProps) => {
  const getStatusIcon = () => {
    switch (status) {
      case "Done":
        return <CheckCircle2 size={20} className="text-green-600" />;
      case "In Progress":
        return <PlayCircle size={20} className="text-blue-600" />;
      default:
        return <Circle size={20} className="text-[#606470]" />;
    }
  };

  const getStatusBadgeStyle = () => {
    switch (status) {
      case "Done":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-[#606470]";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        {getStatusIcon()}
        <h3 className="text-lg font-semibold text-[#323643]">{title}</h3>
        <span
          className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeStyle()}`}
        >
          {tasks.length}
        </span>
      </div>

      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          user={user}
          onChangeStatus={onChangeStatus}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </div>
  );
};

export default TaskColumn;
