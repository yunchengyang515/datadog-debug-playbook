// stage-validator.ts

import { Stage } from "../types/stage";

type Schema = {
  required: string[];
  optional?: string[];
};

type ValidatorMap = {
  [key: string]: Schema;
};

export class StageValidator {
  private validators: ValidatorMap = {
    metrics: {
      required: ["name", "type", "target", "query", "params.timeFrame"], // params.timeFrame is now explicitly required
      optional: ["filter", "output", "map", "aggregation"],
    },
    // Future stage types can be added here
  };

  private schema: Schema;

  constructor(stageType: string) {
    this.schema = this.getSchema(stageType);
  }

  validate<T>(stage: Stage): T {
    // Check for missing top-level fields and nested fields like params.timeFrame
    const missingFields = this.schema.required.filter((field) => {
      const fields = field.split("."); // Split for nested field checks
      let current = stage as any;
      return !fields.every(
        (f) =>
          (current = current[f]) !== undefined &&
          current !== null &&
          current !== ""
      );
    });

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    return stage as T;
  }

  private getSchema(stageType: string): Schema {
    const schema = this.validators[stageType];
    if (!schema) {
      throw new Error(`Unsupported stage type: ${stageType}`);
    }
    return schema;
  }
}
