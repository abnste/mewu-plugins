// SPDX-License-Identifier: MPL-2.0
import { readFile, readdir, lstat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const marketRepository = 'abnste/mewu-plugins';

export function verifyOwnership(entries, projects) {
  const byId = new Map(), repositories = new Set();
  for (const project of projects) {
    if (typeof project?.id !== 'string' || byId.has(project.id)) throw Error('插件项目标识缺失或重复');
    byId.set(project.id, project);
  }
  for (const entry of entries) {
    const project = byId.get(entry.id);
    if (!project || typeof entry.repository !== 'string' || typeof project.sourceRepository !== 'string') {
      throw Error(`插件缺少独立项目：${entry.id}`);
    }
    const repository = entry.repository.toLowerCase();
    if (repository === marketRepository || repository !== project.sourceRepository.toLowerCase()) {
      throw Error(`插件必须从自己的源码仓库发行，市场仓库不能托管插件包：${entry.id}`);
    }
    if (repositories.has(repository)) throw Error(`每个插件须有独立仓库：${entry.id}`);
    repositories.add(repository);
    byId.delete(entry.id);
  }
  if (byId.size) throw Error('项目没有对应的插件条目');
  return { plugins: entries.length, independentRepositories: repositories.size };
}

async function readDirectory(directory) {
  if (!(await lstat(directory)).isDirectory() || (await lstat(directory)).isSymbolicLink()) throw Error('条目目录无效');
  const files = await readdir(directory, { withFileTypes: true });
  if (files.length > 256) throw Error('条目数量超过限制');
  return Promise.all(files.map(async file => {
    if (!file.isFile() || file.isSymbolicLink() || !file.name.endsWith('.json')) throw Error('条目须为普通 JSON 文件');
    const filename = path.join(directory, file.name);
    if ((await lstat(filename)).size > 64 * 1024) throw Error('条目过大');
    return JSON.parse(await readFile(filename, 'utf8'));
  }));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.length !== 4) throw Error('用法：node scripts/verify-ownership.mjs entries projects');
  const [entries, projects] = await Promise.all(process.argv.slice(2).map(readDirectory));
  console.log(JSON.stringify({ ok: true, ...verifyOwnership(entries, projects) }));
}
