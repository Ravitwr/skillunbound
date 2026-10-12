import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const data = require('../data.js');
const urls = [...new Set(data.paths.flatMap((path) => path.resources
  .filter((resource) => resource.kind !== 'YouTube video')
  .map((resource) => resource.url)))];
const failures = [];
let cursor = 0;

async function worker() {
  while (cursor < urls.length) {
    const url = urls[cursor++];
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15_000);
    try {
      const response = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: { 'User-Agent': 'SkillUnbound-LinkCheck/1.0 (+https://skillunbound.dev/credits)' },
      });
      if (response.status === 404 || response.status === 410) failures.push(`${response.status} ${url}`);
      else console.log(`${response.status} ${url} -> ${response.url}`);
      await response.body?.cancel();
    } catch (error) {
      failures.push(`${error.name}: ${url}`);
    } finally {
      clearTimeout(timer);
    }
  }
}

await Promise.all(Array.from({ length: 6 }, worker));
if (failures.length) {
  console.error(`\n${failures.length} resource checks failed:\n${failures.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`\nVerified ${urls.length} unique learning-resource URLs.`);
}
