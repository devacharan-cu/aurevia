// Specialist directory: filter by area, language and free text. State is mirrored in the URL
// (?area=Heart&lang=Portuguese&q=sleep) so a filtered view can be shared or bookmarked.
export default function specialistFilter(root) {
  const chips = [...root.querySelectorAll('[data-filter-discipline]')];
  const lang = root.querySelector('[data-filter-language]');
  const search = root.querySelector('[data-filter-search]');
  const cards = [...root.querySelectorAll('[data-filter-list] > li')];
  const status = root.querySelector('[data-filter-status]');
  const empty = root.querySelector('[data-filter-empty]');
  const reset = root.querySelector('[data-filter-reset]');

  const params = new URLSearchParams(location.search);
  const state = { area: params.get('area') || '', lang: params.get('lang') || '', q: params.get('q') || '' };

  const apply = ({ push = true } = {}) => {
    const q = state.q.trim().toLowerCase();
    let shown = 0;
    cards.forEach((card) => {
      const ok = (!state.area || card.dataset.discipline === state.area)
        && (!state.lang || card.dataset.languages.split('|').includes(state.lang))
        && (!q || q.split(/\s+/).every((t) => card.dataset.search.includes(t)));
      card.hidden = !ok;
      if (ok) { shown++; card.classList.add('is-in'); }
    });
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.filterDiscipline === state.area)));
    lang.value = state.lang;
    if (search.value !== state.q) search.value = state.q;
    empty.hidden = shown > 0;
    status.textContent = shown === cards.length ? `Showing all ${cards.length} clinicians` : `Showing ${shown} of ${cards.length} clinicians`;

    if (push) {
      const p = new URLSearchParams();
      if (state.area) p.set('area', state.area);
      if (state.lang) p.set('lang', state.lang);
      if (state.q) p.set('q', state.q);
      history.replaceState(null, '', `${location.pathname}${p.size ? `?${p}` : ''}`);
    }
  };

  chips.forEach((chip) => chip.addEventListener('click', () => { state.area = chip.dataset.filterDiscipline; apply(); }));
  lang.addEventListener('change', () => { state.lang = lang.value; apply(); });
  let t;
  search.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { state.q = search.value; apply(); }, 120); });
  reset?.addEventListener('click', () => { Object.assign(state, { area: '', lang: '', q: '' }); apply(); chips[0].focus(); });

  apply({ push: false });
}
