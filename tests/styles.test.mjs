import test from 'node:test';
import assert from 'node:assert/strict';
import { removeShadowedDeclarations } from '../scripts/optimize-css.mjs';

test('Styles optimization keeps media boundaries, priorities and variable fallbacks', () => {
  const result = removeShadowedDeclarations(
    'header{color:red;padding:1px;color:blue!important} @media(max-width:760px){header{padding:2px}} header{padding:3px;color:green;background:white;background:var(--surface)}',
  );
  assert.equal(result.removed, 2);
  assert.match(result.css, /padding:2px/);
  assert.match(result.css, /color:blue!important/);
  assert.match(result.css, /background:white;background:var\(--surface\)/);
  assert.doesNotMatch(result.css, /padding:1px|color:red/);
});
