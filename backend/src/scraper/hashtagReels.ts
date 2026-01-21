import fs from "fs";
import { chromium } from "./utils.js";

export async function scrapeHashtagReels(hashtag: string) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  const cookies = JSON.parse(fs.readFileSync("cookies.json", "utf-8"));
  await context.addCookies(cookies);

  const page = await context.newPage();
  console.log(`📡 Navigating to #${hashtag}...`);
  await page.goto(`https://www.instagram.com/explore/tags/${hashtag}/`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await page.waitForTimeout(5000);

  // Scroll multiple times to trigger more loading
  console.log("🖱️ Scrolling to load more reels...");
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(2000);
  }

  // Take a screenshot for debugging
  await page.screenshot({ path: "debug_hashtag.png" });

  // Debug: see all links
  const allLinks = await page.$$eval("a", (links) => links.length);
  console.log(`🔗 Total links found on page: ${allLinks}`);

  // Try multiple selectors for the reel grid
  const reelSelectors = [
    "a[href*='/reels/']",
    "a[href*='/p/']",
    "div._ac7v a",
    "article a",
  ];

  let reels: any[] = [];
  for (const selector of reelSelectors) {
    reels = await page.$$(selector);
    if (reels.length > 0) {
      console.log(
        `📦 Found ${reels.length} elements with selector: ${selector}`,
      );
      break;
    }
  }

  if (reels.length === 0) {
    console.warn(
      "⚠️ No reels found. This might be due to a login issue or selector change.",
    );
    await browser.close();
    return [];
  }

  const reel = reels[0]!;
  // Scroll reel into view before clicking
  await reel.scrollIntoViewIfNeeded();
  await reel.click();
  await page.waitForTimeout(5000);

  const results = [];

  for (let i = 0; i < 10; i++) {
    console.log(`📸 Scraping current reel (${i + 1}/10)...`);
    const data = await page.evaluate(() => {
      const caption =
        document.querySelector("h1")?.innerText ||
        document.querySelector("article span._ap3a")?.textContent ||
        "";

      const likesText =
        document.querySelector("section article span")?.textContent ||
        document.querySelector("span.x193iq5w")?.textContent ||
        "0";

      return {
        caption,
        likes: parseInt(likesText.replace(/,/g, "")) || 0,
        scrapedAt: new Date().toISOString(),
        url: window.location.href,
      };
    });

    results.push(data);

    // Next reel
    const currentUrl = page.url();
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(4000);

    if (page.url() === currentUrl) {
      console.log(
        "🔄 URL didn't change, trying alternative next navigation...",
      );
      await page.click("svg[aria-label='Next']").catch(() => {});
      await page.waitForTimeout(4000);
    }
  }

  await browser.close();
  return results;
}
