import { MetricsResolver } from "./resolvers/metrics-resolver";
import { Playbook } from "./types/playbook";
import { Stage } from "./types/stage";

export class EngineService {
  private resolvers: Record<string, any> = {
    metrics: new MetricsResolver(), // Add other resolvers as needed
  };

  private results: Map<string, any> = new Map();

  // Accept the playbook directly as a JSON object from the request
  async run(playbook: Playbook) {
    try {
      // Step 1: Process each stage
      for (const stage of playbook) {
        await this.processStage(stage);
      }

      // Optional: Return or handle results
      return this.results;
    } catch (error) {
      console.error("Failed to run the engine:", error);
      throw error;
    }
  }

  private async processStage(stage: Stage) {
    const { id, target } = stage;

    // Step 2: Select the appropriate resolver based on the stage target
    const resolver = this.resolvers[target];
    if (!resolver) {
      throw new Error(`No resolver found for target: ${target}`);
    }

    // Step 3: Resolve the stage and store the result
    const result = await resolver.resolve(stage);
    this.results.set(id, result);
  }
}
