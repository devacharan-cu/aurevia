// Reusable pieces of the Aurevia component language.
import { esc, em, html, img, icon, pad, formatDate, mark } from './helpers.mjs';

/** Section label: a numbered index and a quiet uppercase label. */
export const eyebrow = (label, index = null, cls = '') => html`
  <p class="eyebrow ${cls}">${index !== null ? `<span class="eyebrow-index">${pad(index)}</span>` : ''}<span>${esc(label)}</span></p>`;

/** Buttons. `solid` is reserved for the single most important action in view. */
export const btn = (href, label, { variant = 'solid', magnetic = false, cls = '', attrs = '' } = {}) => html`
  <a href="${href}" class="btn btn--${variant} ${cls}" ${magnetic ? 'data-magnetic' : ''} ${attrs}>
    <span class="btn-label">${esc(label)}</span>
    <span class="btn-icon" aria-hidden="true">${icon.arrow('size-3.5')}</span>
  </a>`;

export const linkArrow = (href, label, cls = '') => html`
  <a href="${href}" class="link-arrow ${cls}"><span>${esc(label)}</span>${icon.arrow('size-3.5')}</a>`;

/**
 * Specialist plate: a typographic portrait in an arched frame.
 * If a commissioned portrait is supplied through the CMS, it fills the arch instead.
 */
export const plate = (s, { size = 'md', cls = '', eager = false } = {}) => {
  const [a, b] = [s.initials?.[0] || '', s.initials?.[1] || ''];
  return html`
  <div class="plate plate--${esc(s.tone || 'stone')} plate--${size} ${cls}" aria-hidden="true">
    <div class="plate-arch">
      ${s.portrait
        ? img(s.portrait, { alt: '', sizes: '(min-width: 1024px) 30vw, 80vw', cls: 'plate-photo', priority: eager })
        : `<span class="plate-initials">${esc(a)}<em>${esc(b)}</em></span>`}
    </div>
    <div class="plate-meta"><span>${esc(s.room)}</span><span>${esc(s.discipline)}</span></div>
  </div>`;
};

export const specialistCard = (s, { ctx }) => html`
  <li class="spec-card" data-reveal
      data-discipline="${esc(s.discipline)}"
      data-languages="${esc(s.languages.join('|'))}"
      data-search="${esc([s.name, s.role, s.discipline, ...s.focus, ...s.languages].join(' ').toLowerCase())}">
    <a href="/specialists/${s.slug}/" class="group block">
      ${plate(s)}
      <div class="mt-4 flex items-start justify-between gap-4 sm:mt-5">
        <div>
          <h3 class="font-serif text-[1.15rem] leading-tight font-light tracking-tight sm:text-[1.6rem]">${esc(s.name)}</h3>
          <p class="mt-1 text-[0.8rem] leading-snug text-muted sm:text-[0.95rem]">${esc(s.role)}</p>
        </div>
        <span class="round-arrow max-sm:hidden" aria-hidden="true">${icon.arrow('size-3.5')}</span>
      </div>
      <ul class="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-[0.8rem] text-muted max-sm:hidden">
        ${s.focus.slice(0, 3).map((f) => `<li class="dot-list">${esc(f)}</li>`)}
      </ul>
      <p class="t-meta mt-4 text-muted max-sm:mt-2 max-sm:text-[0.6rem]">Speaks ${esc(s.languages.join(', '))}</p>
    </a>
  </li>`;

/** Directory entry: an editorial row led by the clinician's own words, not a staff card. */
export const specialistRow = (s) => html`
  <li class="spec-row" data-reveal
      data-discipline="${esc(s.discipline)}"
      data-languages="${esc(s.languages.join('|'))}"
      data-search="${esc([s.name, s.role, s.discipline, ...s.focus, ...s.languages].join(' ').toLowerCase())}">
    <a href="/specialists/${s.slug}/" class="spec-row-link group">
      <div class="spec-row-plate">${plate(s, { size: 'xs' })}</div>
      <div class="spec-row-id">
        <p class="t-meta text-brass-deep">${esc(s.discipline)}</p>
        <h3 class="spec-row-name"><span class="underline-grow">${esc(s.name)}</span></h3>
        <p class="mt-1.5 text-[0.95rem] text-ink-soft">${esc(s.role)}</p>
      </div>
      <blockquote class="spec-row-quote"><p>“${esc(s.quote.replace(/^[“"]|[”"]$/g, ''))}”</p></blockquote>
      <div class="spec-row-facts">
        <ul class="text-[0.85rem] leading-relaxed text-ink-soft">${s.focus.slice(0, 3).map((f) => `<li>${esc(f)}</li>`)}</ul>
        <p class="t-meta mt-4 text-muted">Speaks ${esc(s.languages.join(', '))}</p><p class="t-meta mt-1.5 text-muted max-md:hidden">${esc(s.room)}</p>
      </div>
      <span class="round-arrow spec-row-arrow" aria-hidden="true">${icon.arrow('size-3.5')}</span>
    </a>
  </li>`;

export const articleMeta = (a, ctx) => {
  const author = ctx.specialistsBySlug[a.author];
  return html`<p class="t-meta flex flex-wrap items-center gap-x-3 gap-y-1 text-muted">
    <span class="text-brass-deep">${esc(a.category)}</span><span aria-hidden="true">·</span>
    <time datetime="${a.date}">${formatDate(a.date)}</time><span aria-hidden="true">·</span>
    <span>${a.readingTime} min read</span>
    ${author ? `<span class="sr-only">by ${esc(author.name)}</span>` : ''}
  </p>`;
};

export const articleCard = (a, ctx, { variant = 'card', sizes = '(min-width: 1024px) 33vw, 100vw', heading = 'h3' } = {}) => {
  const author = ctx.specialistsBySlug[a.author];
  const H = heading;
  if (variant === 'row') {
    return html`
    <li class="article-row" data-reveal>
      <a href="/journal/${a.slug}/" class="group grid grid-cols-[1fr_5.5rem] items-start gap-6 border-t border-line py-6 sm:grid-cols-[6.5rem_1fr]">
        <div class="img-frame aspect-square w-full sm:order-first max-sm:order-last">${img(a.image, { alt: '', sizes: '7rem', cls: 'img-cover img-zoom' })}</div>
        <div>
          <p class="t-meta text-muted"><span class="text-brass-deep">${esc(a.category)}</span> · ${a.readingTime} min read</p>
          <${H} class="mt-2 font-serif text-[1.3rem] leading-snug font-light tracking-tight md:text-[1.45rem]"><span class="underline-grow">${esc(a.title)}</span></${H}>
          ${author ? `<p class="mt-2 text-[0.82rem] text-muted">${esc(author.name)}</p>` : ''}
        </div>
      </a>
    </li>`;
  }
  return html`
  <article class="article-card group relative" data-reveal>
    <div class="img-frame aspect-[4/5]">${img(a.image, { alt: a.image_alt, sizes, cls: 'img-cover img-zoom' })}</div>
    <div class="mt-5">
      ${articleMeta(a, ctx)}
      <${H} class="mt-3 font-serif text-[1.65rem] leading-[1.15] font-light tracking-tight">
        <a href="/journal/${a.slug}/" class="stretched underline-grow">${esc(a.title)}</a>
      </${H}>
      <p class="mt-3 text-[0.95rem] leading-relaxed text-muted">${esc(a.dek)}</p>
      ${author ? `<p class="mt-4 text-[0.85rem] text-ink-soft">${esc(author.name)} <span class="text-muted">· ${esc(author.role)}</span></p>` : ''}
    </div>
  </article>`;
};

/** Native <details> accordion: accessible without JavaScript, animated where supported. */
export const faqList = (faqs, { cls = '' } = {}) => html`
  <div class="faq ${cls}">
    ${faqs.map((f) => html`
      <details class="faq-item" name="faq">
        <summary>
          <span class="faq-q">${esc(f.q)}</span>
          <span class="faq-icon" aria-hidden="true">${icon.plus('size-3.5')}</span>
        </summary>
        <div class="faq-a"><p>${esc(f.a)}</p></div>
      </details>`)}
  </div>`;

export const breadcrumb = (items) => html`
  <nav aria-label="Breadcrumb" class="breadcrumb">
    <ol>
      ${items.map((it, i) => i < items.length - 1
        ? `<li><a href="${it.href}">${esc(it.label)}</a><span aria-hidden="true">/</span></li>`
        : `<li aria-current="page">${esc(it.label)}</li>`)}
    </ol>
  </nav>`;

/** Closing call to action used across pages. */
export const closingCta = (ctx, { headline, body } = {}) => {
  const c = ctx.home.closing;
  const s = ctx.site;
  return html`
  <section class="closing surface-dark relative overflow-hidden" aria-labelledby="closing-title" data-surface="dark">
    <div class="glow" aria-hidden="true"></div>
    <div class="wrap relative grid gap-16 py-28 md:py-36 lg:grid-cols-12 lg:items-center">
      <div class="lg:col-span-7">
        ${eyebrow('Enquiries')}
        <h2 id="closing-title" class="t-h1 mt-8" data-split>${em(headline || c.headline)}</h2>
        <p class="t-lead mt-8 max-w-[34ch] text-ivory/75" data-reveal>${esc(body || c.body)}</p>
        <div class="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5" data-reveal>
          ${btn('/enquire/', 'Make an enquiry', { variant: 'light', magnetic: true })}
          <a href="tel:${s.phone.replace(/\s/g, '')}" class="link-arrow text-ivory">${icon.phone('size-4')}<span>${esc(s.phone_display)}</span></a>
        </div>
        <dl class="closing-facts mt-16 md:mt-20" data-reveal>
          <div><dt>Reply</dt><dd>The same working day</dd></div>
          <div><dt>Hours</dt><dd>${s.hours.filter((h) => !/closed/i.test(h.time)).map((h) => `${esc(h.days.replace('Monday – Friday', 'Weekdays'))} <span class="text-ivory/65">${esc(h.time)}</span>`).join('<br>')}</dd></div>
          <div><dt>Visit</dt><dd>${esc(s.address.line1)}<br>${esc(s.address.locality)} ${esc(s.address.postcode)}</dd></div>
        </dl>
      </div>
      <figure class="closing-door lg:col-span-4 lg:col-start-9" data-reveal data-module="doorway">
        <div class="relative">
          <div class="closing-arch">
            <div class="closing-view">${img(c.image || 'garden-door', { alt: '', sizes: '(min-width: 1024px) 30vw, 70vw', cls: 'img-cover' })}</div>
            <span class="closing-reveal" aria-hidden="true"></span>
          </div>
          <span class="closing-spill" aria-hidden="true"></span>
        </div>
        <figcaption class="t-meta mt-5 text-ivory/60">${esc(c.caption || 'The garden door, ground floor')}</figcaption>
      </figure>
    </div>
  </section>`;
};

/** Inner-page opening: editorial title with optional image. */
export const pageIntro = ({ eyebrowLabel, title, intro, crumbs, aside = '' }) => html`
  <section class="page-intro wrap pt-36 pb-16 md:pt-48 md:pb-24">
    ${crumbs ? breadcrumb(crumbs) : ''}
    <div class="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
      <div class="lg:col-span-8">
        ${eyebrowLabel ? eyebrow(eyebrowLabel) : ''}
        <h1 class="t-h1 mt-6" data-split>${em(title)}</h1>
      </div>
      ${intro ? `<p class="t-lead text-ink-soft lg:col-span-4 lg:pb-3" data-reveal>${esc(intro)}</p>` : ''}
    </div>
    ${aside}
  </section>`;

export { mark };
