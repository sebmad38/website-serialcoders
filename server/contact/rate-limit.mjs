/** Fixed windows preserve insertion order, so only expired entries need scanning. */
export function createRateLimiter({
  limit = 5,
  windowMs = 600000,
  maxEntries = 10000,
  now = Date.now,
} = {}) {
  const attempts = new Map();
  return (key) => {
    const currentTime = now();
    for (const [address, entry] of attempts) {
      if (entry.until > currentTime) break;
      attempts.delete(address);
    }
    let entry = attempts.get(key);
    if (!entry) {
      if (attempts.size >= maxEntries) return false;
      entry = { count: 0, until: currentTime + windowMs };
      attempts.set(key, entry);
    }
    if (entry.count >= limit) return false;
    entry.count++;
    return true;
  };
}
