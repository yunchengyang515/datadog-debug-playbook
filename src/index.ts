import { Command } from "commander";
import figlet from "figlet";
import dotenv from "dotenv";
import { RequestPerformanceWorkflow } from "./workflows/request-performance/request-performance";

const program = new Command();

console.log(figlet.textSync("Dir Manager"));

// Load environment variables from .env file
dotenv.config();

program.version("1.0.0").description("An example CLI for managing workflows");

program
  .command("run-workflow")
  .description("Run a specific workflow")
  .option("-w, --workflow <name>", "Name of the workflow to run")
  .option("-f, --from <from>", "Start time (UNIX timestamp)")
  .option("-t, --to <to>", "End time (UNIX timestamp)")
  .action(async (cmd) => {
    const { workflow, from, to } = cmd;

    if (!from || !to) {
      console.error("Both --from and --to options are required.");
      process.exit(1);
    }

    const fromTime = parseInt(from);
    const toTime = parseInt(to);

    if (isNaN(fromTime) || isNaN(toTime)) {
      console.error("Invalid timestamps provided.");
      process.exit(1);
    }

    switch (workflow) {
      case "request-performance":
        const rpWorkflow = new RequestPerformanceWorkflow({
          timeFrame: {
            from: fromTime,
            to: toTime,
          },
        });
        await rpWorkflow.execute();
        break;
      default:
        console.error("Invalid workflow name provided.");
        process.exit(1);
    }
  });

program.parse(process.argv);
