import { chromium as base } from "playwright-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

base.use(StealthPlugin());

export const chromium = base;
