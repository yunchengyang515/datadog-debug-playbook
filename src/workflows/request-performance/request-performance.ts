import { LogsApi } from "@datadog/datadog-api-client/dist/packages/datadog-api-client-v1";
import { getLogsApi } from "../../datadog/apis/logs";
import { getV2MetricsApi } from "../../datadog/apis/metircs/metrics";
import { Workflow } from "../workflow";
import { TimeFrame } from "../../types/time-frame";
import queries from "./queries.json";
import { MetricsApi } from "@datadog/datadog-api-client/dist/packages/datadog-api-client-v2";
import { v2 } from "@datadog/datadog-api-client";
import { extractHighCpuTimePointsFromSeries } from "../../datadog/apis/metircs/metrics-parser";

/**
 * Workflow to debug request performance, with Datadog API
 * In future we should extend the class to be able to use other monitoring platforms.
 * Also for each check logic, we can incorporate different queries
 */
export class RequestPerformanceWorkflow extends Workflow {
  logsApi: LogsApi;
  metricsApi: MetricsApi;
  timeFrame: TimeFrame;
  constructor({ timeFrame }: { timeFrame: TimeFrame }) {
    super();
    this.logsApi = getLogsApi();
    this.metricsApi = getV2MetricsApi();
    this.timeFrame = timeFrame;
  }
  async execute() {
    console.log("Requesting performance data...");
    const result = await this.fetchHighCpuTimePoint();
    console.log(result);
  }
  /**
   * Get the time point when the CPU usage is high
   * @returns a list of time points and tags
   */
  private async fetchHighCpuTimePoint() {
    const metricsParams: v2.MetricsApiQueryTimeseriesDataRequest = {
      body: {
        data: {
          attributes: {
            from: this.timeFrame.from,
            interval: 5000,
            queries: [
              {
                dataSource: "metrics",
                query: queries.cpuMetricsQuery,
                name: "cpu usage",
              },
            ],
            to: this.timeFrame.to,
          },
          type: "timeseries_request",
        },
      },
    };
    const response = await this.metricsApi.queryTimeseriesData(metricsParams);
    return extractHighCpuTimePointsFromSeries(
      response,
      queries.cpuMetricsThresholdInCore,
      queries.cpuMetricsTargetTag
    );
  }

  /**
   * Get the requests right before the time point when CPU usage is high
   * @returns
   */
  private fetchRequestsBeforeHighCpu(tag: string, timePoint: number) {
    return;
  }

  /**
   * Get the requests latency by checking the response
   * @returns
   */
  private checkRequestLatency() {}

  /**
   * Check if the request has a response
   * @returns
   */
  private checkRequestHasResponse() {}

  /**
   * Check if the request trace matches the CPU spike
   */
  private checkRequestTraceDuration() {}

  /**
   * Search the same request in other servers, see if the issue is server specific
   * @returns
   */
  private confirmRequestsInOtherServer() {
    return;
  }

  private listUniqueRequestsRelatedToHighCpu() {}
}
