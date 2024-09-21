// metrics-resolver.test.ts
import { MetricsResolver } from "./metrics-resolver";
import { DatadogMetricsApi } from "../datadog/apis/metrics/metrics";
import { TimeFrameParser } from "../utils/time-frame-parser";

jest.mock("../datadog/apis/metrics/metrics"); // Mock the metrics API
jest.mock("../utils/time-frame-parser"); // Mock the TimeFrameParser

describe("MetricsResolver", () => {
  let resolver: MetricsResolver;
  let mockMetricsApi: jest.Mocked<DatadogMetricsApi>;
  let mockTimeFrameParser: jest.Mocked<TimeFrameParser>;

  beforeEach(() => {
    mockMetricsApi = new DatadogMetricsApi() as jest.Mocked<DatadogMetricsApi>;
    mockTimeFrameParser = new TimeFrameParser() as jest.Mocked<TimeFrameParser>;
    resolver = new MetricsResolver();

    // Replace the internal instances with mocks
    (resolver as any).metricsApi = mockMetricsApi;
    (resolver as any).timeFrameParser = mockTimeFrameParser;
  });

  it("should correctly parse the stage and call the metrics API", async () => {
    const stage = {
      name: "Test Stage",
      query: "avg:system.cpu.user{*}",
      params: { timeFrame: "last_24h" },
      type: "Metrics",
      target: "metrics",
    };

    const expectedTimeFrame = { from: 1620000000, to: 1620003600 };
    mockTimeFrameParser.parse.mockReturnValue(expectedTimeFrame);
    mockMetricsApi.query.mockResolvedValue([
      { timestamp: 1620000000, value: 1 },
    ]);

    const result = await resolver.resolve(stage);

    expect(mockTimeFrameParser.parse).toHaveBeenCalledWith("last_24h");
    expect(mockMetricsApi.query).toHaveBeenCalledWith({
      query: "avg:system.cpu.user{*}",
      timeFrame: expectedTimeFrame,
      name: "Test Stage",
    });
    expect(result).toEqual([{ timestamp: 1620000000, value: 1 }]);
  });

  it("should throw an error if the stage is invalid", async () => {
    const invalidStage = {
      name: "Invalid Stage",
      query: "",
      params: { timeFrame: "" },
      type: "Metrics",
      target: "metrics",
    };

    await expect(resolver.resolve(invalidStage)).rejects.toThrow(
      "Missing required fields: query, params.timeFrame"
    );
  });
});
