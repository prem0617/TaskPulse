// src/components/Logs.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useSocket } from "@/hooks/useSokect";
import { Trash2 } from "lucide-react";

interface Log {
  _id: string;
  action: string;
  extraInfo?: string;
  createdAt: string;
  userId: {
    name: string;
    username: string;
    email: string;
  };
  taskId?: {
    title: string;
  };
}

function ActivityLogs({ id: projectId }: { id: string }) {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  const socket = useSocket();

  // Add this inside the component
  const handleDelete = async (logId: string) => {
    try {
      await axios.post(
        "http://localhost:3000/api/logs/delete-logs",
        { logId },
        { withCredentials: true }
      );
      // Optimistically update UI
      setLogs((prev) => prev.filter((log) => log._id !== logId));
    } catch (err) {
      console.error("Failed to delete log", err);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/logs/get-logs",
        { projectId },
        {
          withCredentials: true,
        }
      );
      console.log(res);
      setLogs(res.data.logs);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [projectId]);

  useEffect(() => {
    if (!socket) return;

    function handleLogs(data: any) {
      console.log(data);
      const { newLogs } = data;

      setLogs((prev) => [newLogs, ...prev]);
    }

    function handleDeleteLog(data: any) {
      const { logId } = data;
      setLogs((prev) => prev.filter((log) => log._id !== logId));
    }

    socket.on("new-logs", handleLogs);
    socket.on("delete-log", handleDeleteLog);

    // Clean up
    return () => {
      socket.off("new-logs", handleLogs);
      socket.off("delete-log", handleDeleteLog);
    };
  }, [socket]);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">📋 Activity Logs</h2>

      {loading ? (
        <p>Loading logs...</p>
      ) : logs.length === 0 ? (
        <p className="text-gray-500">No logs found for this project.</p>
      ) : (
        <ul className="space-y-3">
          {logs.map((log) => (
            <li
              key={log._id}
              className="p-3 border rounded shadow-sm flex items-start justify-between gap-2"
            >
              <div>
                <p className="text-sm text-gray-700">
                  <strong>{log.userId?.name}</strong> did{" "}
                  <strong>{log.action}</strong>{" "}
                  {log.taskId?.title && (
                    <>
                      on <em>{log.taskId.title}</em>
                    </>
                  )}
                  {log.extraInfo && <> — {log.extraInfo}</>}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(log._id)}
                className="text-red-500 hover:text-red-700 text-sm"
                title="Delete log"
              >
                <Trash2 />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ActivityLogs;
