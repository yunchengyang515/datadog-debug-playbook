// app.ts
import express, { Request, Response } from "express";
import { EngineService } from "../engine"; // Assuming this is the engine service you've built

const app = express();
const engineService = new EngineService();

app.use(express.json()); // Middleware to parse JSON request bodies

// Route to handle playbook execution
app.post("/run-playbook", async (req: Request, res: Response) => {
  try {
    const playbook = req.body;

    if (!playbook || !Array.isArray(playbook.stages)) {
      return res.status(400).send({ error: "Invalid playbook format" });
    }

    // Run the engine with the playbook
    const results = await engineService.run(playbook);

    // Send back the results of the execution
    res
      .status(200)
      .json({ success: true, results: Array.from(results.entries()) });
  } catch (error) {
    console.error("Error processing playbook:", error);
    res.status(500).send({ error: "Failed to process playbook" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
