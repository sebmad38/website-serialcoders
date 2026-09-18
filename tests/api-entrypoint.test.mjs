import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

test('API starts through the release directory symlink', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'serialcoders-entry-'));
  let child;
  try {
    await symlink(resolve('server'), join(directory, 'current'), 'junction');
    child = spawn(process.execPath, [join(directory, 'current', 'index.mjs')], {
      stdio: ['ignore', 'ignore', 'pipe'],
    });
    let errors = '';
    child.stderr.on('data', (chunk) => (errors += chunk));
    let healthy = false;
    for (let attempt = 0; attempt < 40; attempt++) {
      assert.equal(child.exitCode, null, errors || 'API exited before listening');
      try {
        const response = await fetch('http://127.0.0.1:4180/health');
        assert.deepEqual(await response.json(), { status: 'ok' });
        healthy = true;
        break;
      } catch {
        await new Promise((done) => setTimeout(done, 50));
      }
    }
    assert.ok(healthy, errors || 'API did not listen through its release link');
  } finally {
    if (child && child.exitCode === null) {
      const stopped = once(child, 'exit');
      child.kill();
      await stopped;
    }
    await rm(join(directory, 'current'), { force: true, recursive: true });
    await rm(directory, { recursive: true, force: true });
  }
});
