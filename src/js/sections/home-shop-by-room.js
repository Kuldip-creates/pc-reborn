// ==========================================================
// SHOP BY ROOM | Accessible room-specific content tabs
// ==========================================================

/** Initialise each room tablist and its associated content panels once. */
export const initRoomTabs = (root = document) => {
  root.querySelectorAll('[data-js="shop-by-room"]').forEach((section) => {
    if (section.dataset.initialized === 'true') return;

    const tabs = [...section.querySelectorAll('[data-room-tab]')];
    const panels = [...section.querySelectorAll('[data-js="room-copy"]')];
    const status = section.querySelector('[data-js="room-status"]');
    if (!tabs.length) return;
    if (!status || panels.length !== tabs.length || tabs.some((tab) =>
      panels.filter((panel) => panel.id === tab.getAttribute('aria-controls')
        && panel.getAttribute('aria-labelledby') === tab.id).length !== 1)) {
      throw new Error('Shop by room requires a unique labelled panel for each tab and a status region.');
    }

    const activate = (tab, announce = true) => {
      const changed = tab.getAttribute('aria-selected') !== 'true';
      tabs.forEach((item) => {
        item.setAttribute('aria-selected', String(item === tab));
        item.tabIndex = item === tab ? 0 : -1;
      });
      panels.forEach((panel) => {
        panel.hidden = panel.id !== tab.getAttribute('aria-controls');
      });
      if (announce && changed) {
        status.textContent = `${tab.textContent.trim()} inspiration shown.`;
      }
    };

    activate(tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') ?? tabs[0], false);
    section.dataset.initialized = 'true';

    section.addEventListener('click', (event) => {
      const tab = event.target.closest('[data-room-tab]');
      if (tabs.includes(tab)) activate(tab);
    });

    section.addEventListener('keydown', (event) => {
      const tab = event.target.closest('[data-room-tab]');
      if (!tabs.includes(tab) || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
        return;
      }
      event.preventDefault();

      const currentIndex = tabs.indexOf(tab);
      const nextIndex = event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? tabs.length - 1
          : (currentIndex + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[nextIndex].focus();
      activate(tabs[nextIndex]);
    });
  });
};
