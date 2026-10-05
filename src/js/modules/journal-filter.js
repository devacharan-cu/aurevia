// Journal topics: a light client-side filter over the article grid.
export default function journalFilter(root) {
  const chips = [...root.querySelectorAll('[data-topic]')];
  const items = [...root.querySelectorAll('[data-topic-item]')];
  const status = root.querySelector('[data-topic-status]');

  const select = (topic) => {
    let shown = 0;
    items.forEach((it) => {
      const ok = !topic || it.dataset.topicItem === topic;
      it.hidden = !ok;
      if (ok) { shown++; it.querySelector('[data-reveal]')?.classList.add('is-in'); }
    });
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.topic === topic)));
    root.querySelector('[data-topic-list]').classList.toggle('is-filtered', !!topic);
    status.textContent = topic ? `${shown} article${shown === 1 ? '' : 's'} on ${topic}` : `All ${shown} articles`;
  };
  chips.forEach((c) => c.addEventListener('click', () => select(c.dataset.topic)));
}
