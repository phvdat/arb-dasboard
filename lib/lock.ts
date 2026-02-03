let runningMode: 'dynamic' | 'fixed' | null = null;

export function acquireLock(mode: 'dynamic' | 'fixed') {
  if (runningMode) return false;
  runningMode = mode;
  return true;
}

export function releaseLock() {
  runningMode = null;
}

export function getRunningMode() {
  return runningMode;
}
