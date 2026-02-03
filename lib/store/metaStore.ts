import fs from 'fs';
import path from 'path';

export type RunningMode = 'dynamic' | 'fixed' | null;

type MetaState = {
  runningMode: RunningMode;
  status: 'idle' | 'running';
  startedAt: number | null;
};

const META_PATH = path.join(process.cwd(), 'data/meta.json');

let meta: MetaState = {
  runningMode: null,
  status: 'idle',
  startedAt: null,
};

/* ---------- helpers ---------- */

function ensureFile() {
  if (!fs.existsSync(META_PATH)) {
    fs.mkdirSync(path.dirname(META_PATH), { recursive: true });
    fs.writeFileSync(META_PATH, JSON.stringify(meta, null, 2));
  }
}

export function loadMeta() {
  ensureFile();
  meta = JSON.parse(fs.readFileSync(META_PATH, 'utf8'));
}

export function saveMeta() {
  fs.writeFileSync(META_PATH, JSON.stringify(meta, null, 2));
}

/* ---------- API ---------- */

export function startMode(mode: Exclude<RunningMode, null>) {
  if (meta.status === 'running') {
    throw new Error(`Already running: ${meta.runningMode}`);
  }

  meta.runningMode = mode;
  meta.status = 'running';
  meta.startedAt = Date.now();
  saveMeta();
}

export function stopMode() {
  meta.runningMode = null;
  meta.status = 'idle';
  meta.startedAt = null;
  saveMeta();
}

export function getMeta(): MetaState {
  return meta;
}

export function isRunning() {
  return meta.status === 'running';
}

export function getRunningMode(): RunningMode {
  return meta.runningMode;
}
