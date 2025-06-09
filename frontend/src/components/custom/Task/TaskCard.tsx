// TaskCard.tsx
import {
  Calendar,
  CheckCircle2,
  Circle,
  PlayCircle,
  User,
  ArrowRight,
  ArrowLeft,
  Trash2Icon,
  Flag,
  Tag,
  Paperclip,
  Image,
  FileText,
  X,
  Eye,
} from "lucide-react";
import { useState } from "react";
import AssignTaskDialog from "./AssignTask";
import type { Task } from "./AllTaks";

interface Attachment {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  url: string;
}

interface TaskCardProps {
  task: Task & { attachments?: Attachment[] };
  user: any;
  onChangeStatus: (data: { taskId: string; status: string }) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskCard = ({
  task,
  user,
  onChangeStatus,
  onDeleteTask,
}: TaskCardProps) => {
  const [showAttachments, setShowAttachments] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (mimetype: string) => {
    if (mimetype.startsWith("image/")) {
      return <Image size={16} className="text-blue-600" />;
    }
    return <FileText size={16} className="text-green-600" />;
  };

  const isImage = (mimetype: string) => {
    return mimetype.startsWith("image/");
  };

  const renderStatusButtons = () => {
    if (task.assignedTo?.id !== user?.id) return null;

    switch (task.status) {
      case "To Do":
        return (
          <button
            onClick={() =>
              onChangeStatus({ taskId: task._id, status: "In Progress" })
            }
            className="flex items-center gap-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-full transition-colors"
          >
            <ArrowRight size={12} />
            Start
          </button>
        );

      case "In Progress":
        return (
          <div className="flex gap-2">
            <button
              onClick={() =>
                onChangeStatus({ taskId: task._id, status: "To Do" })
              }
              className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors"
            >
              <ArrowLeft size={12} />
              Back
            </button>
            <button
              onClick={() =>
                onChangeStatus({ taskId: task._id, status: "Done" })
              }
              className="flex items-center gap-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-full transition-colors"
            >
              <ArrowRight size={12} />
              Done
            </button>
          </div>
        );

      case "Done":
        return <div className="text-sm">Task Done</div>;

      default:
        return null;
    }
  };

  return (
    <>
      <div
        className={`bg-white border border-[#93deff]/20 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-[#93deff]/40 ${
          task.status === "Done" ? "opacity-90" : ""
        }`}
      >
        <div className="flex items-start gap-3 mb-3">
          <div className="mt-1">{getStatusIcon(task.status)}</div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-lg font-semibold text-[#323643]">
                {task.title}
              </h4>
              {task.projectId.createdBy === user?.id && (
                <button
                  onClick={() => onDeleteTask(task._id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2Icon size={16} />
                </button>
              )}
            </div>

            <p className="text-[#606470] text-sm leading-relaxed mb-3">
              {task.description}
            </p>

            {/* Priority and Labels */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {/* Priority Badge */}
              <div
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                  task.priority
                )}`}
              >
                <Flag size={10} />
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </div>

              {/* Labels */}
              {task.labels && task.labels.length > 0 && (
                <>
                  {task.labels.map((label, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 bg-[#93deff]/20 text-[#323643] px-2 py-1 rounded-full text-xs font-medium border border-[#93deff]/30"
                    >
                      <Tag size={10} />
                      {label}
                    </span>
                  ))}
                </>
              )}
            </div>

            {/* Attachments Button */}
            {task.attachments && task.attachments.length > 0 && (
              <div className="mb-3">
                <button
                  onClick={() => setShowAttachments(true)}
                  className="flex items-center gap-2 text-xs bg-[#93deff]/20 hover:bg-[#93deff]/30 text-[#323643] px-3 py-2 rounded-full transition-colors border border-[#93deff]/30"
                >
                  <Paperclip size={12} />
                  See Attachments ({task.attachments.length})
                </button>
              </div>
            )}

            {/* Due Date */}
            {task.dueDate && task.status !== "Done" && (
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
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-3 border-t border-[#93deff]/20">
          <div className="flex items-center gap-2">
            {task.assignedTo
              ? task.assignedTo.id !== user?.id && (
                  <div className="text-sm text-[#606470]">
                    Assigned to {task.assignedTo.name}
                  </div>
                )
              : user.id === task.projectId.createdBy && (
                  <>
                    <User size={14} className="text-[#606470]" />
                    <AssignTaskDialog taskId={task._id} />
                  </>
                )}
          </div>

          <div className="flex items-center gap-2">{renderStatusButtons()}</div>
        </div>
      </div>

      {/* Attachments Modal */}
      {showAttachments && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-[#323643] flex items-center gap-2">
                <Paperclip size={20} />
                Attachments ({task.attachments?.length || 0})
              </h3>
              <button
                onClick={() => setShowAttachments(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {task.attachments?.map((attachment, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {getFileIcon(attachment.mimetype)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-[#323643] truncate">
                          {attachment.originalname}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatFileSize(attachment.size)}
                        </p>

                        {/* Image Preview */}
                        {isImage(attachment.mimetype) && (
                          <div className="mt-3">
                            <img
                              src={attachment.url}
                              alt={attachment.originalname}
                              className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => setSelectedImage(attachment.url)}
                            />
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-3">
                          {isImage(attachment.mimetype) && (
                            <button
                              onClick={() => setSelectedImage(attachment.url)}
                              className="flex items-center gap-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded-full transition-colors"
                            >
                              <Eye size={10} />
                              View
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2 z-10"
            >
              <X size={24} />
            </button>
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCard;
