// engine-service.test.ts
import { EngineService } from ".";
import { MetricsResolver } from "./resolvers/metrics-resolver";
import { Metrics } from "./types/metrics";
import { Playbook } from "./types/playbook";

// Mock the MetricsResolver
jest.mock("./resolvers/metrics-resolver");

describe("EngineService", () => {
  let engineService: EngineService;
  let mockMetricsResolver: jest.Mocked<MetricsResolver>;

  beforeEach(() => {
    mockMetricsResolver = new MetricsResolver() as jest.Mocked<MetricsResolver>;
    engineService = new EngineService();

    // Replace the resolver map entry for metrics with the mock
    (engineService as any).resolvers.metrics = mockMetricsResolver;
  });

  it("should process a valid metrics stage and store the result", async () => {
    // Mocked response from the resolver
    const mockResult = [{ data: "some-metrics-data" }] as unknown as Metrics;
    mockMetricsResolver.resolve.mockResolvedValue(mockResult);

    // A valid playbook with one metrics stage
    const playbook: Playbook = [
      {
        id: "stage1",
        name: "Test Metrics Stage",
        type: "metrics",
        target: "metrics",
        query: "avg:system.cpu.user{*} by {host}",
        params: { timeFrame: "last_24h" },
      },
    ];

    // Run the engine
    const results = await engineService.run(playbook);

    // Check that the correct resolver was called
    expect(mockMetricsResolver.resolve).toHaveBeenCalledWith(playbook[0]);

    // Ensure the result is stored correctly
    expect(results.get("stage1")).toEqual(mockResult);
  });

  it("should throw an error if no resolver is found for a stage target", async () => {
    // A playbook with an invalid stage (unsupported target)
    const invalidPlaybook: Playbook = [
      {
        id: "stage1",
        name: "Invalid Stage",
        type: "unknown",
        target: "unknown", // No resolver for this target
        query: "some-query",
        params: { timeFrame: "last_24h" },
      },
    ];

    await expect(engineService.run(invalidPlaybook)).rejects.toThrow(
      "No resolver found for target: unknown"
    );
  });
});
