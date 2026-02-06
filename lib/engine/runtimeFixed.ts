import { closeMode } from "./exchangePool";

let fixedRunning = false;

export function startFixed() {
  if (fixedRunning) return false;
  fixedRunning = true;
  return true;
}

export function stopFixed() {
  fixedRunning = false;
  closeMode('fixed');
}

export function isFixedRunning() {
  return fixedRunning;
}

export function shouldFixedRun() {
  return fixedRunning;
}
