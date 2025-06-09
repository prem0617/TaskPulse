import type { Task } from "./TaskCalendar";
import { Calendar, FileText, X } from "lucide-react";

interface SelectedTaskProps {
  selectedTask: Task;
  setShowTask: React.Dispatch<React.SetStateAction<boolean>>;
}

const SelectedTask = ({ selectedTask, setShowTask }: SelectedTaskProps) => {
  return (
    <div>
      {" "}
      <div className="fixed inset-0 flex justify-center items-center bg-black/30 z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg transform transition-all duration-300 ease-out">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-[#93deff]/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#323643] rounded-2xl flex items-center justify-center">
                <FileText size={20} className="text-[#93deff]" />
              </div>
              <h2 className="text-2xl font-bold text-[#323643]">
                Task Details
              </h2>
            </div>
            <button
              onClick={() => setShowTask(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 text-[#606470] hover:text-red-500 transition-all duration-200"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Title */}
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#323643]">
                {selectedTask.title}
              </h3>
              <p className="text-[#606470] text-sm leading-relaxed">
                {selectedTask.description || "No description provided"}
              </p>
            </div>

            {/* Status and Priority */}
            <div className="flex gap-4">
              <div className="flex-1">
                <span className="text-xs font-medium text-[#606470] uppercase tracking-wide">
                  Status
                </span>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                      selectedTask.status === "Done"
                        ? "bg-green-100 text-green-800"
                        : selectedTask.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-[#93deff]/20 text-[#323643]"
                    }`}
                  >
                    {selectedTask.status}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <span className="text-xs font-medium text-[#606470] uppercase tracking-wide">
                  Priority
                </span>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                      selectedTask.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : selectedTask.priority === "medium"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${
                        selectedTask.priority === "high"
                          ? "bg-red-500"
                          : selectedTask.priority === "medium"
                          ? "bg-orange-500"
                          : "bg-gray-400"
                      }`}
                    ></span>
                    {selectedTask.priority.charAt(0).toUpperCase() +
                      selectedTask.priority.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-[#606470] uppercase tracking-wide">
                Due Date
              </span>
              <div className="flex items-center gap-2 text-[#323643]">
                <Calendar size={16} className="text-[#93deff]" />
                <span className="font-medium">
                  {new Date(selectedTask.dueDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Assigned To */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-[#606470] uppercase tracking-wide">
                Assigned To
              </span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#323643] rounded-full flex items-center justify-center">
                  <span className="text-[#93deff] text-sm font-medium">
                    {selectedTask.assignedTo?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-[#323643]">
                    {selectedTask.assignedTo?.name || "Unassigned"}
                  </p>
                  {selectedTask.assignedTo?.email && (
                    <p className="text-sm text-[#606470]">
                      {selectedTask.assignedTo.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Labels */}
            {selectedTask.labels && selectedTask.labels.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-medium text-[#606470] uppercase tracking-wide">
                  Labels
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedTask.labels.map((label, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-[#93deff]/20 text-[#323643]"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#93deff]/20">
              <div className="space-y-1">
                <span className="text-xs font-medium text-[#606470] uppercase tracking-wide">
                  Created
                </span>
                <p className="text-sm text-[#323643] font-medium">
                  {new Date(selectedTask.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium text-[#606470] uppercase tracking-wide">
                  Updated
                </span>
                <p className="text-sm text-[#323643] font-medium">
                  {new Date(selectedTask.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-[#93deff]/20 bg-gray-50 rounded-b-2xl">
            <button
              onClick={() => setShowTask(false)}
              className="px-6 py-2 text-sm font-medium text-[#606470] bg-white border border-[#93deff]/30 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#93deff] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedTask;
