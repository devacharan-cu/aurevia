// Scroll reveals, masked headline reveals, and the "illuminate" statement.
// Content is fully visible without JS; the hidden starting states only exist under `.js`.
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Wrap each word in a mask so headlines rise into place. Preserves <em> and <br>. */
function splitWords(el) {
  let i = 0;
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(document.createTextNode(' ')); return; }
          const w = document.createElement('span');
          w.className = 'w';
          const inner = document.createElement('span');
          inner.className = 'wi';
          inner.style.setProperty('--i', i++);
          inner.textContent = part;
          w.append(inner);
          frag.append(w);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
        walk(child);
      }
    });
  };
  walk(el);
}

export function initReveal() {
  const splits = document.querySelectorAll('[data-split]');
  splits.forEach(splitWords);

  const targets = [...document.querySelectorAll('[data-reveal], [data-split]')];
  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach((el) => {
      // The hero headline is choreographed with page load instead.
      if (el.dataset.split === 'hero') return;
      io.observe(el);
    });
    const heroTitle = document.querySelector('[data-split="hero"]');
    if (heroTitle) {
      const start = () => setTimeout(() => heroTitle.classList.add('is-in'), 250);
      document.documentElement.classList.contains('is-loaded')
        ? start()
        : new MutationObserver((_, obs) => { if (document.documentElement.classList.contains('is-loaded')) { obs.disconnect(); start(); } })
            .observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    }
  }

  document.querySelectorAll('[data-illuminate]').forEach(initIlluminate);
}

/** A statement whose words brighten as it passes through the viewport, like light moving across a room. */
function initIlluminate(el) {
  if (reduced) return;
  const words = [];
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(document.createTextNode(' ')); return; }
          const s = document.createElement('span');
          s.className = 'lw';
          s.textContent = part;
          words.push(s);
          frag.append(s);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) walk(child);
    });
  };
  walk(el);

  let raf = 0;
  const update = () => {
    raf = 0;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    // progress 0 when the block's top reaches 85% of the viewport, 1 when its bottom reaches 55%
    const start = vh * 0.85, end = vh * 0.5;
    const p = Math.min(1, Math.max(0, (start - r.top) / (start - end + r.height)));
    const lit = p * words.length * 1.15;
    words.forEach((w, i) => {
      const o = Math.min(1, Math.max(0.16, lit - i + 0.16));
      w.style.setProperty('--o', o.toFixed(3));
    });
  };
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) window.addEventListener('scroll', onScroll, { passive: true });
    else window.removeEventListener('scroll', onScroll);
  });
  io.observe(el);
  update();
}
