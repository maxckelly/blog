// Renders /cv to public/max-kelly-cv.pdf using the site's own styles,
// so the PDF always matches the website. Run with: pnpm pdf
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 4998;
const URL = `http://localhost:${PORT}/cv`;
const OUT = path.join(root, 'public', 'max-kelly-cv.pdf');

const astroBin = path.join(root, 'node_modules', '.bin', 'astro');
const server = spawn(astroBin, ['dev', '--port', String(PORT)], {
  cwd: root,
  stdio: 'ignore',
});

async function waitForServer(url, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Dev server did not start within ${timeoutMs / 1000}s`);
}

try {
  await waitForServer(URL);

  const browser = await puppeteer.launch({ channel: 'chrome' });
  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);

  await page.pdf({
    path: OUT,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await browser.close();
  console.log(`CV written to ${OUT}`);
} finally {
  server.kill();
}
