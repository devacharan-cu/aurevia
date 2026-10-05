import { esc, html, pad } from '../templates/helpers.mjs';
import { eyebrow, linkArrow, closingCta, pageIntro } from '../templates/components.mjs';
import { layout } from '../templates/layout.mjs';
import { breadcrumbSchema } from './schema.mjs';

const BILLING = [
  { title: 'Quoted before arranged', detail: 'The fees below cover the appointments themselves. Tests, imaging and procedures are quoted in writing before they are booked.' },
  { title: 'Insurance', detail: 'For specialist and diagnostic care we bill most UK private medical insurers directly. Any excess or shortfall is yours, and we will tell you if we expect one.' },
  { title: 'Paying yourself', detail: 'Payment is taken at the end of each visit, by card or bank transfer. Memberships can be paid annually or monthly.' },
  { title: 'Changing plans', detail: 'Appointments can be moved free of charge with 48 hours’ notice. Later cancellations are charged at half the fee, and never for illness or emergencies.' },
  { title: 'No small print', detail: 'We don’t charge for routine letters to your GP, for repeat prescriptions for members, or for calling us with a question.' },
];

export default function fees(ctx) {
  const { care, site } = ctx;
  const path = '/fees/';
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Fees', href: path }];

  const content = html`
  ${pageIntro({
    crumbs,
    eyebrowLabel: 'Fees',
    title: 'Every fee, *published in full.*',
    intro: 'Uncertainty about cost is its own kind of anxiety. These are our fees, and anything not listed here is quoted in writing before it is arranged.',
  })}

  <section class="wrap pb-20" aria-label="Fees by area of care">
    <nav class="fees-nav" aria-label="Jump to area">
      ${care.map((c, i) => `<a href="#fees-${c.slug}"><span>${pad(i + 1)}</span>${esc(c.title)}</a>`)}
    </nav>
    <div class="mt-16 grid gap-20">
      ${care.map((c, i) => html`
        <section id="fees-${c.slug}" class="grid gap-8 border-t border-line pt-10 lg:grid-cols-12" aria-labelledby="fees-h-${c.slug}" data-reveal>
          <div class="lg:col-span-4">
            <p class="font-serif text-[1rem] italic text-brass-deep">${pad(i + 1)}</p>
            <h2 id="fees-h-${c.slug}" class="mt-2 font-serif text-[2rem] leading-tight font-light">${esc(c.title)}</h2>
            ${linkArrow(`/care/${c.slug}/`, 'What’s included', 'mt-5')}
          </div>
          <table class="fee-table lg:col-span-7 lg:col-start-6">
            <caption class="sr-only">${esc(c.title)} fees</caption>
            <thead class="sr-only"><tr><th scope="col">Service</th><th scope="col">Fee</th></tr></thead>
            <tbody>
              ${c.fees.map((f) => `<tr><th scope="row"><span class="fee-item">${esc(f.item)}</span>${f.note ? `<span class="fee-note">${esc(f.note)}</span>` : ''}</th><td>${esc(f.fee)}</td></tr>`)}
            </tbody>
          </table>
        </section>`)}
    </div>
    <p class="mt-16 text-[0.82rem] text-muted">Fees shown are illustrative, created for a fictional practice.</p>
  </section>

  <section class="surface-ivory py-24 md:py-32" aria-labelledby="billing-title">
    <div class="wrap grid gap-12 lg:grid-cols-12">
      <div class="lg:col-span-4">${eyebrow('Billing')}<h2 id="billing-title" class="t-h2 mt-6" data-split>How billing <em>works.</em></h2></div>
      <dl class="billing lg:col-span-7 lg:col-start-6">
        ${BILLING.map((b) => `<div data-reveal><dt>${esc(b.title)}</dt><dd>${esc(b.detail)}</dd></div>`)}
      </dl>
    </div>
  </section>
  ${closingCta(ctx)}`;

  return [{
    path,
    html: layout(ctx, {
      id: 'fees', path, title: 'Fees',
      description: 'Aurevia publishes every fee: memberships, health assessments, specialist consultations, diagnostics, women’s health and organisation programmes, plus how insurance and billing work.',
      jsonld: [breadcrumbSchema(site, crumbs)],
    }, content),
  }];
}
