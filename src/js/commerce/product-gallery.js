// ==========================================================
// PRODUCT GALLERY | Media viewer, thumbnails and full-screen preview
// ==========================================================
const pad = (value) => String(value).padStart(2, '0');

/**
 * Initialises every product gallery inside `root`.
 * Thumbnails carry the media source and labels in data attributes:
 * `data-src`, `data-alt`, `data-label` and an optional `data-note`.
 * @param {ParentNode} [root=document]
 */
export const initProductGallery = (root = document) => {
  root.querySelectorAll('[data-js="product-gallery"]').forEach((gallery) => {
    if (gallery.dataset.initialized === 'true') {
      return;
    }

    const image = gallery.querySelector('[data-js="gallery-image"]');
    const counter = gallery.querySelector('[data-js="gallery-counter"]');
    const status = gallery.querySelector('[data-js="gallery-status"]');
    const thumbs = [...gallery.querySelectorAll('[data-gallery-index]')];
    const previous = gallery.querySelector('[data-js="gallery-prev"]');
    const next = gallery.querySelector('[data-js="gallery-next"]');
    const expand = gallery.querySelector('[data-js="gallery-expand"]');
    const dialog = gallery.querySelector('[data-js="gallery-dialog"]');
    const dialogImage = gallery.querySelector('[data-js="gallery-dialog-image"]');
    const close = gallery.querySelector('[data-js="gallery-close"]');

    if (!image || !counter || !thumbs.length) {
      return;
    }
    gallery.dataset.initialized = 'true';

    let current = Math.max(0, thumbs.findIndex((thumb) => thumb.getAttribute('aria-current') === 'true'));

    const show = (index) => {
      current = (index + thumbs.length) % thumbs.length;
      const thumb = thumbs[current];

      image.src = thumb.dataset.src;
      image.alt = thumb.dataset.alt;
      thumbs.forEach((item, itemIndex) => {
        item.setAttribute('aria-current', String(itemIndex === current));
      });
      counter.textContent = `${pad(current + 1)} / ${pad(thumbs.length)}`;

      if (status) {
        const note = thumb.dataset.note ? ` ${thumb.dataset.note}` : '';
        status.textContent = `Image ${current + 1} of ${thumbs.length}: ${thumb.dataset.label}.${note}`;
      }
    };

    thumbs.forEach((thumb, index) => {
      thumb.addEventListener('click', () => show(index));
    });
    previous?.addEventListener('click', () => show(current - 1));
    next?.addEventListener('click', () => show(current + 1));

    // Left/Right arrows step through the media while focus is on a gallery control.
    gallery.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key) || event.target.closest('dialog')) {
        return;
      }
      event.preventDefault();
      show(current + (event.key === 'ArrowRight' ? 1 : -1));
      if (thumbs.includes(event.target)) {
        thumbs[current].focus();
      }
    });

    if (!expand || !dialog || !dialogImage || !close) {
      return;
    }

    expand.addEventListener('click', () => {
      dialogImage.src = image.src;
      dialogImage.alt = image.alt;
      dialog.showModal();
      close.focus();
    });

    close.addEventListener('click', () => dialog.close());

    dialog.addEventListener('close', () => {
      expand.focus();
    });
  });
};
