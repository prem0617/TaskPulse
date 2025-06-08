import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Flag, Tag, X } from "lucide-react";
import useActivityLogger from "@/hooks/useActivityLogger";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  id: string; // projectId
}

interface TaskFormData {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  labels: string[];
}

const AddTaskDialog = ({ id }: Props) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    priority: "medium",
    labels: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [labelInput, setLabelInput] = useState("");

  const { addActivityLog } = useActivityLogger();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePriorityChange = (value: "low" | "medium" | "high") => {
    setFormData((prev) => ({
      ...prev,
      priority: value,
    }));
  };

  const addLabel = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && labelInput.trim()) {
      e.preventDefault();
      const newLabel = labelInput.trim().toLowerCase();
      if (!formData.labels.includes(newLabel)) {
        setFormData((prev) => ({
          ...prev,
          labels: [...prev.labels, newLabel],
        }));
      }
      setLabelInput("");
    }
  };

  const removeLabel = (labelToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      labels: prev.labels.filter((label) => label !== labelToRemove),
    }));
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

  async function handleTaskCreation(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/task/add-task",
        {
          ...formData,
          projectId: id,
        },
        { withCredentials: true }
      );

      console.log("Task Created:", response.data);
      toast.success(response.data.message);

      // Reset form
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        labels: [],
      });
      setLabelInput("");

      await addActivityLog({
        projectId: id,
        action: "New task created",
        extraInfo: `${response.data.newTask.title} is created with ${formData.priority} priority`,
      });
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    } finally {
      setOpenDialog(false);
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpenDialog(true)}
          className="bg-[#93deff] hover:bg-[#7bc9f0] text-[#323643] font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center gap-2"
        >
          <Plus size={18} />
          Add New Task
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[#f7f7f7] border-none shadow-2xl rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-6">
          <DialogTitle className="text-2xl font-bold text-[#323643] flex items-center gap-3">
            <div className="w-10 h-10 bg-[#93deff] rounded-xl flex items-center justify-center">
              <Plus size={20} className="text-[#323643]" />
            </div>
            Create New Task
          </DialogTitle>
          <DialogDescription className="text-[#606470] text-base">
            Add a new task to your project and stay organized
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleTaskCreation} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#323643] flex items-center gap-2">
              <FileText size={16} />
              Task Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter task title..."
              className="w-full bg-white border-2 border-[#93deff]/30 focus:border-[#93deff] px-4 py-3 rounded-xl text-[#323643] placeholder-[#606470]/60 transition-colors duration-200 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#323643] flex items-center gap-2">
              <FileText size={16} />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe your task..."
              rows={3}
              className="w-full bg-white border-2 border-[#93deff]/30 focus:border-[#93deff] px-4 py-3 rounded-xl text-[#323643] placeholder-[#606470]/60 transition-colors duration-200 focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#323643] flex items-center gap-2">
              <Flag size={16} />
              Priority
            </label>
            <Select
              value={formData.priority}
              onValueChange={handlePriorityChange}
            >
              <SelectTrigger
                className={`w-full border-2 border-[#93deff]/30 focus:border-[#93deff] px-4 py-3 rounded-xl transition-colors duration-200 focus:outline-none ${getPriorityColor(
                  formData.priority
                )}`}
              >
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="low" className="text-green-600">
                  Low Priority
                </SelectItem>
                <SelectItem value="medium" className="text-yellow-600">
                  Medium Priority
                </SelectItem>
                <SelectItem value="high" className="text-red-600">
                  High Priority
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#323643] flex items-center gap-2">
              <Tag size={16} />
              Labels
            </label>
            <input
              type="text"
              value={labelInput}
              onChange={(e) => setLabelInput(e.target.value)}
              onKeyDown={addLabel}
              placeholder="Type a label and press Enter..."
              className="w-full bg-white border-2 border-[#93deff]/30 focus:border-[#93deff] px-4 py-3 rounded-xl text-[#323643] placeholder-[#606470]/60 transition-colors duration-200 focus:outline-none"
            />
            {formData.labels.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.labels.map((label, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 bg-[#93deff]/20 text-[#323643] px-3 py-1 rounded-full text-sm font-medium border border-[#93deff]/30"
                  >
                    <Tag size={12} />
                    {label}
                    <button
                      type="button"
                      onClick={() => removeLabel(label)}
                      className="ml-1 hover:text-red-600 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpenDialog(false)}
              className="flex-1 border-[#606470]/30 text-[#606470] hover:bg-[#606470]/10 hover:border-[#606470] py-3 rounded-xl font-medium transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#323643] hover:bg-[#323643]/90 text-white py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Plus size={16} />
                  Create Task
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskDialog;
