// Aurevia — entry point.
// Core behaviour runs everywhere; page-specific modules load only when their markup is present.
import { initHeader } from './modules/header.js';
import { initReveal } from './modules/reveal.js';
import { initMagnetic } from './modules/magnetic.js';
import { initParallax } from './modules/parallax.js';
import { initOpenStatus } from './modules/open-status.js';

const root = document.documentElement;

initHeader();
initReveal();
initMagnetic();
initParallax();
initOpenStatus();

// Page modules, keyed by data-module="name" → ./modules/name.js (exports default init(el)).
document.querySelectorAll('[data-module]').forEach((el) => {
  el.dataset.module.split(' ').forEach((name) => {
    import(`./modules/${name}.js`)
      .then((m) => m.default(el))
      .catch((err) => console.warn(`[aurevia] module "${name}" failed`, err));
  });
});

// Opening choreography starts once fonts are ready (avoids reflowing split text).
const ready = () => requestAnimationFrame(() => root.classList.add('is-loaded'));
if (document.fonts?.ready) {
  Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 900))]).then(ready);
} else ready();
