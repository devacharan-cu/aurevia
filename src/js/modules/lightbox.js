// Lightbox built on <dialog>: native focus handling and Escape-to-close, plus arrow keys.
export default function lightbox(root) {
  const dialog = root.querySelector('[data-lightbox-dialog]');
  const image = dialog?.querySelector('[data-lightbox-img]');
  const caption = dialog?.querySelector('[data-lightbox-caption]');
  const triggers = [...root.querySelectorAll('[data-lightbox]')];
  if (!dialog || !triggers.length || typeof dialog.showModal !== 'function') return;
  let index = 0;

  const show = (i) => {
    index = (i + triggers.length) % triggers.length;
    const t = triggers[index];
    const src = t.querySelector('img');
    // Pre-sized library images have a 2200px variant, in AVIF when the thumbnail's <picture>
    // chose AVIF (so the browser supports it); CMS uploads are used as-is.
    const ext = src?.currentSrc?.endsWith('.avif') ? 'avif' : 'webp';
    image.src = t.dataset.lightbox.startsWith('/') ? t.dataset.lightbox : `/images/${t.dataset.lightbox}-2200.${ext}`;
    image.alt = src?.alt || '';
    caption.textContent = `${String(index + 1).padStart(2, '0')} / ${String(triggers.length).padStart(2, '0')} · ${t.dataset.caption}`;
  };

  triggers.forEach((t, i) => t.addEventListener('click', () => {
    show(i);
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  }));
  dialog.addEventListener('close', () => {
    document.body.style.overflow = '';
    triggers[index].focus();
  });
  dialog.querySelector('[data-lightbox-close]').addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-lightbox-prev]').addEventListener('click', () => show(index - 1));
  dialog.querySelector('[data-lightbox-next]').addEventListener('click', () => show(index + 1));
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') show(index + 1);
    if (e.key === 'ArrowLeft') show(index - 1);
  });
  // Click on the backdrop closes.
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
}
