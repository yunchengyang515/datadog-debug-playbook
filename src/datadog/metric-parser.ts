import { MetricsQueryMetadata } from "@datadog/datadog-api-client/dist/packages/datadog-api-client-v1";
import { MetricsTimePoint } from "../types/metrics-time-point";
import { v2 } from "@datadog/datadog-api-client";

export const extractHighCpuTimePointsFromSeries = (
  queryResponse: v2.TimeseriesFormulaQueryResponse,
  threshold: number,
  targetTag: string
): MetricsTimePoint[] => {
  const highCpuTimePoints: MetricsTimePoint[] = [];
  if (!queryResponse.data || !queryResponse.data.attributes) {
    return [];
  }
  const { series, times, values } = queryResponse.data?.attributes;

  if (!series || !times || !values) {
    return [];
  }

  for (let i = 0; i < series.length; i++) {
    if (!series[i].groupTags || !series[i].unit) {
      continue;
    }
    const groupTags = series[i].groupTags;
    const unit = series[i].unit?.[0] ?? undefined;
    const scaleFactor = unit?.scaleFactor ?? 1;
    console.log("units are: ", unit);
    const targetGroupTag = groupTags?.find((tag) => tag.startsWith(targetTag));
    if (!targetGroupTag) {
      continue;
    }

    const seriesValues =
      values[i]?.map((value) => (value as number) * scaleFactor) ?? [];
    const highValues = seriesValues
      .map((value, index) => ({
        timePoint: times[index],
        tagValue: targetGroupTag,
        value,
      }))
      .filter((point) => point.value > threshold);

    highCpuTimePoints.push(...highValues);
  }

  return highCpuTimePoints;
};
