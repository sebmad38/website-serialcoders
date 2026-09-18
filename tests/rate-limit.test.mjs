import test from 'node:test';
import assert from 'node:assert/strict';
import { createRateLimiter } from '../server/contact/rate-limit.mjs';

test('Rate limit expires exactly at the window boundary without blocking existing entries at capacity', () => {
  let now = 0;
  const allow = createRateLimiter({ limit: 2, windowMs: 100, maxEntries: 2, now: () => now });
  assert.equal(allow('a'), true);
  now = 10;
  assert.equal(allow('b'), true);
  assert.equal(allow('c'), false);
  assert.equal(allow('a'), true);
  assert.equal(allow('a'), false);
  now = 100;
  assert.equal(allow('c'), true);
  assert.equal(allow('b'), true);
  now = 110;
  assert.equal(allow('b'), true);
});
