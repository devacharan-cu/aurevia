// Aurevia build: content (JSON / JSON-frontmatter Markdown) + templates -> static HTML in /dist.
// Zero runtime dependencies. Build-time: Tailwind CLI for CSS, marked for article bodies.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { marked } from 'marked';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const rel = (...p) => path.join(ROOT, ...p);
const readJSON = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));

const PAGES = ['home', 'care', 'specialists', 'journal', 'practice', 'fees', 'contact', 'enquire', 'legal', 'notfound'];

/** Decap "json-frontmatter": a JSON object, then the Markdown body. */
function parseJsonFrontmatter(src) {
  const end = src.indexOf('\n}') + 2;
  return { data: JSON.parse(src.slice(0, end)), body: src.slice(end).trim() };
}

const readDir = (dir, ext) =>
  fs.readdirSync(rel(dir)).filter((f) => f.endsWith(ext) && !f.startsWith('_')).map((f) => path.join(rel(dir), f));

function loadContent() {
  const site = readJSON(rel('content/settings/site.json'));
  if (process.env.SITE_URL) site.url = process.env.SITE_URL.replace(/\/$/, '');
  const home = readJSON(rel('content/settings/home.json'));
  const practice = readJSON(rel('content/settings/practice.json'));
  const credits = readJSON(rel('content/settings/image-credits.json')).images;

  const care = readDir('content/care', '.json').map(readJSON).sort((a, b) => a.order - b.order);
  const specialists = readDir('content/specialists', '.json').map(readJSON).sort((a, b) => a.order - b.order);

  marked.use({ gfm: true });
  const journal = readDir('content/journal', '.md')
    .map((f) => {
      const { data, body } = parseJsonFrontmatter(fs.readFileSync(f, 'utf8'));
      const slug = path.basename(f, '.md');
      const words = body.split(/\s+/).length;
      return { slug, ...data, body, bodyHtml: marked.parse(body), readingTime: Math.max(2, Math.ceil(words / 220)) };
    })
    .sort((a, b) => (a.featured === b.featured ? b.date.localeCompare(a.date) : a.featured ? -1 : 1));

  const bySlug = (arr) => Object.fromEntries(arr.map((x) => [x.slug, x]));
  return {
    site, home, practice, credits, care, specialists, journal,
    careBySlug: bySlug(care),
    specialistsBySlug: bySlug(specialists),
    version: Date.now().toString(36),
  };
}

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const s = path.join(from, entry.name), d = path.join(to, entry.name);
    entry.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}

function write(urlPath, html) {
  const file = urlPath.endsWith('.html') ? path.join(DIST, urlPath) : path.join(DIST, urlPath, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

async function build({ css = true } = {}) {
  const t0 = performance.now();
  const ctx = loadContent();

  fs.rmSync(DIST, { recursive: true, force: true });
  copyDir(rel('public'), DIST);
  copyDir(rel('src/js'), path.join(DIST, 'js'));

  const pages = [];
  for (const name of PAGES.filter((n) => fs.existsSync(rel(`src/pages/${n}.mjs`)))) {
    // Cache-bust the import so --watch picks up template edits.
    const mod = await import(`../src/pages/${name}.mjs?t=${ctx.version}`);
    for (const p of mod.default(ctx)) { write(p.path, p.html); pages.push(p); }
  }

  // Sitemap and robots. Indexing is controlled by the noindex meta, so crawling stays allowed.
  const urls = pages.filter((p) => !p.path.endsWith('.html')).map((p) => `  <url><loc>${ctx.site.url}${p.path}</loc></url>`);
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
  fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${ctx.site.url}/sitemap.xml\n`);

  if (css) {
    execFileSync(process.execPath, [rel('node_modules/@tailwindcss/cli/dist/index.mjs'), '-i', rel('src/styles/main.css'), '-o', path.join(DIST, 'css/main.css'), '--minify'], { stdio: ['ignore', 'ignore', 'inherit'] });
  }
  console.log(`✓ Built ${pages.length} pages in ${Math.round(performance.now() - t0)} ms`);
}

await build();

if (process.argv.includes('--watch')) {
  let timer;
  for (const dir of ['src', 'content', 'public']) {
    fs.watch(rel(dir), { recursive: true }, () => {
      clearTimeout(timer);
      timer = setTimeout(() => build().catch((e) => console.error(e)), 120);
    });
  }
  console.log('Watching src/, content/ and public/ …');
}
