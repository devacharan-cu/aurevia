// Gentle parallax for elements marked data-parallax="0.1" (fraction of viewport travel).
export function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const items = [...document.querySelectorAll('[data-parallax]')];
  const hero = document.querySelector('[data-hero-media]');
  if (!items.length && !hero) return;

  const visible = new Set();
  const io = new IntersectionObserver((entries) => entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target))), { rootMargin: '10% 0px' });
  items.forEach((el) => io.observe(el));

  let raf = 0;
  const update = () => {
    raf = 0;
    const vh = window.innerHeight;
    visible.forEach((el) => {
      // <picture> is display: contents, so measure the frame that contains it.
      const frame = el.parentElement.tagName === 'PICTURE' ? el.parentElement.parentElement : el.parentElement;
      const r = frame.getBoundingClientRect();
      const progress = (r.top + r.height / 2 - vh / 2) / vh; // -1 … 1 around centre
      el.style.transform = `translate3d(0, ${(progress * parseFloat(el.dataset.parallax) * -100).toFixed(2)}%, 0)`;
    });
    // Hero: the image drifts slower than the page, the content softens as it leaves.
    if (hero && window.scrollY < vh * 1.2) {
      hero.style.transform = `translate3d(0, ${(window.scrollY * 0.28).toFixed(1)}px, 0)`;
    }
  };
  window.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
  update();
}
