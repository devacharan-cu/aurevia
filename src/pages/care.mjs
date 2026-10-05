import { esc, em, html, img, icon, pad } from '../templates/helpers.mjs';

// Shown under a "From" label: drop a leading "From" and keep the lower bound of a range.
const feeFrom = (f) => esc(f.replace(/^From\s+/i, '').split(/\s*[–-]\s*(?=£)/)[0]);
import { eyebrow, btn, linkArrow, plate, articleCard, faqList, closingCta, pageIntro, breadcrumb } from '../templates/components.mjs';
import { layout } from '../templates/layout.mjs';
import { breadcrumbSchema, faqSchema } from './schema.mjs';

export default function care(ctx) {
  return [careIndex(ctx), ...ctx.care.map((c, i) => careDetail(ctx, c, i))];
}

/* ---------- /care/ ---------- */
function careIndex(ctx) {
  const { care, site } = ctx;
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Care', href: '/care/' }];

  const [first, ...others] = care;
  const last = others.pop();
  const fee = (c) => `<p class="text-[0.9rem] text-muted"><span class="t-meta mr-3">From</span><span class="font-serif text-[1.25rem] text-ink">${feeFrom(c.fees[0].fee)}</span></p>`;

  // Four specialist routes, staggered so the spread reads as a page rather than a list.
  const card = (c, i) => html`
    <article class="care-card ${i % 2 ? 'md:mt-40' : ''}" data-reveal>
      <a href="/care/${c.slug}/" class="group block">
        <div class="img-frame ${i % 3 ? 'aspect-[4/3]' : 'aspect-[4/5]'}">
          ${img(c.image, { alt: c.image_alt, sizes: '(min-width: 768px) 45vw, 100vw', cls: 'img-cover img-zoom' })}
          <span class="care-entry-num" aria-hidden="true">${pad(c.order)}</span>
        </div>
        <p class="mt-8 font-serif text-[1.1rem] italic font-light text-brass-deep">“${esc(c.need)}”</p>
        <h3 class="t-h3 mt-3"><span class="underline-grow">${esc(c.title)}</span></h3>
        <p class="mt-5 max-w-[46ch] leading-relaxed text-ink-soft">${esc(c.summary)}</p>
        <div class="mt-7 flex items-center justify-between gap-6 border-t border-line pt-5">${fee(c)}<span class="round-arrow" aria-hidden="true">${icon.arrow('size-3.5')}</span></div>
      </a>
    </article>`;

  const content = html`
    ${pageIntro({
      crumbs,
      eyebrowLabel: 'Care',
      title: 'Care, arranged around *how you’d describe it.*',
      intro: 'Six ways into the practice. Each begins with a conversation and a named clinician, and each has its fees published before you commit to anything.',
    })}

    <section class="wrap pb-24 md:pb-32" aria-labelledby="care-first">
      <a href="/care/${first.slug}/" class="group block" data-reveal>
        <div class="img-frame aspect-[4/3] md:aspect-[21/9]">
          ${img(first.image, { alt: first.image_alt, sizes: '100vw', cls: 'img-cover img-zoom', priority: true })}
          <span class="care-entry-num" aria-hidden="true">01</span>
        </div>
        <div class="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div class="lg:col-span-6">
            <p class="t-meta text-brass-deep">Where most people begin</p>
            <h2 id="care-first" class="t-h1 mt-5"><span class="underline-grow">${esc(first.title)}</span></h2>
            <p class="mt-5 font-serif text-[1.25rem] italic font-light text-ink-soft">“${esc(first.need)}”</p>
          </div>
          <div class="lg:col-span-5 lg:col-start-8 lg:pt-10">
            <p class="text-[1.05rem] leading-relaxed text-ink-soft">${esc(first.summary)}</p>
            <ul class="care-includes mt-7">${first.includes.slice(0, 3).map((it) => `<li>${icon.check('size-3.5 mt-1 shrink-0 text-brass')}<span><strong class="font-medium text-ink">${esc(it.title)}.</strong> ${esc(it.detail)}</span></li>`)}</ul>
            <div class="mt-8 flex items-center justify-between gap-6 border-t border-line pt-5">${fee(first)}<span class="round-arrow" aria-hidden="true">${icon.arrow('size-3.5')}</span></div>
          </div>
        </div>
      </a>
    </section>

    <section class="wrap border-t border-line pt-20 pb-28 md:pt-28 md:pb-40" aria-labelledby="care-routes">
      <div class="grid gap-8 lg:grid-cols-12">
        <div class="lg:col-span-6">
          ${eyebrow('When something more specific is needed')}
          <h2 id="care-routes" class="t-h2 mt-6" data-split>Your physician stays in the room. <em>The right specialist joins it.</em></h2>
        </div>
        <p class="leading-relaxed text-ink-soft lg:col-span-4 lg:col-start-9 lg:self-end" data-reveal>Each of these can be booked directly. Results and letters still go back to one physician, so nothing is read in isolation.</p>
      </div>
      <div class="mt-16 grid gap-20 md:mt-24 md:grid-cols-2 md:gap-x-12 lg:gap-x-20">${others.map(card)}</div>
    </section>

    <section class="surface-dark relative overflow-hidden" aria-labelledby="care-org" data-surface="dark">
      <div class="glow glow--low" aria-hidden="true"></div>
      <a href="/care/${last.slug}/" class="wrap group relative grid gap-12 py-24 md:py-32 lg:grid-cols-12 lg:items-center">
        <div class="lg:col-span-5" data-reveal>
          <p class="t-meta text-champagne">For organisations · ${pad(last.order)}</p>
          <h2 id="care-org" class="t-h2 mt-6"><span class="underline-grow">${esc(last.title)}</span></h2>
          <p class="mt-5 font-serif text-[1.2rem] italic font-light text-ivory/75">“${esc(last.need)}”</p>
          <p class="mt-6 max-w-[46ch] leading-relaxed text-ivory/80">${esc(last.summary)}</p>
          <div class="mt-8 flex items-center justify-between gap-6 border-t border-ivory/15 pt-5"><p class="text-[0.9rem] text-ivory/70"><span class="t-meta mr-3">From</span><span class="font-serif text-[1.25rem] text-ivory">${feeFrom(last.fees[0].fee)}</span></p><span class="round-arrow round-arrow--light" aria-hidden="true">${icon.arrow('size-3.5')}</span></div>
        </div>
        <div class="img-frame aspect-[4/3] lg:col-span-6 lg:col-start-7" data-reveal>${img(last.image, { alt: last.image_alt, sizes: '(min-width: 1024px) 48vw, 100vw', cls: 'img-cover img-zoom' })}</div>
      </a>
    </section>

    <section class="surface-ivory" aria-labelledby="unsure-title">
      <div class="wrap grid gap-10 py-24 md:py-32 lg:grid-cols-12 lg:items-center">
        <div class="lg:col-span-6">
          ${eyebrow('Not sure where to start')}
          <h2 id="unsure-title" class="t-h2 mt-6" data-split>Not sure which? <em>Describe it instead.</em></h2>
        </div>
        <div class="lg:col-span-5 lg:col-start-8" data-reveal>
          <p class="t-lead text-ink-soft">Most people don’t arrive with a category. Describe what’s going on and a coordinator will suggest the right first appointment, usually an hour with one of our physicians, who can bring in a specialist if one is needed.</p>
          <div class="mt-8 flex flex-wrap gap-x-8 gap-y-4">
            ${btn('/enquire/?care=unsure', 'Describe what’s going on')}
            ${linkArrow('/fees/', 'See every fee')}
          </div>
        </div>
      </div>
    </section>
    ${closingCta(ctx)}`;

  return {
    path: '/care/',
    html: layout(ctx, {
      id: 'care', path: '/care/', title: 'Care',
      description: 'Personal physician membership, health assessments, specialist consultations, diagnostics, women’s health and executive health at Aurevia Private Medical, Marylebone.',
      image: care[0].image,
      jsonld: [breadcrumbSchema(site, crumbs)],
    }, content),
  };
}

/* ---------- /care/{slug}/ ---------- */
function careDetail(ctx, c, index) {
  const { site, specialists, journal, care } = ctx;
  const path = `/care/${c.slug}/`;
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Care', href: '/care/' }, { label: c.title, href: path }];
  const team = specialists.filter((s) => s.care.includes(c.slug));
  const reading = journal.filter((a) => a.related_care === c.slug).slice(0, 2);
  const next = care[(index + 1) % care.length];

  const hero = html`
  <section class="wrap pt-32 md:pt-40" aria-labelledby="care-title">
    ${breadcrumb(crumbs)}
    <div class="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-10">
      <div class="flex flex-col lg:col-span-6 lg:pb-6">
        <p class="font-serif text-[1.2rem] italic font-light text-brass-deep" data-reveal>“${esc(c.need)}”</p>
        <h1 id="care-title" class="t-h1 mt-5" data-split>${esc(c.title)}</h1>
        <p class="t-lead mt-8 max-w-[34ch] text-ink-soft" data-reveal>${esc(c.summary)}</p>
        <div class="mt-auto pt-12" data-reveal>
          <div class="flex flex-wrap items-center gap-x-8 gap-y-5">
            ${btn(`/enquire/?care=${c.slug}`, 'Enquire about this', { magnetic: true })}
            <p class="text-[0.9rem] text-muted"><span class="t-meta block">From</span><span class="font-serif text-[1.35rem] text-ink">${feeFrom(c.fees[0].fee)}</span></p>
          </div>
        </div>
      </div>
      <div class="lg:col-span-5 lg:col-start-8">
        <div class="img-frame arch-frame aspect-[4/5]">${img(c.image, { alt: c.image_alt, sizes: '(min-width: 1024px) 40vw, 100vw', cls: 'img-cover', priority: true })}</div>
      </div>
    </div>
  </section>`;

  const intro = html`
  <section class="wrap py-24 md:py-36" aria-labelledby="for-title">
    <div class="grid gap-14 lg:grid-cols-12">
      <p class="t-statement t-statement--sm lg:col-span-7" data-reveal>${esc(c.intro)}</p>
      <div class="lg:col-span-4 lg:col-start-9" data-reveal>
        <h2 id="for-title" class="t-meta text-muted">Often chosen by</h2>
        <ul class="mt-6 border-t border-line">
          ${c.for_whom.map((f) => `<li class="flex gap-4 border-b border-line py-4 leading-snug text-ink-soft"><span class="mt-[0.55rem] h-px w-4 shrink-0 bg-brass"></span>${esc(f)}</li>`)}
        </ul>
      </div>
    </div>
  </section>`;

  const includes = html`
  <section class="surface-ivory py-24 md:py-32" aria-labelledby="inc-title">
    <div class="wrap">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <div>${eyebrow('What’s included', 1)}<h2 id="inc-title" class="t-h2 mt-6" data-split>What you <em>receive.</em></h2></div>
      </div>
      <ol class="includes-grid mt-14">
        ${c.includes.map((it, i) => html`
          <li data-reveal style="--d:${i % 3}">
            <span class="includes-num">${pad(i + 1)}</span>
            <h3 class="mt-6 font-serif text-[1.5rem] leading-tight font-light">${esc(it.title)}</h3>
            <p class="mt-3 leading-relaxed text-ink-soft">${esc(it.detail)}</p>
          </li>`)}
      </ol>
    </div>
  </section>`;

  const process = html`
  <section class="wrap py-24 md:py-32" aria-labelledby="proc-title">
    ${eyebrow('How it runs', 2)}
    <h2 id="proc-title" class="t-h2 mt-6" data-split>From first call <em>to follow-up.</em></h2>
    <ol class="process mt-14" style="--n:${c.process.length}">
      ${c.process.map((p, i) => html`
        <li class="process-step" data-reveal style="--d:${i}">
          <span class="process-dot" aria-hidden="true"></span>
          <p class="t-meta text-brass-deep">${pad(i + 1)} · ${esc(p.duration)}</p>
          <h3 class="mt-3 font-serif text-[1.45rem] leading-tight font-light">${esc(p.step)}</h3>
          <p class="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">${esc(p.detail)}</p>
        </li>`)}
    </ol>
  </section>`;

  const fees = html`
  <section class="wrap pb-24 md:pb-32" aria-labelledby="fees-title">
    <div class="grid gap-10 border-t border-line pt-16 lg:grid-cols-12">
      <div class="lg:col-span-4">
        ${eyebrow('Fees', 3)}
        <h2 id="fees-title" class="t-h2 mt-6" data-split>Known <em>in advance.</em></h2>
        <p class="mt-6 max-w-[34ch] text-ink-soft" data-reveal>Anything beyond these is quoted in writing before it is arranged.</p>
      </div>
      <div class="lg:col-span-7 lg:col-start-6" data-reveal>
        <table class="fee-table">
          <caption class="sr-only">${esc(c.title)} fees</caption>
          <thead class="sr-only"><tr><th scope="col">Service</th><th scope="col">Fee</th></tr></thead>
          <tbody>
            ${c.fees.map((f) => `<tr><th scope="row"><span class="fee-item">${esc(f.item)}</span>${f.note ? `<span class="fee-note">${esc(f.note)}</span>` : ''}</th><td>${esc(f.fee)}</td></tr>`)}
          </tbody>
        </table>
        <p class="mt-6 text-[0.82rem] text-muted">Illustrative fees for a fictional practice. ${linkArrow('/fees/', 'All fees and how billing works', 'ml-2')}</p>
      </div>
    </div>
  </section>`;

  const people = team.length ? html`
  <section class="surface-stone py-24 md:py-32" aria-labelledby="team-title">
    <div class="wrap">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <div>${eyebrow('Who you’ll see', 4)}<h2 id="team-title" class="t-h2 mt-6" data-split>The <em>clinicians.</em></h2></div>
        ${linkArrow('/specialists/', 'All specialists')}
      </div>
      <ul class="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-8 lg:grid-cols-4">
        ${team.slice(0, 4).map((s) => html`
          <li data-reveal>
            <a href="/specialists/${s.slug}/" class="group block">
              ${plate(s, { size: 'sm' })}
              <h3 class="mt-4 font-serif text-[1.15rem] leading-tight font-light sm:mt-5 sm:text-[1.4rem]"><span class="underline-grow">${esc(s.name)}</span></h3>
              <p class="mt-1 text-[0.9rem] text-muted">${esc(s.role)}</p>
            </a>
          </li>`)}
      </ul>
    </div>
  </section>` : '';

  const faqs = html`
  <section class="wrap py-24 md:py-32" aria-labelledby="faq-title">
    <div class="grid gap-12 lg:grid-cols-12">
      <div class="lg:col-span-4">${eyebrow('Questions', 5)}<h2 id="faq-title" class="t-h2 mt-6" data-split>Worth <em>asking.</em></h2></div>
      <div class="lg:col-span-7 lg:col-start-6" data-reveal>${faqList(c.faqs)}</div>
    </div>
  </section>`;

  const further = html`
  <section class="wrap pb-24 md:pb-32" aria-label="Further reading and other care">
    <div class="grid gap-14 border-t border-line pt-16 lg:grid-cols-12">
      ${reading.length ? html`
        <div class="lg:col-span-7">
          <p class="t-meta text-muted">From the journal</p>
          <ul class="mt-6 border-b border-line">${reading.map((a) => articleCard(a, ctx, { variant: 'row' }))}</ul>
        </div>` : ''}
      <a href="/care/${next.slug}/" class="next-card group lg:col-span-4 lg:col-start-9" data-reveal>
        <span class="t-meta text-muted">Next area of care</span>
        <div class="img-frame mt-6 aspect-[16/10]">${img(next.image, { alt: '', sizes: '(min-width: 1024px) 30vw, 100vw', cls: 'img-cover img-zoom' })}</div>
        <span class="mt-5 flex items-center justify-between gap-4">
          <span class="font-serif text-[1.7rem] leading-tight font-light"><span class="underline-grow">${esc(next.title)}</span></span>
          <span class="round-arrow" aria-hidden="true">${icon.arrow('size-3.5')}</span>
        </span>
      </a>
    </div>
  </section>`;

  const content = hero + intro + includes + process + fees + people + faqs + further +
    closingCta(ctx, { headline: `Ask about *${c.title}.*`, body: 'Tell us a little about what you have in mind. A coordinator replies the same working day, confirms the fee, and books nothing until you have decided.' });

  return {
    path,
    html: layout(ctx, {
      id: 'care-detail', path, title: c.title, description: c.summary, image: c.image, preloadImage: c.image, preloadSizes: '(min-width: 1024px) 40vw, 100vw',
      jsonld: [breadcrumbSchema(site, crumbs), faqSchema(c.faqs)],
    }, content),
  };
}
