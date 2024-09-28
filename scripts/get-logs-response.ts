// fetch-logs.ts
import { v2 } from "@datadog/datadog-api-client"; // Import types for the response
import { TimeFrame } from "../src/engine/types/time-frame";
import { DatadogLogsApi } from "../src/engine/datadog/apis/logs/logs";

(async () => {
  try {
    // Initialize the Logs API instance
    const logsApi = new DatadogLogsApi();

    // Define parameters for the logs query
    const params = {
      query: "service:dashpivot-api AND env:production", // Replace with your desired query
      timeFrame: {
        from: new Date(Date.now() - 60 * 1000).getTime(), // 24 hours ago
        to: Date.now(),
      } as TimeFrame,
      name: "api_logs",
      indexes: ["main"], // Optional: specify indexes, if needed
    };

    // Fetch the logs data using the query method
    const response: v2.LogsListResponse = await logsApi.query(params);

    // Log the response as a JavaScript variable
    console.log(
      "const logsResponse =",
      JSON.stringify(response, null, 2) + ";"
    );
  } catch (error) {
    console.error("Error fetching logs data:", error);
  }
})();
