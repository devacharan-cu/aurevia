// Header: solid state after the fold, hides on scroll down, returns on scroll up.
// Mobile menu: focus trap, Escape to close, scroll lock.
export function initHeader() {
  const header = document.querySelector('[data-header]');
  const menu = document.querySelector('[data-menu]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const bar = document.querySelector('[data-mobile-bar]');
  if (!header) return;

  const hero = document.querySelector('.hero');
  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    const threshold = hero ? hero.offsetHeight - 90 : 40;
    header.classList.toggle('is-solid', y > (hero ? threshold : 40));
    const goingDown = y > lastY + 4;
    const goingUp = y < lastY - 4;
    if (y > 500 && goingDown) header.classList.add('is-hidden');
    else if (goingUp || y < 200) header.classList.remove('is-hidden');
    if (bar) bar.classList.toggle('is-visible', y > window.innerHeight * 0.6);
    lastY = y;
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();

  if (!menu || !toggle) return;
  const label = toggle.querySelector('.menu-toggle-label');
  let lastFocus = null;

  const focusables = () => [...header.querySelectorAll('a, button'), ...menu.querySelectorAll('a, button')]
    .filter((el) => el.offsetParent !== null);

  const open = () => {
    lastFocus = document.activeElement;
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add('is-open'));
    document.documentElement.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
    toggle.setAttribute('aria-expanded', 'true');
    label.textContent = 'Close';
    menu.querySelector('a')?.focus({ preventScroll: true });
  };
  const close = ({ restore = true } = {}) => {
    menu.classList.remove('is-open');
    document.documentElement.classList.remove('menu-open');
    document.body.style.overflow = '';
    toggle.setAttribute('aria-expanded', 'false');
    label.textContent = 'Menu';
    setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 800);
    if (restore) (lastFocus || toggle).focus({ preventScroll: true });
  };

  toggle.addEventListener('click', () => (toggle.getAttribute('aria-expanded') === 'true' ? close() : open()));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) close({ restore: false }); });
  document.addEventListener('keydown', (e) => {
    if (!menu.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') {
      const items = focusables();
      const first = items[0], last = items.at(-1);
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => { if (e.matches && menu.classList.contains('is-open')) close({ restore: false }); });
}
