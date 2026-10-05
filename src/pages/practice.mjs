import { esc, em, html, img, pad } from '../templates/helpers.mjs';
import { eyebrow, linkArrow, closingCta, breadcrumb } from '../templates/components.mjs';
import { layout } from '../templates/layout.mjs';
import { breadcrumbSchema, clinicSchema } from './schema.mjs';

export default function practice(ctx) {
  const { site, practice: p } = ctx;
  const path = '/practice/';
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'The Practice', href: path }];

  const content = html`
  <section class="wrap pt-32 md:pt-40" aria-labelledby="practice-title">
    ${breadcrumb(crumbs)}
    <div class="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
      <h1 id="practice-title" class="t-h1 lg:col-span-8" data-split>${em(p.title)}</h1>
      <p class="t-lead text-ink-soft lg:col-span-4 lg:pb-3" data-reveal>${esc(p.intro)}</p>
    </div>
  </section>

  <figure class="practice-hero mt-14 md:mt-20">
    <div class="img-frame h-full">${img(p.hero_image, { alt: p.hero_alt, sizes: '100vw', cls: 'img-cover', priority: true, attrs: 'data-parallax="0.08"' })}</div>
    <figcaption class="wrap mt-4 flex justify-between text-[0.8rem] text-muted"><span>Fig. 02 · The first-floor waiting room</span><span>9 Aurelian Mews</span></figcaption>
  </figure>

  <section class="wrap py-24 md:py-36" aria-labelledby="story-title">
    <div class="grid gap-12 lg:grid-cols-12">
      <div class="lg:col-span-4">${eyebrow('Our story', 1)}<h2 id="story-title" class="t-h2 mt-6" data-split>${em(p.story.headline)}</h2></div>
      <div class="prose-aurevia text-[1.2rem] lg:col-span-7 lg:col-start-6" data-reveal>
        ${p.story.paragraphs.map((t, i) => `<p${i === 0 ? ' class="dropcap"' : ''}>${esc(t)}</p>`)}
      </div>
    </div>
  </section>

  <section class="surface-dark relative overflow-hidden" aria-labelledby="principles-title" data-surface="dark">
    <div class="glow" aria-hidden="true"></div>
    <div class="wrap relative py-24 md:py-36">
      ${eyebrow('How we work', 2)}
      <h2 id="principles-title" class="t-h2 mt-6 max-w-[16ch]" data-split>Four habits, <em>kept deliberately.</em></h2>
      <ol class="principles mt-16">
        ${p.principles.map((pr, i) => html`
          <li data-reveal style="--d:${i}">
            <span class="principle-num">${pad(i + 1)}</span>
            <h3 class="mt-8 font-serif text-[1.7rem] leading-tight font-light">${esc(pr.title)}</h3>
            <p class="mt-4 leading-relaxed text-ivory/70">${esc(pr.detail)}</p>
          </li>`)}
      </ol>
    </div>
  </section>

  <section class="wrap py-24 md:py-36" aria-labelledby="not-title">
    <div class="grid gap-12 lg:grid-cols-12">
      <div class="lg:col-span-5">
        ${eyebrow('Candour', 3)}
        <h2 id="not-title" class="t-h2 mt-6" data-split>What we <em>don’t do.</em></h2>
        <p class="mt-6 max-w-[36ch] text-ink-soft" data-reveal>Trust is easier to earn with a short list of refusals than a long list of promises.</p>
      </div>
      <ul class="not-list lg:col-span-6 lg:col-start-7">
        ${p.not_doing.map((n, i) => `<li data-reveal style="--d:${i % 3}"><span class="not-mark" aria-hidden="true"></span><span><span class="sr-only">We don’t </span>${esc(n)}</span></li>`)}
      </ul>
    </div>
  </section>

  <section class="surface-ivory py-24 md:py-32" aria-labelledby="house-title" data-module="lightbox">
    <div class="wrap">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <div>${eyebrow('The house', 4)}<h2 id="house-title" class="t-h2 mt-6" data-split>Four floors, <em>one quiet house.</em></h2></div>
        <p class="max-w-[40ch] text-ink-soft" data-reveal>Nine consulting rooms, a garden room for assessment mornings, and a studio on the lower ground floor. Every consulting room has a window that opens.</p>
      </div>
      <ul class="mosaic mt-14" role="list">
        ${p.gallery.map((g, i) => html`
          <li class="mosaic-item mosaic-item--${i + 1}" data-reveal style="--d:${i % 3}">
            <button type="button" class="mosaic-btn group" data-lightbox="${esc(g.image)}" data-caption="${esc(g.caption)}" aria-label="Enlarge photograph: ${esc(g.caption)}">
              <span class="img-frame block h-full">${img(g.image, { alt: g.alt, sizes: '(min-width: 1024px) 40vw, 100vw', cls: 'img-cover img-zoom' })}</span>
            </button>
            <p class="mt-3 text-[0.8rem] text-muted">${pad(i + 1)} · ${esc(g.caption)}</p>
          </li>`)}
      </ul>
    </div>
    <dialog class="lightbox" data-lightbox-dialog aria-label="Photograph">
      <figure>
        <img alt="" data-lightbox-img>
        <figcaption data-lightbox-caption></figcaption>
      </figure>
      <div class="lightbox-controls">
        <button type="button" data-lightbox-prev aria-label="Previous photograph">←</button>
        <button type="button" data-lightbox-next aria-label="Next photograph">→</button>
        <button type="button" data-lightbox-close aria-label="Close">Close</button>
      </div>
    </dialog>
  </section>

  <section class="wrap py-24 md:py-36" aria-labelledby="people-title">
    <div class="grid gap-12 lg:grid-cols-12">
      <div class="lg:col-span-4">
        ${eyebrow('First contact', 5)}
        <h2 id="people-title" class="t-h2 mt-6" data-split>The people <em>you meet first.</em></h2>
        <p class="mt-6 max-w-[34ch] text-ink-soft" data-reveal>Before any doctor, there is a coordinator on the phone and a nurse at the door. They set the tone for everything else.</p>
        ${linkArrow('/specialists/', 'Meet the clinicians', 'mt-8')}
      </div>
      <ul class="people-list lg:col-span-7 lg:col-start-6">
        ${p.team.map((t) => html`
          <li data-reveal>
            <p class="font-serif text-[1.65rem] leading-tight font-light">${esc(t.name)}</p>
            <p class="t-meta mt-2 text-brass-deep">${esc(t.role)}</p>
            <p class="mt-4 leading-relaxed text-ink-soft">${esc(t.note)}</p>
          </li>`)}
      </ul>
    </div>
  </section>

  <section class="surface-stone py-24 md:py-32" aria-labelledby="partners-title">
    <div class="wrap grid gap-12 lg:grid-cols-12">
      <div class="lg:col-span-4">${eyebrow('Working together', 6)}<h2 id="partners-title" class="t-h2 mt-6" data-split>Your GP, <em>your insurer.</em></h2></div>
      <div class="grid gap-10 md:grid-cols-2 lg:col-span-7 lg:col-start-6">
        <div data-reveal><h3 class="t-meta text-muted">With your NHS GP</h3><p class="mt-4 leading-relaxed text-ink-soft">${esc(p.partners.gp)}</p></div>
        <div data-reveal style="--d:1"><h3 class="t-meta text-muted">With your insurer</h3><p class="mt-4 leading-relaxed text-ink-soft">${esc(p.partners.insurers)}</p></div>
      </div>
    </div>
  </section>

  ${closingCta(ctx)}`;

  return [{
    path,
    html: layout(ctx, {
      id: 'practice', path, title: 'The Practice',
      description: 'How Aurevia works: hour-long first appointments, one named physician, published fees, and a short list of things we refuse to do. A Georgian house on a quiet Marylebone mews.',
      image: p.hero_image, preloadImage: p.hero_image,
      jsonld: [breadcrumbSchema(site, crumbs), clinicSchema(ctx)],
    }, content),
  }];
}
