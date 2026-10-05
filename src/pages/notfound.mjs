import { html, mark } from '../templates/helpers.mjs';
import { btn, linkArrow } from '../templates/components.mjs';
import { layout, NAV } from '../templates/layout.mjs';

export default function notFound(ctx) {
  const content = html`
  <section class="notfound surface-dark relative overflow-hidden" data-surface="dark" aria-labelledby="nf-title">
    <div class="glow" aria-hidden="true"></div>
    <div class="wrap relative grid min-h-[100svh] content-center gap-12 py-32 lg:grid-cols-12 lg:items-center">
      <div class="notfound-arch lg:col-span-4" aria-hidden="true">${mark('w-full h-auto')}</div>
      <div class="lg:col-span-7 lg:col-start-6">
        <p class="t-meta text-champagne">Error 404</p>
        <h1 id="nf-title" class="t-h1 mt-6" data-split>This door doesn’t <em>lead anywhere.</em></h1>
        <p class="t-lead mt-8 max-w-[34ch] text-ivory/70">The page may have moved, or the link may have been mistyped. These rooms are all open:</p>
        <ul class="mt-10 grid gap-x-8 gap-y-3 text-ivory sm:grid-cols-2">
          ${NAV.map((n) => `<li>${linkArrow(n.href, n.label, 'text-ivory')}</li>`)}
        </ul>
        <div class="mt-12">${btn('/', 'Return to the front door', { variant: 'light' })}</div>
      </div>
    </div>
  </section>`;
  return [{
    path: '404.html',
    html: layout(ctx, { id: '404', path: '/404', title: 'Page not found', description: 'This page could not be found.', headerTone: 'light', noindex: true }, content),
  }];
}
