export type Log = {
  message: string;
  timestamp: number | Date;
  attributes?: string[];
};

export type Logs = Log[];
