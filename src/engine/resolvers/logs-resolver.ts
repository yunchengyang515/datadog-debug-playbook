import { DatadogLogsApi } from "../datadog/apis/logs/logs"; // Datadog API
import { TimeFrame } from "../types/time-frame";

export class LogsResolver {
  private logsApi: DatadogLogsApi;

  constructor() {
    this.logsApi = new DatadogLogsApi();
  }

  // Resolves logs by directly querying the Datadog Logs API
  public async resolve(params: {
    query: string;
    timeFrame: TimeFrame;
    name: string;
  }) {
    return this.logsApi.query({
      query: params.query,
      timeFrame: params.timeFrame,
      name: params.name,
    });
  }
}
