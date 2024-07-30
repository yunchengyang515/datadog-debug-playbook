import { MetricsQueryMetadata } from "@datadog/datadog-api-client/dist/packages/datadog-api-client-v1";
import { MetricsTimePoint } from "../types/metrics-time-point";

export const extractHighCpuTimePointsFromSeries = (
  timeSeriesList: MetricsQueryMetadata[],
  threshold: number,
  targetTag: string
): MetricsTimePoint[] => {
  const highCpuTimePoints: MetricsTimePoint[] = [];
  for (const timeSeries of timeSeriesList) {
    if (!timeSeries.pointlist) {
      continue;
    }
    for (const point of timeSeries.pointlist) {
      if (point[1] > threshold) {
        highCpuTimePoints.push({
          timePoint: point[0],
          tagValue: timeSeries.tagSet? timeSeries.tagSet
        });
      }
    }
  }
};
