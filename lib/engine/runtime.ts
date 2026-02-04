let dynamicRunning = false;

export function isDynamicRunning() {
  return dynamicRunning;
}

export function startDynamic() {
  if (dynamicRunning) return false;
  dynamicRunning = true;
  return true;
}

export function stopDynamic() {
  dynamicRunning = false;
}

export function shouldDynamicRun() {
  return dynamicRunning;
}
