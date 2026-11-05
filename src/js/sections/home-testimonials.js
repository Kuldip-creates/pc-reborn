export const initHomeTestimonials = () => {
  const grid = document.querySelector('[data-js="testimonial-grid"]');
  const previous = document.querySelector('[data-js="testimonial-previous"]');
  const next = document.querySelector('[data-js="testimonial-next"]');

  if (!grid || !previous || !next || grid.dataset.initialized === 'true') {
    return;
  }
  grid.dataset.initialized = 'true';

  const cards = [...grid.querySelectorAll('.testimonial-card')];
  if (cards.length < 2) {
    previous.disabled = true;
    next.disabled = true;
    return;
  }

  const getPage = () => {
    const gap = Number.parseFloat(getComputedStyle(grid).columnGap) || 0;
    const cardWidth = cards[0].getBoundingClientRect().width;
    const step = cardWidth + gap;
    const visibleCards = Math.max(1, Math.round((grid.clientWidth + gap) / step));
    const maxPage = Math.max(0, cards.length - visibleCards);
    const page = Math.min(maxPage, Math.max(0, Math.round(grid.scrollLeft / step)));
    return { gap, step, page, maxPage };
  };

  const updateControls = () => {
    const { page, maxPage } = getPage();
    previous.disabled = page === 0;
    next.disabled = page >= maxPage;
  };

  const move = (direction) => {
    const { page, maxPage, step } = getPage();
    const targetPage = Math.min(maxPage, Math.max(0, page + direction));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      grid.scrollLeft = targetPage * step;
    } else {
      grid.scrollTo({ left: targetPage * step, behavior: 'smooth' });
    }
  };

  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  grid.addEventListener('scroll', updateControls, { passive: true });
  window.addEventListener('resize', updateControls);
  updateControls();
};