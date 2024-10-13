import { DatadogMetricsApi } from "../datadog/apis/metrics/metrics"; // Assuming this is your metrics API class
import { TimeFrameParser } from "../utils/time-frame-parser"; // Handles time frame conversion
import { StageValidator } from "../utils/stage-validator"; // Validates the stage configuration
import { MetricsStage, Stage } from "../types/stage";

export class MetricsResolver {
  private timeFrameParser: TimeFrameParser;
  private metricsApi: DatadogMetricsApi;
  private validator: StageValidator;

  constructor() {
    this.timeFrameParser = new TimeFrameParser();
    this.metricsApi = new DatadogMetricsApi();
    this.validator = new StageValidator("metrics"); // Initialize the validator specifically for metrics
  }

  async resolve(stage: Stage) {
    // Validate the stage before proceeding
    const validatedStage = this.validator.validate<MetricsStage>(stage);

    const { query, params } = validatedStage;
    const timeFrame = this.timeFrameParser.parse(params.timeFrame);
    const metricsParams = {
      query,
      timeFrame,
      name: stage.name,
    };

    return this.metricsApi.query(metricsParams);
  }
}
