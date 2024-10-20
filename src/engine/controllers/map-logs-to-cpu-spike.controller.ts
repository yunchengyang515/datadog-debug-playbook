import { Request, Response } from "express";
import { MetricsResolver } from "../resolvers/metrics-resolver"; // Assuming you've already implemented this
import { TimeFrame } from "../types/time-frame"; // Assuming you have this type
import { LogsResolver } from "../resolvers/logs-resolver";

export class LogToCpuMapController {
  private metricsResolver: MetricsResolver;
  private logsResolver: LogsResolver;

  constructor() {
    this.metricsResolver = new MetricsResolver();
    this.logsResolver = new LogsResolver();
  }

  // POST /log-to-cpu-map
  public async handleLogToCpuMap(req: Request, res: Response): Promise<void> {
    try {
      const {
        metricsQuery,
        logsQuery,
        timeRange,
        cpuThreshold,
        paddingMinutes,
        provider,
      } = req.body;

      // Validate config
      if (!metricsQuery || !logsQuery || !timeRange || !cpuThreshold) {
        res.status(400).json({ message: "Invalid configuration provided." });
        return;
      }

      // Step 1: Fetch metrics data for CPU usage
      const timeFrame: TimeFrame = {
        from: new Date(timeRange.from).getTime(),
        to: new Date(timeRange.to).getTime(),
      };

      const metricsResult = await this.metricsResolver.resolve({
        query: metricsQuery,
        timeFrame,
        name: "CPU Usage Query",
      });

      // Step 2: Analyze the metrics and find CPU spikes
      const spikeTimes = this.findCpuSpikes(metricsResult, cpuThreshold);

      // Step 3: Fetch logs around the CPU spike times (with padding)
      const logResults = await this.fetchLogsAroundSpikes(
        spikeTimes,
        logsQuery,
        paddingMinutes,
        timeFrame
      );

      // Step 4: Return the logs related to CPU spikes
      res.status(200).json({ spikes: spikeTimes, logs: logResults });
    } catch (error) {
      console.error("Error in log-to-cpu-map workflow:", error);
      res
        .status(500)
        .json({ message: "Failed to process log-to-cpu-map workflow" });
    }
  }

  // Helper to find CPU spikes based on the threshold
  private findCpuSpikes(metricsResult: any, threshold: number): number[] {
    const spikeTimes: number[] = [];

    for (const dataPoint of metricsResult) {
      if (dataPoint.value > threshold) {
        spikeTimes.push(dataPoint.timestamp);
      }
    }

    return spikeTimes;
  }

  // Fetch logs around spike times with padding
  private async fetchLogsAroundSpikes(
    spikeTimes: number[],
    logsQuery: string,
    paddingMinutes: number,
    timeFrame: TimeFrame
  ) {
    const logResults = [];

    for (const spikeTime of spikeTimes) {
      const paddedTimeFrame: TimeFrame = {
        from: spikeTime - paddingMinutes * 60 * 1000, // padding before spike
        to: spikeTime + paddingMinutes * 60 * 1000, // padding after spike
      };

      const logs = await this.logsResolver.resolve({
        query: logsQuery,
        timeFrame: paddedTimeFrame,
        name: "Log Query Around Spike",
      });

      logResults.push(...logs);
    }

    return logResults;
  }
}
