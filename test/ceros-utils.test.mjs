import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getAllowedExperienceUrl,
  getSafeAspectRatio,
  settingsFromPairs,
} from '../blocks/ceros-demo/ceros-utils.mjs';

test('settingsFromPairs converts authored rows into settings', () => {
  assert.deepEqual(settingsFromPairs([
    [' mode ', ' mock '],
    ['title', 'Demo'],
    ['', 'ignored'],
  ]), {
    mode: 'mock',
    title: 'Demo',
  });
});

test('allows an HTTPS URL from an exact approved host', () => {
  const result = getAllowedExperienceUrl('https://view.ceros.com/acme/demo');
  assert.equal(result?.href, 'https://view.ceros.com/acme/demo');
});

test('rejects HTTP, deceptive hostnames, and invalid URLs', () => {
  assert.equal(getAllowedExperienceUrl('http://view.ceros.com/acme/demo'), null);
  assert.equal(getAllowedExperienceUrl('https://view.ceros.com.evil.test/demo'), null);
  assert.equal(getAllowedExperienceUrl('not a url'), null);
});

test('allows a Ceros subdomain but rejects a look-alike hostname', () => {
  assert.equal(
    getAllowedExperienceUrl('https://campaign.ceros.site/demo')?.hostname,
    'campaign.ceros.site',
  );
  assert.equal(getAllowedExperienceUrl('https://evilceros.site/demo'), null);
});

test('accepts a numeric aspect ratio and falls back for arbitrary CSS', () => {
  assert.equal(getSafeAspectRatio('4 / 3'), '4 / 3');
  assert.equal(getSafeAspectRatio('var(--anything)'), '16 / 9');
});
