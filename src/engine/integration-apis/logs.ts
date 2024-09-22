// logs-api.ts
export abstract class LogsApi {
  abstract query(params: {
    query: string;
    timeFrame: { from: number; to: number };
    name: string;
  }): Promise<any>;
}
