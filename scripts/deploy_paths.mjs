// Deploys this Worker with its build stamped in: `MEO_BUILD` (commit, nearest tag, time) is served at the
// Worker's version URL so the Meo Account release center can see exactly what is live, and the Cloudflare
// version is tagged with the commit.
import { execFileSync, spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const git = (...args) => { try { return execFileSync('git', args, { encoding: 'utf8' }).trim(); } catch { return ''; } };
const commit = git('rev-parse', 'HEAD');
const dirty = git('status', '--porcelain').length > 0;
const build = { commit, describe: git('describe', '--tags', '--always', '--match', 'v[0-9]*') + (dirty ? '-dirty' : ''), message: git('log', '-1', '--format=%s'), builtAt: new Date().toISOString(), dirty };
const cwd = process.argv[2] ? join(dirname(fileURLToPath(import.meta.url)), '..', process.argv[2]) : process.cwd();
const args = ['wrangler', 'deploy', '--define', `MEO_BUILD:${JSON.stringify(build)}`, '--tag', commit.slice(0, 7) + (dirty ? '-dirty' : ''), '--message', build.message.slice(0, 100) || 'deploy'];
process.exit(spawnSync('npx', args, { stdio: 'inherit', cwd }).status ?? 1);
