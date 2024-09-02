import { v2 } from "@datadog/datadog-api-client";
import { Metrics } from "../../../types/metrics";

export const parseMetricResponse = (
  queryResponse: v2.TimeseriesFormulaQueryResponse
): Metrics => {
  if (!queryResponse.data?.attributes) {
    console.warn("Missing data or attributes in queryResponse.");
    return [];
  }

  const { series, times, values } = queryResponse.data.attributes;

  if (!series || !times || !values) {
    console.warn("Missing series, times, or values in attributes.");
    return [];
  }

  const metrics: Metrics = [];

  series.forEach((seriesItem, i) => {
    if (!seriesItem.groupTags || !seriesItem.unit) {
      console.warn(`Skipping series ${i} due to missing groupTags or unit.`);
      return;
    }

    const groupTags = seriesItem.groupTags;
    const unit = seriesItem.unit[0];
    const scaleFactor = unit?.scaleFactor ?? 1;

    values[i]?.forEach((value, index) => {
      if (value !== null) {
        // Multiply by scaleFactor and round to 5 decimal places
        const roundedValue = parseFloat(
          ((value as number) * scaleFactor).toFixed(5)
        );

        metrics.push({
          timestamp: times[index],
          attributes: groupTags,
          value: roundedValue,
        });
      }
    });
  });

  return metrics;
};
