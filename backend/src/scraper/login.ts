import "dotenv/config";
import { chromium } from "./utils.js";
import fs from "fs";

export async function loginAndSaveCookies() {
  console.log("🚀 Starting browser for login...");
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("🔗 Navigating to Instagram login...");
  await page.goto("https://www.instagram.com/accounts/login/");

  console.log("⌨️ Filling credentials...");
  await page.fill("input[name='username']", process.env.INSTAGRAM_USERNAME!);
  await page.fill("input[name='password']", process.env.INSTAGRAM_PASSWORD!);
  await page.click("button[type='submit']");

  console.log("⏳ Waiting for manual login/OTP (15 seconds)...");
  await page.waitForTimeout(15000); // handle OTP

  const cookies = await context.cookies();
  fs.writeFileSync("cookies.json", JSON.stringify(cookies, null, 2));
  console.log("✅ Cookies saved to cookies.json");

  await browser.close();
}

if (
  import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1]?.endsWith("login.ts") ||
  process.argv[1]?.endsWith("login.js")
) {
  loginAndSaveCookies().catch(console.error);
}
