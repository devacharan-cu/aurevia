// "A walk through the house": on large screens vertical scroll drives a horizontal track while
// the section is pinned. Elsewhere (touch, small screens, reduced motion) it is a native
// scroll-snap strip, which is already a good experience on its own.
export default function houseGallery(root) {
  const viewport = root.querySelector('[data-house-viewport]');
  const track = root.querySelector('[data-house-track]');
  const fill = root.querySelector('[data-house-fill]');
  const pin = root.querySelector('[data-house-pin]');
  // Landscape and tall enough only: a portrait tablet reads better as a swipeable strip.
  const mq = window.matchMedia('(min-width: 1024px) and (min-aspect-ratio: 5/4) and (min-height: 640px) and (prefers-reduced-motion: no-preference)');
  let distance = 0;
  let raf = 0;

  const setProgress = (p) => fill?.parentElement.style.setProperty('--p', `${(p * 100).toFixed(2)}%`);

  const measure = () => {
    if (!mq.matches) {
      root.classList.remove('is-pinned');
      root.style.removeProperty('--house-h');
      track.style.transform = '';
      return;
    }
    root.classList.add('is-pinned');
    distance = Math.max(0, track.scrollWidth - window.innerWidth);
    root.style.setProperty('--house-h', `${window.innerHeight + distance}px`);
    update();
  };

  const update = () => {
    raf = 0;
    if (!mq.matches) return;
    const r = root.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight || 1)));
    track.style.transform = `translate3d(${(-p * distance).toFixed(1)}px, 0, 0)`;
    setProgress(p);
  };

  // Native strip progress
  viewport.addEventListener('scroll', () => {
    if (mq.matches) return;
    const max = viewport.scrollWidth - viewport.clientWidth;
    setProgress(max > 0 ? viewport.scrollLeft / max : 0);
  }, { passive: true });

  // Keyboard: when focused, arrow keys move between rooms in either mode.
  viewport.addEventListener('keydown', (e) => {
    if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    e.preventDefault();
    const dir = e.key === 'ArrowRight' ? 1 : -1;
    if (mq.matches) window.scrollBy({ top: dir * window.innerWidth * 0.35, behavior: 'smooth' });
    else viewport.scrollBy({ left: dir * viewport.clientWidth * 0.8, behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
  window.addEventListener('resize', measure);
  mq.addEventListener('change', measure);
  // Images can change the track width once loaded.
  track.querySelectorAll('img').forEach((img) => img.complete || img.addEventListener('load', measure, { once: true }));
  measure();
  void pin;
}
