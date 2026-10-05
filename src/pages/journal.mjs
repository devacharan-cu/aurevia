import { esc, html, img, icon, formatDate, isPortrait } from '../templates/helpers.mjs';
import { eyebrow, linkArrow, articleCard, articleMeta, closingCta, pageIntro, breadcrumb } from '../templates/components.mjs';
import { layout } from '../templates/layout.mjs';
import { breadcrumbSchema, articleSchema } from './schema.mjs';

export default function journal(ctx) {
  return [index(ctx), ...ctx.journal.map((a) => article(ctx, a))];
}

/* ---------- /journal/ ---------- */
function index(ctx) {
  const { journal, site, specialistsBySlug } = ctx;
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Journal', href: '/journal/' }];
  const [lead, ...rest] = journal;
  const categories = [...new Set(journal.map((a) => a.category))];
  const leadAuthor = specialistsBySlug[lead.author];

  const content = html`
    ${pageIntro({
      crumbs,
      eyebrowLabel: 'Journal',
      title: 'Notes from *clinic.*',
      intro: 'Written by our clinicians about the questions patients ask most often. General information, carefully sourced, and never a substitute for advice about your own health.',
    })}

    <section class="wrap pb-20" aria-label="Featured article">
      <article class="group relative grid gap-10 border-t border-line pt-10 lg:grid-cols-12 lg:gap-10" data-reveal>
        <div class="img-frame aspect-[4/3] lg:col-span-7 lg:aspect-[16/11]">${img(lead.image, { alt: lead.image_alt, sizes: '(min-width: 1024px) 58vw, 100vw', cls: 'img-cover img-zoom', priority: true })}</div>
        <div class="flex flex-col lg:col-span-5 lg:py-2">
          <p class="t-meta text-muted"><span class="text-brass-deep">Featured</span> · ${esc(lead.category)}</p>
          <h2 class="t-h2 mt-5"><a href="/journal/${lead.slug}/" class="stretched underline-grow">${esc(lead.title)}</a></h2>
          <p class="t-lead mt-6 text-ink-soft">${esc(lead.dek)}</p>
          <div class="mt-auto flex items-center justify-between gap-6 border-t border-line pt-5 max-lg:mt-10">
            <p class="text-[0.9rem]">${leadAuthor ? esc(leadAuthor.name) : ''}<span class="block text-[0.8rem] text-muted">${formatDate(lead.date)} · ${lead.readingTime} min read</span></p>
            <span class="round-arrow" aria-hidden="true">${icon.arrow('size-3.5')}</span>
          </div>
        </div>
      </article>
    </section>

    <section class="wrap pb-24 md:pb-36" aria-labelledby="all-title" data-module="journal-filter">
      <div class="flex flex-wrap items-end justify-between gap-6 border-t border-line pt-14">
        <h2 id="all-title" class="t-h2" data-split>All <em>articles.</em></h2>
        <div class="filter-chips" role="group" aria-label="Filter by topic">
          <button type="button" class="chip" aria-pressed="true" data-topic="">All</button>
          ${categories.map((c) => `<button type="button" class="chip" aria-pressed="false" data-topic="${esc(c)}">${esc(c)}</button>`)}
        </div>
      </div>
      <p class="sr-only" aria-live="polite" data-topic-status></p>
      <div class="journal-grid mt-14" data-topic-list>
        ${rest.map((a) => `<div data-topic-item="${esc(a.category)}">${articleCard(a, ctx, { heading: 'h3' })}</div>`)}
      </div>
    </section>
    ${closingCta(ctx)}`;

  return {
    path: '/journal/',
    html: layout(ctx, {
      id: 'journal', path: '/journal/', title: 'Journal',
      description: 'Notes from clinic by Aurevia’s physicians and consultants: prevention, heart health, sleep, menopause, healthy ageing, travel and the practice of medicine.',
      image: lead.image,
      jsonld: [breadcrumbSchema(site, crumbs)],
    }, content),
  };
}

/* ---------- /journal/{slug}/ ---------- */
function article(ctx, a) {
  const { site, journal, specialistsBySlug, careBySlug } = ctx;
  const path = `/journal/${a.slug}/`;
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Journal', href: '/journal/' }, { label: a.title, href: path }];
  const author = specialistsBySlug[a.author];
  const care = careBySlug[a.related_care];
  const more = journal.filter((x) => x.slug !== a.slug).sort((x, y) => (x.category === a.category ? -1 : 0) - (y.category === a.category ? -1 : 0)).slice(0, 3);

  // Give each H2 an id for the contents list.
  const toc = [];
  const body = a.bodyHtml.replace(/<h2>(.*?)<\/h2>/g, (_, t) => {
    const id = t.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[^;]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    toc.push({ id, t });
    return `<h2 id="${id}">${t}</h2>`;
  });

  const content = html`
  <article aria-labelledby="article-title">
    <header class="wrap pt-32 md:pt-40">
      ${breadcrumb(crumbs)}
      <div class="mt-12 max-w-[62rem]">
        ${articleMeta(a, ctx)}
        <h1 id="article-title" class="t-h1 mt-6" data-split>${esc(a.title)}</h1>
        <p class="t-lead mt-8 max-w-[46ch] text-ink-soft" data-reveal>${esc(a.dek)}</p>
        ${author ? html`
        <a href="/specialists/${author.slug}/" class="byline group mt-10" data-reveal>
          <span class="byline-mark plate--${esc(author.tone)}" aria-hidden="true">${esc(author.initials)}</span>
          <span><span class="block font-medium"><span class="underline-grow">${esc(author.name)}</span></span><span class="block text-[0.85rem] text-muted">${esc(author.role)}</span></span>
        </a>` : ''}
      </div>
    </header>

    ${isPortrait(a.image) ? html`
    <figure class="wrap mt-14 grid gap-6 md:mt-20 md:grid-cols-12 md:items-end">
      <div class="img-frame aspect-[4/5] md:col-span-6 md:col-start-4 lg:col-span-4 lg:col-start-5">${img(a.image, { alt: a.image_alt, sizes: '(min-width: 1024px) 34vw, (min-width: 768px) 50vw, 100vw', cls: 'img-cover', priority: true })}</div>
    </figure>` : html`
    <figure class="wrap mt-14 md:mt-20">
      <div class="img-frame aspect-[4/3] md:aspect-[21/9]">${img(a.image, { alt: a.image_alt, sizes: '100vw', cls: 'img-cover', priority: true, attrs: 'data-parallax="0.06"' })}</div>
    </figure>`}

    <div class="wrap grid gap-14 py-16 md:py-24 lg:grid-cols-12">
      <aside class="lg:col-span-3" aria-label="In this article">
        <div class="lg:sticky lg:top-28">
          <p class="t-meta text-muted">In this article</p>
          <ol class="toc mt-5">${toc.map((h, i) => `<li><a href="#${h.id}"><span>${String(i + 1).padStart(2, '0')}</span>${h.t}</a></li>`)}</ol>
        </div>
      </aside>
      <div class="lg:col-span-7 lg:col-start-5">
        <div class="prose-aurevia prose-article">${body}</div>

        <aside class="notice mt-16" aria-label="About this article">
          <p class="t-meta text-brass-deep">General information</p>
          <p class="mt-3">This article explains common questions in general terms. It is not advice about your own health. If you are worried about a symptom, speak to a doctor, and if you are seriously unwell, call 999.</p>
          <p class="mt-3 text-muted">Published ${formatDate(a.date)} as part of a fictional design concept; the author is an invented clinician.</p>
        </aside>

        ${care ? html`
        <a href="/care/${care.slug}/" class="related-care group mt-10">
          <div class="img-frame aspect-square w-24 shrink-0 md:w-32">${img(care.image, { alt: '', sizes: '8rem', cls: 'img-cover img-zoom' })}</div>
          <div class="min-w-0 flex-1">
            <p class="t-meta text-muted">Related care</p>
            <p class="mt-2 font-serif text-[1.6rem] leading-tight font-light"><span class="underline-grow">${esc(care.title)}</span></p>
            <p class="mt-1 text-[0.9rem] text-muted">${esc(care.need)}</p>
          </div>
          <span class="round-arrow max-sm:hidden" aria-hidden="true">${icon.arrow('size-3.5')}</span>
        </a>` : ''}
      </div>
    </div>
  </article>

  <section class="surface-ivory py-24 md:py-32" aria-labelledby="more-title">
    <div class="wrap">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <h2 id="more-title" class="t-h2" data-split>Further <em>reading.</em></h2>
        ${linkArrow('/journal/', 'All articles')}
      </div>
      <div class="mt-12 grid gap-12 md:grid-cols-2 lg:grid-cols-3">${more.map((m) => articleCard(m, ctx))}</div>
    </div>
  </section>
  ${closingCta(ctx)}`;

  return {
    path,
    html: layout(ctx, {
      id: 'article', path, title: a.title, description: a.dek, image: a.image, ogType: 'article', preloadImage: a.image,
      jsonld: [breadcrumbSchema(site, crumbs), articleSchema(site, a, author)],
    }, content),
  };
}
