import { closeMode } from "./exchangePool";

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
  closeMode('dynamic');
}

export function shouldDynamicRun() {
  return dynamicRunning;
}
