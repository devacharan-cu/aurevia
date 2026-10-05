// Care browser. Semantically an accordion (button + region), so it works for every input and
// screen reader. On large screens CSS presents it as a list/detail view; one area is always open.
export default function careBrowser(root) {
  const tabs = [...root.querySelectorAll('[data-care-tab]')];
  const desktop = window.matchMedia('(min-width: 1024px)');

  const panelOf = (tab) => document.getElementById(tab.getAttribute('aria-controls'));

  const select = (tab, { focus = false } = {}) => {
    const isOpen = tab.getAttribute('aria-expanded') === 'true';
    // On small screens a second tap closes; on desktop one area always stays open.
    if (isOpen && !desktop.matches) {
      tab.setAttribute('aria-expanded', 'false');
      panelOf(tab).removeAttribute('data-open');
      return;
    }
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-expanded', String(on));
      panelOf(t).toggleAttribute('data-open', on);
    });
    if (focus) tab.focus();
    if (!desktop.matches) {
      // Keep the opened item in view on phones.
      requestAnimationFrame(() => {
        const top = tab.getBoundingClientRect().top;
        if (top < 70 || top > window.innerHeight * 0.6) window.scrollBy({ top: top - 90, behavior: 'smooth' });
      });
    }
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      if (!desktop.matches) return;
      const next = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      select(tabs[(next + tabs.length) % tabs.length], { focus: true });
    });
  });

  // If the viewport grows to desktop with nothing open, open the first area.
  desktop.addEventListener('change', (e) => {
    if (e.matches && !tabs.some((t) => t.getAttribute('aria-expanded') === 'true')) select(tabs[0]);
  });
}
