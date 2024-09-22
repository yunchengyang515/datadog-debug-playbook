export type Log = {
  message: string;
  timestamp: number;
  attributes?: string[];
};

export type Logs = Log[];
