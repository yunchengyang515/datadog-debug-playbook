// stage-validator.test.ts
import { StageValidator } from "./stage-validator";

describe("StageValidator", () => {
  let validator: StageValidator;

  beforeEach(() => {
    // Initialize the validator for metrics stage type
    validator = new StageValidator("metrics");
  });

  it("should pass validation for a valid metrics stage", () => {
    const validStage = {
      name: "Identify CPU Spike",
      type: "QueryTarget",
      target: "metrics",
      query: "avg:system.cpu.user{*} by {host}",
      params: { timeFrame: "last_24h" },
      filter: "result.value > 80",
      output: ["spikeTime", "targetTag"],
    };

    expect(() => validator.validate(validStage)).not.toThrow();
  });

  it("should throw an error when a required field is missing", () => {
    const missingNameStage = {
      type: "QueryTarget",
      target: "metrics",
      query: "avg:system.cpu.user{*} by {host}",
      params: { timeFrame: "last_24h" },
    };

    expect(() => validator.validate(missingNameStage as any)).toThrow(
      "Missing required fields: name"
    );
  });

  it("should throw an error when params.timeFrame is missing", () => {
    const missingTimeFrameStage = {
      name: "Identify CPU Spike",
      type: "QueryTarget",
      target: "metrics",
      query: "avg:system.cpu.user{*} by {host}",
      params: {}, // Missing timeFrame
    };

    expect(() => validator.validate(missingTimeFrameStage)).toThrow(
      "Missing required fields: params.timeFrame"
    );
  });

  it("should throw an error when an unsupported stage type is used", () => {
    expect(() => new StageValidator("unsupported")).toThrow(
      "Unsupported stage type: unsupported"
    );
  });
});
