import { v2 } from "@datadog/datadog-api-client";
import { Metrics, MetricsPoint } from "../../../types/metrics";

// Main function to parse the Datadog metrics response
export const parseMetricResponse = (
  queryResponse: v2.TimeseriesFormulaQueryResponse
): Metrics => {
  const attributes = getValidAttributes(queryResponse);
  if (!attributes) {
    return [];
  }

  const { series, times, values } = attributes;

  if (!series || !times || !values) {
    return [];
  }

  return series.reduce<Metrics>((acc, seriesItem, index) => {
    const metricsPoints = extractMetricsPoints(
      seriesItem,
      times,
      values[index] || []
    );
    return [...acc, ...metricsPoints];
  }, []);
};

// Safely get valid attributes from the query response
const getValidAttributes = (
  queryResponse: v2.TimeseriesFormulaQueryResponse
): v2.TimeseriesResponseAttributes | undefined => {
  const attributes = queryResponse.data?.attributes;
  if (
    attributes &&
    attributes.series &&
    attributes.times &&
    attributes.values
  ) {
    return attributes;
  }
  console.warn("Missing series, times, or values in attributes.");
  return undefined;
};

// Extract metrics points from a series item, times, and values
const extractMetricsPoints = (
  seriesItem: v2.TimeseriesResponseSeries,
  times: number[],
  values: (number | null)[]
): Metrics => {
  if (!isValidSeries(seriesItem)) {
    return [];
  }

  const scaleFactor = getScaleFactor(seriesItem);
  return values
    .map((value, index) =>
      value !== null
        ? createMetricsPoint(
            value,
            times[index],
            scaleFactor,
            seriesItem.groupTags || []
          )
        : null
    )
    .filter((point): point is MetricsPoint => point !== null);
};

// Check if a series item has required properties
const isValidSeries = (seriesItem: v2.TimeseriesResponseSeries): boolean => {
  return !!seriesItem.groupTags && !!seriesItem.unit;
};

// Get the scale factor from the unit, defaulting to 1 if undefined
const getScaleFactor = (seriesItem: v2.TimeseriesResponseSeries): number => {
  const unit = seriesItem.unit?.[0];
  return unit?.scaleFactor ?? 1;
};

// Create a metrics point with scaled value and rounded to 5 decimal places
const createMetricsPoint = (
  value: number,
  timestamp: number,
  scaleFactor: number,
  groupTags: string[]
): MetricsPoint => {
  const scaledValue = parseFloat((value * scaleFactor).toFixed(5));
  return {
    timestamp,
    attributes: groupTags,
    value: scaledValue,
  };
};
