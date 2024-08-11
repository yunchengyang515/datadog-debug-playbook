import { v1, v2 } from "@datadog/datadog-api-client";
import { getDatadogClientConfiguration } from "../../clients";
import { MetricsApi } from "../../../apis/metrics";
import { Metrics } from "../../../types/metrics";
import {
  MetricsApiQueryTimeseriesDataRequest,
  TimeseriesFormulaQueryResponse,
} from "@datadog/datadog-api-client/dist/packages/datadog-api-client-v2";
import { TimeFrame } from "../../../types/time-frame";
import { parseMetricResponse } from "./metrics-parser";

export const getV2MetricsApi = () => {
  const configuration = getDatadogClientConfiguration();
  configuration.unstableOperations["v2.queryTimeseriesData"] = true;
  const apiInstance = new v2.MetricsApi(configuration);
  return apiInstance;
};

export class DatadogMetricsApi implements MetricsApi {
  private apiInstance: v2.MetricsApi;

  constructor() {
    this.apiInstance = getV2MetricsApi();
  }

  async query(params: {
    query: string;
    timeFrame: TimeFrame;
    name: string;
  }): Promise<Metrics> {
    const metricsResponse = await this.getMetrics(params);
    return this.parseMetrics(metricsResponse);
  }

  async getMetrics(params: {
    query: string;
    timeFrame: TimeFrame;
    name: string;
  }): Promise<TimeseriesFormulaQueryResponse> {
    const { query, timeFrame, name } = params;
    const requestParams: MetricsApiQueryTimeseriesDataRequest = {
      body: {
        data: {
          attributes: {
            from: timeFrame.from,
            queries: [
              {
                dataSource: "metrics",
                query,
                name,
              },
            ],
            to: timeFrame.to,
          },
          type: "timeseries_request",
        },
      },
    };
    return this.apiInstance.queryTimeseriesData(requestParams);
  }

  parseMetrics(response: TimeseriesFormulaQueryResponse): Metrics {
    return parseMetricResponse(response);
  }
}
