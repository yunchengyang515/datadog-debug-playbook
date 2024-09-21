import { v1 } from "@datadog/datadog-api-client";
import { getDatadogClientConfiguration } from "../clients";

export const getLogsApi = () => {
  const configuration = getDatadogClientConfiguration();
  const apiInstance = new v1.LogsApi(configuration);
  return apiInstance;
};
