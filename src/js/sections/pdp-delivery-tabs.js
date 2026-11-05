// ==========================================================
// PDP DELIVERY TABS | Keyboard-operable delivery and returns panels
// ==========================================================

/** Initialise each PDP delivery tablist inside `root` once. */
export const initPdpDeliveryTabs = (root = document) => {
  root.querySelectorAll('[data-js="pdp-delivery-tabs"]').forEach((section) => {
    if (section.dataset.initialized === 'true') return;

    const tabs = [...section.querySelectorAll('[data-pdp-delivery-tab]')];
    const panels = [...section.querySelectorAll('[data-pdp-delivery-panel]')];
    const panelIds = tabs.map((tab) => tab.getAttribute('aria-controls'));

    if (!tabs.length || tabs.length !== panels.length || new Set(panelIds).size !== tabs.length
      || tabs.some((tab) => !panels.some((panel) => panel.id === tab.getAttribute('aria-controls')
        && panel.getAttribute('aria-labelledby') === tab.id))) {
      throw new Error('PDP delivery tabs require a unique labelled panel for every tab.');
    }

    const activate = (tab, moveFocus = false) => {
      tabs.forEach((item) => {
        const selected = item === tab;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
      });
      panels.forEach((panel) => {
        panel.hidden = panel.id !== tab.getAttribute('aria-controls');
      });
      if (moveFocus) tab.focus();
    };

    activate(tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') ?? tabs[0]);
    section.dataset.initialized = 'true';

    section.addEventListener('click', (event) => {
      const tab = event.target.closest('[data-pdp-delivery-tab]');
      if (tabs.includes(tab)) activate(tab);
    });

    section.addEventListener('keydown', (event) => {
      const tab = event.target.closest('[data-pdp-delivery-tab]');
      if (!tabs.includes(tab) || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();

      const currentIndex = tabs.indexOf(tab);
      const nextIndex = event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? tabs.length - 1
          : (currentIndex + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      activate(tabs[nextIndex], true);
    });
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initPdpDeliveryTabs(), { once: true });
} else {
  initPdpDeliveryTabs();
}