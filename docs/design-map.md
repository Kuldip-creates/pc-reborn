# PC Reborn homepage design map

## Wall Art Preview

| Name | Level | Figma node link | Figma version | Code files | Used on | Status |
|---|---|---|---|---|---|---|
| wall-art-preview | section | [Existing flow reference](https://www.figma.com/design/L2LvNYSoNhr1p3PPhjlnjR/Homepage?node-id=3743-2332) | Final Step 01 and Review screenshots supplied in chat 03/11/2026; popover anchor bug fix requested 04/11/2026; no new Figma node or named version supplied | `src/partials/wall-art-preview.html`, `src/scss/sections/_wall-art-preview.scss`, `src/js/sections/wall-art-preview.js` | personalise-wall-art | Draft |
| personalise-wall-art | page | [Choose format](https://www.figma.com/design/L2LvNYSoNhr1p3PPhjlnjR/Homepage?node-id=3743-3160) | Responsive full interactive frontend prototype; no production commerce | `src/personalise-wall-art.html`, `scripts/build-html.js` | personalise-wall-art | Draft |

The page reuses the shared header/footer and existing tokens; the shared header was updated on 04/11/2026. Step 01 has centred responsive progress, a larger contained photo preview, 184px desktop gallery cards, confirmed local Delete all, gallery-header sample access and a selected-image dock capped at 900px with no Exit action. Review positions the preview badge inside the scene and Print preview below it, with a crop-based local PPI estimate that is explicitly unverified. IndexedDB, upload validation, sample selection and the four-stage flow are retained. Production quality thresholds and basket integration are unavailable; Add to basket remains disabled. Behaviour and validation gaps: `docs/components/wall-art-preview.md`. Existing route, build conventions and imports are preserved.

30/10/2026 user-approved imagery override: the furnished room is replaced with `src/assets/images/wall-art-preview-minimal-wall.jpg`, a licensed, unobstructed concrete-wall photograph. Frames share a centred anchor so every size/orientation fits; page preload and alt text match the replacement. Source/licence details are recorded in the component doc. Figma remains unchanged.

30/10/2026 user-approved option presentation: hide native radio circles in all five wall-art flow groups; retain accessible native inputs, tile selection borders and whole-tile focus. No shared component API or other page is changed.

Desktop nodes: `3743:3160`, `3743:3221`, `3743:3281`, `3743:3349`, `3743:3429`, `3743:3097`. Mobile nodes: `3743:3663`, `3743:3691`, `3743:3711`, `3743:3747`, `3743:3789`, `3743:3827`. Handoff/edge references: `3743:3508`, `3743:3523`, `3743:3617`, `3743:3858`. All Figma access was read-only.

## Scope

- Figma file: [PC Reborn Homepage](https://www.figma.com/design/L2LvNYSoNhr1p3PPhjlnjR/Homepage?node-id=3752-11954)
- Implemented frames: `HP — Desktop` (`3752:11954`), `Wall Art CP — Desktop` (`3752:12354`) and the Photo Canvas PDP — Desktop, Large Canvas Prints (`3752:13010`).
- Reference canvas: 1600px; centred content container: 1355px. The shared header and desktop mega menus use the same centred `.container`; the earlier 90%-width header rule is superseded by the 04/11/2026 navigation update in `docs/CHANGELOG.md`.
- Other PDP frames (Custom Wallpaper PDP, Design Studio demo) are reference-only. They are not implemented.
- Build status: **Draft**. This is a static implementation, not a production-connected website. Figma provides desktop frames only, so the tablet and mobile layouts are fluid derivations that still need design approval.

## Shared header navigation

| Name | Level | Figma node link | Figma version | Code files | Used on | Status |
|---|---|---|---|---|---|---|
| site-header-navigation | component | [HP header](https://www.figma.com/design/L2LvNYSoNhr1p3PPhjlnjR/Homepage?node-id=3752-11961) · [Wall Art](https://www.figma.com/design/L2LvNYSoNhr1p3PPhjlnjR/Homepage?node-id=3776-1365) · [Canvas Prints](https://www.figma.com/design/L2LvNYSoNhr1p3PPhjlnjR/Homepage?node-id=3195-4793) · [Wallpaper](https://www.figma.com/design/L2LvNYSoNhr1p3PPhjlnjR/Homepage?node-id=3776-1390) · [Photo Gifts](https://www.figma.com/design/L2LvNYSoNhr1p3PPhjlnjR/Homepage?node-id=3776-1414) | Approved desktop frames supplied in chat; no named Figma version supplied; category-heading and Wall Art navigation overrides approved 04/11/2026 | `src/partials/site-header.html`, `src/scss/layout/_site-header.scss`, `src/js/components/site-header.js`, `src/data/site-navigation.json`, `scripts/build-html.js` | index, wall-art, large-canvas-prints, personalise-wall-art | Draft |

Desktop order is Wall Art, Canvas Prints, Wallpaper and Photo Gifts. Wall Art links directly to `./wall-art.html` and retains its hover menu with a separate disclosure for keyboard and touch; the other category triggers retain their existing behaviour. Panels are generated from `site-navigation.json`, and the active page's category is marked in the desktop navigation. Mobile uses a native dialog, a direct Wall Art link and native `<details>` disclosures derived from existing responsive conventions. No mobile or tablet navigation frame was supplied, so that layout is not claimed as Figma-matched. The locally implemented Large Canvas Prints destination remains `./large-canvas-prints.html`.

04/11/2026 user-approved hierarchy override: all four desktop submenu category headings use existing near-black 14px/20px semibold type with 12px below. No Figma version, token, link or interaction was changed.

04/11/2026 HP Desktop sizing: announcement bar target 38px and header row target 88px. Shared menu, search, mobile dialog, account and basket behavior remains unchanged.

## Shared site footer

| Name | Level | Figma node link | Figma version | Code files | Used on | Status |
|---|---|---|---|---|---|---|
| site-footer | component | [HP footer](https://www.figma.com/design/L2LvNYSoNhr1p3PPhjlnjR/Homepage?node-id=3752-12261) | HP Desktop (`3752:11954`); named version not supplied | `src/partials/site-footer.html`, `src/scss/layout/_site-footer.scss`, `scripts/build-html.js` | index, wall-art, large-canvas-prints, personalise-wall-art | Draft |

The shared footer retains current navigation and adds the verified canvas/returns/legal links in the approved grouping. Because Shop by room is hidden on the homepage, that link now targets the visible format section. The Figma Accessibility URL returned 404 when checked, so it is not linked.

## Homepage mapping

| Name | Level | Figma node link | Figma version | Code files | Used on | Status |
|---|---|---|---|---|---|---|
| shop-by-room | section | [Room content](https://www.figma.com/design/L2LvNYSoNhr1p3PPhjlnjR/Homepage?node-id=3752-12539) | Existing desktop reference; room-specific editorial extension approved in chat 04/11/2026, no new Figma version | `src/index.html`, `src/wall-art.html`, `src/scss/sections/_home-shop-by-room.scss`, `src/js/sections/home-shop-by-room.js` | wall-art; index source retained but disabled | Draft |

| Figma section | Node | Implementation | Status |
|---|---:|---|---|
| Announcement bar | `3752:11955` | Shared header partial and page values | Draft |
| Header and navigation | `3752:11961` | Shared header row above | Draft |
| Personalised wall-art hero | `3752:11987` | `src/index.html`, `src/scss/sections/_home-hero.scss`, `src/js/sections/home-hero.js` | Draft |
| Trust and reassurance | `3752:11988` | `src/index.html`, `src/scss/sections/_trust-strip.scss` | Draft |
| Bestselling wall art | `3752:12035` | `src/index.html`, `src/scss/sections/_home-bestsellers.scss` | Draft |
| Shop wall art by format | `3752:12079` | `src/index.html`, `src/scss/sections/_home-format-grid.scss` | Draft |
| Ideas for your walls | — | Source/styles retained; disabled via `src/data/homepage-sections.json` | Draft; hidden on homepage |
| Shop by room | — | Source/styles/initializer retained; disabled via `src/data/homepage-sections.json` | Draft; hidden on homepage |
| Craftsmanship and product quality | `3752:12180` | Homepage reuses `.factory-layout--cp` and `.cp-quality-grid` from `src/scss/sections/_wall-art-category.scss` | Draft |
| Personalisation journey | `3752:12332` | `src/index.html`, `src/scss/sections/_home-personalisation.scss` | Draft |
| London factory editorial | `3752:12167` | `src/index.html`, `src/scss/sections/_home-factory.scss` | Draft |
| Customer testimonials | `3752:12233` | `src/index.html`, `src/scss/sections/_home-testimonials.scss`, `src/js/sections/home-testimonials.js` | Draft |
| Newsletter | `3752:12252` | `src/partials/newsletter.html`, `src/scss/sections/_home-newsletter.scss`, `src/js/sections/home-newsletter.js` | Draft; no endpoint |
| Footer | `3752:12261` | `src/partials/site-footer.html`, `src/scss/layout/_site-footer.scss` | Draft |

## Wall Art category mapping

The current category target is the approved desktop frame `3752:12354` (“Wall Art CP — Desktop”). Its source asset is the existing floral placeholder `src/assets/images/hero-finish-preview.png`; the frame provides no tablet or mobile layouts.

| Figma section | Node | Implementation | Status |
|---|---:|---|---|
| Announcement bar and header | `3752:12355`, `3752:12361` | Shared partials and page values in `scripts/build-html.js` | Draft; partials unchanged |
| Breadcrumb | `3752:12387` | `src/wall-art.html`, shared `.breadcrumb` (`src/scss/components/_breadcrumb.scss`) | Draft |
| Compact hero | `3752:12392` | `src/wall-art.html`, `.cp-hero` (`src/scss/sections/_wall-art-category.scss`) | Draft |
| Shop wall art by format | `3752:12398`, cards `3752:12402` | `src/wall-art.html`, shared `.format-grid` / `.format-card` | Draft |
| FAQ accordion | `3752:12489` | `src/wall-art.html`, shared `.faq` (`src/scss/components/_faq.scss`), native `<details>` / `<summary>` | Draft |
| Shop by room | `3752:12525`, interactive content `3752:12539` | `src/wall-art.html`, `src/js/sections/home-shop-by-room.js`, existing styles; four room-specific panels, user-approved editorial extension 04/11/2026 | Draft |
| Newsletter and footer | `3752:12540`, `3752:12549` | `src/partials/newsletter.html`, `src/partials/site-footer.html`; `.page-category` in `src/wall-art.html` enables the existing homepage/PDP newsletter layout and PDP focus treatment in `src/scss/sections/_home-newsletter.scss` | Draft; partials unchanged |

Ideas for your walls, format comparison, How it works and craftsmanship remain in the category source template but are disabled by `src/data/wall-art-sections.json`, so they are absent from generated category HTML. The Homepage hero uses the same placeholder in all four finish-selector states, as approved; the buttons still update their selected state and accessible status but no longer show distinct finish imagery.

## Photo Canvas PDP mapping (Large Canvas Prints)

Figma frame [Photo Canvas PDP — Desktop](https://www.figma.com/design/L2LvNYSoNhr1p3PPhjlnjR/Homepage?node-id=3752-13010). The frame name and node ID are the approved reference; no named Figma version-history label was supplied. Page: `src/large-canvas-prints.html`, registered in `scripts/build-html.js`.

| Figma section | Node | Implementation | Status |
|---|---:|---|---|
| Announcement bar and header | Within `3752:13010` | Shared `src/partials/site-header.html` and page values in `scripts/build-html.js` (unchanged) | Draft |
| Breadcrumb | Within `3752:13010` | Existing shared `.breadcrumb` | Draft |
| Gallery and purchase panel | [Section 03](https://www.figma.com/design/L2LvNYSoNhr1p3PPhjlnjR/Homepage?node-id=3752-13046) | Existing `.pdp-product`, `.product-gallery` and `.purchase-panel`; gallery behavior remains in `src/js/commerce/product-gallery.js`; legacy selectors/configuration remain hidden in source | Draft; user-approved frame, named version not supplied |
| Canvas size guide | Within `3752:13010` | Existing `.pdp-size-guide` | Draft |
| Canvas wrap options | Within `3752:13010` | Existing `.pdp-wraps`; exact schematic is unavailable locally and is not substituted | Draft; asset gap |
| Trust strip | Within `3752:13010` | Existing `.trust-strip.trust-strip--pdp`, moved after the wrap guide | Draft |
| Quality and care | Within `3752:13010` | Existing `.pdp-quality`; reuses the matched local artwork | Draft |
| How it works and delivery information | [Section 10](https://www.figma.com/design/L2LvNYSoNhr1p3PPhjlnjR/Homepage?node-id=3752-13288) | `.pdp-how-it-works-delivery`, `.delivery-info`; page-scoped tabs in `src/js/sections/pdp-delivery-tabs.js`; verified delivery and returns links retained | Draft; user-approved frame, named version not supplied |
| FAQ | Within `3752:13010` | Existing shared `.faq.faq--ruled` | Draft |
| Customer testimonials | Within `3752:13010` | Existing `.home-testimonials` and `.testimonial-*`, moved after FAQ | Draft |
| Related canvas formats | Within `3752:13010` | Existing `.format-card--related` and `.pdp-related` CSS scenes | Draft |
| Newsletter | Within `3752:13010` | Shared `src/partials/newsletter.html` included once; `src/scss/sections/_home-newsletter.scss` reuses the homepage field, button and desktop form layout under `.page-pdp` in `src/large-canvas-prints.html`; other pages unchanged | Draft |
| Footer | Within `3752:13010` | Existing shared `src/partials/site-footer.html`; implementation unchanged | Draft |
| Room inspiration | Not visible in the approved frame | Source markup and SCSS retained; omitted from generated PDP via `src/data/pdp-sections.json` | Draft; hidden |
| Final CTA band | Not visible in the approved frame | Source markup and SCSS retained; omitted from generated PDP via `src/data/pdp-sections.json` | Draft; hidden |

PDP data and integrations:

- The existing product id `317`, displayed price, rating and review count remain static; no price calculation or new product facts are introduced. The Design Studio CTA continues to use `https://www.photo-canvas.com/estore/startdesign/317`; selected size and wrap are not passed because no hand-off contract exists.
- The size selector retains the single sample option (40 × 60 cm). The page-owned configuration module updates only the visible size/wrap summary.
- Image mapping: `imgGalleryImage01MainMediaViewer`, the size-guide artwork and the quality image reuse `src/assets/images/hero-finish-preview.png`. Related format mockups reuse that same asset. The 360° thumbnail (`img3DWallpaperThumbnailArtwork.svg`) and wrap schematics (`imgSchematicTopEdgeGalleryWrap.png`) have no exact local matches and are intentionally not substituted.
- The existing product gallery keeps its thumbnail, previous/next, keyboard and full-screen dialog behavior. Its four available thumbnails remain synchronized with the gallery counter; the unmatched 360° thumbnail is reported as an asset gap.

## Foundations and assets

- Colours and typography map Figma variables in `src/scss/base/_root.scss`.
- Custom properties in `_root.scss` are design tokens only: colour, type, the shared spacing scale, radius, motion and layers. Widths, heights, offsets and column tracks are never variables. Figma frame measurements are references; the code uses fluid grid/flex tracks, `aspect-ratio`, padding and gap (`frontend-code-standards` §7.4). `npm run lint:tokens` enforces this and runs as part of `npm run build`.
- Fonts are self-hosted under `src/assets/fonts/`; upstream OFL notices are included alongside them.
- Figma SVG icons are stored in `src/assets/icons/`.
- Content images scale fluidly: `img` is `max-width: 100%; height: auto` globally, and each image slot declares an `aspect-ratio` taken from the relevant Figma frame (for example 790/324 CP hero, 660/512 craftsmanship, 429/242 CP journey, 4/5 cards). Widths and tracks use fluid layouts. The homepage container is capped at 1355px; a pixel-level desktop comparison has not been completed.
- The HP Figma frame repeats a floral placeholder across its image slots. The implementation uses the existing local category-specific production-style images under `src/assets/images/homepage/`; `src/assets/images/hero-finish-preview.png` remains in use by other pages.
- The CP reuses the same approved placeholder image and the existing Manrope, Instrument Serif and Phosphor assets. It adds only the plus/minus accordion SVGs and the CP-specific Phosphor icons already stored under `src/assets/icons/`.
- `scripts/build-html.js` inserts the shared header, newsletter and footer into the HP, CP and PDP documents, then copies the shared CSS, JS and assets into `dist/`.
- New PDP icons are inline Phosphor Regular SVG in a page sprite (`<symbol>` + `<use>`, `currentColor`), sized by `components/_icon.scss`. The thumbnail play affordance is the Figma export (two-tone, not a Phosphor Regular glyph). HP and CP icons remain `<img>` files.

## Validation completed

- `npm install` completed and reported zero vulnerabilities. npm noted that the optional `@parcel/watcher` install script was not approved; CSS compilation does not depend on it.
- `npm run build:css` completed successfully.
- `node --check` passed for the homepage JavaScript modules.
- At the 1600px Figma frame, the target container is 1355px wide; the shared announcement/header targets are 38px/88px. Browser evaluation confirmed the container width and header heights, but the integrated browser did not sustain a 1600px screenshot for pixel comparison.
- Fluid-layout check (28/10/2026, Edge, both pages): measured at 320, 375, 414, 600, 767, 768, 900, 1024, 1199, 1200, 1280, 1366, 1440, 1600, 1920 and 2560px. Horizontal overflow before the refactor: 12 of 32 page/width combinations (up to 824px wide at 320–768px). After: none, and with classic scrollbars the container gutters are symmetric. All 122 local `src`, `href`, CSS `url()` and module-import references in `dist/` resolve. Screenshots were reviewed at 375, 768, 1200 and 1600px, including the open Wall Art menu and the search dialog. A pixel comparison against Figma was not performed.
- Interaction smoke test (28/10/2026, Edge, 375 and 1600px): Wall Art menu, search dialog, finish selector, room tabs, newsletter validation and FAQ toggles. 30 of 30 checks passed, with no console errors apart from the missing `favicon.ico` (no icon link exists in the pages). The accessibility-tree snapshots of the header, breadcrumb, comparison facts list and FAQ item are identical before and after the refactor.
- Header width check (29/10/2026, headless Edge via Playwright run from the session folder, not a project dependency): `npm run build` passed. On the HP, CP and PDP at 320, 375, 767, 768, 1023, 1199, 1200, 1280, 1366, 1440, 1505, 1506, 1600, 1920 and 2560px (45 combinations): the header row is exactly 90% of the viewport and centred from 1200px, and the container width below it; the open Wall Art menu has the same left edge and width as the header row from 768px; the primary nav stays on one row from 1200px; no horizontal overflow. The only console error is the missing `favicon.ico`. Screenshots were reviewed at 1200 and 1600px with the menu open. W3C validation, a screen-reader pass and Lighthouse were not run.
- `npm run lint:tokens` passed, and a deliberate-failure test confirmed it rejects layout custom properties, `--space-<n>` values that are off the scale or mismatched, and undefined tokens.
- Browser checks passed for menu open/close, search filtering and Escape/focus return, finish selection and event payload, room-tab keyboard movement, and native email validation.
- The homepage now references dedicated local product and editorial assets. A complete image-decode pass was not completed.
- Browser checks confirmed finish selection, the responsive testimonial next control, required email validation, and no document overflow at tested 320/375/768/1200/1600 CSS widths. The integrated browser resets to its 1004px host width, so sustained 1600px screenshot comparison was not completed. Screen-reader and formal contrast audits remain outstanding.
- `npm run build` successfully generated both `dist/index.html` and `dist/wall-art.html`.
- PDP check (28/10/2026, headless Edge via Playwright run from the session folder, not a project dependency): `npm run build` passed (token lint, Sass, HTML); `node --check` passed for the new module. No horizontal overflow on HP, CP or PDP at 320, 375, 768, 1200 and 1600px; no console errors; every image decoded. At 1600px the PDP is 5755px tall (Figma 5808px). Section-by-section screenshots were compared side by side with the Figma render of `3230:7472`. Gallery next/previous (with wrap-around), thumbnail selection, arrow keys, live announcements, full-screen dialog (focus to Close, Escape closes, focus returns to the trigger), radio arrow-key selection with visible focus and selected state, and native FAQ toggling were verified in the browser. CP breadcrumb, FAQ and badges and the HP badges, trust strip and Wall Art menu were re-checked after the shared-component moves. W3C validation, a screen-reader pass and Lighthouse were not run.

## Known gaps before production

- The HP uses separate local assets under `src/assets/images/homepage/` for the relevant finish, format, journey, quality and factory slots. `hero-finish-preview.png` remains for other pages and is no longer used as homepage product photography.
- Figma provides Living room copy only. Bedroom, Kitchen & dining and Office now have user-approved editorial copy (04/11/2026); the existing shared image is retained, not room-specific imagery. All room-panel links were removed at the user's request on 04/11/2026.
- The newsletter endpoint and homepage Design Studio destination have not been supplied. Newsletter email validation works but does not submit; the primary hero CTA uses the existing local Wall Art route pending route-owner confirmation. Account and basket controls remain disabled.
- Numeric product ratings in Figma were omitted because they were not verified against the live source. Testimonial text is carried over from the Figma design and should be confirmed before production use.
- The Accessibility URL shown in Figma returned 404; the shared footer links verified Privacy, Terms and Cookies destinations.
- The CP frame includes five collapsed FAQ questions without answer copy. The implementation uses generic format-dependent guidance for those opened answers; exact approved copy is still needed.
- Figma-specified claims and product specifications (including guarantee, materials, paper weight and size options) must be confirmed against current business/product sources before launch.
- The shared footer now follows the HP grouping while retaining existing navigation destinations; no unverified policy links were added.
- Full CP visual and interaction QA is still required. Figma was inspected read-only; no code-to-Figma writes were made.
- Tablet and mobile layouts are fluid derivations. No Figma tablet or mobile frames exist, so they have not been reviewed against an approved design. Sass watch mode has not been validated.
- PDP: `hero-finish-preview.png` is reused only for the matching patterned artwork in the main gallery, size guide and quality image. The Figma 360° thumbnail and wrap schematic have no exact local matches; neither is replaced with a different asset. The hidden room section remains in source.
- PDP: the Design Studio hand-off contract, the verified size list, per-size or per-wrap pricing and the analytics hooks used on the live page are not available. The selectors are UI state only.
- PDP: four FAQ answers are composed from copy elsewhere on the approved frame (wrap cards, trust strip, delivery table, care note); "What resolution does my photo need?" reuses the approved CP answer. Approved FAQ copy is still needed.
- PDP: the testimonials are taken from Figma and not verified against the review source. "Ships in 1–2 days" follows Figma and the live meta description; the live page also says "Ready same day (before 12pm Mon–Fri)".
- PDP: the Figma footer differs from the shared footer (Shop links, legal row). The shared footer was not changed.
- PDP Figma links point to wallpaper PDFs (size guidance, fire certificate). The code uses live canvas routes instead: `/canvas-sizes`, `/canvas-types` (wrap tips) and `/help` (care guidance).
