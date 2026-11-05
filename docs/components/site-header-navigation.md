# Site Header Navigation — Status: Draft

Figma: [HP header](https://www.figma.com/design/L2LvNYSoNhr1p3PPhjlnjR/Homepage?node-id=3752-11961) · [Wall Art](https://www.figma.com/design/L2LvNYSoNhr1p3PPhjlnjR/Homepage?node-id=3776-1365) · [Canvas Prints](https://www.figma.com/design/L2LvNYSoNhr1p3PPhjlnjR/Homepage?node-id=3195-4793) · [Wallpaper](https://www.figma.com/design/L2LvNYSoNhr1p3PPhjlnjR/Homepage?node-id=3776-1390) · [Photo Gifts](https://www.figma.com/design/L2LvNYSoNhr1p3PPhjlnjR/Homepage?node-id=3776-1414)  
Version: Approved desktop frames supplied in chat; no named Figma version supplied. The Wall Art navigation behaviour was separately approved on 04/11/2026. No mobile or tablet navigation frame was supplied.

## Purpose

Provide the shared site header and category navigation on the homepage, Wall Art category page, Large Canvas Prints page and personalisation page. Use the same category data for desktop menus and mobile disclosures.

## Anatomy

- Announcement link and brand/home link.
- Desktop navigation in the order Wall Art, Canvas Prints, Wallpaper, Photo Gifts. Wall Art has a direct category link and a separate menu disclosure; the remaining categories use buttons.
- One category menu containing four independently hidden panels, each with product links and a featured panel.
- Desktop category headings use near-black 14px/20px semibold uppercase text with 12px below them. This is a user-approved hierarchy refinement on 04/11/2026, rather than a match to the smaller muted Figma headings.
- Search dialog and utility controls.
- Mobile Menu button and native navigation dialog with one `<details>` disclosure per category. Wall Art also has a direct category link before its disclosure.

The shared markup is in `src/partials/site-header.html`. `scripts/build-html.js` generates navigation and feature content from `src/data/site-navigation.json`.

## Contract

| Input/state | Type | Required/default | Behaviour |
|---|---|---|---|
| Navigation category | JSON object `{ id, label, href?, links, feature }` | Required; IDs are `wall-art`, `canvas-prints`, `wallpaper`, `photo-gifts`; `href` is optional | When present, `href` provides a direct category link. Build-time validation escapes labels and permits only local `./` or Photo Canvas HTTPS links. Invalid URLs or unknown feature visuals fail the build. |
| Current page category | Build-page value | Optional; empty on homepage | Adds the current-category modifier to the matching desktop link or trigger. |
| `aria-current` | Native ARIA state | `page` only on the linked category page | Marks the direct Wall Art link on the Wall Art category page, not on other pages in that category. |
| `data-js="desktop-menu-group"` | Desktop group hook | Required when a category has a direct link | Groups the link and its disclosure so hovering or focusing either opens the same menu. |
| `data-menu-trigger` | Button data attribute | Required on each desktop category trigger | Identifies the panel to open. |
| `data-menu-panel` | Panel data attribute | Required on each desktop panel | Matches a category ID; `hidden` is the closed/ inactive state. |
| `aria-expanded` | Native ARIA state | `false` initially | Reflects the active desktop trigger; all others remain false. |
| Mobile disclosure | Native `<details>` | Closed initially | Native summary toggles each category's product links independently of the direct Wall Art link. |
| Mobile dialog | Native `<dialog>` | Closed initially | Modal navigation; body scrolling is locked while open. |

Events: none.

Lifecycle: `initSiteHeader(root = document)` initialises every `.site-header` in the root and is idempotent. `destroySiteHeader(root = document)` clears timers, aborts registered listeners, closes transient UI and removes scroll lock. These exported functions are in `src/js/components/site-header.js`.

## States & variants

- Desktop menu closed; one active category panel; pointer-hovered/focused link or trigger; focused menu link.
- Mobile dialog closed/open; each category disclosure collapsed/expanded.
- Search dialog closed/open, filtered results and empty-results message (existing shared behaviour).
- Account and basket actions remain disabled because destinations are not configured.
- On the HP Desktop frame, the announcement bar targets 38px and the desktop header row targets 88px; existing search states are unchanged.

## Responsive behaviour

- Below 1200px the desktop navigation is replaced by the mobile Menu button and dialog. This is an implementation derived from existing responsive conventions, not a Figma-matched mobile design.
- At 1200px and above the desktop category navigation is displayed. The Wall Art disclosure remains available on touch devices without hover.
- The shared header and desktop menu use the standard centred `.container` (max-width 1355px).

## Accessibility

- Uses labelled navigation landmarks, real buttons for menu actions, real links for destinations, native dialog and disclosure elements. The desktop Wall Art link works without JavaScript; the mobile dialog requires JavaScript to open.
- Desktop: Enter on the Wall Art link navigates to the category page; its separately named disclosure toggles the menu. Left/Right moves across categories; Home/End moves to the first/last; Down opens the active menu and focuses its first link; Escape closes and restores focus to the originating link or trigger.
- Outside click, focus leaving the header and pointer exit close the desktop menu. Pointer exit uses a brief delay to allow moving into the menu.
- Native dialog behaviour supplies modal focus handling and Escape dismissal. Close button, backdrop and navigation links close the mobile dialog; focus returns to the Menu button.
- Visible `:focus-visible` outline is provided. Formal keyboard and screen-reader review has not yet been completed.

## Tokens used

Existing semantic token families only: `--color-*`, `--font-*`, `--line-height-*`, `--space-*`, `--radius-*` and `--layer-*`. No token was added or changed.

## Edge cases

| Category | Cases | Status |
|---|---|---|
| Content | Empty/long labels, special characters, many/duplicate links, unsupported URLs, missing feature data | Unresolved — build input validates URL prefixes and feature visual type, but no dedicated data-edge tests were run. |
| Visual states | Default, hover, focus-visible, active, disabled, expanded/collapsed, empty search | Partly covered — hover, expanded state, visible keyboard focus and the new controls' contrast were checked; other visual-state review remains outstanding. |
| Interaction | Rapid category changes, pointer transfer into menu, outside click, Escape, mobile dismissal, focus restoration | Partly covered — desktop hover, pointer transfer, exit, direct navigation, keyboard and touch disclosure behaviour were checked; rapid switching was not separately tested. |
| Responsive | 320/375/768/1200/1600px, zoom, overflow, touch targets, on-screen keyboard | Partly covered — touch emulation showed no page overflow at 320/375/768/1199px; desktop-window checks showed existing 320px overflow. The new touch controls meet 44 × 44px. Zoom and on-screen keyboard were not tested. |
| Forms | Search input, filtering, empty results, keyboard dismissal | Covered — existing static filtering behaviour has been verified previously; no remote search service is used. |
| Accessibility | Names/roles/states, keyboard-only, focus return, live announcements, reduced motion, forced colours | Partly covered — names, states, keyboard focus and new text/icon contrast were checked; manual assistive-tech, reduced-motion and forced-colour checks remain outstanding. |
| Lifecycle | Multiple headers, repeated init, destroy, listener/timer cleanup | Partly covered — repeated initialisation, destroy and reinitialisation were checked in one header; a multi-instance browser test was not run. |

## Tests

- 04/11/2026 (Wall Art navigation): `npm run build` and JavaScript syntax checks passed. Desktop hover, category switching and direct navigation passed on all four pages at 1200px and 1600px; keyboard checks covered Tab, ArrowDown, Escape, Space, arrow navigation and Enter. Headless Edge checked mobile touch navigation and disclosures on all four pages at 320px, 375px, 768px and 1199px, plus desktop touch at 1200px. The desktop link also navigated with JavaScript disabled.
- 04/11/2026: touch emulation showed no horizontal overflow at 320px, 375px, 768px or 1199px; desktop-window checks showed no overflow at 375px, 768px, 1200px or 1600px. At 320px with a desktop scrollbar, existing page overflow was 1px on the homepage and 15px on the other pages. The new text and disclosure icon each measured 17.90:1 against white. Repeated initialisation, destroy and reinitialisation passed; no JavaScript errors were captured.
- 04/11/2026: `npm run build` passed, including token lint (49 tokens, 49 referenced), Sass compilation and generation of all four HTML pages.
- 04/11/2026: generated HTML inspection confirmed category order, per-page current category, four panels, homepage section omission and local Large Canvas Prints links.
- 04/11/2026 (approved heading refinement): full build passed; headless Chrome verified 14px/20px, weight 600, near-black text, uppercase and 12px bottom margin for all four headings on all four pages at 1200px and 1600px (32 checks). All four pages had no horizontal overflow at 320/375/768/1200/1600px; 12 mobile-dialog and focus-return checks passed. Heading/white contrast measured 17.90:1.
- The heading checks exposed a desktop keyboard failure where focus restoration reopened a menu after Escape. This was fixed in the subsequent Wall Art navigation change. The only console diagnostic during the earlier heading checks was an existing `/favicon.ico` 404.
- Not run for the Wall Art navigation change: W3C validation (no local validator available), screen-reader testing, zoom/forced-colour checks and pixel-level Figma screenshot comparison.
- 04/11/2026 (Figma review): headless Chrome geometry at 1600px compared with Figma nodes `3776:1365`, `3195:4793`, `3776:1390` and `3776:1414` — link rows 22px at 30px pitch, links 32px below menu top, feature panel 563.5 × 262.5 at x 898 (Figma 560 × 260 at x 900), CTA 48px tall at 16/24, mockup layers within ±2px of Figma at 1600px.
- 04/11/2026 (HP Desktop sizing): `npm run build` passed; fresh browser evaluation confirmed 38px announcement and 88px desktop header row. The integrated browser did not sustain a 1600px screenshot for pixel comparison.

## Known limitations

- No responsive navigation Figma frame is available; mobile and tablet presentation is a convention-based derivation.
- Account and basket destinations are not configured and remain disabled.
- Featured menu visuals reuse the supplied artwork asset; only one distinct raster asset was available.
- Links for categories without local pages use their verified Photo Canvas destinations.
- At a 320px desktop-window width with a 15px scrollbar, the existing homepage header overflows by 1px and the other pages' 320px body minimum produces 15px of overflow.
- The preview has no `/favicon.ico`, producing a browser-console 404.

## Changelog

- 04/11/2026 — Introduced four-category shared navigation and responsive mobile dialog. See [docs/CHANGELOG.md](../CHANGELOG.md#04112026---shared-header-navigation-and-homepage-visibility).
- 04/11/2026 — Added direct Wall Art category navigation and retained the submenu. See [docs/CHANGELOG.md](../CHANGELOG.md#04112026---shared-wall-art-navigation).
