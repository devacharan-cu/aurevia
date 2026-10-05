import { esc, html, icon, pad } from '../templates/helpers.mjs';
import { breadcrumb } from '../templates/components.mjs';
import { layout } from '../templates/layout.mjs';
import { breadcrumbSchema } from './schema.mjs';

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

/**
 * Shared form wrapper. Posts natively to Web3Forms without JavaScript; with JavaScript the
 * form module validates, submits with fetch and shows inline states. If the access key is
 * still the placeholder, the module runs in clearly-labelled demo mode and sends nothing.
 */
export function formShell(ctx, { id, subject, body, cls = '' }) {
  const { site } = ctx;
  const key = site.forms.web3forms_access_key;
  const demo = !key || key.startsWith('YOUR_');
  return html`
  <form id="${id}" class="aurevia-form ${cls}" action="${WEB3FORMS_ENDPOINT}" method="POST" novalidate data-module="enquiry-form" ${demo ? 'data-demo' : ''}>
    <input type="hidden" name="access_key" value="${esc(key)}">
    <input type="hidden" name="subject" value="${esc(site.forms.subject_prefix)}: ${esc(subject)}" data-subject-base="${esc(site.forms.subject_prefix)}: ${esc(subject)}">
    <input type="hidden" name="from_name" value="${esc(site.legal_name)} website">
    <input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
    <div data-form-body>${body}</div>
    <div class="form-error" role="alert" data-form-error hidden>
      <p class="font-serif text-[1.35rem] font-light leading-snug">That didn’t send.</p>
      <p class="mt-2 text-[0.95rem]">Nothing you entered has been lost. Please try again in a moment, or call us on <a class="underline underline-offset-4" href="tel:${site.phone.replace(/\s/g, '')}">${esc(site.phone_display)}</a>.</p>
    </div>
    <div class="form-success" data-form-success hidden tabindex="-1">
      <p class="t-meta text-brass-deep">Received</p>
      <p class="mt-4 font-serif text-[2.2rem] font-light leading-tight" data-success-title>Thank you.</p>
      <p class="mt-4 max-w-[46ch] leading-relaxed text-ink-soft" data-success-body>A coordinator will reply the same working day.</p>
      ${demo ? '<p class="demo-note mt-6">Demo mode: this concept site is not connected to an inbox, so nothing was sent.</p>' : ''}
    </div>
  </form>`;
}

const STEPS = ['What brings you here', 'A little more', 'How to reach you', 'Review and send'];

export default function enquire(ctx) {
  const { site, care, specialists } = ctx;
  const path = '/enquire/';
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Make an enquiry', href: path }];

  const pill = (name, value, label, checked = false, type = 'radio') =>
    `<label class="choice choice--pill"><input type="${type}" name="${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span class="choice-body"><span class="choice-title">${esc(label)}</span><span class="choice-mark"></span></span></label>`;

  const step = (n, title, lead, inner) => html`
    <fieldset class="form-step" data-step="${n}" aria-labelledby="step-${n}-title">
      <p class="t-meta text-brass-deep">Step ${pad(n)} of ${pad(STEPS.length)}</p>
      <legend class="sr-only">${esc(title)}</legend>
      <h2 id="step-${n}-title" class="step-title" tabindex="-1">${title}</h2>
      ${lead ? `<p class="mt-4 max-w-[48ch] text-ink-soft">${lead}</p>` : ''}
      <div class="mt-10">${inner}</div>
    </fieldset>`;

  const body = html`
    <div class="specialist-note" data-specialist-note hidden>
      <span class="t-meta text-muted">You asked about</span>
      <span class="font-serif text-[1.3rem] font-light" data-specialist-name></span>
      <input type="hidden" name="specialist" value="" data-specialist-input>
    </div>

    ${step(1, 'What brings you <em>to Aurevia?</em>', 'Choose whichever is closest. It only helps us route your enquiry; nothing is decided yet.', html`
      <div class="choice-grid md:grid-cols-2" role="radiogroup" aria-required="true" aria-describedby="care-err" data-required-group="care">
        ${care.map((c) => html`
          <label class="choice">
            <input type="radio" name="care" value="${esc(c.title)}" data-slug="${c.slug}">
            <span class="choice-body"><span><span class="choice-title">${esc(c.need)}</span><span class="choice-sub">${esc(c.title)}</span></span><span class="choice-mark"></span></span>
          </label>`)}
        <label class="choice md:col-span-2">
          <input type="radio" name="care" value="Not sure yet" data-slug="unsure">
          <span class="choice-body"><span><span class="choice-title">I’m not sure yet</span><span class="choice-sub">A coordinator will help you decide</span></span><span class="choice-mark"></span></span>
        </label>
      </div>
      <p class="field-error mt-4" id="care-err">Please choose one, or “I’m not sure yet”.</p>`)}

    ${step(2, 'A little <em>more.</em>', 'All optional, and all useful to the coordinator who calls you.', html`
      <fieldset>
        <legend class="field-label">Who is this for?</legend>
        <div class="mt-4 flex flex-wrap gap-2">${pill('for_whom', 'Myself', 'Myself', true)}${pill('for_whom', 'Someone I care for', 'Someone I care for')}${pill('for_whom', 'My organisation', 'My organisation')}</div>
      </fieldset>
      <fieldset class="mt-10">
        <legend class="field-label">How are you likely to pay?</legend>
        <div class="mt-4 flex flex-wrap gap-2">${pill('payment', 'Paying myself', 'Paying myself')}${pill('payment', 'Private medical insurance', 'Insurance')}${pill('payment', 'Not sure yet', 'Not sure yet', true)}</div>
      </fieldset>
      <div class="field mt-10">
        <label class="field-label" for="e-msg">What would you like help with?</label>
        <textarea class="field-input" id="e-msg" name="message" rows="4" maxlength="1200" aria-describedby="e-msg-hint" placeholder="A sentence or two is plenty."></textarea>
        <p class="field-hint" id="e-msg-hint">Please don’t include detailed medical history here. We’ll talk it through on the phone, where it’s private.</p>
      </div>`)}

    ${step(3, 'How should we <em>reach you?</em>', null, html`
      <div class="grid gap-8 md:grid-cols-2">
        <div class="field md:col-span-2"><label class="field-label" for="e-name">Full name</label><input class="field-input" id="e-name" name="name" autocomplete="name" required><p class="field-error" id="e-name-err">Please tell us your name.</p></div>
        <div class="field"><label class="field-label" for="e-email">Email</label><input class="field-input" id="e-email" name="email" type="email" autocomplete="email" inputmode="email" required><p class="field-error" id="e-email-err">Please enter a valid email address.</p></div>
        <div class="field"><label class="field-label" for="e-phone">Phone</label><input class="field-input" id="e-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required data-validate="phone"><p class="field-error" id="e-phone-err">Please enter a phone number, including the country code if outside the UK.</p></div>
      </div>
      <fieldset class="mt-10">
        <legend class="field-label">We’ll reply by</legend>
        <div class="mt-4 flex flex-wrap gap-2">${pill('contact_method', 'Phone call', 'Phone call', true)}${pill('contact_method', 'Email', 'Email')}</div>
      </fieldset>
      <fieldset class="mt-10">
        <legend class="field-label">Best time to call <span class="font-normal text-muted">(London time)</span></legend>
        <div class="mt-4 flex flex-wrap gap-2">${pill('preferred_time', 'Morning, 8–11', 'Morning')}${pill('preferred_time', 'Midday, 11–2', 'Midday')}${pill('preferred_time', 'Afternoon, 2–5', 'Afternoon')}${pill('preferred_time', 'Early evening, 5–7', 'Early evening')}${pill('preferred_time', 'Any time', 'Any time', true)}</div>
      </fieldset>`)}

    ${step(4, 'Review and <em>send.</em>', 'Check the details below. Sending this doesn’t book anything: it asks a coordinator to contact you.', html`
      <dl class="review" data-review></dl>
      <div class="consent mt-10">
        <label class="consent-label">
          <input type="checkbox" name="consent" value="Agreed" required aria-describedby="consent-err">
          <span class="consent-box" aria-hidden="true">${icon.check('size-3')}</span>
          <span>I agree to Aurevia using these details to respond to my enquiry, as described in the <a class="underline underline-offset-4" href="/privacy/">privacy notice</a>.</span>
        </label>
        <p class="field-error mt-3" id="consent-err">Please confirm so we can reply to you.</p>
      </div>`)}

    <div class="form-nav" data-form-nav>
      <button type="button" class="link-arrow link-back" data-prev hidden>${icon.arrow('size-3.5 rotate-180')}<span>Back</span></button>
      <button type="button" class="btn btn--solid" data-next><span class="btn-label">Continue</span><span class="btn-icon" aria-hidden="true">${icon.arrow('size-3.5')}</span></button>
      <button type="submit" class="btn btn--solid" data-submit><span class="btn-label">Send enquiry</span><span class="btn-icon" aria-hidden="true">${icon.arrow('size-3.5')}</span></button>
    </div>`;

  const specialistData = Object.fromEntries(specialists.map((s) => [s.slug, { name: s.name, care: s.care[0] }]));

  const content = html`
  <section class="enquire wrap pt-32 pb-24 md:pt-40 md:pb-32" aria-labelledby="enquire-title">
    ${breadcrumb(crumbs)}
    <div class="mt-10 grid gap-14 lg:grid-cols-12">
      <aside class="lg:col-span-4">
        <div class="lg:sticky lg:top-28">
          <h1 id="enquire-title" class="t-h2" data-split>Begin with a <em>conversation.</em></h1>
          <p class="mt-6 max-w-[34ch] text-ink-soft" data-reveal>Four short steps. A patient coordinator replies the same working day, and nothing is booked until you have agreed the fee.</p>
          <ol class="step-rail mt-12 max-lg:hidden" data-step-rail aria-hidden="true">
            ${STEPS.map((s, i) => `<li data-rail="${i + 1}"><span>${pad(i + 1)}</span>${esc(s)}</li>`)}
          </ol>
          <div class="enquire-assure mt-12 max-lg:hidden">
            <p><span class="t-meta block text-muted">Prefer to talk?</span><a class="font-serif text-[1.4rem] font-light" href="tel:${site.phone.replace(/\s/g, '')}">${esc(site.phone_display)}</a></p>
            <p class="mt-6 text-[0.85rem] leading-relaxed text-muted">${esc(site.urgent_notice)}</p>
          </div>
        </div>
      </aside>
      <div class="lg:col-span-7 lg:col-start-6">
        <div class="step-progress" aria-hidden="true"><span data-step-bar></span></div>
        ${formShell(ctx, { id: 'enquiry-form', subject: 'New patient enquiry', body, cls: 'is-stepped' })}
        <p class="urgent urgent--light mt-14 lg:hidden" role="note">${icon.phone('size-4 shrink-0')}<span>${esc(site.urgent_notice)}</span></p>
      </div>
    </div>
    <script type="application/json" id="specialist-data">${JSON.stringify(specialistData)}</script>
  </section>`;

  return [{
    path,
    html: layout(ctx, {
      id: 'enquire', path, title: 'Make an enquiry',
      description: 'Make an enquiry with Aurevia Private Medical. Four short steps; a patient coordinator replies the same working day, and nothing is booked until you have agreed the fee.',
      jsonld: [breadcrumbSchema(site, crumbs)],
    }, content),
  }];
}
