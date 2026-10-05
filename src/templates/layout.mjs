// Document shell: <head>, header, menu, footer.
import { esc, html, plain, mark, icon, imageUrl, ogImageUrl, img } from './helpers.mjs';

export const NAV = [
  { href: '/care/', label: 'Care', note: 'Six ways in' },
  { href: '/specialists/', label: 'Specialists', note: 'Nine clinicians' },
  { href: '/practice/', label: 'The Practice', note: 'How we work' },
  { href: '/journal/', label: 'Journal', note: 'Notes from clinic' },
  { href: '/fees/', label: 'Fees', note: 'Published in full' },
  { href: '/contact/', label: 'Contact', note: 'Visit & hours' },
];

const isCurrent = (href, path) => (href === '/' ? path === '/' : path.startsWith(href));

function head(ctx, page) {
  const { site } = ctx;
  const url = site.url + page.path;
  const title = page.path === '/' ? plain(page.title) : `${plain(page.title)} · ${site.legal_name}`;
  const ogImage = site.url + ogImageUrl(page.image || 'striped-chair');
  const robots = site.indexable && !page.noindex ? 'index, follow' : 'noindex, nofollow';
  const jsonld = [].concat(page.jsonld || []).filter(Boolean);
  return html`
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(page.description)}">
  ${page.noindex ? '' : `<link rel="canonical" href="${esc(url)}">`}
  <meta name="robots" content="${robots}">
  <meta name="theme-color" content="#F6F2EB">
  <meta property="og:type" content="${page.ogType || 'website'}">
  <meta property="og:site_name" content="${esc(site.legal_name)}">
  <meta property="og:title" content="${esc(plain(page.title))}">
  <meta property="og:description" content="${esc(page.description)}">
  ${page.noindex ? '' : `<meta property="og:url" content="${esc(url)}">`}
  <meta property="og:image" content="${esc(ogImage)}">
  ${ogImage.endsWith('-og.jpg') ? '<meta property="og:image:width" content="1200">\n  <meta property="og:image:height" content="630">' : ''}
  <meta property="og:locale" content="en_GB">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="/fonts/newsreader-var.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/hanken-grotesk-var.woff2" as="font" type="font/woff2" crossorigin>
  ${page.preloadImage && !page.preloadImage.startsWith('/') ? `<link rel="preload" as="image" type="image/avif" imagesrcset="/images/${page.preloadImage}-800.avif 800w, /images/${page.preloadImage}-1400.avif 1400w, /images/${page.preloadImage}-2200.avif 2200w" imagesizes="${page.preloadSizes || '100vw'}" fetchpriority="high">` : ''}
  <link rel="stylesheet" href="/css/main.css?v=${ctx.version}">
  <script>document.documentElement.classList.add('js')</script>
  <script type="module" src="/js/main.js?v=${ctx.version}"></script>
  ${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`)}`;
}

function header(ctx, page) {
  const { site } = ctx;
  return html`
  <header class="site-header" data-header data-tone="${page.headerTone || 'dark'}">
    <div class="wrap flex h-[var(--header-h)] items-center justify-between gap-6">
      <a href="/" class="brand" aria-label="${esc(site.legal_name)}, home">
        ${mark('h-[1.55rem] w-[1.1rem]')}
        <span class="wordmark">Aurevia</span>
      </a>
      <nav aria-label="Primary" class="max-lg:hidden">
        <ul class="nav-list">
          ${NAV.filter((n) => n.href !== '/fees/').map((n) => `<li><a href="${n.href}" class="nav-link"${isCurrent(n.href, page.path) ? ' aria-current="page"' : ''}>${n.label}</a></li>`)}
        </ul>
      </nav>
      <div class="flex items-center gap-5">
        <a href="tel:${site.phone.replace(/\s/g, '')}" class="nav-link tabular-nums max-xl:hidden">${esc(site.phone_display)}</a>
        <a href="/enquire/" class="btn btn--header max-sm:hidden">Enquire</a>
        <button type="button" class="menu-toggle lg:hidden" aria-expanded="false" aria-controls="site-menu" data-menu-toggle>
          <span class="menu-toggle-label">Menu</span>
          <span class="menu-toggle-lines" aria-hidden="true"><i></i><i></i></span>
        </button>
      </div>
    </div>
  </header>

  <div id="site-menu" class="site-menu" data-menu hidden>
    <div class="site-menu-inner wrap">
      <nav aria-label="Menu">
        <ol class="menu-list">
          ${NAV.map((n, i) => html`<li style="--i:${i}"><a href="${n.href}"${isCurrent(n.href, page.path) ? ' aria-current="page"' : ''}><span class="menu-index">0${i + 1}</span><span class="menu-label">${n.label}</span><span class="menu-note">${n.note}</span></a></li>`)}
        </ol>
      </nav>
      <div class="menu-foot">
        <a href="/enquire/" class="btn btn--light w-full justify-between sm:w-auto"><span class="btn-label">Make an enquiry</span><span class="btn-icon" aria-hidden="true">${icon.arrow('size-3.5')}</span></a>
        <div class="grid grid-cols-2 gap-6 text-[0.85rem] text-ivory/70">
          <p><span class="t-meta block text-ivory/60">Call</span><a href="tel:${site.phone.replace(/\s/g, '')}" class="text-ivory">${esc(site.phone_display)}</a></p>
          <p><span class="t-meta block text-ivory/60">Weekdays</span>${esc(site.hours[0].time)}</p>
        </div>
      </div>
    </div>
  </div>`;
}

function footer(ctx) {
  const { site } = ctx;
  const a = site.address;
  return html`
  <footer class="site-footer surface-dark" data-surface="dark">
    <div class="wrap pt-24 pb-10">
      <div class="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4 xl:grid-cols-12 xl:gap-14">
        <div class="col-span-2 md:col-span-4 xl:col-span-4">
          <a href="/" class="inline-flex items-center gap-3 text-ivory" aria-label="${esc(site.legal_name)}, home">${mark('h-9 w-[1.3rem]')}<span class="wordmark text-[1.05rem]">Aurevia</span></a>
          <p class="mt-6 max-w-[30ch] font-serif text-[1.35rem] leading-snug font-light text-ivory/85">A small private practice of physicians and consultants in Marylebone.</p>
        </div>
        <div class="xl:col-span-2 xl:col-start-5">
          <h2 class="t-meta text-ivory/60">Visit</h2>
          <address class="mt-4 not-italic leading-relaxed text-ivory/80">${esc(a.line1)}<br>${esc(a.locality)}, ${esc(a.city)}<br>${esc(a.postcode)}</address>
          <ul class="mt-4 space-y-1 text-[0.85rem] text-ivory/65">${site.stations.map((s) => `<li>${esc(s.name)} · ${esc(s.walk)}</li>`)}</ul>
        </div>
        <div class="xl:col-span-2">
          <h2 class="t-meta text-ivory/60">Hours</h2>
          <dl class="mt-4 space-y-2 text-ivory/80">${site.hours.map((h) => `<div><dt class="text-[0.85rem] text-ivory/65">${esc(h.days)}</dt><dd class="tabular-nums">${esc(h.time)}</dd></div>`)}</dl>
        </div>
        <div class="xl:col-span-2">
          <h2 class="t-meta text-ivory/60">Contact</h2>
          <ul class="mt-4 space-y-2 text-ivory/80">
            <li><a class="footer-link tabular-nums" href="tel:${site.phone.replace(/\s/g, '')}">${esc(site.phone_display)}</a></li>
            <li class="whitespace-nowrap max-sm:text-[0.88rem]"><a class="footer-link" href="mailto:${site.email}">${esc(site.email)}</a></li>
            <li><a class="footer-link" href="/enquire/">Make an enquiry</a></li>
          </ul>
        </div>
        <nav class="xl:col-span-2" aria-label="Footer">
          <h2 class="t-meta text-ivory/60">Explore</h2>
          <ul class="mt-4 space-y-2 text-ivory/80">${NAV.map((n) => `<li><a class="footer-link" href="${n.href}">${n.label}</a></li>`)}</ul>
        </nav>
      </div>

      <p class="urgent mt-20" role="note">${icon.phone('size-4 shrink-0')}<span>${esc(site.urgent_notice)}</span></p>

      <div class="footer-giant" aria-hidden="true">Aurevia</div>

      <div class="flex flex-col gap-6 border-t border-ivory/12 pt-8 text-[0.8rem] text-ivory/60 lg:flex-row lg:items-start lg:justify-between">
        <p class="max-w-[62ch]"><span class="concept-tag">Concept</span> ${esc(site.concept_notice)}</p>
        <ul class="flex flex-wrap gap-x-6 gap-y-2">
          <li><a class="footer-link" href="/privacy/">Privacy</a></li>
          <li><a class="footer-link" href="/colophon/">Colophon &amp; credits</a></li>
          <li>© ${new Date().getFullYear()} ${esc(site.legal_name)}</li>
        </ul>
      </div>
    </div>
  </footer>`;
}

/** Mobile-only action bar that appears once the visitor is past the opening screen. */
const mobileBar = (ctx, page) =>
  page.path.startsWith('/enquire') ? '' : html`
  <div class="mobile-bar lg:hidden" data-mobile-bar>
    <a href="tel:${ctx.site.phone.replace(/\s/g, '')}" class="mobile-bar-call">${icon.phone('size-4')}<span>Call</span></a>
    <a href="/enquire/" class="mobile-bar-cta"><span>Make an enquiry</span>${icon.arrow('size-3.5')}</a>
  </div>`;

export function layout(ctx, page, content) {
  return `<!doctype html>
<html lang="en-GB">
<head>${head(ctx, page)}
</head>
<body class="${page.bodyClass || ''}" data-page="${esc(page.id || '')}">
  <a href="#main" class="skip-link">Skip to content</a>
  ${header(ctx, page)}
  <main id="main" tabindex="-1">
${content}
  </main>
  ${footer(ctx)}
  ${mobileBar(ctx, page)}
</body>
</html>
`;
}

export { img };
