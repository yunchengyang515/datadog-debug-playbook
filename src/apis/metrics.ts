import { TimeseriesFormulaQueryResponse } from "@datadog/datadog-api-client/dist/packages/datadog-api-client-v2";
import { Metrics } from "../types/metrics";
import { TimeFrame } from "../types/time-frame";

export abstract class MetricsApi {
  abstract query(params: {
    query: string;
    timeFrame: TimeFrame;
  }): Promise<Metrics>;
  abstract getMetrics(params: {
    query: string;
    timeFrame: TimeFrame;
  }): Promise<TimeseriesFormulaQueryResponse>;
  abstract parseMetrics(response: TimeseriesFormulaQueryResponse): Metrics;
}
