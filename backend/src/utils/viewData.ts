import "dotenv/config";
import { connectDB } from "../db/mongo.js";

async function viewData() {
  try {
    const db = await connectDB();
    const data = await db
      .collection("trend_outputs")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    if (data.length === 0) {
      console.log("📂 Database is empty.");
    } else {
      console.log(`📊 Found ${data.length} analyzed reels:\n`);
      console.table(
        data.map((d) => ({
          Caption: d.reel.caption.substring(0, 50) + "...",
          Likes: d.reel.likes,
          SavedAt: new Date(d.createdAt).toLocaleString(),
        })),
      );
    }
  } catch (error) {
    console.error("❌ Error fetching data:", error);
  } finally {
    process.exit();
  }
}

viewData();
