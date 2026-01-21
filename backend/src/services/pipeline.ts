import { scrapeHashtagReels } from "../scraper/hashtagReels.js";
import { analyzeTrend } from "../agents/trendAnalyzer.js";
import { generateOutline } from "../agents/outlineAgent.js";
import { connectDB } from "../db/mongo.js";

export async function runPipeline() {
  console.log("🏁 Starting pipeline...");
  const db = await connectDB();

  console.log("🔍 Scraping reels for #ai...");
  const reels = await scrapeHashtagReels("ai");
  console.log(`✅ Scraped ${reels.length} reels.`);

  const topReels = reels.slice(0, 10);

  for (const [index, reel] of topReels.entries()) {
    try {
      console.log(`🤖 Analyzing reel ${index + 1}/${topReels.length}...`);
      const analysis = await analyzeTrend(reel);

      console.log(`📝 Generating outline for reel ${index + 1}...`);
      const outline = await generateOutline(analysis);

      await db.collection("trend_outputs").insertOne({
        reel,
        analysis,
        outline,
        createdAt: new Date(),
      });
      console.log(`💾 Saved reel ${index + 1} to database.`);
    } catch (error) {
      console.error(`❌ Error processing reel ${index + 1}:`, error);
    }
  }

  console.log("✨ Pipeline execution finished.");
}
