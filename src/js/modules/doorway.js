// The closing doorway behaves like an opening in a wall: as the pointer moves, the garden
// beyond shifts against the frame (near/far parallax) and light pools towards the viewer.
export default function doorway(el) {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const still = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!fine.matches || still.matches) return;
  const zone = el.closest('section') || el;
  let tx = 0, ty = 0, x = 0, y = 0, raf = 0;

  const loop = () => {
    x += (tx - x) * 0.07;
    y += (ty - y) * 0.07;
    el.style.setProperty('--dx', x.toFixed(4));
    el.style.setProperty('--dy', y.toFixed(4));
    raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.0005 ? requestAnimationFrame(loop) : 0;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };

  zone.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)));
    ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2)));
    kick();
  });
  zone.addEventListener('pointerleave', () => { tx = 0; ty = 0; kick(); });
  el.classList.add('is-live');
}
