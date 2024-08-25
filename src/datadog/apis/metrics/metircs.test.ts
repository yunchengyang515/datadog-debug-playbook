import { DatadogMetricsApi } from "./metrics";
import { TimeFrame } from "../../../types/time-frame";
import { Metrics } from "../../../types/metrics";
import mockResponse from "./datadog-query-timeseries-metrics-response-dashpivot-infra.json"; // Adjust the path to your mock response file

describe("DatadogMetricsApi - query method", () => {
  let datadogMetricsApi: DatadogMetricsApi;
  let queryTimeseriesDataMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create a mock of the apiInstance with the queryTimeseriesData method
    queryTimeseriesDataMock = jest.fn().mockResolvedValue(mockResponse);

    // Mock the internal apiInstance of DatadogMetricsApi
    datadogMetricsApi = new DatadogMetricsApi();
    (datadogMetricsApi as any).apiInstance = {
      queryTimeseriesData: queryTimeseriesDataMock,
    };
  });

  it("should query metrics and return the correctly parsed data", async () => {
    const params = {
      query: "avg:system.cpu.user{*}",
      timeFrame: { from: 1620000000, to: 1620003600 } as TimeFrame,
      name: "cpu_usage",
    };

    const expectedMetrics: Metrics = [
      {
        timestamp: 1721737103000,
        value: 0.8580300854741503, // 858030085.4741503 * 1e-9
        attributes: [
          "container_id:030308e156174239b2753407f83ebab6-3321642634",
        ],
      },
      {
        timestamp: 1721737133000,
        value: 0.9755611841454662, // 975561184.1454662 * 1e-9
        attributes: [
          "container_id:030308e156174239b2753407f83ebab6-3321642634",
        ],
      },
      {
        timestamp: 1721737193000,
        value: 0.9305866516077688, // 930586651.6077688 * 1e-9
        attributes: [
          "container_id:030308e156174239b2753407f83ebab6-3321642634",
        ],
      },
    ];

    const result = await datadogMetricsApi.query(params);

    expect(queryTimeseriesDataMock).toHaveBeenCalledWith(
      expect.objectContaining({
        body: {
          data: {
            attributes: expect.objectContaining({
              from: params.timeFrame.from,
              to: params.timeFrame.to,
              queries: [
                expect.objectContaining({
                  dataSource: "metrics",
                  query: params.query,
                  name: params.name,
                }),
              ],
            }),
          },
        },
      })
    );

    expect(result).toEqual(expectedMetrics);
  });
});
