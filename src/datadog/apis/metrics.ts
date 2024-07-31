import { v1, v2 } from "@datadog/datadog-api-client";
import { getDatadogClientConfiguration } from "../clients";

export const getV2MetricsApi = () => {
  const configuration = getDatadogClientConfiguration();
  configuration.unstableOperations["v2.queryTimeseriesData"] = true;
  const apiInstance = new v2.MetricsApi(configuration);
  return apiInstance;
};

export const getV1MetricsApi = () => {
  const configuration = getDatadogClientConfiguration();
  const apiInstance = new v1.MetricsApi(configuration);
  return apiInstance;
};
