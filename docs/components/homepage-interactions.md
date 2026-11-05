# Site Navigation and Homepage Interactions

**Status:** Draft  
**Scope:** Homepage and Wall Art desktop interactions; shared header appears on all generated pages  
**Implementation:** HTML, SCSS and vanilla JavaScript

## Shared category navigation

- Desktop trigger order: Wall Art, Canvas Prints, Wallpaper, Photo Gifts.
- Desktop panels and mobile disclosures are generated from `src/data/site-navigation.json`.
- Desktop: click or pointer hover opens the matching panel; moving the pointer from the header closes it after a short delay. Outside click, focus leaving the header and Escape close the menu. Escape restores focus to the active trigger.
- Keyboard: Left/Right moves across triggers; Home/End selects the first/last; Down opens the active panel and focuses its first link.
- Mobile: the Menu button opens a native dialog; category groups use native `<details>`. Close, Escape, backdrop and navigation links close the dialog; body scrolling is locked while it is open and focus returns to the Menu button.
- The mobile/tablet presentation is derived from existing responsive conventions. No responsive navigation Figma frame was supplied, so it is not claimed as Figma-matched.
- The local Large Canvas Prints link remains `./large-canvas-prints.html`; other configured links follow the supplied/verified product routes.

## Search dialog

- Trigger: search button opens a native `dialog`; focus moves to the labelled search field.
- Close: close button, Escape, or backdrop click; focus returns to the search trigger.
- Search is limited to filtering the four static, verified category suggestions. There is no search endpoint.

## Hero finish selector

- Input: `data-finish-option` value (`canvas`, `framed`, `poster`, `metal`); the final visible label is Aluminium while the established internal value remains `metal`.
- State: exactly one option has `aria-pressed="true"`; root `data-finish` stores the selection; the status label changes with the selected finish.
- Event: `home-hero:finish-change`, bubbling, with the established `{ value }` payload in `detail`.
- Assets: per the approved Wall Art category refresh, all four finish states use `src/assets/images/hero-finish-preview.png`. The selection state and event remain functional, but the preview image does not visually vary by finish.

## Homepage section visibility

- `home-ideas` and `home-shop-by-room` are not in the approved HP Desktop frame and are disabled in `src/data/homepage-sections.json`.
- Both source sections remain in the project; the Homepage does not render them. The room-tabs initializer is reused by the active Wall Art category Shop by Room section.
- The shared footer's “Shop by room” link routes to the active category section; the homepage visibility remains unchanged.

## Testimonials

- Desktop shows the three supplied review cards in three columns.
- Below desktop, Previous/Next scroll the existing cards; controls disable at the real ends and respect reduced-motion preferences.
- No additional review content is fabricated. Carousel styling is scoped to the homepage; product-page testimonials keep their prior layout.

## Room tabs

- Contract: `initRoomTabs(root = document)` initialises every descendant `data-js="shop-by-room"` section once. Each `data-room-tab` button requires a unique `aria-controls` target with `data-js="room-copy"` and `aria-labelledby` referencing that button. A `data-js="room-status"` live region is required; incomplete panel mappings throw an explicit error. No custom events are emitted.
- State: selection updates `aria-selected` and roving `tabindex`, reveals the associated panel using `hidden` and hides the others. Each panel contains its own heading and three paragraphs, with no links (removed at the user's request on 04/11/2026). Repeated selection is safe; it does not repeat the live announcement.
- Keyboard: Left/Right selects adjacent tabs with wrap-around; Home/End selects first/last. Enter/Space uses native button activation; Tab reaches the selected panel, then continues outside the room section. Focus remains on the activated tab until the user moves it.
- Scope: the initializer serves the Homepage source section and the active Wall Art category section through `data-js="shop-by-room"`.
- Content: Living room copy is retained. Bedroom, Kitchen & dining and Office use editorial copy drafted with user approval on 04/11/2026, not copy from Figma. No prices, guarantees or other product claims were added.
- Presentation: existing image, typography, colours and responsive layout are unchanged. Tabs and panels have a section-scoped visible keyboard outline using existing tokens, overriding the global outline reset. Room-specific imagery is not supplied. The homepage section remains disabled.
- Edge cases: static non-empty content only (dynamic/translated/disabled/loading states are not implemented); repeated selection, multiple instances and reinitialisation are supported. No global listeners, observers, timers or cleanup are needed.

## Newsletter

- Presentation: `.page-home`, `.page-pdp` and `.page-category` reuse the bordered email field and matching button sizing; from 1200px the field and button sit side by side. Below 1200px they stack. Other pages retain their existing presentation.
- PDP and category keyboard focus: the email input and submit button have a token-based outline; other pages' focus styling is unchanged.
- Input: required email field with native email validation.
- Failure: invalid input uses browser validation; valid input announces that no signup endpoint is connected.
- Success/submission: not supported until a newsletter service endpoint is supplied.

## Validation performed

- [x] 04/11/2026 room-link removal: build passed; source/generated HTML contain no links in any room panel. Edge verified all four selections and retained paragraphs, Home-key activation and Tab movement from the selected panel to outside the section.
- [x] 04/11/2026 room-tabs fix: JavaScript syntax and build passed; Edge verified all four panels, headings, copy and CTA labels at 320/375/768/1200/1600px, unique ARIA references and one active/visible panel. No section or document overflow in the isolated browser.
- [x] Room-tabs keyboard checks passed for arrows/wrap, Home/End, Enter/Space, panel/CTA tab order and a visible 2px tab outline. Multiple instances, repeat initialisation, 40 rapid selections and announcement suppression passed. All four homepage source panels worked; the generated homepage still omits this section.
- [x] Desktop/mobile room screenshots inspected. Existing muted text contrast is 5.98:1 against white; primary text and the focus-token contrast are 17.90:1. No runtime exceptions occurred; one resource 404 console message remains.
- [ ] Room-tabs fix: W3C validation (no local validator), screen-reader, real-device touch, 200% zoom, forced-colour, Figma pixel comparison and Lighthouse were not run. New editorial copy has no Figma reference; no visual matching claim is made.
- [x] 04/11/2026 category newsletter fix: build passed; browser assertions verified bordered 56px controls, responsive alignment and no newsletter overflow at all five required widths. Ten homepage/PDP responsive regression checks passed.
- [x] Category required/invalid email, keyboard movement, visible input/button focus and Enter feedback were checked. W3C, screen-reader, fresh contrast and Figma pixel checks were not run; existing page-level 320px overflow remains outside the newsletter.
- [x] 04/11/2026 PDP newsletter fix: build passed; browser assertions verified 56px controls, stacking/desktop alignment and no newsletter overflow at 320/375/768/1200/1600px. Homepage/category newsletter presentation was rechecked unchanged.
- [x] PDP newsletter required/invalid email, Tab/Enter, visible input/button focus and disconnected-endpoint feedback passed; no console errors were captured. Text/button contrast is 17.90:1 and field-border contrast is 5.98:1 against white.
- [ ] PDP newsletter fix: W3C validation, screen-reader and Figma pixel comparison were not run. Existing page-level 320px overflow remains outside this section's scope.
- [x] `npm run build` passed on 04/11/2026 (token lint, Sass compile and static HTML build).
- [x] Generated HTML inspection confirmed the four category triggers and panels, the per-page active category, the retained local Large Canvas Prints route and omission of the hidden homepage section.
- [x] Search, hero finish selection, room tabs and newsletter validation retain their previously verified behaviour; this navigation update does not change those interactions.
- [x] Wall Art category refresh: build and generated-HTML assertions passed for the eight product cards, section visibility/order, FAQ state, room-tab ARIA references and approved image references.
- [x] 04/11/2026: `node --check` passed for the build script and updated JavaScript modules; generated links and local asset references resolved.
- [ ] 04/11/2026: Browser-based visual, keyboard and screen-reader checks for the category refresh were unavailable.
- [x] Browser check confirmed Canvas selection updates the matching local preview and status; the mobile testimonial Next control scrolls the supplied cards.
- [x] Homepage has no document overflow at tested 320/375/768/1200/1600 CSS viewport widths with a classic scrollbar.
- [ ] Full asset decoding, W3C validation, screen-reader/contrast review and sustained 1600px screenshot comparison remain outstanding.

## Remaining validation

- [x] Browser check confirmed desktop Wall Art hover opens its matching menu panel.
- [ ] Verify desktop pointer transfer, outside click, Escape/focus return, and Arrow/Home/End keyboard behaviour in a browser.
- [x] Browser check confirmed mobile navigation dialog opens and closes.
- [ ] Verify mobile disclosures, scroll lock, backdrop dismissal and close-after-navigation in a browser.
- [x] Check 320, 375, 768, 1200 and 1600px geometry and horizontal overflow.
- [ ] Review contrast, semantics, keyboard tab order and screen-reader behaviour; run W3C validation.
- [ ] Compare the desktop header and open category panels with the supplied Figma screenshots. The integrated browser resets to its 1004px host width; mobile/tablet screenshots are not available.
