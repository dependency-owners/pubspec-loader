import assert from 'node:assert/strict';
import { suite, test } from 'node:test';
import { createFixture } from 'fs-fixture';
import * as YAML from 'yaml';

import { canLoad, load } from '../src/index.ts';

suite('canLoad', () => {
  test('should return true for pubspec.yaml file', async () => {
    const result = await canLoad('/some/path/pubspec.yaml');
    assert.strictEqual(result, true);
  });

  test('should return false for non-pubspec.yaml file', async () => {
    const result = await canLoad('/some/path/index.js');
    assert.strictEqual(result, false);
  });
});

suite('load', () => {
  const createPubspec = (overrides = {}) => {
    const defaultPubspec = {
      name: 'test',
      version: '1.0.0',
    };
    return YAML.stringify({ ...defaultPubspec, ...overrides });
  };

  test('should return dependencies and dev_dependencies', async () => {
    const fixture = await createFixture({
      'pubspec.yaml': createPubspec({
        dependencies: { lodash: '^4.17.21' },
        dev_dependencies: { jest: '^29.0.0' },
      }),
    });
    const deps = await load(fixture.getPath('pubspec.yaml'));
    assert.ok(
      deps.some((dep) => dep.name === 'lodash' && dep.version === '^4.17.21')
    );
    assert.ok(
      deps.some((dep) => dep.name === 'jest' && dep.version === '^29.0.0')
    );
  });

  test('should return empty array if no dependencies', async () => {
    const fixture = await createFixture({
      'pubspec.yaml': createPubspec(),
    });
    const deps = await load(fixture.getPath('pubspec.yaml'));
    assert.deepEqual(deps, []);
  });
});
