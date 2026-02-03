let dynamicInterval: NodeJS.Timeout | null = null;

export function setDynamicInterval(i: NodeJS.Timeout) {
  dynamicInterval = i;
}

export function clearDynamicInterval() {
  if (dynamicInterval) {
    clearInterval(dynamicInterval);
    dynamicInterval = null;
  }
}

export function hasDynamicInterval() {
  return dynamicInterval !== null;
}
