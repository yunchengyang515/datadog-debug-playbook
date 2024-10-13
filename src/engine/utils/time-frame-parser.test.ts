// time-frame-parser.test.ts
import { TimeFrameParser } from "../utils/time-frame-parser";

describe("TimeFrameParser", () => {
  let parser: TimeFrameParser;

  beforeEach(() => {
    parser = new TimeFrameParser();
    jest
      .useFakeTimers()
      .setSystemTime(new Date("2023-08-15T12:00:00Z").getTime()); // Mocking Date.now() to a fixed time
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should parse 'last_24h' correctly", () => {
    const result = parser.parse("last_24h");

    expect(result).toEqual({
      from: new Date("2023-08-14T12:00:00Z").getTime(),
      to: new Date("2023-08-15T12:00:00Z").getTime(),
    });
  });

  it("should parse 'last_hour' correctly", () => {
    const result = parser.parse("last_hour");

    expect(result).toEqual({
      from: new Date("2023-08-15T11:00:00Z").getTime(),
      to: new Date("2023-08-15T12:00:00Z").getTime(),
    });
  });

  it("should parse 'last_7d' correctly", () => {
    const result = parser.parse("last_7d");

    expect(result).toEqual({
      from: new Date("2023-08-08T12:00:00Z").getTime(),
      to: new Date("2023-08-15T12:00:00Z").getTime(),
    });
  });

  it("should throw an error for unsupported time frame", () => {
    expect(() => parser.parse("unsupported_time_frame")).toThrow(
      "Unsupported time frame: unsupported_time_frame"
    );
  });
});
