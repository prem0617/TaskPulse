import { useState } from "react";
import axios from "axios";
import {
  FolderPlus,
  FileText,
  AlignLeft,
  ArrowLeft,
  Check,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import useActivityLogger from "@/hooks/useActivityLogger";

interface ProjectData {
  title: string;
  description: string;
}

const CreateProject = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ProjectData>({
    title: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const { addActivityLog } = useActivityLogger();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/project/create-project",
        formData,
        { withCredentials: true }
      );
      console.log("Project created:", response.data);
      toast.success("Project created successfully!");
      setFormData({ title: "", description: "" });
      setIsSuccess(true);

      const project = response.data.newProject;

      await addActivityLog({
        projectId: project._id,
        action: "project created",
        extraInfo: `${project.title} is created`,
      });

      // Reset success state after 3 seconds
      setTimeout(() => (setIsSuccess(false), navigate("/projects")), 3000);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] p-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-[#606470] hover:text-[#323643] font-medium mb-8 transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          Back to Projects
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#93deff] rounded-3xl flex items-center justify-center mx-auto mb-4">
            <FolderPlus size={40} className="text-[#323643]" />
          </div>
          <h1 className="text-3xl font-bold text-[#323643] mb-2">
            Create New Project
          </h1>
          <p className="text-[#606470] text-lg">
            Start organizing your work with a new project
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-[#93deff]/20 overflow-hidden">
          {isSuccess && (
            <div className="bg-green-50 border-b border-green-200 p-4">
              <div className="flex items-center gap-3 text-green-800">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Check size={18} className="text-green-600" />
                </div>
                <span className="font-medium">
                  Project created successfully!
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8">
            {/* Project Title */}
            <div className="mb-6">
              <label className="text-[#323643] font-semibold mb-3 flex items-center gap-2">
                <FileText size={18} />
                Project Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Enter your project title..."
                className="w-full px-4 py-4 border-2 border-[#93deff]/30 focus:border-[#93deff] rounded-2xl focus:outline-none bg-white text-[#323643] placeholder-[#606470]/60 transition-all duration-200 focus:shadow-lg text-lg"
              />
            </div>

            {/* Project Description */}
            <div className="mb-8">
              <label className="text-[#323643] font-semibold mb-3 flex items-center gap-2">
                <AlignLeft size={18} />
                Project Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="Describe your project goals, objectives, and key details..."
                rows={6}
                className="w-full px-4 py-4 border-2 border-[#93deff]/30 focus:border-[#93deff] rounded-2xl focus:outline-none bg-white text-[#323643] placeholder-[#606470]/60 transition-all duration-200 focus:shadow-lg resize-none leading-relaxed"
              />
              <p className="text-sm text-[#606470] mt-2">
                Provide a clear description to help team members understand the
                project scope.
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4">
              <Link
                to="/"
                className="flex-1 border-2 border-[#606470]/30 text-[#606470] hover:border-[#606470] hover:bg-[#606470]/5 font-semibold py-4 px-6 rounded-2xl transition-all duration-200 text-center"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#323643] hover:bg-[#323643]/90 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Project...
                  </>
                ) : (
                  <>
                    <FolderPlus size={20} />
                    Create Project
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-[#93deff]/10 rounded-2xl p-6 border border-[#93deff]/20">
          <h3 className="font-semibold text-[#323643] mb-3 flex items-center gap-2">
            <div className="w-6 h-6 bg-[#93deff] rounded-full flex items-center justify-center">
              <span className="text-[#323643] text-sm font-bold">💡</span>
            </div>
            Pro Tips
          </h3>
          <ul className="space-y-2 text-[#606470]">
            <li className="flex items-start gap-2">
              <span className="text-[#93deff] mt-1">•</span>
              <span>
                Choose a clear, descriptive title that reflects your project's
                main goal
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#93deff] mt-1">•</span>
              <span>
                Include key objectives and deliverables in your description
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#93deff] mt-1">•</span>
              <span>
                You can always edit project details later from the project
                settings
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
