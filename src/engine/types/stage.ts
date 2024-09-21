export interface Stage {
  name: string;
  type: string;
  target: string;
  query: string;
  params: { timeFrame?: string; [key: string]: any }; // Ensure params include timeFrame
}

export interface MetricsStage extends Stage {
  params: { timeFrame: string };
}
