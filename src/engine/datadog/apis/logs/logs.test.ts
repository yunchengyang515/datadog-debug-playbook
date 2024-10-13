// logs-parser.test.ts
import { parseLogsResponse } from "./logs-parser"; // Adjust the path as necessary
import { v2 } from "@datadog/datadog-api-client";

describe("Logs Parser", () => {
  it("should correctly parse a valid logs response", () => {
    const mockResponse: v2.LogsListResponse = {
      data: [
        {
          id: "log1",
          type: "log",
          attributes: {
            message: "Log entry 1",
            timestamp: new Date("2024-09-28T14:04:13.453Z"),
            tags: ["tag1", "tag2"],
          },
        },
        {
          id: "log2",
          type: "log",
          attributes: {
            message: "Log entry 2",
            timestamp: new Date("2024-09-28T14:05:15.123Z"),
            tags: ["tag3"],
          },
        },
      ],
      meta: {
        status: "done",
      },
    };

    const expectedLogs = [
      {
        message: "Log entry 1",
        timestamp: new Date("2024-09-28T14:04:13.453Z"),
        attributes: ["tag1", "tag2"],
      },
      {
        message: "Log entry 2",
        timestamp: new Date("2024-09-28T14:05:15.123Z"),
        attributes: ["tag3"],
      },
    ];

    const result = parseLogsResponse(mockResponse);
    expect(result).toEqual(expectedLogs);
  });

  it("should handle logs with missing attributes", () => {
    const mockResponse: v2.LogsListResponse = {
      data: [
        {
          id: "log1",
          type: "log",
          attributes: {
            message: "Log entry 1",
            timestamp: new Date("2024-09-28T14:04:13.453Z"),
          },
        },
        {
          id: "log2",
          type: "log",
          attributes: undefined, // Missing attributes
        },
      ],
      meta: {
        status: "done",
      },
    };

    const expectedLogs = [
      {
        message: "Log entry 1",
        timestamp: new Date("2024-09-28T14:04:13.453Z"),
        attributes: [],
      },
    ];

    const result = parseLogsResponse(mockResponse);
    expect(result).toEqual(expectedLogs);
  });

  it("should return an empty array if response has no data", () => {
    const mockResponse: v2.LogsListResponse = {
      data: [],
      meta: {
        status: "done",
      },
    };

    const result = parseLogsResponse(mockResponse);
    expect(result).toEqual([]);
  });

  it("should return a default message if the log entry has no message", () => {
    const mockResponse: v2.LogsListResponse = {
      data: [
        {
          id: "log1",
          type: "log",
          attributes: {
            timestamp: new Date("2024-09-28T14:04:13.453Z"),
            tags: ["tag1"],
          },
        },
      ],
      meta: {
        status: "done",
      },
    };

    const expectedLogs = [
      {
        message: "No message available",
        timestamp: new Date("2024-09-28T14:04:13.453Z"),
        attributes: ["tag1"],
      },
    ];

    const result = parseLogsResponse(mockResponse);
    expect(result).toEqual(expectedLogs);
  });
});
