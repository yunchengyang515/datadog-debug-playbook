// fetch-metrics.ts
import { v2 } from "@datadog/datadog-api-client";
import {
  MetricsApiQueryTimeseriesDataRequest,
  TimeseriesFormulaQueryResponse,
} from "@datadog/datadog-api-client/dist/packages/datadog-api-client-v2";
import { getDatadogClientConfiguration } from "../src/engine/datadog/clients";

// Helper function to get the v2 Metrics API instance
const getV2MetricsApi = () => {
  const configuration = getDatadogClientConfiguration();
  configuration.unstableOperations["v2.queryTimeseriesData"] = true; // Enable the unstable operation
  return new v2.MetricsApi(configuration);
};

(async () => {
  try {
    // Get the Metrics API instance
    const apiInstance = getV2MetricsApi();

    // Define parameters for the metrics query
    const params: MetricsApiQueryTimeseriesDataRequest = {
      body: {
        data: {
          attributes: {
            from: new Date(Date.now() - 60 * 1000).getTime(), // 24 hours ago
            to: Date.now(),
            queries: [
              {
                dataSource: "metrics",
                query: "your query", // Replace with the desired query
                name: "cpu_usage",
              },
            ],
          },
          type: "timeseries_request",
        },
      },
    };

    // Fetch the metrics data using queryTimeseriesData
    const response: TimeseriesFormulaQueryResponse =
      await apiInstance.queryTimeseriesData(params);

    // Log the response as a JavaScript variable
    console.log(
      "const metricsResponse =",
      JSON.stringify(response, null, 2) + ";"
    );
  } catch (error) {
    console.error("Error fetching metrics data:", error);
  }
})();
