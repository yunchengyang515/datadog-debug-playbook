import express, { Request, Response } from "express";
import { LogToCpuMapController } from "./controllers/map-logs-to-cpu-spike.controller";

const app = express();
const port = process.env.PORT || 3000;

const logToCpuMapController = new LogToCpuMapController();

app.use(express.json());

// Define the route for your workflow
app.post("/log-to-cpu-map", (req: Request, res: Response) => {
  logToCpuMapController.handleLogToCpuMap(req, res);
});

// Catch all route for undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).send({ message: "Route not found." });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
