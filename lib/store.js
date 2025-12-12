import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data', 'store');

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readJSON(file, fallback) {
  await ensureDir();
  const p = path.join(DATA_DIR, file);
  try {
    const data = await fs.readFile(p, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return fallback;
  }
}

export async function writeJSON(file, data) {
  await ensureDir();
  const p = path.join(DATA_DIR, file);
  await fs.writeFile(p, JSON.stringify(data, null, 2), 'utf8');
}
