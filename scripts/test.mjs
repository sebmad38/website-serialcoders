import { mkdtemp, rm, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { spawn } from 'node:child_process';
import { buildSite, projectRoot } from '../src/lib/build.mjs';

// Every file-oriented test sees the same fresh, complete build, never a stale dist/.
const directory = await mkdtemp(join(tmpdir(), 'serialcoders-tests-'));
if (
  !resolve(directory).startsWith(resolve(tmpdir()) + sep) ||
  !directory.split(sep).at(-1).startsWith('serialcoders-tests-')
)
  throw new Error('Chemin temporaire invalide');
try {
  const output = join(directory, 'dist');
  await buildSite({ outputDirectory: output });
  const files = (await readdir(join(projectRoot, 'tests')))
    .filter((file) => file.endsWith('.test.mjs'))
    .map((file) => join(projectRoot, 'tests', file));
  const child = spawn(process.execPath, ['--test', ...files], {
    stdio: 'inherit',
    env: { ...process.env, SITE_TEST_DIST: output },
  });
  process.exitCode = await new Promise((resolve, reject) => {
    child.on('error', reject);
    child.on('exit', (code) => resolve(code ?? 1));
  });
} finally {
  await rm(directory, { recursive: true, force: true });
}
