import "dotenv/config";
import "./jobs/dailyPipeline.js";
import { runPipeline } from "./services/pipeline.js";

console.log("🚀 Trend Agent running...");

if (process.argv.includes("--now")) {
  console.log("🏃 Running pipeline immediately...");
  runPipeline().catch(console.error);
}
