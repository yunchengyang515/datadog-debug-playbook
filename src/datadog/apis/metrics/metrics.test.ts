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

  it("should query metrics api with correct params", async () => {
    const params = {
      query:
        "max:container.cpu.user{task_name:dashpivot-ecs-api-infra-au1, ecs_container_name:dashpivot-api} by {container_id}",
      timeFrame: { from: 1722478260000, to: 1722478320000 } as TimeFrame,
      name: "cpu_usage",
    };

    await datadogMetricsApi.query(params);

    expect(queryTimeseriesDataMock).toHaveBeenCalledWith({
      body: {
        data: {
          attributes: {
            from: params.timeFrame.from,
            queries: [
              {
                dataSource: "metrics",
                name: params.name,
                query: params.query,
              },
            ],
            to: params.timeFrame.to,
          },
          type: "timeseries_request",
        },
      },
    });
  });

  it("should return the parsed metrics", async () => {
    const params = {
      query: "avg:system.cpu.user{*}",
      timeFrame: { from: 1620000000, to: 1620003600 } as TimeFrame,
      name: "cpu_usage",
    };

    const expectedMetrics: Metrics = [
      {
        timestamp: 1722478263000,
        value: 0.01533, // Rounded to 5 decimal places
        attributes: [
          "container_id:37acd4800ca54ced8aef65e42428cdf8-3321642634",
        ],
      },
      {
        timestamp: 1722478278000,
        value: 0.0,
        attributes: [
          "container_id:37acd4800ca54ced8aef65e42428cdf8-3321642634",
        ],
      },
      {
        timestamp: 1722478293000,
        value: 0.0,
        attributes: [
          "container_id:37acd4800ca54ced8aef65e42428cdf8-3321642634",
        ],
      },
      {
        timestamp: 1722478308000,
        value: 0.00267, // Rounded to 5 decimal places
        attributes: [
          "container_id:37acd4800ca54ced8aef65e42428cdf8-3321642634",
        ],
      },
      {
        timestamp: 1722478314000,
        value: 0.00187, // Rounded to 5 decimal places
        attributes: [
          "container_id:37acd4800ca54ced8aef65e42428cdf8-3321642634",
        ],
      },
      {
        timestamp: 1722478314000,
        value: 0.20732, // Rounded to 5 decimal places
        attributes: [
          "container_id:959809dd199e4e2c9f9b5e7dc6c1ae32-3321642634",
        ],
      },
    ];

    const result = await datadogMetricsApi.query(params);

    expect(result).toEqual(expectedMetrics);
  });
});
