// Forms: validation, the guided multi-step enquiry, and Web3Forms submission.
// Without JavaScript every step is visible and the form posts natively to Web3Forms.
// With a placeholder access key the form runs in demo mode and says so; nothing is sent.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LABELS = {
  care: 'Area of interest', specialist: 'Clinician', for_whom: 'For', payment: 'Payment', message: 'Message',
  name: 'Name', email: 'Email', phone: 'Phone', contact_method: 'Reply by', preferred_time: 'Best time',
};

export default function enquiryForm(form) {
  const stepped = form.classList.contains('is-stepped');
  const demo = form.hasAttribute('data-demo');
  const steps = [...form.querySelectorAll('[data-step]')];
  const prevBtn = form.querySelector('[data-prev]');
  const nextBtn = form.querySelector('[data-next]');
  const submitBtn = form.querySelector('[data-submit]');
  const errorBox = form.querySelector('[data-form-error]');
  const successBox = form.querySelector('[data-form-success]');
  const bodyBox = form.querySelector('[data-form-body]');
  const bar = document.querySelector('[data-step-bar]');
  const rail = [...document.querySelectorAll('[data-rail]')];
  let current = 0;
  let attempted = false;

  /* ---------- Validation ---------- */
  const fieldValid = (input) => {
    const v = (input.value || '').trim();
    if (input.type === 'checkbox') return !input.required || input.checked;
    if (input.required && !v) return false;
    if (input.type === 'email' && v && !EMAIL.test(v)) return false;
    if (input.dataset.validate === 'phone' && v && v.replace(/\D/g, '').length < 7) return false;
    return true;
  };

  const mark = (input, ok) => {
    const errId = `${input.id || input.name}-err`;
    const err = document.getElementById(errId) || (input.name === 'consent' ? document.getElementById('consent-err') : null);
    input.setAttribute('aria-invalid', String(!ok));
    if (err) {
      const describedBy = new Set((input.getAttribute('aria-describedby') || '').split(' ').filter(Boolean));
      ok ? describedBy.delete(err.id) : describedBy.add(err.id);
      describedBy.size ? input.setAttribute('aria-describedby', [...describedBy].join(' ')) : input.removeAttribute('aria-describedby');
      err.classList.toggle('is-visible', !ok);
    }
    input.closest('.field')?.classList.toggle('is-invalid', !ok);
  };

  const validate = (scope) => {
    let firstBad = null;
    scope.querySelectorAll('input:not([type=hidden]):not([type=radio]):not(.hp), textarea').forEach((input) => {
      const ok = fieldValid(input);
      mark(input, ok);
      if (!ok && !firstBad) firstBad = input;
    });
    scope.querySelectorAll('[data-required-group]').forEach((group) => {
      const ok = !!group.querySelector('input:checked');
      const err = document.getElementById(group.getAttribute('aria-describedby'));
      err?.classList.toggle('is-visible', !ok);
      group.setAttribute('aria-invalid', String(!ok));
      if (!ok && !firstBad) firstBad = group.querySelector('input');
    });
    if (firstBad) firstBad.focus();
    return !firstBad;
  };

  form.addEventListener('input', (e) => {
    if (!attempted) return;
    const t = e.target;
    if (t.type === 'radio') {
      const group = t.closest('[data-required-group]');
      if (group) { document.getElementById(group.getAttribute('aria-describedby'))?.classList.remove('is-visible'); group.setAttribute('aria-invalid', 'false'); }
    } else if (t.matches('input, textarea')) mark(t, fieldValid(t));
  });
  form.addEventListener('change', (e) => { if (attempted && e.target.type === 'checkbox') mark(e.target, fieldValid(e.target)); });

  /* ---------- Steps ---------- */
  const goTo = (i, { focus = true } = {}) => {
    current = Math.max(0, Math.min(steps.length - 1, i));
    steps.forEach((s, k) => s.classList.toggle('is-current', k === current));
    rail.forEach((r, k) => { r.classList.toggle('is-current', k === current); r.classList.toggle('is-done', k < current); });
    if (bar) bar.style.width = `${((current + 1) / steps.length) * 100}%`;
    prevBtn.hidden = current === 0;
    nextBtn.hidden = current === steps.length - 1;
    submitBtn.hidden = current !== steps.length - 1;
    if (current === steps.length - 1) buildReview();
    attempted = false;
    if (focus) {
      const title = steps[current].querySelector('.step-title');
      const top = form.getBoundingClientRect().top + window.scrollY - 140;
      if (window.scrollY > top) window.scrollTo({ top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      title?.focus({ preventScroll: true });
    }
  };

  const buildReview = () => {
    const review = form.querySelector('[data-review]');
    if (!review) return;
    const data = new FormData(form);
    const stepOf = (name) => steps.findIndex((s) => s.querySelector(`[name="${name}"]`));
    review.innerHTML = '';
    Object.entries(LABELS).forEach(([name, label]) => {
      const value = data.getAll(name).filter(Boolean).join(', ');
      if (!value) return;
      const row = document.createElement('div');
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = label;
      dd.textContent = value;
      row.append(dt, dd);
      const s = stepOf(name);
      if (s >= 0) {
        const edit = document.createElement('button');
        edit.type = 'button';
        edit.className = 'review-edit';
        edit.textContent = 'Edit';
        edit.setAttribute('aria-label', `Edit ${label.toLowerCase()}`);
        edit.addEventListener('click', () => goTo(s));
        row.append(edit);
      }
      review.append(row);
    });
  };

  if (stepped) {
    form.classList.add('is-enhanced');
    nextBtn.addEventListener('click', () => {
      attempted = true;
      if (validate(steps[current])) goTo(current + 1);
    });
    prevBtn.addEventListener('click', () => goTo(current - 1));
    // Enter moves forward rather than submitting early.
    form.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.tagName === 'INPUT' && current < steps.length - 1) { e.preventDefault(); nextBtn.click(); }
    });
    prefill();
    goTo(0, { focus: false });
  }

  /* ---------- Deep links: ?care=slug, ?specialist=slug ---------- */
  function prefill() {
    const params = new URLSearchParams(location.search);
    let careSlug = params.get('care');
    const specSlug = params.get('specialist');
    if (specSlug) {
      try {
        const data = JSON.parse(document.getElementById('specialist-data').textContent)[specSlug];
        if (data) {
          const note = form.querySelector('[data-specialist-note]');
          note.hidden = false;
          note.querySelector('[data-specialist-name]').textContent = data.name;
          note.querySelector('[data-specialist-input]').value = data.name;
          careSlug = careSlug || data.care;
        }
      } catch { /* no specialist data */ }
    }
    if (careSlug) {
      const radio = form.querySelector(`input[name="care"][data-slug="${CSS.escape(careSlug)}"]`);
      if (radio) radio.checked = true;
    }
  }

  /* ---------- Submission ---------- */
  const setBusy = (busy) => {
    form.setAttribute('aria-busy', String(busy));
    submitBtn.disabled = busy;
    submitBtn.classList.toggle('is-loading', busy);
    submitBtn.querySelector('.btn-label').textContent = busy ? 'Sending…' : submitBtn.dataset.label;
  };
  submitBtn.dataset.label = submitBtn.querySelector('.btn-label').textContent;

  const replyWindow = () => {
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short', hour: 'numeric', hour12: false }).formatToParts(new Date()).map((p) => [p.type, p.value]));
    const weekday = !['Sat', 'Sun'].includes(parts.weekday);
    return weekday && Number(parts.hour) < 17 ? 'later today' : 'on the next working day';
  };

  const showSuccess = (data) => {
    const first = (data.get('name') || '').trim().split(/\s+/)[0];
    const title = successBox.querySelector('[data-success-title]');
    const body = successBox.querySelector('[data-success-body]');
    title.textContent = first ? `Thank you, ${first}.` : 'Thank you.';
    if (stepped) {
      const byPhone = data.get('contact_method') === 'Phone call';
      const time = data.get('preferred_time');
      body.textContent = `Your enquiry has reached our coordinators. One of them will ${byPhone ? `call you on ${data.get('phone')}` : `email you at ${data.get('email')}`} ${replyWindow()}${byPhone && time && time !== 'Any time' ? `, aiming for your preferred time (${time.split(',')[0].toLowerCase()})` : ''}. This is not an appointment yet: nothing is booked until you have spoken and agreed the fee.`;
    } else {
      body.textContent = `We’ll reply to ${data.get('email')} ${replyWindow()}.`;
    }
    bodyBox.hidden = true;
    form.querySelector('[data-form-nav]')?.setAttribute('hidden', '');
    document.querySelector('.step-progress')?.setAttribute('hidden', '');
    rail.forEach((r) => { r.classList.remove('is-current'); r.classList.add('is-done'); });
    submitBtn.hidden = true;
    errorBox.hidden = true;
    successBox.hidden = false;
    successBox.focus();
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    attempted = true;
    const scope = stepped ? steps[current] : form;
    if (!validate(scope)) return;
    if (stepped && current !== steps.length - 1) return;
    if (form.querySelector('.hp')?.checked) return; // bot

    const data = new FormData(form);
    const subject = form.querySelector('[name="subject"]');
    subject.value = `${subject.dataset.subjectBase} — ${data.get('name') || ''}${data.get('care') ? ` (${data.get('care')})` : ''}`;

    errorBox.hidden = true;
    setBusy(true);
    try {
      if (demo) {
        await new Promise((r) => setTimeout(r, 1100));
      } else {
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(Object.fromEntries(new FormData(form))),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || !json.success) throw new Error(json.message || `HTTP ${res.status}`);
      }
      setBusy(false);
      showSuccess(data);
    } catch (err) {
      console.warn('[aurevia] form submission failed', err);
      setBusy(false);
      errorBox.hidden = false;
      errorBox.focus?.();
    }
  });
}
