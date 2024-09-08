export class TimeFrameParser {
  parse(timeFrame: string): { from: number; to: number } {
    const now = Date.now();

    switch (timeFrame) {
      case "last_24h":
        return { from: now - 24 * 60 * 60 * 1000, to: now };
      case "last_hour":
        return { from: now - 60 * 60 * 1000, to: now };
      case "last_7d":
        return { from: now - 7 * 24 * 60 * 60 * 1000, to: now };
      default:
        throw new Error(`Unsupported time frame: ${timeFrame}`);
    }
  }
}
