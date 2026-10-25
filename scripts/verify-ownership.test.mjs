// SPDX-License-Identifier: MPL-2.0
import test from 'node:test';
import assert from 'node:assert/strict';
import { verifyOwnership } from './verify-ownership.mjs';

const entry = { id: 'author.plugin', repository: 'author/plugin' };
const project = { id: 'author.plugin', sourceRepository: 'author/plugin' };

test('independent release and source repository match, case-insensitively', () => {
  assert.deepEqual(verifyOwnership([entry], [{ ...project, sourceRepository: 'Author/Plugin' }]),
    { plugins: 1, independentRepositories: 1 });
});
test('market-hosted releases are rejected even when source also claims the market', () => {
  assert.throws(() => verifyOwnership([{ ...entry, repository: 'abnste/mewu-plugins' }],
    [{ ...project, sourceRepository: 'abnste/mewu-plugins' }]), /市场仓库不能托管/);
});
test('a valid independent source does not excuse a release in another repository', () => {
  assert.throws(() => verifyOwnership([{ ...entry, repository: 'abnste/mewu-plugins' }], [project]), /自己的源码仓库/);
  assert.throws(() => verifyOwnership([{ ...entry, repository: 'elsewhere/package' }], [project]), /自己的源码仓库/);
});
test('missing, duplicate and orphan projects are rejected', () => {
  assert.throws(() => verifyOwnership([entry], []), /缺少独立项目/);
  assert.throws(() => verifyOwnership([entry], [project, project]), /重复/);
  assert.throws(() => verifyOwnership([], [project]), /没有对应/);
});
test('two plugin identities cannot share one release repository', () => {
  assert.throws(() => verifyOwnership([entry, { ...entry, id: 'author.second' }],
    [project, { ...project, id: 'author.second' }]), /独立仓库/);
});
