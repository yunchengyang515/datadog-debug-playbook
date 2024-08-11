import { v2 } from "@datadog/datadog-api-client";
import { Metrics } from "../../../types/metrics";

export const parseMetricResponse = (
  queryResponse: v2.TimeseriesFormulaQueryResponse
): Metrics => {
  if (!queryResponse.data || !queryResponse.data.attributes) {
    return [];
  }
  const { series, times, values } = queryResponse.data?.attributes;

  if (!series || !times || !values) {
    return [];
  }
  const metrics: Metrics = [];
  for (let i = 0; i < series.length; i++) {
    if (!series[i].groupTags || !series[i].unit) {
      continue;
    }
    const groupTags = series[i].groupTags;
    const unit = series[i].unit?.[0] ?? undefined;
    const scaleFactor = unit?.scaleFactor ?? 1;

    const seriesValues =
      values[i]?.map((value) => (value as number) * scaleFactor) ?? [];
    const queryResultSeries: Metrics = seriesValues.map((value, index) => ({
      timestamp: times[index],
      attributes: groupTags,
      value,
    }));
    metrics.push(...queryResultSeries);
  }

  return metrics;
};
