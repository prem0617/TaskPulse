import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

const ErrorSkeleton = ({ error }: { error: string }) => {
  return (
    <div className="min-h-screen bg-[#f7f7f7] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h3 className="text-xl font-semibold text-[#323643] mb-2">
            Error Loading Project
          </h3>
          <p className="text-[#606470] mb-6">{error}</p>
          <Link
            to="/projectes"
            className="inline-flex items-center gap-2 bg-[#323643] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#323643]/90 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Projects
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorSkeleton;
