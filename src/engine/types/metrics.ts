export type MetricsPoint = {
  timestamp: number;
  value: number;
  attributes?: string[];
};
export type Metrics = MetricsPoint[];
