// TaskStats.tsx
import { CheckCircle2, Circle, PlayCircle } from "lucide-react";

interface TaskStatsProps {
  toDoCount: number;
  inProgressCount: number;
  doneCount: number;
}

const TaskStats = ({
  toDoCount,
  inProgressCount,
  doneCount,
}: TaskStatsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4 mt-6">
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-[#93deff]/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
            <Circle size={20} className="text-[#606470]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#323643]">{toDoCount}</p>
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
              {inProgressCount}
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
            <p className="text-2xl font-bold text-[#323643]">{doneCount}</p>
            <p className="text-sm text-[#606470]">Completed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskStats;
