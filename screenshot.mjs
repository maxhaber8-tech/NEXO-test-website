// Usage: node screenshot.mjs <url> [label] [width] [height]
// Saves to ./temporary screenshots/screenshot-N[-label].png (auto-incremented, never overwritten)
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const [url = 'http://localhost:3000', label, width = '1440', height = '5200'] = process.argv.slice(2);
const chrome = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const dir = join(fileURLToPath(new URL('.', import.meta.url)), 'temporary screenshots');
mkdirSync(dir, { recursive: true });
const used = readdirSync(dir)
  .map((f) => Number(f.match(/^screenshot-(\d+)/)?.[1]))
  .filter(Number.isFinite);
const n = used.length ? Math.max(...used) + 1 : 1;
const out = join(dir, `screenshot-${n}${label ? `-${label}` : ''}.png`);

execFileSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--force-device-scale-factor=1',
  `--window-size=${width},${height}`,
  '--virtual-time-budget=4000',
  `--screenshot=${out}`,
  url,
], { stdio: 'ignore' });

console.log(out);
