// src/hooks/useActivityLogger.ts
import axios from "axios";
import { useCallback } from "react";

interface AddActivityLogParams {
  projectId: string;
  action: string;
  extraInfo?: string;
}

export default function useActivityLogger() {
  const apiUrl = import.meta.env.VITE_API_URL;
  console.log(apiUrl);

  const addActivityLog = useCallback(
    async ({ projectId, action, extraInfo }: AddActivityLogParams) => {
      try {
        const response = await axios.post(
          `${apiUrl}/api/logs/add-logs`,
          { projectId, action, extraInfo },
          { withCredentials: true }
        );
        console.log("Log added:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error adding activity log:", error);
        throw error;
      }
    },
    []
  );

  return { addActivityLog };
}
