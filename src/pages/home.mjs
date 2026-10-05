import { esc, em, html, img, icon, pad, plain, hoursMap } from '../templates/helpers.mjs';
import { eyebrow, btn, linkArrow, plate, articleCard, faqList, closingCta } from '../templates/components.mjs';
import { layout } from '../templates/layout.mjs';
import { clinicSchema } from './schema.mjs';

export default function home(ctx) {
  const { home: h, site, care, specialists, journal } = ctx;

  /* ---------- 00 · Hero ---------- */
  const hero = html`
  <section class="hero surface-dark" data-surface="dark" aria-labelledby="hero-title">
    <div class="hero-media" data-hero-media>
      ${img(h.hero.image, { alt: h.hero.image_alt, sizes: '100vw', cls: 'hero-img', priority: true })}
      <div class="hero-shade" aria-hidden="true"></div>
    </div>
    <div class="hero-body wrap">
      <p class="hero-eyebrow t-meta" data-hero-in style="--d:0">${esc(h.hero.eyebrow)}</p>
      <div class="hero-grid">
        <h1 id="hero-title" class="t-display hero-title" data-split="hero">${em(h.hero.headline)}</h1>
        <div class="hero-aside" data-hero-in style="--d:5">
          <p class="hero-sub">${esc(h.hero.subline)}</p>
          <div class="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            ${btn('/enquire/', 'Make an enquiry', { variant: 'light', magnetic: true })}
            ${linkArrow('/practice/', 'How the practice works', 'text-ivory')}
          </div>
        </div>
      </div>
      <div class="hero-meta" data-hero-in style="--d:7">
        <p><span class="text-ivory/60">Fig. 01</span> ${esc(h.hero.caption)}</p>
        <p class="max-md:hidden">${esc(site.address.locality)}, ${esc(site.address.city)} ${esc(site.address.postcode.split(' ')[0])}</p>
        <p data-open-status='${JSON.stringify(hoursMap(site.hours))}' class="max-sm:hidden">Weekdays ${esc(site.hours[0].time)}</p>
        <a href="#position" class="hero-scroll" aria-label="Scroll to the next section"><span></span></a>
      </div>
    </div>
  </section>`;

  /* ---------- 01 · Position ---------- */
  const position = html`
  <section id="position" class="wrap pt-28 pb-24 md:pt-40 md:pb-32" aria-labelledby="position-title">
    <div class="grid gap-12 lg:grid-cols-12">
      <div class="lg:col-span-3">
        ${eyebrow('Our position', 1)}
        <h2 id="position-title" class="sr-only">Our position</h2>
      </div>
      <p class="t-statement lg:col-span-9" data-illuminate>${em(h.manifesto.statement)}</p>
    </div>
    <ul class="ledger mt-24 md:mt-32" role="list">
      ${h.manifesto.commitments.map((c, i) => html`
        <li class="ledger-item" data-reveal style="--d:${i}">
          <p class="ledger-figure">${em(c.title)}</p>
          <p class="ledger-detail">${esc(c.detail)}</p>
        </li>`)}
    </ul>
  </section>`;

  /* ---------- 02 · Care browser ---------- */
  const careBrowser = html`
  <section class="surface-ivory py-28 md:py-36" aria-labelledby="care-title" data-surface="ivory">
    <div class="wrap">
      <div class="grid gap-10 lg:grid-cols-12 lg:items-end">
        <div class="lg:col-span-7">
          ${eyebrow('Care', 2)}
          <h2 id="care-title" class="t-h2 mt-7" data-split>Start with what's <em>on your mind.</em></h2>
        </div>
        <p class="text-[1.05rem] leading-relaxed text-ink-soft lg:col-span-4 lg:col-start-9" data-reveal>Six ways into the practice, described the way people tend to describe them. Choose the closest; a coordinator will route you from there.</p>
      </div>

      <div class="care-browser mt-16 md:mt-24" data-module="care-browser">
        ${care.map((c, i) => html`
          <h3 class="care-tab-wrap">
            <button type="button" class="care-tab" id="care-tab-${c.slug}" aria-expanded="${String(i === 0)}" aria-controls="care-panel-${c.slug}" data-care-tab>
              <span class="care-tab-index">${pad(i + 1)}</span>
              <span class="care-tab-text">
                <span class="care-tab-need">${esc(c.need)}</span>
                <span class="care-tab-title">${esc(c.title)}</span>
              </span>
              <span class="care-tab-icon" aria-hidden="true">${icon.arrow('size-3.5')}</span>
            </button>
          </h3>
          <div class="care-panel" id="care-panel-${c.slug}" role="region" aria-labelledby="care-tab-${c.slug}" data-care-panel ${i === 0 ? 'data-open' : ''}>
            <div class="care-panel-inner">
              <div class="img-frame care-panel-img">${img(c.image, { alt: c.image_alt, sizes: '(min-width: 1024px) 45vw, 100vw', cls: 'img-cover' })}</div>
              <div class="care-panel-copy">
                <p class="t-meta text-brass-deep">${esc(c.title)}</p>
                <p class="mt-4 font-serif text-[1.45rem] leading-snug font-light md:text-[1.7rem]">${esc(c.summary)}</p>
                <ul class="care-includes mt-7">
                  ${c.includes.slice(0, 3).map((it) => `<li>${icon.check('size-3.5 mt-1 shrink-0 text-brass')}<span><strong class="font-medium text-ink">${esc(it.title)}.</strong> ${esc(it.detail)}</span></li>`)}
                </ul>
                <div class="mt-9 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-6">
                  <p class="text-[0.9rem] text-muted"><span class="t-meta block">Indicative fee</span><span class="font-serif text-[1.35rem] text-ink">${esc(c.fees[0].fee)}</span></p>
                  <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
                    ${linkArrow(`/care/${c.slug}/`, `Explore ${c.title}`)}
                    <a href="/enquire/?care=${c.slug}" class="text-[0.9rem] text-muted underline decoration-line underline-offset-4 hover:text-ink">Enquire about this</a>
                  </div>
                </div>
              </div>
            </div>
          </div>`)}
      </div>
    </div>
  </section>`;

  /* ---------- 03 · Discretion interlude ---------- */
  const privacy = html`
  <section class="interlude surface-dark" aria-labelledby="privacy-title" data-surface="dark">
    <div class="interlude-media" aria-hidden="true">${img(h.privacy.image, { alt: '', sizes: '100vw', cls: 'img-cover', attrs: 'data-parallax="0.12"' })}</div>
    <div class="wrap relative flex min-h-[inherit] items-end py-20 md:items-center md:py-32">
      <div class="glass-card" data-reveal>
        ${eyebrow(h.privacy.eyebrow, 3)}
        <h2 id="privacy-title" class="t-h2 mt-6">${em(h.privacy.headline)}</h2>
        <p class="mt-6 text-[1.02rem] leading-relaxed text-ink-soft">${esc(h.privacy.body)}</p>
        ${linkArrow('/privacy/', 'Read our privacy notice', 'mt-8')}
      </div>
    </div>
  </section>`;

  /* ---------- 04 · Journey ---------- */
  const journey = html`
  <section class="journey surface-dark relative" aria-labelledby="journey-title" data-surface="dark" data-module="journey">
    <div class="glow glow--low" aria-hidden="true"></div>
    <div class="wrap relative grid gap-16 py-28 md:py-40 lg:grid-cols-12">
      <div class="lg:col-span-5">
        <div class="lg:sticky lg:top-32">
          ${eyebrow(h.journey.eyebrow, 4)}
          <h2 id="journey-title" class="t-h2 mt-7" data-split>${em(h.journey.headline)}</h2>
          <p class="mt-7 max-w-[38ch] text-[1.05rem] leading-relaxed text-ivory/70" data-reveal>${esc(h.journey.intro)}</p>
          <div class="journey-progress mt-12 max-lg:hidden" aria-hidden="true">
            <span class="t-meta text-ivory/60">Step</span>
            <span class="journey-count"><span data-journey-current>01</span><span class="text-ivory/50"> / ${pad(h.journey.steps.length)}</span></span>
          </div>
        </div>
      </div>
      <ol class="journey-steps lg:col-span-6 lg:col-start-7" data-journey-steps>
        <span class="journey-line" aria-hidden="true"><span data-journey-fill></span></span>
        ${h.journey.steps.map((s, i) => html`
          <li class="journey-step" data-journey-step>
            <span class="journey-dot" aria-hidden="true"></span>
            <p class="t-meta text-champagne">${pad(i + 1)} · ${esc(s.meta)}</p>
            <h3 class="mt-3 font-serif text-[1.85rem] leading-tight font-light md:text-[2.3rem]">${esc(s.title)}</h3>
            <p class="mt-4 max-w-[46ch] leading-relaxed text-ivory/80">${esc(s.detail)}</p>
          </li>`)}
      </ol>
    </div>
  </section>`;

  /* ---------- 05 · The house (horizontal walk) ---------- */
  const house = html`
  <section class="house" aria-labelledby="house-title" data-module="house-gallery">
    <div class="house-pin" data-house-pin>
      <div class="wrap house-head">
        <div>
          ${eyebrow(h.house.eyebrow, 5)}
          <h2 id="house-title" class="t-h2 mt-6" data-split>${em(h.house.headline)}</h2>
        </div>
        <div class="house-head-aside">
          <p class="max-w-[40ch] leading-relaxed text-ink-soft" data-reveal>${esc(h.house.intro)}</p>
          <div class="house-progress" aria-hidden="true"><span data-house-fill></span></div>
        </div>
      </div>
      <div class="house-viewport" data-house-viewport tabindex="0" role="region" aria-label="Photographs of the practice. Scroll horizontally to see more.">
        <ul class="house-track" data-house-track role="list">
          ${h.house.rooms.map((r, i) => html`
            <li class="house-room house-room--${i % 2 ? 'b' : 'a'}">
              <figure>
                <div class="img-frame house-img">${img(r.image, { alt: r.alt, sizes: '(min-width: 1024px) 40vw, 82vw', cls: 'img-cover' })}</div>
                <figcaption>
                  <span class="t-meta text-muted">${pad(i + 1)} · ${esc(r.label)}</span>
                  <span class="mt-2 block font-serif text-[1.25rem] leading-snug font-light">${esc(r.caption)}</span>
                </figcaption>
              </figure>
            </li>`)}
          <li class="house-room house-room--end">
            <div class="house-end">
              <p class="font-serif text-[1.6rem] leading-snug font-light">${esc(h.house.end.text)}</p>
              <div class="mt-6 flex flex-wrap gap-x-6 gap-y-3">${linkArrow(h.house.end.href, h.house.end.link)}${linkArrow('/practice/', 'The practice', 'text-muted')}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>`;

  /* ---------- 06 · Specialists index ---------- */
  const team = html`
  <section class="surface-stone py-28 md:py-36" aria-labelledby="team-title" data-surface="stone">
    <div class="wrap">
      <div class="grid gap-10 lg:grid-cols-12 lg:items-end">
        <div class="lg:col-span-7">
          ${eyebrow('Specialists', 6)}
          <h2 id="team-title" class="t-h2 mt-7" data-split>Nine clinicians. <em>You'll likely meet two.</em></h2>
        </div>
        <p class="leading-relaxed text-ink-soft lg:col-span-4 lg:col-start-9" data-reveal>Your physician first, and a consultant if you need one. They share a building, a record and, most Thursdays, a lunch table where difficult cases get a second opinion.</p>
      </div>
      <ol class="team-index mt-16 md:mt-20" data-module="team-index">
        ${specialists.map((s, i) => html`
          <li class="team-row" data-reveal>
            <a href="/specialists/${s.slug}/" class="team-link" data-team-link data-plate-id="plate-${s.slug}">
              <span class="team-num">${pad(i + 1)}</span>
              <span class="team-name">${esc(s.name)}</span>
              <span class="team-role">${esc(s.role)}</span>
              <span class="team-lang">${esc(s.languages.join(' · '))}</span>
              <span class="round-arrow" aria-hidden="true">${icon.arrow('size-3.5')}</span>
            </a>
          </li>`)}
      </ol>
      <div class="team-float" data-team-float aria-hidden="true">
        ${specialists.map((s) => `<div class="team-float-plate" id="plate-${s.slug}">${plate(s, { size: 'sm' })}</div>`)}
      </div>
      <div class="mt-12 flex flex-wrap items-center justify-between gap-6" data-reveal>
        <p class="text-[0.85rem] text-muted">Profiles on this site are fictional and illustrative.</p>
        ${btn('/specialists/', 'Browse all specialists', { variant: 'ghost' })}
      </div>
    </div>
  </section>`;

  /* ---------- 07 · Journal ---------- */
  const [lead, ...rest] = journal;
  const journalSection = html`
  <section class="wrap pt-28 pb-20 md:pt-36 md:pb-24" aria-labelledby="journal-title">
    <div class="flex flex-wrap items-end justify-between gap-8">
      <div>
        ${eyebrow('Journal', 7)}
        <h2 id="journal-title" class="t-h2 mt-7" data-split>Notes from <em>clinic.</em></h2>
      </div>
      ${linkArrow('/journal/', 'All articles')}
    </div>
    <div class="mt-16 grid gap-14 lg:grid-cols-12 lg:gap-10">
      <article class="group relative lg:col-span-7" data-reveal>
        <div class="img-frame aspect-[4/3]">${img(lead.image, { alt: lead.image_alt, sizes: '(min-width: 1024px) 55vw, 100vw', cls: 'img-cover img-zoom' })}</div>
        <div class="mt-7 grid gap-6 md:grid-cols-[1fr_16rem]">
          <div>
            <p class="t-meta text-brass-deep">${esc(lead.category)} · ${lead.readingTime} min read</p>
            <h3 class="mt-3 font-serif text-[2rem] leading-[1.1] font-light tracking-tight md:text-[2.6rem]"><a href="/journal/${lead.slug}/" class="stretched underline-grow">${esc(lead.title)}</a></h3>
          </div>
          <p class="text-[0.95rem] leading-relaxed text-muted md:pt-7">${esc(lead.dek)}</p>
        </div>
      </article>
      <div class="lg:col-span-5">
        <ul class="border-b border-line" role="list">
          ${rest.slice(0, 4).map((a) => articleCard(a, ctx, { variant: 'row' }))}
        </ul>
      </div>
    </div>
  </section>`;

  /* ---------- 08 · Questions ---------- */
  const questions = html`
  <section class="wrap border-t border-line pt-20 pb-24 md:pt-24 md:pb-32" aria-labelledby="faq-title">
    <div class="grid gap-12 lg:grid-cols-12">
      <div class="lg:col-span-4">
        ${eyebrow('Questions', 8)}
        <h2 id="faq-title" class="t-h2 mt-7" data-split>Asked before <em>the first call.</em></h2>
        <p class="mt-6 max-w-[34ch] text-ink-soft" data-reveal>Fees, insurance, referrals and urgency. If yours isn't here, a coordinator will answer it directly.</p>
        ${linkArrow('/fees/', 'See all fees', 'mt-8')}
      </div>
      <div class="lg:col-span-7 lg:col-start-6" data-reveal>${faqList(h.faqs)}</div>
    </div>
  </section>`;

  const page = {
    id: 'home',
    path: '/',
    title: `${site.legal_name} · A private practice in Marylebone`,
    description: 'A small private medical practice in Marylebone, London. Hour-long first appointments, a named physician who holds your history, and specialists who work together.',
    headerTone: 'light',
    preloadImage: h.hero.image,
    image: h.hero.image,
    jsonld: [
      clinicSchema(ctx),
      { '@context': 'https://schema.org', '@type': 'WebSite', name: site.legal_name, url: site.url + '/' },
    ],
  };
  return [{ path: '/', html: layout(ctx, page, hero + position + careBrowser + privacy + journey + house + team + journalSection + questions + closingCta(ctx)) }];
}
