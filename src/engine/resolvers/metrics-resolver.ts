import { DatadogMetricsApi } from "../datadog/apis/metrics/metrics"; // Datadog API
import { TimeFrame } from "../types/time-frame";

export class MetricsResolver {
  private metricsApi: DatadogMetricsApi;

  constructor() {
    this.metricsApi = new DatadogMetricsApi();
  }

  // Resolves metrics by directly querying the Datadog Metrics API
  public async resolve(params: {
    query: string;
    timeFrame: TimeFrame;
    name: string;
  }) {
    return this.metricsApi.query({
      query: params.query,
      timeFrame: params.timeFrame,
      name: params.name,
    });
  }
}
