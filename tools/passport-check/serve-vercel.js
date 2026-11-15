// SITE-SHORT-ROUTE-I18N-01: tiny static server that applies vercel.json the way Vercel does
// for this site: cleanUrls (/page -> page.html), rewrites (path kept in the browser), redirects.
// Run: node tools/passport-check/serve-vercel.js [port]   (default 8766, serves the repo root)
const http = require('http'); const fs = require('fs'); const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
const PORT = +process.argv[2] || 8766;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg' };
function match(pattern, pathname) {
  const names = []; const re = new RegExp('^' + pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/:(\w+)/g, (_, n) => { names.push(n); return '([^/]+)'; }) + '$');
  const m = pathname.match(re); if (!m) return null;
  const o = {}; names.forEach((n, i) => { o[n] = m[i + 1]; }); return o;
}
function fill(dest, params) { return dest.replace(/:(\w+)/g, (_, n) => params[n] || ''); }
function file(p) { const f = path.join(ROOT, decodeURIComponent(p)); return f.startsWith(ROOT) && fs.existsSync(f) && fs.statSync(f).isFile() ? f : null; }
function resolve(pathname) {
  if (pathname === '/') return file('/index.html');
  if (/\.html$/.test(pathname)) return null; // cleanUrls: .html is redirected below
  return file(pathname) || file(pathname + '.html') || file(pathname + '/index.html');
}
http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  if (/\.html$/.test(u.pathname) && file(u.pathname)) { res.writeHead(308, { Location: u.pathname.replace(/(index)?\.html$/, '') + u.search }); return res.end(); }
  for (const r of cfg.redirects || []) { const m = match(r.source, u.pathname); if (m) { res.writeHead(r.permanent ? 308 : 307, { Location: fill(r.destination, m) }); return res.end(); } }
  let f = resolve(u.pathname);
  if (!f) for (const r of cfg.rewrites || []) {
    const m = match(r.source, u.pathname); if (!m) continue;
    f = resolve(new URL(fill(r.destination, m), 'http://x').pathname); break;
  }
  if (!f) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('404'); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
}).listen(PORT, '127.0.0.1', () => console.log('vercel-like server on http://127.0.0.1:' + PORT));
