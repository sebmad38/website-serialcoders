import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['.audit-*'] },
  {
    ignores: [
      '.sites-runtime/**',
      'artifacts/**',
      'dist/**',
      'node_modules/**',
      '.npm-cache/**',
      'public/**',
      'test-results/**',
      'playwright-report/**',
      '.serialcoders-build-*/**',
    ],
  },
  js.configs.recommended,
  { files: ['**/*.mjs'], languageOptions: { globals: globals.node } },
  {
    files: ['src/client/*.js'],
    languageOptions: { sourceType: 'script', globals: globals.browser },
  },
  { files: ['tests/browser/*.mjs'], languageOptions: { globals: globals.browser } },
  {
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrors: 'none' }],
      'no-constant-binary-expression': 'error',
      eqeqeq: 'error',
    },
  },
];
