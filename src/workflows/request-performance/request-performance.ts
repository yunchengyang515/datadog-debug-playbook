import { LogsApi } from "@datadog/datadog-api-client/dist/packages/datadog-api-client-v1";
import { getLogsApi } from "../../datadog/apis/logs";
import { getMetricsApi } from "../../datadog/apis/metrics";
import { Workflow } from "../workflow";
import { TimeFrame } from "../../types/time-frame";
import queries from "./queries.json";
import { MetricsApi } from "@datadog/datadog-api-client/dist/packages/datadog-api-client-v2";

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
    this.metricsApi = getMetricsApi();
    this.timeFrame = timeFrame;
  }

  /**
   * Get the time point when the CPU usage is high
   * @returns a list of time points and tags
   */
  private async fetchHighCpuTimePoint() {
    const metricsParams = {
      from: this.timeFrame.from,
      to: this.timeFrame.to,
      query: queries.cpuMetricsQuery, // Assuming the query is defined in queries.json
    };
    const response = await this.metricsApi.queryTimeseriesData(metricsParams);
    const series = response.series;
  }

  private async extractTimePointsFromSeries(
    series: MetricsQueryResponse["series"]
  ) {}

  /**
   * Get the requests right before the time point when CPU usage is high
   * @returns
   */
  private fetchRequestsBeforeHighCpu() {
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
  execute(): void {
    console.log("Requesting performance data...");
  }
}
