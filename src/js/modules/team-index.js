// Specialist index: on fine pointers a portrait plate follows the cursor across the list.
// Purely decorative (aria-hidden); every row is a normal link.
export default function teamIndex(list) {
  if (!window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)').matches) return;
  const float = document.querySelector('[data-team-float]');
  if (!float) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let x = 0, y = 0, cx = 0, cy = 0, raf = 0, current = null;

  const loop = () => {
    cx += (x - cx) * (reduced ? 1 : 0.14);
    cy += (y - cy) * (reduced ? 1 : 0.14);
    float.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -55%) rotate(${reduced ? 0 : ((x - cx) * 0.03).toFixed(2)}deg)`;
    raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.3 ? requestAnimationFrame(loop) : 0;
  };

  list.querySelectorAll('[data-team-link]').forEach((link) => {
    link.addEventListener('pointerenter', (e) => {
      const plate = document.getElementById(link.dataset.plateId);
      if (current !== plate) {
        current?.classList.remove('is-current');
        plate?.classList.add('is-current');
        current = plate;
      }
      if (!float.classList.contains('is-visible')) { cx = x = e.clientX; cy = y = e.clientY; }
      float.classList.add('is-visible');
    });
  });
  list.addEventListener('pointermove', (e) => {
    x = e.clientX + 120; y = e.clientY;
    // Re-show after a scroll hid it, if the pointer is still over a row.
    const link = e.target.closest('[data-team-link]');
    if (link && !float.classList.contains('is-visible')) link.dispatchEvent(new PointerEvent('pointerenter', e));
    if (!raf) raf = requestAnimationFrame(loop);
  });
  list.addEventListener('pointerleave', () => float.classList.remove('is-visible'));
  window.addEventListener('scroll', () => float.classList.remove('is-visible'), { passive: true });
}
