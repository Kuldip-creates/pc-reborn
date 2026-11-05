export const initHomeHero = () => {
  const preview = document.querySelector('[data-js="hero-preview"]');
  const status = document.querySelector('[data-js="finish-status"]');

  if (!preview || !status || preview.dataset.initialized === 'true') {
    return;
  }
  preview.dataset.initialized = 'true';

  const options = [...preview.querySelectorAll('[data-finish-option]')];
  const image = preview.querySelector('[data-js="hero-preview-image"]');
  const finishLabel = preview.querySelector('[data-js="finish-label"]');

  options.forEach((option) => {
    option.addEventListener('click', () => {
      const finish = option.dataset.finishOption;
      const label = option.textContent.trim();

      options.forEach((item) => {
        item.setAttribute('aria-pressed', String(item === option));
      });

      preview.dataset.finish = finish;
      if (image && option.dataset.imageSrc) {
        image.src = option.dataset.imageSrc;
      }
      if (finishLabel) {
        finishLabel.textContent = `PREVIEWING · ${label.toUpperCase()}`;
      }
      status.textContent = `${label} selected.`;
      preview.dispatchEvent(new CustomEvent('home-hero:finish-change', {
        bubbles: true,
        detail: { value: finish }
      }));
    });
  });
};
