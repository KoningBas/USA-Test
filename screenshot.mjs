import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotDir = path.join(__dirname, 'temporary screenshots');

// Create screenshot directory if it doesn't exist
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

// Get the URL from command line arguments
const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';

async function takeScreenshot() {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Find the next screenshot number
    const files = fs.readdirSync(screenshotDir).filter(f => f.startsWith('screenshot-'));
    let nextNum = 1;
    files.forEach(f => {
      const match = f.match(/screenshot-(\d+)/);
      if (match) {
        nextNum = Math.max(nextNum, parseInt(match[1]) + 1);
      }
    });

    const filename = label
      ? `screenshot-${nextNum}-${label}.png`
      : `screenshot-${nextNum}.png`;
    const filepath = path.join(screenshotDir, filename);

    await page.screenshot({ path: filepath, fullPage: false });
    console.log(`Screenshot saved to: ${filepath}`);

    await browser.close();
  } catch (error) {
    console.error('Error taking screenshot:', error);
    if (browser) await browser.close();
    process.exit(1);
  }
}

takeScreenshot();
