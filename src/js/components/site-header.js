// ==========================================================
// SITE HEADER | Category navigation, mobile drawer and search
// ==========================================================

const cleanupByHeader = new WeakMap();

const initHeader = (header) => {
  if (cleanupByHeader.has(header)) {
    return;
  }

  const menu = header.querySelector('[data-js="mega-menu"]');
  const triggers = [...header.querySelectorAll('[data-menu-trigger]')];
  const panels = [...header.querySelectorAll('[data-menu-panel]')];
  const searchOpen = header.querySelector('[data-js="search-open"]');
  const searchDialog = header.querySelector('[data-js="search-dialog"]');
  const searchClose = header.querySelector('[data-js="search-close"]');
  const searchInput = header.querySelector('[data-js="site-search"]');
  const searchSuggestions = header.querySelector('[data-js="search-suggestions"]');
  const searchEmpty = header.querySelector('[data-js="search-empty"]');
  const mobileNavOpen = header.querySelector('[data-js="mobile-nav-open"]');
  const mobileNav = header.querySelector('[data-js="mobile-nav"]');
  const mobileNavClose = header.querySelector('[data-js="mobile-nav-close"]');

  if (
    !menu ||
    triggers.length === 0 ||
    panels.length === 0 ||
    !searchOpen ||
    !searchDialog ||
    !searchClose ||
    !searchInput ||
    !searchSuggestions ||
    !searchEmpty ||
    !mobileNavOpen ||
    !mobileNav ||
    !mobileNavClose
  ) {
    throw new Error('Site header markup is missing a required navigation or search control.');
  }

  const controller = new AbortController();
  const { signal } = controller;
  let activeTrigger = null;
  let menuFocusTarget = null;
  let restoringMenuFocus = false;
  let closeTimer = 0;
  const hoverEnabled = window.matchMedia('(hover: hover) and (pointer: fine)');

  const getTrigger = (element) => {
    if (!(element instanceof Element)) {
      return null;
    }

    return element.closest('[data-menu-trigger]') ??
      element.closest('[data-js="desktop-menu-group"]')?.querySelector('[data-menu-trigger]') ??
      null;
  };

  const closeMenu = (restoreFocus = false) => {
    window.clearTimeout(closeTimer);
    menu.hidden = true;
    panels.forEach((panel) => {
      panel.hidden = true;
    });
    triggers.forEach((trigger) => {
      trigger.setAttribute('aria-expanded', 'false');
    });

    const focusTarget = menuFocusTarget ?? activeTrigger;
    activeTrigger = null;
    menuFocusTarget = null;

    if (restoreFocus && focusTarget && document.activeElement !== focusTarget) {
      restoringMenuFocus = true;
      focusTarget.focus();
      restoringMenuFocus = false;
    }
  };

  const openMenu = (id, focusTarget = null) => {
    const trigger = triggers.find((item) => item.dataset.menuTrigger === id);
    const panel = panels.find((item) => item.dataset.menuPanel === id);

    if (!trigger || !panel) {
      throw new Error(`Missing desktop navigation panel for category "${id}".`);
    }

    const heading = panel.querySelector('[data-js="menu-heading"]');
    if (!heading) {
      throw new Error(`Missing desktop navigation heading for category "${id}".`);
    }

    if (activeTrigger !== trigger) {
      menuFocusTarget = null;
    }
    if (focusTarget) {
      menuFocusTarget = focusTarget;
    }

    window.clearTimeout(closeTimer);
    panels.forEach((item) => {
      item.hidden = item !== panel;
    });
    triggers.forEach((item) => {
      item.setAttribute('aria-expanded', String(item === trigger));
    });
    menu.setAttribute('aria-label', `${heading.textContent.trim()} navigation`);
    menu.hidden = false;
    activeTrigger = trigger;
  };

  const scheduleMenuClose = () => {
    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => closeMenu(), 120);
  };

  let openBeforePointerDown = false;

  triggers.forEach((trigger) => {
    const group = trigger.closest('[data-js="desktop-menu-group"]');

    // Hover and focusin open the menu before the click fires, so pointer clicks use the pre-press state.
    trigger.addEventListener('pointerdown', () => {
      openBeforePointerDown = activeTrigger === trigger && !menu.hidden;
    }, { signal });

    trigger.addEventListener('click', (event) => {
      const isPointerClick = event.detail > 0;

      if (isPointerClick && hoverEnabled.matches && !group) {
        openMenu(trigger.dataset.menuTrigger);
        return;
      }

      const wasOpen = isPointerClick
        ? openBeforePointerDown
        : activeTrigger === trigger && !menu.hidden;

      if (wasOpen) {
        closeMenu();
        return;
      }
      openMenu(trigger.dataset.menuTrigger);
    }, { signal });

    (group ?? trigger).addEventListener('pointerenter', () => {
      if (hoverEnabled.matches) {
        openMenu(trigger.dataset.menuTrigger);
      }
    }, { signal });
  });

  header.addEventListener('pointerenter', () => {
    window.clearTimeout(closeTimer);
  }, { signal });

  header.addEventListener('pointerleave', scheduleMenuClose, { signal });

  header.addEventListener('focusin', (event) => {
    if (restoringMenuFocus) {
      return;
    }

    const trigger = getTrigger(event.target);
    if (trigger) {
      openMenu(trigger.dataset.menuTrigger, event.target);
    }
  }, { signal });

  header.addEventListener('focusout', (event) => {
    if (!header.contains(event.relatedTarget)) {
      closeMenu();
    }
  }, { signal });

  header.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) {
      event.preventDefault();
      closeMenu(true);
      return;
    }

    const trigger = getTrigger(event.target);
    if (!trigger) {
      return;
    }

    const index = triggers.indexOf(trigger);
    let nextIndex = index;

    if (event.key === 'ArrowRight') {
      nextIndex = (index + 1) % triggers.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (index - 1 + triggers.length) % triggers.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = triggers.length - 1;
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      openMenu(trigger.dataset.menuTrigger, event.target);
      menu.querySelector('[data-menu-panel]:not([hidden]) a')?.focus();
      return;
    } else {
      return;
    }

    event.preventDefault();
    const nextTrigger = triggers[nextIndex];
    const nextGroup = nextTrigger.closest('[data-js="desktop-menu-group"]');
    (nextGroup?.querySelector('a') ?? nextTrigger).focus();
  }, { signal });

  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) {
      closeMenu();
    }
  }, { signal });

  searchOpen.addEventListener('click', () => {
    closeMenu();
    if (!searchDialog.open) {
      searchDialog.showModal();
    }
    searchInput?.focus();
  }, { signal });

  searchClose.addEventListener('click', () => {
    searchDialog.close();
  }, { signal });

  searchDialog.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      searchDialog.close();
    }
  }, { signal });

  searchDialog.addEventListener('close', () => {
    searchOpen.focus();
  }, { signal });

  searchDialog.addEventListener('click', (event) => {
    if (event.target === searchDialog) {
      searchDialog.close();
    }
  }, { signal });

  searchInput?.addEventListener('input', () => {
    const query = searchInput.value.trim().toLocaleLowerCase();
    const suggestions = [...(searchSuggestions?.querySelectorAll('li') ?? [])];
    let visibleCount = 0;

    suggestions.forEach((item) => {
      const link = item.querySelector('a');
      const matches = !query || (link?.dataset.searchTerm ?? '').includes(query);
      item.hidden = !matches;
      if (matches) {
        visibleCount += 1;
      }
    });

    if (searchEmpty) {
      searchEmpty.hidden = visibleCount > 0;
    }
  }, { signal });

  mobileNavOpen.addEventListener('click', () => {
    if (!mobileNav.open) {
      mobileNav.showModal();
      document.body.classList.add('is-navigation-open');
      mobileNavOpen.setAttribute('aria-expanded', 'true');
    }
  }, { signal });

  mobileNavClose.addEventListener('click', () => {
    mobileNav.close();
  }, { signal });

  mobileNav.addEventListener('click', (event) => {
    if (event.target === mobileNav || event.target.closest('a')) {
      mobileNav.close();
    }
  }, { signal });

  mobileNav.addEventListener('close', () => {
    document.body.classList.remove('is-navigation-open');
    mobileNavOpen.setAttribute('aria-expanded', 'false');
    mobileNavOpen.focus();
  }, { signal });

  cleanupByHeader.set(header, () => {
    window.clearTimeout(closeTimer);
    controller.abort();
    closeMenu();
    if (mobileNav.open) {
      mobileNav.close();
    }
    document.body.classList.remove('is-navigation-open');
    mobileNavOpen.setAttribute('aria-expanded', 'false');
    header.dataset.initialized = 'false';
  });

  header.dataset.initialized = 'true';
};

/**
 * Initialise every site header within the supplied root. Safe to call more than once.
 * @param {Document|Element} root
 */
export const initSiteHeader = (root = document) => {
  const headers = root.matches?.('.site-header')
    ? [root]
    : root.querySelectorAll('.site-header');
  headers.forEach(initHeader);
};

/**
 * Remove listeners and transient state from every site header within the supplied root.
 * @param {Document|Element} root
 */
export const destroySiteHeader = (root = document) => {
  const headers = root.matches?.('.site-header')
    ? [root]
    : root.querySelectorAll('.site-header');
  headers.forEach((header) => {
    cleanupByHeader.get(header)?.();
    cleanupByHeader.delete(header);
  });
};
