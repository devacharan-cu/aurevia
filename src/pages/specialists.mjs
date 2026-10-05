import { esc, html, icon } from '../templates/helpers.mjs';
import { eyebrow, btn, linkArrow, plate, specialistCard, specialistRow, articleCard, closingCta, pageIntro, breadcrumb } from '../templates/components.mjs';
import { layout } from '../templates/layout.mjs';
import { breadcrumbSchema, physicianSchema } from './schema.mjs';

export default function specialists(ctx) {
  return [index(ctx), ...ctx.specialists.map((s) => detail(ctx, s))];
}

/* ---------- /specialists/ ---------- */
function index(ctx) {
  const { specialists, site } = ctx;
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Specialists', href: '/specialists/' }];
  const disciplines = [...new Set(specialists.map((s) => s.discipline))];
  const languages = [...new Set(specialists.flatMap((s) => s.languages))].filter((l) => l !== 'English').sort();

  const filters = html`
  <div class="filter-bar" data-reveal>
    <div class="filter-chips" role="group" aria-label="Filter by area">
      <button type="button" class="chip" aria-pressed="true" data-filter-discipline="">All <span class="chip-count">${specialists.length}</span></button>
      ${disciplines.map((d) => `<button type="button" class="chip" aria-pressed="false" data-filter-discipline="${esc(d)}">${esc(d)} <span class="chip-count">${specialists.filter((s) => s.discipline === d).length}</span></button>`)}
    </div>
    <div class="filter-tools">
      <label class="filter-field">
        <span class="sr-only">Language spoken</span>
        <select data-filter-language>
          <option value="">Any language</option>
          ${languages.map((l) => `<option value="${esc(l)}">Speaks ${esc(l)}</option>`)}
        </select>
      </label>
      <label class="filter-field filter-search">
        ${icon.search('size-4 shrink-0 text-muted')}
        <span class="sr-only">Search by name, condition or focus</span>
        <input type="search" placeholder="Search: thyroid, running, sleep…" data-filter-search autocomplete="off">
      </label>
    </div>
  </div>`;

  const content = html`
    ${pageIntro({
      crumbs,
      eyebrowLabel: 'Specialists',
      title: 'Nine clinicians, *one record.*',
      intro: 'Physicians who hold your history, and consultants who report back to them. Filter by what you need, or by the language you would rather speak.',
    })}
    <section class="wrap pb-24 md:pb-36" aria-label="Specialist directory" data-module="specialist-filter">
      ${filters}
      <h2 class="sr-only">Directory</h2>
      <p class="mt-10 text-[0.85rem] text-muted" aria-live="polite" data-filter-status>Showing all ${specialists.length} clinicians</p>
      <ul class="spec-rows mt-6" data-filter-list role="list">
        ${specialists.map((s) => specialistRow(s))}
      </ul>
      <div class="empty-state" data-filter-empty hidden>
        <p class="font-serif text-[1.8rem] font-light leading-tight">No one matches that combination.</p>
        <p class="mt-3 text-ink-soft">A coordinator can still help: most questions start with one of our physicians.</p>
        <button type="button" class="link-arrow mt-6" data-filter-reset><span>Clear filters</span>${icon.arrow('size-3.5')}</button>
      </div>
      <p class="mt-20 max-w-[70ch] border-t border-line pt-6 text-[0.82rem] text-muted">These profiles describe fictional clinicians created for a design concept. They are not real doctors and no qualifications are claimed. Portraits are represented by typographic plates; commissioned photography can replace them through the content manager.</p>
    </section>
    ${closingCta(ctx)}`;

  return {
    path: '/specialists/',
    html: layout(ctx, {
      id: 'specialists', path: '/specialists/', title: 'Specialists',
      description: 'Meet Aurevia’s physicians and consultants in cardiology, endocrinology, gynaecology, gastroenterology, psychiatry, sport medicine and dermatology. Filter by specialty or language.',
      jsonld: [breadcrumbSchema(site, crumbs)],
    }, content),
  };
}

/* ---------- /specialists/{slug}/ ---------- */
function detail(ctx, s) {
  const { site, specialists, journal, careBySlug } = ctx;
  const path = `/specialists/${s.slug}/`;
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Specialists', href: '/specialists/' }, { label: s.name, href: path }];
  const writing = journal.filter((a) => a.author === s.slug);
  const colleagues = specialists
    .filter((o) => o.slug !== s.slug && o.care.some((c) => s.care.includes(c)))
    .slice(0, 3);
  const surname = s.name.split(' ').at(-1);

  const content = html`
  <section class="wrap pt-32 pb-20 md:pt-40 md:pb-28" aria-labelledby="spec-title">
    ${breadcrumb(crumbs)}
    <div class="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-10">
      <div class="lg:col-span-5">
        <div class="max-lg:max-w-[14rem] lg:sticky lg:top-28">${plate(s, { size: 'lg', eager: true })}</div>
      </div>
      <div class="lg:col-span-6 lg:col-start-7">
        ${eyebrow(s.discipline)}
        <h1 id="spec-title" class="t-h1 mt-6" data-split>${esc(s.name)}</h1>
        <p class="t-lead mt-4 text-ink-soft" data-reveal>${esc(s.role)}</p>

        <blockquote class="spec-quote" data-reveal>
          <p>“${esc(s.quote)}”</p>
        </blockquote>

        <dl class="spec-facts" data-reveal>
          <div><dt>Consulting</dt><dd>${esc(s.days)}</dd></div>
          <div><dt>Room</dt><dd>${esc(s.room)}</dd></div>
          <div><dt>Languages</dt><dd>${esc(s.languages.join(', '))}</dd></div>
          <div><dt>Sees patients for</dt><dd>${s.care.map((c) => careBySlug[c] ? `<a class="underline decoration-line underline-offset-4 hover:decoration-ink" href="/care/${c}/">${esc(careBySlug[c].title)}</a>` : '').filter(Boolean).join(', ')}</dd></div>
        </dl>

        <div class="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4" data-reveal>
          ${btn(`/enquire/?specialist=${s.slug}`, `Enquire about seeing Dr ${surname}`, { magnetic: true })}
        </div>

        <div class="prose-aurevia mt-20" data-reveal>
          <h2>About ${esc(s.name.replace(/^Dr /, ''))}</h2>
          ${s.bio.map((p) => `<p>${esc(p)}</p>`)}
        </div>

        <div class="mt-14 grid gap-10 border-t border-line pt-10 md:grid-cols-2" data-reveal>
          <div>
            <h2 class="t-meta text-muted">Areas of focus</h2>
            <ul class="mt-5 grid gap-3">${s.focus.map((f) => `<li class="flex gap-4 leading-snug"><span class="mt-[0.6rem] h-px w-4 shrink-0 bg-brass"></span>${esc(f)}</li>`)}</ul>
          </div>
          <div>
            <h2 class="t-meta text-muted">Background</h2>
            <p class="mt-5 leading-relaxed text-ink-soft">${esc(s.background)}</p>
          </div>
        </div>

        <p class="mt-14 rounded-sm border border-line px-5 py-4 text-[0.82rem] text-muted"><span class="concept-tag concept-tag--light">Fictional</span> ${esc(s.name)} is an invented clinician in a design concept. No real person, qualification or registration is represented.</p>
      </div>
    </div>
  </section>

  ${writing.length ? html`
  <section class="wrap pb-24 md:pb-32" aria-labelledby="writing-title">
    <div class="grid gap-10 border-t border-line pt-16 lg:grid-cols-12">
      <div class="lg:col-span-4">
        <h2 id="writing-title" class="t-h2" data-split>Writing by <em>Dr ${esc(surname)}.</em></h2>
        ${linkArrow('/journal/', 'The journal', 'mt-8')}
      </div>
      <ul class="border-b border-line lg:col-span-7 lg:col-start-6" role="list">${writing.map((a) => articleCard(a, ctx, { variant: 'row' }))}</ul>
    </div>
  </section>` : ''}

  ${colleagues.length ? html`
  <section class="surface-stone py-24 md:py-28" aria-labelledby="coll-title">
    <div class="wrap">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <h2 id="coll-title" class="t-h2" data-split>Often works <em>alongside.</em></h2>
        ${linkArrow('/specialists/', 'All specialists')}
      </div>
      <ul class="spec-rows mt-12" role="list">
        ${colleagues.map((o) => specialistRow(o))}
      </ul>
    </div>
  </section>` : ''}

  ${closingCta(ctx, { headline: `See *Dr ${surname}.*`, body: `Tell us a little about what's going on. A coordinator will check Dr ${surname}'s availability, confirm the fee, and reply the same working day.` })}`;

  return {
    path,
    html: layout(ctx, {
      id: 'specialist', path, title: `${s.name}, ${s.role}`,
      description: `${s.name} is a ${s.role.toLowerCase()} at Aurevia Private Medical, with a focus on ${s.focus.slice(0, 2).join(' and ').toLowerCase()}. Consulting ${s.days}.`,
      ogType: 'profile',
      jsonld: [breadcrumbSchema(site, crumbs), physicianSchema(site, s)],
    }, content),
  };
}
