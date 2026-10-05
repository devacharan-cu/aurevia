import { esc, html, img, icon, hoursMap } from '../templates/helpers.mjs';
import { eyebrow, btn, linkArrow, pageIntro } from '../templates/components.mjs';
import { layout } from '../templates/layout.mjs';
import { breadcrumbSchema, clinicSchema } from './schema.mjs';
import { formShell } from './enquire.mjs';

export default function contact(ctx) {
  const { site } = ctx;
  const a = site.address;
  const path = '/contact/';
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Contact', href: path }];
  const tel = site.phone.replace(/\s/g, '');

  const content = html`
  ${pageIntro({
    crumbs,
    eyebrowLabel: 'Contact',
    title: 'Visit, call, *or write.*',
    intro: 'To arrange care, the enquiry form is quickest. For anything else, including records, invoices and press, write to us below or call reception.',
  })}

  <section class="wrap pb-24 md:pb-32" aria-label="Contact details">
    <div class="grid gap-14 lg:grid-cols-12">
      <div class="lg:col-span-5">
        <div class="img-frame arch-frame aspect-[4/5]">${img('reception', { alt: 'The reception desk of fluted oak, an olive tree in a pot beside it', sizes: '(min-width: 1024px) 38vw, 100vw', cls: 'img-cover', priority: true })}</div>
      </div>
      <div class="lg:col-span-6 lg:col-start-7">
        <dl class="contact-list">
          <div data-reveal>
            <dt>Call reception</dt>
            <dd><a href="tel:${tel}" class="contact-big">${esc(site.phone_display)}</a><span class="mt-1 block text-[0.9rem] text-muted" data-open-status='${JSON.stringify(hoursMap(site.hours))}'>Weekdays ${esc(site.hours[0].time)}</span></dd>
          </div>
          <div data-reveal>
            <dt>Write</dt>
            <dd><a href="mailto:${site.email}" class="contact-big [overflow-wrap:anywhere]">${esc(site.email)}</a><span class="mt-1 block text-[0.9rem] text-muted">Replied to the same working day. Please don’t send detailed medical information by email.</span></dd>
          </div>
          <div data-reveal>
            <dt>Visit</dt>
            <dd>
              <address class="not-italic font-serif text-[1.5rem] leading-snug font-light">${esc(a.line1)}<br>${esc(a.locality)}, ${esc(a.city)} ${esc(a.postcode)}</address>
              <ul class="mt-4 grid gap-1 text-[0.92rem] text-ink-soft">${site.stations.map((s) => `<li>${esc(s.name)} station · ${esc(s.walk)}</li>`)}</ul>
              <p class="mt-4 text-[0.92rem] leading-relaxed text-muted">Step-free access through the mews entrance, with a lift to every floor. Pay-and-display parking on nearby streets; we can reserve the mews bay for patients with limited mobility.</p>
            </dd>
          </div>
          <div data-reveal>
            <dt>Hours</dt>
            <dd><ul class="grid gap-1">${site.hours.map((h) => `<li class="flex max-w-xs justify-between gap-6"><span>${esc(h.days)}</span><span class="tabular-nums text-muted">${esc(h.time)}</span></li>`)}</ul></dd>
          </div>
        </dl>
        <div class="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4" data-reveal>
          ${btn('/enquire/', 'Arrange care', { magnetic: true })}
          ${linkArrow('/fees/', 'Fees and insurance')}
        </div>
        <p class="urgent urgent--light mt-10" role="note">${icon.phone('size-4 shrink-0')}<span>${esc(site.urgent_notice)}</span></p>
      </div>
    </div>
  </section>

  <section class="surface-ivory py-24 md:py-32" aria-labelledby="general-title">
    <div class="wrap grid gap-12 lg:grid-cols-12">
      <div class="lg:col-span-4">
        ${eyebrow('General enquiries')}
        <h2 id="general-title" class="t-h2 mt-6" data-split>Something <em>else?</em></h2>
        <p class="mt-6 max-w-[34ch] text-ink-soft" data-reveal>Records requests, invoices, press or feedback. For appointments, <a class="underline underline-offset-4" href="/enquire/">use the enquiry form</a> instead: it reaches the right coordinator faster.</p>
      </div>
      <div class="lg:col-span-7 lg:col-start-6" data-reveal>
        ${formShell(ctx, { id: 'contact-form', subject: 'General enquiry', body: html`
          <div class="grid gap-8 md:grid-cols-2">
            <div class="field"><label class="field-label" for="c-name">Your name</label><input class="field-input" id="c-name" name="name" autocomplete="name" required><p class="field-error" id="c-name-err">Please tell us your name.</p></div>
            <div class="field"><label class="field-label" for="c-email">Email</label><input class="field-input" id="c-email" name="email" type="email" autocomplete="email" required><p class="field-error" id="c-email-err">Please enter an email address we can reply to.</p></div>
          </div>
          <fieldset class="mt-10">
            <legend class="field-label">About</legend>
            <div class="mt-4 flex flex-wrap gap-2">
              ${['Records request', 'Invoice or payment', 'Press', 'Feedback', 'Something else'].map((t, i) => `<label class="choice choice--pill"><input type="radio" name="topic" value="${t}" ${i === 0 ? 'checked' : ''}><span class="choice-body"><span class="choice-title">${t}</span><span class="choice-mark"></span></span></label>`)}
            </div>
          </fieldset>
          <div class="field mt-10"><label class="field-label" for="c-msg">Message</label><textarea class="field-input" id="c-msg" name="message" rows="4" required></textarea><p class="field-error" id="c-msg-err">Please add a short message.</p></div>
          <div class="mt-10 flex flex-wrap items-center justify-between gap-6">
            <p class="max-w-[40ch] text-[0.82rem] text-muted">We use your details only to reply. <a class="underline underline-offset-4" href="/privacy/">Privacy notice</a>.</p>
            <button type="submit" class="btn btn--solid" data-submit><span class="btn-label">Send message</span><span class="btn-icon" aria-hidden="true">${icon.arrow('size-3.5')}</span></button>
          </div>` })}
      </div>
    </div>
  </section>`;

  return [{
    path,
    html: layout(ctx, {
      id: 'contact', path, title: 'Contact',
      description: `Contact Aurevia Private Medical: ${a.line1}, ${a.locality}, ${a.city} ${a.postcode}. Call ${site.phone_display} or write to ${site.email}. Open weekdays ${site.hours[0].time}.`,
      jsonld: [breadcrumbSchema(site, crumbs), clinicSchema(ctx)],
    }, content),
  }];
}
