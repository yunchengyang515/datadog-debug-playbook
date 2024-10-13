import { v2 } from "@datadog/datadog-api-client";
import { Logs } from "../../../types/logs";

export const parseLogsResponse = (response: v2.LogsListResponse): Logs => {
  if (!response.data) {
    console.warn("No logs data found in the response.");
    return [];
  }

  const logs: Logs = response.data
    .map((logEntry) => {
      const attributes = logEntry.attributes;
      if (!attributes) {
        console.warn("Log entry missing attributes:", logEntry);
        return null;
      }

      const message = attributes.message || "No message available";
      if (!attributes.timestamp) {
        console.warn("Log entry missing timestamp:", logEntry);
        return null;
      }
      const timestamp = new Date(attributes.timestamp);

      const tags = attributes.tags || [];

      return {
        message,
        timestamp,
        attributes: tags,
      };
    })
    .filter((log) => log !== null); // Remove any null entries

  return logs;
};
