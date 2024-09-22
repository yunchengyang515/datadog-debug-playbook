// datadog-logs-api.ts
import { v2 } from "@datadog/datadog-api-client";
import { getDatadogClientConfiguration } from "../../clients"; // Configuration helper
import { TimeFrame } from "../../../types/time-frame"; // Assuming this type exists
import { LogsApi } from "../../../integration-apis/logs";

export class DatadogLogsApi extends LogsApi {
  private apiInstance: v2.LogsApi;

  constructor() {
    super();
    const configuration = getDatadogClientConfiguration();
    this.apiInstance = new v2.LogsApi(configuration);
  }

  async query(params: {
    query: string;
    timeFrame: TimeFrame;
    name: string;
    indexes?: string[]; // Optional field for indexes
  }): Promise<v2.LogsListResponse> {
    const { query, timeFrame, indexes } = params;

    // Constructing the LogsQueryFilter for the request
    const filter: v2.LogsQueryFilter = {
      from: new Date(timeFrame.from).toISOString(),
      to: new Date(timeFrame.to).toISOString(),
      query,
      indexes,
    };

    const requestParams: v2.LogsApiListLogsRequest = {
      body: {
        filter,
      },
    };

    // Making the API call with the constructed request params
    return this.apiInstance.listLogs(requestParams);
  }
}
