import cron from "node-cron";
import { runPipeline } from "../services/pipeline.js";

cron.schedule("0 6,12,18 * * *", async () => {
  console.log("⏰ Running daily pipeline");
  await runPipeline();
});
