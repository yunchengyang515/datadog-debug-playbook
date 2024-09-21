import { TimeseriesFormulaQueryResponse } from "@datadog/datadog-api-client/dist/packages/datadog-api-client-v2";
import { Metrics } from "../types/metrics";
import { TimeFrame } from "../types/time-frame";

export abstract class MetricsApi {
  abstract query(params: {
    query: string;
    timeFrame: TimeFrame;
  }): Promise<Metrics>;
  protected abstract getMetrics(params: {
    query: string;
    timeFrame: TimeFrame;
  }): Promise<TimeseriesFormulaQueryResponse>;
  protected abstract parseMetrics(
    response: TimeseriesFormulaQueryResponse
  ): Metrics;
}
