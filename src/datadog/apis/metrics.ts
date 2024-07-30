import { v1, v2 } from "@datadog/datadog-api-client";
import { getDatadogClientConfiguration } from "../clients";

export const getMetricsApi = () => {
  const configuration = getDatadogClientConfiguration();
  const apiInstance = new v2.MetricsApi(configuration);
  return apiInstance;
};
