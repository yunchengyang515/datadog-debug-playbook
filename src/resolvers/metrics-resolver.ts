import { DatadogMetricsApi } from "../datadog/apis/metrics/metrics"; // Assuming this is your metrics API class
import { TimeFrameParser } from "../utils/time-frame-parser"; // Handles time frame conversion

export class MetricsResolver {
  private timeFrameParser: TimeFrameParser;
  private metricsApi: DatadogMetricsApi;

  constructor() {
    this.timeFrameParser = new TimeFrameParser();
    this.metricsApi = new DatadogMetricsApi();
  }

  async resolve(stage: any) {
    const { query, params } = stage;
    const timeFrame = this.timeFrameParser.parse(params.timeFrame);
    const metricsParams = {
      query,
      timeFrame,
      name: stage.name,
    };

    const result = await this.metricsApi.query(metricsParams);
    return result;
  }
}
