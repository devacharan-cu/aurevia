// Patient journey: the line fills as you read, the current step brightens, the counter follows.
export default function journey(root) {
  const list = root.querySelector('[data-journey-steps]');
  const steps = [...root.querySelectorAll('[data-journey-step]')];
  const fill = root.querySelector('[data-journey-fill]');
  const counter = root.querySelector('[data-journey-current]');
  if (!list || !steps.length) return;

  let raf = 0;
  const update = () => {
    raf = 0;
    const mid = window.innerHeight * 0.55;
    const r = list.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (mid - r.top) / r.height));
    fill?.parentElement.style.setProperty('--p', `${(p * 100).toFixed(2)}%`);
    let active = 0;
    steps.forEach((s, i) => { if (s.getBoundingClientRect().top < mid) active = i; });
    steps.forEach((s, i) => {
      s.classList.toggle('is-active', i === active);
      s.classList.toggle('is-past', i < active);
    });
    if (counter) counter.textContent = String(active + 1).padStart(2, '0');
  };
  window.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
  window.addEventListener('resize', update);
  update();
}
