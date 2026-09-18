/* eslint no-empty-pattern: off -- Playwright requires fixture argument destructuring. */
import { test as base, expect } from '@playwright/test';
import { createPreviewServer } from '../../server/preview.mjs';
import { buildSite } from '../../src/lib/build.mjs';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';

// Own the server in the worker: no external process to orphan on Windows or in CI.
export const test = base.extend({
  previewURL: [
    async ({}, use, workerInfo) => {
      const directory = await mkdtemp(join(tmpdir(), 'serialcoders-browser-'));
      if (!resolve(directory).startsWith(resolve(tmpdir()) + sep))
        throw new Error('Unsafe temporary path');
      const root = join(directory, 'dist');
      const config = JSON.parse(await readFile('site.config.json', 'utf8'));
      await buildSite({
        outputDirectory: root,
        config: { ...config, design: workerInfo.project.name },
      });
      const server = createPreviewServer({ root });
      await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
      try {
        await use(`http://127.0.0.1:${server.address().port}`);
      } finally {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(resolve));
        await rm(directory, { recursive: true, force: true });
      }
    },
    { scope: 'worker' },
  ],
  baseURL: async ({ previewURL }, use) => use(previewURL),
});
export { expect };
