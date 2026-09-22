const keys = ['visits', 'downloads'];

function corsHeaders(origin, env) {
  const allowed = (env.SITE_ORIGINS || 'https://mvr2avo.com,https://www.mvr2avo.com,https://mvr2avo.github.io')
    .split(',').map(value => value.trim());
  if (!allowed.includes(origin)) return null;
  return { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Vary': 'Origin' };
}

function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra } });
}

async function counts(db) {
  const rows = await db.prepare('SELECT name, value FROM counters WHERE name IN (?, ?)').bind(...keys).all();
  return Object.fromEntries(keys.map(key => [key, Number(rows.results.find(row => row.name === key)?.value ?? 0)]));
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    const origin = request.headers.get('Origin');
    const cors = corsHeaders(origin, env);
    if (!cors && (origin || request.method !== 'GET')) return json({ error: 'Forbidden' }, 403);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    try {
      if (pathname === '/api/stats' && request.method === 'GET') return json(await counts(env.DB), 200, cors || {});
      const key = pathname === '/api/visit' ? 'visits' : pathname === '/api/download' ? 'downloads' : null;
      if (key && request.method === 'POST') {
        await env.DB.prepare('UPDATE counters SET value = value + 1 WHERE name = ?').bind(key).run();
        return json(await counts(env.DB), 200, cors);
      }
      return json({ error: 'Not found' }, 404, cors || {});
    } catch {
      return json({ error: 'Statistics unavailable' }, 503, cors || {});
    }
  },
};
