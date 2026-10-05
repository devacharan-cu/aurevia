// Small, dependency-free helpers shared by every template.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const IMAGE_DIR = path.join(ROOT, 'public/images');
const WIDTHS = [800, 1400, 2200];

const credits = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/settings/image-credits.json'), 'utf8')).images;
const creditMap = Object.fromEntries(credits.map((c) => [c.file, c]));

/** Escape text for HTML. */
export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/**
 * Escape, then allow one deliberate piece of markup: *words* become <em>.
 * Editors can set an italic accent in a headline without being able to break layout.
 */
export const em = (s) => esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>');

/** Strip the *accent* markers (for <title>, alt text, meta). */
export const plain = (s) => String(s ?? '').replace(/\*/g, '');

/** Tagged template: joins arrays, drops null/undefined/false. */
export const html = (strings, ...values) =>
  strings.reduce((out, str, i) => {
    let v = values[i - 1];
    if (Array.isArray(v)) v = v.join('');
    if (v === null || v === undefined || v === false) v = '';
    return out + v + str;
  });

export const pad = (n) => String(n).padStart(2, '0');

export const formatDate = (iso) =>
  new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export const readingTime = (text) => Math.max(2, Math.round(String(text).split(/\s+/).length / 210));

/** Responsive image. `name` is a key in /public/images (name-800.webp …) or a CMS upload path. */
export function img(name, { alt = '', sizes = '100vw', cls = '', priority = false, attrs = '' } = {}) {
  if (!name) return '';
  const credit = creditMap[name];
  const variants = WIDTHS.filter((w) => fs.existsSync(path.join(IMAGE_DIR, `${name}-${w}.webp`)));
  // Per-image focal point (credits.focus) keeps the subject in frame at every crop.
  const css = [credit?.color && `background-color:${credit.color}`, credit?.focus && `object-position:${credit.focus}`].filter(Boolean).join(';');
  const style = css ? ` style="${css}"` : '';
  const loading = priority ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"';
  if (!variants.length) {
    // CMS uploads arrive as a single file path.
    return `<img src="${esc(name)}" alt="${esc(alt)}" class="${cls}" ${loading} decoding="async" ${attrs}>`;
  }
  const ratio = credit?.ratio || 1.5;
  const w = 2200;
  const srcset = variants.map((v) => `/images/${name}-${v}.webp ${v}w`).join(', ');
  const fallback = `/images/${name}-${variants.includes(1400) ? 1400 : variants.at(-1)}.webp`;
  const tag = `<img src="${fallback}" srcset="${srcset}" sizes="${sizes}" width="${w}" height="${Math.round(w / ratio)}" alt="${esc(alt)}" class="${cls}" ${loading} decoding="async"${style} ${attrs}>`;
  // AVIF first where it exists (about a third of the WebP weight); WebP remains the fallback.
  const avif = variants.filter((v) => fs.existsSync(path.join(IMAGE_DIR, `${name}-${v}.avif`)));
  if (!avif.length) return tag;
  return `<picture><source type="image/avif" srcset="${avif.map((v) => `/images/${name}-${v}.avif ${v}w`).join(', ')}" sizes="${sizes}">${tag}</picture>`;
}

/** Social preview image: a 1200×630 JPEG where generated (crawlers handle JPEG most reliably). */
export const ogImageUrl = (name) => {
  if (!name || name.startsWith('/')) return name;
  return fs.existsSync(path.join(IMAGE_DIR, `${name}-og.jpg`)) ? `/images/${name}-og.jpg` : `/images/${name}-1400.webp`;
};

export const isPortrait = (name) => (creditMap[name]?.ratio || 1.5) < 1;

export const imageUrl = (name, w = 1400) => (name && !name.startsWith('/') ? `/images/${name}-${w}.webp` : name);

/* ---------- Brand marks & icons ---------- */

// The mark: an arched doorway with light inside it. Threshold line below.
export const mark = (cls = 'h-7 w-5') => `<svg class="${cls}" viewBox="0 0 20 28" fill="none" aria-hidden="true" focusable="false"><path d="M1.5 27V10.5a8.5 8.5 0 0 1 17 0V27" stroke="currentColor" stroke-width="1.15"/><circle cx="10" cy="11" r="2.1" fill="currentColor"/><path d="M0 27.4h20" stroke="currentColor" stroke-width="1.15"/></svg>`;

export const wordmark = (cls = '') =>
  `<span class="wordmark ${cls}">Aurevia</span>`;

export const icon = {
  arrow: (cls = 'size-4') => `<svg class="${cls}" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false"><path d="M1 8h13.5M9.5 3l5 5-5 5" stroke="currentColor" stroke-width="1.2"/></svg>`,
  arrowUpRight: (cls = 'size-3.5') => `<svg class="${cls}" viewBox="0 0 14 14" fill="none" aria-hidden="true" focusable="false"><path d="M3 11 11 3M4.5 3H11v6.5" stroke="currentColor" stroke-width="1.2"/></svg>`,
  plus: (cls = 'size-4') => `<svg class="${cls}" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false"><path d="M8 1v14M1 8h14" stroke="currentColor" stroke-width="1.2"/></svg>`,
  phone: (cls = 'size-4') => `<svg class="${cls}" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false"><path d="M5.2 1.5 3 2.2C2 2.6 1.6 3.7 2 4.8a13.4 13.4 0 0 0 9.2 9.2c1 .4 2.2 0 2.6-1l.7-2.2-3-1.6-1.4 1.4a8.3 8.3 0 0 1-4.7-4.7l1.4-1.4-1.6-3Z" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round"/></svg>`,
  close: (cls = 'size-5') => `<svg class="${cls}" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false"><path d="m3 3 14 14M17 3 3 17" stroke="currentColor" stroke-width="1.2"/></svg>`,
  check: (cls = 'size-4') => `<svg class="${cls}" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false"><path d="m2.5 8.5 3.5 3.5 7.5-8" stroke="currentColor" stroke-width="1.3"/></svg>`,
  search: (cls = 'size-4') => `<svg class="${cls}" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false"><circle cx="7" cy="7" r="5.2" stroke="currentColor" stroke-width="1.2"/><path d="m11 11 4 4" stroke="currentColor" stroke-width="1.2"/></svg>`,
};

/** Opening hours as {weekdayIndex: [openHour, closeHour]} for the live "open now" line. */
export function hoursMap(hours) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const map = {};
  for (const h of hours) {
    const m = h.time.match(/(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})/);
    if (!m) continue;
    const [from, to = from] = h.days.split(/\s*[–-]\s*/).map((d) => days.indexOf(d));
    for (let d = from; d <= to && d >= 0; d++) map[d] = [+m[1] + +m[2] / 60, +m[3] + +m[4] / 60];
  }
  return map;
}
