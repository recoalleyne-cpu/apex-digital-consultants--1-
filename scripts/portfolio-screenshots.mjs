import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

const projectMap = [
  { name: 'the-science-plug', url: 'https://thescienceplug.com', archive: null },
  { name: 'okoye-by-kim', url: 'https://okoyebykim.com', archive: 'https://web.archive.org/web/20230124065835if_/http://okoyebykim.com/' },
  { name: 'highlighted-beauty-by-shan', url: 'https://highlightedbeautyspa.com', archive: 'https://web.archive.org/web/20230318162415if_/http://highlightedbeautyspa.com/' },
  { name: 'finish-line-cleaning-services', url: 'https://finishlinecleaningservices.com', archive: null },
  { name: 'hitz-1067-fm', url: 'https://myhitz106.com', archive: 'https://web.archive.org/web/20220918203512if_/http://myhitz106.com/' },
  { name: 'be-blessed-skin-care-and-beauty', url: 'https://beblessedbeauty.com', archive: 'https://web.archive.org/web/20210724095632if_/https://www.beblessedbeauty.com/' },
  { name: 'rhea-renee', url: 'https://rhearenee.com', archive: null },
  { name: 'mobile-and-marine-services', url: 'https://mobileandmarineservices.com', archive: null },
  { name: 'rachel-thomas-executive-coach', url: 'https://rachelthomascoaching.com', archive: null },
  { name: 'ask-for-jess', url: 'https://askforjess.com', archive: null },
  { name: 'sani-services-ltd', url: 'https://www.sanilimited.com', archive: null },
  { name: 'sergios-auto-follow', url: 'https://sergiosautofollow.com', archive: null },
  { name: 'island-zest', url: 'https://islandzest.com', archive: null }
];

const outDir = path.resolve('./public/portfolio-screenshots');
await fs.mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 1 });

for (const item of projectMap) {
  const target = item.archive || item.url;
  const fileStem = `${item.name}-desktop.png`;
  const mobileStem = `${item.name}-mobile.png`;
  const filePath = path.join(outDir, fileStem);
  const mobilePath = path.join(outDir, mobileStem);
  console.log(`Capturing ${item.name}: ${target}`);
  try {
    await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: filePath, fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: mobilePath, fullPage: true });
  } catch (err) {
    console.log(`Failed for ${item.name}: ${err.message}`);
  }
}
await browser.close();
