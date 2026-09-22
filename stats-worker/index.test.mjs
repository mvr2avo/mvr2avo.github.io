import assert from 'node:assert/strict';
import test from 'node:test';
import worker from './index.js';

function database() {
  const values = { visits: 0, downloads: 0 };
  return {
    prepare(query) {
      return {
        bind(...params) {
          return {
            async run() {
              assert.match(query, /^UPDATE counters/);
              values[params[0]] += 1;
            },
            async all() {
              assert.match(query, /^SELECT name/);
              return { results: Object.entries(values).map(([name, value]) => ({ name, value })) };
            },
          };
        },
      };
    },
  };
}

test('visits and installer clicks increment independently', async () => {
  const env = { DB: database() };
  const request = (path, method = 'POST') => new Request(`https://stats.mvr2avo.com/api/${path}`, {
    method,
    headers: { Origin: 'https://mvr2avo.com' },
  });
  assert.deepEqual(await (await worker.fetch(request('visit'), env)).json(), { visits: 1, downloads: 0 });
  assert.deepEqual(await (await worker.fetch(request('download'), env)).json(), { visits: 1, downloads: 1 });
  assert.deepEqual(await (await worker.fetch(request('stats', 'GET'), env)).json(), { visits: 1, downloads: 1 });
});

test('unknown website origins cannot increment counters', async () => {
  const env = { DB: database() };
  const blocked = await worker.fetch(new Request('https://stats.mvr2avo.com/api/download', {
    method: 'POST', headers: { Origin: 'https://example.com' },
  }), env);
  assert.equal(blocked.status, 403);
  const stats = await worker.fetch(new Request('https://stats.mvr2avo.com/api/stats'), env);
  assert.deepEqual(await stats.json(), { visits: 0, downloads: 0 });
});
