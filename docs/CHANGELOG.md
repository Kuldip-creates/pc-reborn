# PC Reborn changelog

Dates are DD/MM/YYYY. Change classes are defined in `.github/instructions/pc-reborn-component-system.instructions.md` §9.

## 05/11/2026 - Approved PDP Sections 03 and 10 Refresh

- **Change class:** Visually breaking section updates; behaviour-changing accessible delivery tabs.
- Updated only the Large Canvas Prints gallery/purchase panel and delivery/how-it-works section to the approved Section 03 and Section 10 frames. Kept the Design Studio route, existing price/review values, gallery controller and hidden size/wrap configuration in place. Added the approved local 360-degree thumbnail artwork.
- Added page-scoped UK, International and Returns tabs. Delivery claims and destinations use the existing PDP content and the current Photo Canvas delivery/returns pages; unverified Figma-only delivery price and timing claims were not added.
- Validation: `npm run build` passed (49/49 tokens, Sass and all generated pages). Browser checks confirmed 1600px layout geometry (1355px container; 600/695px and 620/686px columns), five-item gallery selection, previous/next, fullscreen close/focus return, all three tab panels, ArrowLeft/ArrowRight/Home/End state and focus movement, hidden legacy controls, retained configuration summary updates, unchanged Design Studio URL and no console errors. Both updated sections had no internal overflow at 320, 375, 768, 1200 and 1600px. At 320px the document remains horizontally scrollable from the unchanged shared header (347px document width / 305px client width); no shared files were changed. W3C validation, screen-reader, contrast and Lighthouse checks were not run.

## 04/11/2026 - Remove Room Tab Content Links

- **Change class:** Behaviour-changing, user-requested removal.
- Removed links from all four room panels on Wall Art and the retained homepage source. Removed unused room-link styling; copy, imagery, tab selection and keyboard switching remain unchanged.
- Validation: `npm run build` passed. Source and generated HTML assertions confirmed four panels without links; Edge verified all four selections, retained copy, Home-key activation and Tab movement through the selected panel to outside the section. W3C, screen-reader and fresh responsive/Figma checks were not run for this link-only removal.

## 04/11/2026 - Room Tab Content Switching

- **Change class:** Behaviour-changing and accessibility-critical; shared room-tab fix approved in chat.
- The previous initializer changed selection and announced a Living-room-only limitation without switching content. Added a uniquely labelled static panel for each room and synchronised visibility, selection, roving focus and live announcements for mouse and keyboard activation.
- Retained Living room content, the existing image, product destination and layout. Other rooms use user-approved drafted editorial copy without new product claims. Updated both the active Wall Art section and the retained homepage source; homepage section visibility is unchanged.
- Added token-based keyboard outlines for tabs, panels and CTA links within this section because the global reset suppressed them. Initialisation supports multiple sections and is idempotent; incomplete tab/panel mappings raise an explicit error.
- Validation: JavaScript syntax and `npm run build` passed (49/49 tokens, Sass without warnings, all four pages). Isolated Edge checks passed for all four rooms at 320/375/768/1200/1600px with no section or document overflow; arrows, wrap-around, Home/End, Enter/Space, panel/link tab order and visible tab focus passed. Multiple instances, reinitialisation, 40 rapid selections and live-announcement suppression passed; all four retained homepage source panels worked and generated homepage visibility remained unchanged.
- Desktop/mobile screenshots were inspected. Existing text contrast measured 5.98:1/17.90:1 against white; the focus outline reuses the 17.90:1 near-black token. No JavaScript runtime exceptions occurred; a resource 404 console message remains. W3C validation (no local validator), screen-reader, zoom, forced-colour, real-device touch, Figma pixel comparison and Lighthouse checks were not run.

## 04/11/2026 - Wall Art Print Preview Popover Position

- **Change class:** Non-breaking, section-scoped positioning bug fix.
- The popover's `bottom: 100%` resolved against the whole Wall preview figure, placing it above the image. The Print preview control is now the popover's positioned containing block, so the popover opens directly above the button, flush with its top and right edges. The caption/control row is a size container, and the popover width uses container units (80% mobile, 50% tablet, 40% desktop of the row) so it no longer covers most of the wall preview. Images, JavaScript, tokens and shared layout are unchanged.
- Validation: `npm run build` passed. In the integrated browser, popover geometry was measured at 320, 375, 768, 1200 and 1600px: its bottom matched the button top and its right edge matched the button right edge, with no added horizontal overflow. Mouse hover opened it at 375, 768 and 1600px; a desktop screenshot was inspected.
- W3C, keyboard, screen-reader, real-device touch, Figma comparison and Lighthouse checks were not re-run for this fix.

## 04/11/2026 - Shared Wall Art Navigation

- **Change class:** Behaviour-changing and accessibility-critical, shared header on all four pages.
- Made Wall Art a direct link to `./wall-art.html` while retaining the desktop hover submenu. Added a separate, labelled desktop disclosure for keyboard and touch, and a direct link alongside the native Wall Art disclosure in the mobile menu. Other categories retain their existing activation behaviour.
- Kept the desktop Wall Art link functional without JavaScript and corrected focus restoration so Escape closes a desktop menu without reopening it. Reused existing tokens and the Phosphor caret artwork.
- Validation: `npm run build` and JavaScript syntax checks passed. Desktop hover and direct navigation passed on all four pages at 1200px and 1600px; keyboard checks covered Tab, ArrowDown, Escape, Space, arrow navigation and Enter. Headless Edge passed 16 mobile touch checks, desktop touch disclosure and no-JavaScript navigation.
- Touch emulation showed no horizontal overflow at 320px, 375px, 768px or 1199px; desktop-window checks passed at 375px, 768px, 1200px and 1600px. At 320px with a desktop scrollbar, existing overflow was 1px on the homepage and 15px on the other pages. New text and icon contrast measured 17.90:1 against white; lifecycle reinitialisation and browser JavaScript error checks passed.
- W3C validation was not run because no local validator was available. Screen-reader, zoom, forced-colour and pixel-level Figma screenshot checks were not run.

## 04/11/2026 - Wall Art Category Newsletter Layout Fix

- **Change class:** Non-breaking, Wall Art category newsletter bug fix.
- Added `.page-category` to `src/wall-art.html` and enabled the existing homepage/PDP newsletter field, button sizing and desktop form layout for that page. Reused the PDP keyboard-focus treatment. Shared markup, submission behaviour, homepage and PDP presentation remain unchanged.
- Validation: `npm run build` passed (49/49 tokens, Sass and all four pages). Browser assertions passed at 320, 375, 768, 1200 and 1600px for the category newsletter: bordered 56px field/button, stacked controls below desktop, side-by-side controls from 1200px and no newsletter overflow. Ten homepage/PDP responsive regression checks passed.
- Category required/invalid email, keyboard movement, visible input/button focus and Enter submission with the existing disconnected-endpoint message were checked. Existing page-level 320px overflow remains outside the newsletter scope.
- W3C validation, screen-reader testing, a fresh contrast audit and Figma pixel comparison were not run. No new colour pairs or tokens were introduced; no signup endpoint is connected.

## 04/11/2026 - PDP Newsletter Layout Fix

- **Change class:** Non-breaking, Large Canvas Prints newsletter bug fix.
- The shared newsletter's bordered field, matching button sizing and desktop two-column form were restricted to `.page-home`. Added `.page-pdp` to the product page and included it in those existing selectors. The homepage, category page, shared markup, related products and submission behaviour are unchanged.
- Added visible keyboard-focus outlines for the PDP newsletter input and button using existing tokens.
- Validation: `npm run build` passed (49/49 tokens, Sass without warnings, all four HTML pages). Browser assertions passed at 320, 375, 768, 1200 and 1600px: 56px field/button sizing, stacked controls below desktop, side-by-side controls from 1200px and no newsletter overflow. Homepage and category newsletter geometry retained their previous behaviour at all five widths.
- PDP keyboard checks passed for required/invalid email, Tab to the submit button, visible focus on both controls and Enter submission announcing the existing disconnected-endpoint message. No console errors were captured. Existing text/button contrast is 17.90:1 and field-border contrast is 5.98:1 against white.
- Remaining checks: W3C validation, screen-reader testing and Figma pixel comparison were not run. Existing whole-page overflow at 320px remains outside the newsletter (the body has a 320px minimum width despite the scrollbar); shared header/body rules were not changed. No signup endpoint is connected.

## 04/11/2026 - Homepage Testimonials Layout Fix

- **Change class:** Bug fix (non-breaking), Homepage testimonials carousel only.
- At ≥1200px the carousel modifier's `grid-template-columns: none` out-ranked the three-column rule, and the `md` media block followed the `lg` block, so Homepage reviews stacked in a single half-width column. Reordered the media blocks (mobile-first) and applied the three-column grid to the carousel modifier at `lg`. PDP testimonials (no carousel modifier) are unaffected.
- Added `role="img"` to Homepage star ratings so their `aria-label` is valid, matching the PDP.
- Validation: `npm run build` passed. Browser measurements on `dist/index.html`: 1600px and 1200px show three equal cards in one row; 900px and 768px show two cards per view with scroll-snap; 375px and 320px show one card per view; no horizontal page scroll at any width.

## 04/11/2026 - Approved Photo Canvas PDP Refresh

- **Change class:** Visually breaking PDP section order and purchase-panel presentation; page-specific selection-summary behavior.
- Updated the existing Large Canvas Prints PDP to the approved desktop frame `3752:13010`. Reordered the existing sections, included the existing shared newsletter partial, and retained the shared header/footer implementations unchanged.
- Added build-time PDP section visibility using `src/data/pdp-sections.json`. Rooms inspiration and the CTA band remain in source but are omitted from generated PDP HTML.
- Kept the existing gallery module and Design Studio destination. The page-owned configuration module synchronises the selected sample size and wrap in the visible setup summary without changing prices or the hand-off URL.
- Reused `src/assets/images/hero-finish-preview.png` for matching artwork. The 360° thumbnail and wrap schematic assets are not present locally; no substitute was added.
- Validation: `npm run build` passed (49/49 tokens, Sass and all four generated pages); `node --check` passed for the build script and PDP module. Generated-HTML assertions passed for section order/visibility and source retention, one newsletter include, four gallery thumbnails, the unchanged CTA URL and local asset references. A focused PDP module check confirmed that size and wrap selections update the visible summary. Browser visual/responsive comparison, W3C validation and manual keyboard/screen-reader checks were not run.

## 04/11/2026 - Approved Wall Art Category Refresh

- **Change class:** Behaviour-changing and visually breaking, category section visibility and Homepage hero preview; cross-page scope approved.
- Updated the Wall Art category to Figma frame `3752:12354`: compact hero, eight format cards, native FAQ and active Shop by Room section. Disabled the obsolete ideas, comparison, how-it-works and craftsmanship sections through `src/data/wall-art-sections.json`; the build omits disabled category markup while retaining its source for reactivation.
- Reused the existing `src/assets/images/hero-finish-preview.png` for all category image slots and all four Homepage hero finish states. The finish selector continues to update selection and status, but the preview image no longer changes between finishes by explicit approval.
- Updated stale internal anchors to visible destinations. Header, newsletter and footer partial source files were not changed.
- Validation: `npm run build` passed (49/49 tokens, Sass and all four generated pages); `node --check` passed for the build script and updated JavaScript modules. Generated-HTML assertions passed for active section order/visibility, eight card names/prices/destinations, the single expanded FAQ, four room tabs, approved imagery, Homepage selector sources, local fragments and asset references. Browser-based visual comparison, W3C validation and manual keyboard/screen-reader checks were not run in this environment.

## 04/11/2026 - Approved HP Desktop Homepage Refresh

- **Change class:** Behaviour-changing and visually breaking, homepage section structure; shared header/footer presentation affects all four generated pages (cross-page scope approved).
- Updated the existing homepage to Figma frame `3752:11954`: matched the desktop header/announcement dimensions, hero copy and finish control, trust strip, four product highlights, eight format cards, quality benefits, personalisation steps, London factory story, testimonials, newsletter layout and footer grouping.
- Disabled Shop by room and Ideas for your walls through the existing homepage visibility configuration while retaining their markup, styles and room-tabs initializer. Added the quality section by reusing the Wall Art page's quality classes and Phosphor assets.
- Replaced repeated placeholder photos with local category-specific assets under `src/assets/images/homepage/`. Current product prices and review counts shown were checked against Photo Canvas product pages. The hero selector maps four local finish previews and retains the existing internal `metal` event value for its visible Aluminium label.
- Added homepage-only testimonial scrolling over the three supplied reviews, with real-end disabled controls and reduced-motion handling. Newsletter validation remains, but there is no endpoint for submission states. The Design Studio's canonical homepage route was not available; the primary CTA currently uses the existing local Wall Art route pending route-owner confirmation.
- Updated the shared footer and its homepage link to the visible format section; existing destinations remain. Privacy, Terms and Cookies use verified destinations. The Figma Accessibility URL returned 404 and was omitted. Account/basket controls, search, desktop menus and mobile drawer were not changed.
- Validation: `npm run build` passed (49/49 tokens, Sass, all four pages); editor diagnostics found no errors. Browser checks confirmed no document overflow at tested 320/375/768/1200/1600 CSS widths, a 1355px desktop container, 38px/88px announcement/header at a fresh 1600px CSS evaluation, finish image/status updates, mobile testimonial scrolling and native required-email validation. Full asset decoding and sustained 1600px screenshot/pixel comparison were unavailable because the integrated browser resets to its 1004px host width. W3C, contrast, screen-reader and cross-page interactive checks remain outstanding.

## 04/11/2026 - Submenu Category Heading Hierarchy

- **Change class:** Visually breaking, shared across all four generated pages; explicitly approved in chat for all four category headings.
- Increased desktop submenu headings from muted 12px/16px to near-black 14px/20px semibold, retaining uppercase and increasing the bottom margin from 8px to 12px. Reused existing tokens; no decoration, link, interaction or mobile-navigation change.
- This is a user-approved departure from the Figma heading treatment. Figma remains unchanged.
- Validation: full build/token lint passed; 32 rendered-heading checks and 20 page/width overflow checks passed in headless Chrome, plus 12 mobile-dialog/focus-return checks. Heading/white contrast is 17.90:1. W3C, screen-reader and cross-browser checks were not run.
- Recorded, but did not change, pre-existing Escape/focus menu reopening and the preview's `/favicon.ico` 404.

## 04/11/2026 - Header and Mega Menu Figma Review Fixes

- **Change class:** Behaviour-fixing and visually breaking, shared header on all generated pages; compared with Figma node `3752:11954` (menus `3776:1365`, `3195:4793`, `3776:1390`, `3776:1414`).
- Fixed all four mega-menu panels rendering at once: `.mega-menu__panel` `display: grid` overrode the `hidden` attribute.
- Fixed pointer clicks closing the menu just opened by hover (mouse) or focus (touch tap). Mouse clicks now keep the menu open; touch and keyboard toggle from the pre-press state.
- Fixed the 90px (320px) and 35px (375px) horizontal overflow: the shared `.icon-button` display overrode the hidden account/bag actions below `md`. Fixed the feature CTA likewise being overridden by `.button` (now 48px, 16/24 as Figma).
- Aligned with Figma: links top-aligned with 8px gap and 22px rows; divider at 727.5px of the container (291fr : 251fr); feature panel on `surface-secondary`, 8px radius, 16px padding, 48px from the divider (Figma 50px) and 16px from the container end (Figma 17.5px); divider and bottom border use `surface-secondary`; framed, canvas, wallpaper and mug mockups re-proportioned to the 190 × 228 Figma geometry, with mug layers now percentage-based so they scale at 1200px.
- Menu height stays content-driven (343.5px / 397px vs Figma's fixed 410px); menu padding-block 32px top / 48px bottom.
- Validation: `npm run build` passed (token check 49/49, Sass, all four pages); `node --check` passed. Headless Chrome checks: geometry at 1600px, no horizontal scroll at 320/375/768/1024/1200/1600px on all four pages, hover/touch/keyboard/Escape/mobile-dialog interactions, no console errors. W3C, formal contrast and screen-reader checks not run.

## 04/11/2026 - Shared Header Navigation and Homepage Visibility

- **Change class:** Behaviour-changing and visually breaking, shared across all generated pages; approved desktop Figma frames supplied in chat.
- Replaced the previous header menu with four category triggers in the approved order: Wall Art, Canvas Prints, Wallpaper and Photo Gifts. Independent desktop panels and mobile disclosures now use `src/data/site-navigation.json`; the local Large Canvas Prints links continue to resolve to `./large-canvas-prints.html`.
- Added desktop pointer, click and keyboard menu behaviour and a native mobile navigation dialog. Mobile and tablet presentation follows existing responsive conventions because no corresponding Figma frames were supplied; it is not described as Figma-matched.
- Omitted the homepage “Ideas for your walls” section from generated HTML using `src/data/homepage-sections.json`, retaining its source and styles. Redirected the homepage footer's inspiration link to the Wall Art category page.
- `npm run build` passed: token check (49 tokens, 49 referenced), Sass compile and generation of all four pages. Generated HTML inspection confirmed the four category triggers, per-page active category, four category panels, no homepage “Ideas for your walls” section and the local Large Canvas Prints route.
- Integrated-browser interaction tests could not be run because the opened page handle was unavailable to the browser interaction tools. Manual keyboard/screen-reader, formal contrast, W3C validation and screenshot comparison remain outstanding.

## 04/11/2026 - Review Preview and Resolution Estimate

- **Change class:** Behaviour-changing and visually breaking, page-local; Review reference supplied in chat.
- Moved the Wall preview badge inside the image scene and the existing Print preview control into a caption/utility row below the image. Existing popover, canvas rendering, crop, format and finish state remain the source of the preview.
- Structured the Review quality text as a neutral local-resolution estimate that includes the selected dimensions and updates through the existing render path. Production validation is explicitly unverified.
- No production PPI thresholds, quality service, live catalogue or basket service was found. No Good/Acceptable/Low band or production success is fabricated. No approved green/amber token exists, so the badge dot and status remain neutral; a green token needs separate approval.
- Validation: `npm run build`, module syntax and editor diagnostics pass. Browser check covers sample selection, size and crop changes, Review output and Print preview toggle. Responsive Review geometry checked at 320/375/768/1200/1600px. Manual screen reader, physical keyboard, formal contrast and W3C validator checks remain outstanding; existing 320px shared body overflow is unchanged.

## 03/11/2026 - Final Step 01 Reference Refinement

- **Change class:** Behaviour-changing and visually breaking, page-local; latest reference supplied in chat.
- Centred the desktop stepper in equal columns with balanced connectors and existing 32px introduction spacing. Kept mobile progress and dynamic stage state.
- Enlarged the contained photo on the existing warm-neutral surface and the desktop gallery to 184px cards with 4:3 thumbnails. Selected borders compensate padding to avoid layout shift. Overflow targets are 32px desktop and 44px touch.
- Added confirmed Delete all to the gallery header alongside sample access. Clears IndexedDB transactionally before removing local state/URLs; cancellation and errors retain photos. Original device files and selected samples are not deleted.
- Removed Exit designer. The selected-image thumbnail, count and Continue arrow now sit in a centred dock capped at 900px (78px desktop height), stacked on mobile and contained before the footer. No new tokens, dependencies, assets, shared shell or service contracts.
- Checks: full build/token lint and module syntax; real browser upload, bulk-delete cancellation/success/persistence/failure, selected-sample retention, navigation, responsive geometry and isolated touch-menu tests. Measured primary/white contrast 17.90:1 and muted/white and dock-border/white 5.98:1. Manual screen reader, full keyboard, W3C and cross-browser sign-off remain outstanding. Existing shared 320px body overflow remains unchanged.

## 03/11/2026 - Photo Gallery, Progress and Action Dock Refinement

- **Change class:** Behaviour-changing and visually breaking, page-local; latest UX reference supplied in chat.
- Replaced persistent Delete overlays with compact Phosphor overflow disclosures and a separate Delete photo action. Normal cards use a subtle border; selected cards use one 2px primary border and check indicator; keyboard focus remains distinct. Added a compact Add photo tile that reuses the existing file input.
- Made progress state data-driven for completed/current/upcoming stages, with a connected desktop stepper and compact mobile label/progress bar.
- Constrained the in-designer sticky action dock to 760px on desktop, with Exit and Continue actions, optional selection status, safe-area padding and no viewport-wide background strip or shadow.
- Validation: `npm run build`, module syntax and editor diagnostics pass. Browser tests cover normal/selected cards, unselected-photo deletion without selection change, selected-photo deletion, empty-gallery gating, responsive progress states, 760px desktop dock, narrow mobile dock and sticky boundary. Component has no new overflow at 375–1600px; the existing shared 320px body-minimum overflow remains. Formal W3C, contrast, screen-reader and physical-key checks remain unrun.

## 03/11/2026 - Photo-First Designer Step 01

- **Change class:** Behaviour-changing and visually breaking, page-local; approved UX screenshot supplied in chat. No new Figma node or named version was supplied.
- Reworked the existing Photo stage into an unframed upload/preview workspace, a horizontal uploaded-photo gallery, and an on-demand native sample dialog. The selected image appears only in the main preview; an empty gallery is hidden.
- Added chunked gallery rendering (20 thumbnails initially, then 20 more on request), a contextual Exit/step/Continue bar sticky within the designer on desktop and mobile, and a focus-returning sample dialog.
- Preserved local file validation, IndexedDB originals/thumbnails, gallery selection/deletion and sample state; no samples are saved to the uploaded library. Fixed the submit handler's undefined `view` reference and added duplicate-navigation locking.
- No shared header/footer, tokens, dependencies, other pages or production services changed. Existing 320px shared body-minimum overflow remains.
- Validation: `npm run build` and Node module syntax check pass. Browser checks cover two uploads, selection, selected-photo delete, sample dialog open/close/select, navigation, responsive widths 320/375/667/768/1200/1600px and sticky release above the footer. Escape handler was invoked via a DOM-dispatched key event because physical key automation was unavailable. Manual screen reader, formal contrast and W3C checks remain unrun.

## 03/11/2026 - Four-Stage Wall Art Designer

- **Change class:** Behaviour-changing and visually breaking, page-local; approved UX screenshot supplied in chat. No new Figma node or named version was supplied.
- Refactored the existing flow to Photo, Choose & customise, Crop & edit, and Review, with persistent stage progress, backward navigation, review edit shortcuts and an honest disabled basket action.
- Added a browser-local IndexedDB photo gallery for originals and generated thumbnails, separate from sample photos. Selection, duplicate detection, metadata, confirmed deletion and visit-only fallback when storage is unavailable are implemented. Photos are not uploaded or saved to an account.
- Added a larger selected-photo preview, pointer crop positioning, keyboard-operable position controls, 90-degree rotation, reset and a local PPI estimate that explicitly does not claim production validation.
- No shared header/footer, tokens, dependencies, other pages, live catalogue, pricing, production service or basket contract changed. Full product configuration, pricing and basket addition remain blocked on service contracts.
- Validation: `npm run build`, module syntax check, browser stage/upload/reload/delete/crop/rotate/review smoke checks passed. Four stages had no component overflow at 320/375/768/1200/1600px. The existing shared 320px body minimum still causes 15px document overflow at a 305px classic-scrollbar viewport. Screen-reader, formal contrast and cross-browser checks remain unrun.

## 30/10/2026 - Wall Art Desktop Crop Layout

- **Change class:** Behaviour-changing and visually breaking, page-local; explicitly requested in chat.
- Balanced the desktop crop preview and control columns and reduced control spacing to bring the crop step closer to the first viewport. Moved Change photo to an icon-and-label button over the preview and removed the visible step announcement from the action footer; heading focus remains on navigation.

## 30/10/2026 - Wall Art Print Preview Popover

- **Change class:** Behaviour-changing and visually breaking, page-local; explicitly requested in chat.
- Moved the print canvas from below the wall scene into a bottom-right icon-and-title control. Hover and keyboard focus reveal the popover; click pins it for touch, and Escape dismisses it. Accessible expanded/hidden states follow the interaction.
- Added subtle step-entry and popover transitions, disabled when reduced motion is requested. The same canvas and state continue to power review and preview download; no services or design data changed.

## 30/10/2026 - Wall Art Image-Only Preview Popover

- **Change class:** Visually breaking, page-local; explicitly requested in chat.
- Removed the popover heading and caption so only the preview image remains. Enlarged it to 95% of the scene on mobile and 65% on desktop; hover remains limited to the trigger and preview surface.

## 30/10/2026 - Wall Art Selected Photo Card

- **Change class:** Behaviour-changing and visually breaking, page-local; explicitly requested in chat.
- Replaced the Beach day sample tile with the selected-photo card. It shows the current decoded image, filename, pixel dimensions and local file size, with accessible Replace and Delete icon controls. Forest lake remains available as a sample; existing validation and object-URL cleanup are reused.

## 30/10/2026 - Wall Art Upload Tile States

- **Change class:** Behaviour-changing and visually breaking, page-local; explicitly requested in chat.
- Replaced the first sample tile with a thumbnail upload prompt. The selected-photo card and Replace/Delete controls now appear only for uploaded files; deleting restores the upload prompt in place. Forest lake remains visible and selectable.

## 30/10/2026 - Option Tiles Without Radio Circles

- **Change class:** Visually breaking, page-local; explicitly requested in chat.
- Applied the existing visually-hidden utility to all 18 wall-art option radios: format, crop ratio, configuration format, size and orientation. Native radio roles, labels and selection behaviour remain intact.
- Retained selected-tile borders, added a heavier selected label and whole-tile focus outline. No JavaScript, shared tokens, dependencies or other pages changed.
- Build passes. Browser checks confirm clipped inputs, label-click selection and focus styling; mobile screenshot inspected. Full keyboard retest remains pending because integrated-browser arrow-key automation was inconclusive.

## 30/10/2026 - Minimal Wall Preview Backdrop

- **Change class:** Visually breaking, page-local; explicitly requested in chat.
- Replaced the furnished room with a locally served, licensed minimal concrete-wall photograph; updated preload, alt text and intrinsic dimensions. Source: Henry & Co., [Pexels 9848750](https://www.pexels.com/photo/close-up-shot-of-a-white-concrete-wall-9848750/), [Pexels licence](https://www.pexels.com/license/).
- Centred all frame size/orientation variants using one media-relative anchor. The largest portrait no longer extends below the scene. Removed the furniture overlap without changing photo crops, options, shared components or tokens.
- Moved the Wall preview label above the image to avoid covering tall portrait frames on mobile. Browser geometry checks pass for all 150 format/finish/size/orientation/width combinations; desktop/mobile screenshots inspected and full build passes.
- Preserved the user's recent partial content edits. Original room asset and Figma remain unchanged.

## 30/10/2026 - Full Local Wall-Art Flow

- **Change class:** Behaviour-changing. Full interactive frontend prototype approved in chat, superseding the earlier reduced scope below. Production Design Studio/basket remain separate and unmodified.
- **Files:** restored the already-registered page/partial/SCSS/module; added component contract and exact Figma forest image; updated design map. Existing build configuration, shared imports, header/footer, tokens and dependencies are unchanged.
- **Behaviour:** six responsive screens share one form and state. Native format/options controls, local file validation, cancel/replacement race protection, crop/zoom/position controls, matching room/print previews, review, preview export and explicit demo basket presentation. Back retains edits; removal/reset/destroy clear images and release object URLs.
- **Service boundaries:** no fabricated prices, production quality approval, uploads, remote saving or successful basket requests. Custom size and production compatibility need catalogue contracts. Figma example sizes/finishes are explicitly illustrative; all photos are local to the current page visit.
- **Design mapping:** all desktop/mobile steps plus edge references under `3743:2332`. Existing 32px title, 12/14px UI type and 8px corners retained instead of introducing unapproved tokens; 20px mobile gutters map to existing 24px, 10px gaps to 12px and 15/17px badge insets to 12px. No green/red/shadow tokens added. Fixed frame heights are replaced with content-driven layout. Crop ranges replace drag/pinch; front-view preview sits below room composition. Status labels distinguish demo from production.
- **Validation:** full build passes; exact hashes verified for all three assets; new content passes W3C with zero messages. Browser flow and file-state checks run; detailed results and remaining shared-page limitations are recorded in `docs/components/wall-art-preview.md`.

## 30/10/2026 - Wall Art Preview

- **Items:** new `src/personalise-wall-art.html`, reusable `src/partials/wall-art-preview.html`, scoped SCSS/JS and exact local Figma assets; build page/partial registration and guarded main imports.
- **Change class:** Non-breaking. Existing pages, header/footer, tokens, dependencies and component APIs unchanged.
- **Approved scope:** format selection and local photo preview only. Four format choices update the caption/destination. Local JPEG/PNG/WebP preview guards size/decode errors, stale selections and object-URL cleanup; photos are never uploaded, stored or transferred. Existing Studio/product links are used; no simulated checkout/basket success.
- **Figma:** desktop `3743:3160`, mobile `3743:3663`, under flow `3743:2332`. Named version not supplied; remains Draft. Full crop/personalise/review/basket flow excluded by the user's scope choice.
- **Spacing mappings:** tile gap 10px mobile / 16px desktop -> shared 12px; tile inset 10px -> 12px; preview badge inset 15/17px -> 12px. The existing container's 24px gutters remain instead of mobile Figma's 20px. Desktop section padding remains 48px; mobile 24px. Fixed frame heights/unused space are not reproduced.
- **Token gaps:** Figma mobile heading 28px, 9/10/13px UI text and 10/12/14px corners are not introduced as new tokens. Existing heading/UI/control/media patterns are reused and exact matching remains unresolved. Native radios are visible; the room caption makes clear that this is a composition, not a physical-finish rendering. Actions remain in flow rather than a fixed mobile dock.
- **Validation:** build and editor diagnostics pass; module edge-case checks with DOM/Image doubles pass; new content passes W3C validation; checked contrast pairs range 5.68:1-17.90:1. Full HTML has one existing shared-header `aria-label` error, left untouched. Browser open works but automation loses the page ID; native Edge debugging also unavailable. Responsive screenshots/overflow, real file decoding, keyboard/screen reader/zoom and Lighthouse remain unverified. Full details in `docs/components/wall-art-preview.md`.

## 29/10/2026 — Header width on desktop

- **Items:** shared header row (`.site-header__inner`) and Wall Art mega menu (`.mega-menu__inner`) on the HP, CP and PDP.
- **Change:**
  - From 1200px up, both use `width: 90%`, centred, instead of the shared container width. Below 1200px they keep the container (24px gutters). Only `layout/_site-header.scss` changed: no markup, token or `.container` change.
  - The mega menu follows the header so its columns stay aligned with the brand and the action icons.
- **Change class:** Visually breaking (small): the header content edges no longer line up with the page container, which stays at `min(100% - 48px, 1355px)`. Approved as a Type D change.
- **Visible differences (header content, before → after):**
  - 1200px: 24px → 60px each side (1152 → 1080px wide).
  - 1440px: 42.5px → 72px (1355 → 1296px).
  - 1600px: 122.5px → 80px (1355 → 1440px).
  - 1920px: 282.5px → 96px (1355 → 1728px).
  - The header is wider than the container above 1505px and narrower below it. Header height (85px, 121px with the announcement bar) and every other section and the footer are unchanged.

## 28/10/2026 — Photo Canvas PDP (Large Canvas Prints, desktop)

- **Items:** new page `src/large-canvas-prints.html` (Figma `3230:7472`); shared badge, breadcrumb, FAQ, button, trust strip and format card; HP, CP and header links.
- **Change:**
  - Added the PDP: breadcrumb, gallery with full-screen dialog, purchase panel (native radio option groups, native size select, Design Studio link), trust strip, size guide, wrap cards, testimonials, room inspiration, quality and care, delivery table, FAQ, related formats and CTA band. Registered in `scripts/build-html.js`; gallery module added to `js/main.js`.
  - Moved `.badge` unchanged from `sections/_home-bestsellers.scss` to `components/_badge.scss`.
  - Renamed the CP-only breadcrumb and FAQ to shared blocks: `.cp-breadcrumb` → `.breadcrumb` (`components/_breadcrumb.scss`; the list now wraps); `.cp-faq`, `.cp-faq__*` → `.faq`, `.faq__*` (`components/_faq.scss`), with a `.faq--ruled` modifier for the PDP's final divider. `wall-art.html` was migrated in the same change; no page uses the old names.
  - Added `.button--block`, `.trust-strip--pdp`, `.format-card--related` and `.format-card__row`, plus new components `.icon` (inline SVG sizes and sprite) and `.select-field`.
  - Re-pointed 10 links (HP 5, CP 3, header partial 2) from the live `…/large-canvas-prints` page to `./large-canvas-prints.html`. The header link is the mega-menu "Canvas Prints" item, so its label is broader than the page.
- **Change class:** API-breaking for `.cp-breadcrumb` and `.cp-faq*` (renamed; all usages migrated in one change, approved). Non-breaking for the other additions. No token was added or changed.
- **Off-scale Figma values mapped to the nearest `--space-*` token (ties use the smaller step):** gallery/panel gap 56 → 48; panel stack gap 14 → 12; thumbnail gap 10 → 8; option text inset 10 → 8; trust icon gap 18 → 16; trust description gap 5 → 4; wrap card inset 13 → 12; wrap bullet gap 10 → 8; bullet dot 5 → 4; quality column gap 55 → 48; quality row gap 10 → 8; room section top padding 40 → 36; CTA band padding 38/22 → 36/24; gallery dialog padding 40 → 36; select height 40 → 38.
- **Values without a token (nearest token used):** radii 6px (wrap image, gallery counter) → `--radius-media` / `--radius-input`; 3px (room images) → `--radius-input`; the size-guide dimension line `rgba(102,99,94,.55)` → `--color-border-interactive`; step dividers `rgba(102,99,94,.16)` → `--color-border-subtle`; lightbox title 18/24 → `--font-size-body` (16/24); gallery control icon 18px → 20px (`.icon--md`).
- **Deliberate differences from Figma:**
  - Selected option tiles and the current thumbnail get a second 1px ring, so state is not shown by colour alone (Figma: 1px border, fill 1.05:1).
  - The testimonials and the final CTA reuse the existing HP button and section patterns: 52px button (Figma CTA 48px, 15px semibold); "Read all reviews" is not permanently underlined.
  - Fixed Figma card and row heights are not reproduced.

## 28/10/2026 — Fluid layout; layout custom properties removed

- **Items:** shared header, footer, button and icon button; every homepage section; every Wall Art category section.
- **Change:**
  - Removed all `--layout-*` and `--cp-*` custom properties and the one-off `--space-*` aliases (30, 34, 38, 40, 46, 47-5, 55, 60, 68, 97-5, header-links, header-navigation, format-grid, review-grid, factory-gallery).
  - Widths, heights, offsets and column tracks now come from fluid grid/flex tracks (`fr`, `minmax(0, 1fr)`), `aspect-ratio`, padding and gap. Controls are sized by padding and line-height.
  - Removed the absolute hero positioning, fixed and minimum heights, `100vw`, and the `:root` gutter override at the desktop breakpoint.
  - The header, mega menu, footer, hero finish selector and section headings now reflow on tablet and mobile.
  - Removed the unused `wall-art-cp` class from `wall-art.html`.
  - Added `npm run lint:tokens`, which runs first in `npm run build`. It rejects any custom property outside the approved token families, any `--space-<n>` that is not on the spacing scale (or whose value does not match its name), and any token used but not declared.
- **Change class:** Visually breaking (small; listed below) and Token-breaking. None of the removed properties was referenced outside the SCSS partials.
- **Spacing mapped to the scale** (off-scale Figma value → scale token): hero column gap 112.5 → 88px and image right margin 77.5 → 88px; newsletter column gap 97.5 → 88px; Wall Art hero column gap 100 → 88px; craftsmanship gap 55 → 48px; header nav offset 39.5 → 48px (compensates for the brand no longer being a fixed 168px box); room columns 37.5 → 36px; journey grid 34 → 32px; footer grid 30 → 32px; format, idea and review grids 23.66 / 23.5 → 24px; Wall Art quality-grid columns 25 → 24px.
- **Visible differences at 1600px (before → after):**
  - Announcement bar 38 → 36px. Header 88 → 85px. The nav starts at x=323.8 (was 330) because the brand is no longer a fixed 168px box.
  - Hero 624 → 629.92px. Copy column 465 → 471.59px. Image 700 × 560 → 707.41 × 565.92px (same 5:4 ratio; left edge 700 → 682.09px). CTA 270 → 259.89px wide (sized by padding around its label).
  - Idea cards 547.25 → 488.94px. The fixed minimum height left about 58px of unused space under the text.
  - Newsletter section 285.5 → 188px, which now matches the Figma frame. The old minimum height was added on top of the section padding. Email field and Sign up button are now equal widths (360 / 393.5 → 377.84 / 377.86px).
  - Footer 368 → 365px.
  - Search dialog Close control sizes to its label (67 × 44px, was a fixed 44 × 44px box).
  - Hero finish selector moves with the hero image (10.5px left).
  - Wall Art breadcrumb 48 → 44px, and it now aligns with the container. A margin override had pinned it to x=0 (and to the viewport edge at every width); Figma places it at x=122.5.
  - Wall Art hero copy column 465 → 475.13px.
  - Wall Art "How it works" steps keep Figma's 24px gap, but the columns are now fluid and fill the container: 435.67px wide (was 429px), the third starts 13.3px further right, and the images are 245.75px tall (was 242px). Figma leaves 20px unused at the right of this row.
  - Wall Art comparison cards 450 → 443px. Quality-grid rows follow their content instead of a fixed 146px.
  - All other visible columns, images and cards differ by less than 5px horizontally. Page height: homepage 6078 → 5922px; Wall Art 5475 → 5305px.
- **Below the desktop breakpoint:** horizontal overflow removed. Before, 12 of 32 measured page/width combinations overflowed (up to 824px wide at 320–768px); now none do. The Wall Art menu columns no longer collapse to zero width on mobile.
- **Gutters:** with classic (Windows) scrollbars the container used `100vw`, which gave uneven gutters (24px left, 9px right; 122.5 / 107.5px at 1600px). They are now symmetric (24 / 24px; 115 / 115px at 1600px).
