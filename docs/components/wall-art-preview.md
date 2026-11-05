# Wall Art Preview - Status: Draft

Figma: https://www.figma.com/design/L2LvNYSoNhr1p3PPhjlnjR/Homepage?node-id=3743-2332
Version: four-stage and Step 01 UX screenshots approved in chat on 03/11/2026; no new Figma node or named version supplied.

## Purpose

One responsive four-stage Wall Art Designer: add photo, choose and customise, crop and edit, then review. Step 01 is a photo-first workspace with a browser-local gallery and on-demand sample dialog. The gallery is not an account service or replacement for production catalogue, print validation or basket services.

## Anatomy

The document wrapper includes the unchanged site header, `wall-art-preview` partial and unchanged footer. The partial owns one `main#main`; omit another main when embedding it. One form and one set of four step panels serve desktop and mobile. A shared progress indicator and page state preserve selections during back navigation. The Photo stage has one upload/selected-photo workspace, a horizontal uploaded-photo gallery, and a native sample dialog. In Review, the Wall preview badge overlays the scene and the existing Print preview control sits in a utility row directly below the image. The contextual action bar remains inside the designer form so it stops before the shared footer.

### Wall Backdrop

30/10/2026: user requested a minimal wall instead of the furnished Figma room. `src/assets/images/wall-art-preview-minimal-wall.jpg` is a local 1600 x 868px photograph by Henry & Co., sourced from [Pexels photo 9848750](https://www.pexels.com/photo/close-up-shot-of-a-white-concrete-wall-9848750/) under the [Pexels licence](https://www.pexels.com/license/). It is illustrative wall texture, not a product photograph. Original download: `https://images.pexels.com/photos/9848750/pexels-photo-9848750.jpeg?auto=compress&cs=srgb&w=1600&h=868&fit=crop`.

The wall has no furniture, floor or window behind the print. Every frame is centred on the same point; existing relative size differences remain. The largest portrait occupies approximately 83% of the scene height, rather than extending below its lower edge. This explicitly requested imagery change supersedes the original furnished Figma backdrop without modifying Figma. The original source asset is retained.

The Wall preview label sits above the image, not over it, so it cannot cover tall portrait frames on mobile. Browser checks on 30/10/2026 exercised all formats/finishes, three sizes and two orientations at 320/375/768/1200/1600px: 150 combinations were centred and entirely inside the wall, with no runtime page errors. Desktop and mobile largest-portrait screenshots were inspected; at 375px there is approximately 15px clearance above and below the frame. The project build passes.

## Contract

- `init(root = document)`: initialise `[data-js="wall-art-preview"]` descendants or the root itself; repeated calls are ignored.
- `destroy(root = document)`: remove listeners, cancel outstanding image work, revoke owned object URLs and hide the form. Reinitialisation creates a fresh design.
- No external inputs, custom events, network requests or account services. Uploaded originals and thumbnails persist in IndexedDB on the current browser/device only. Internal `data-js`, `data-step` and `data-view` attributes are not integration APIs.
- State: four-stage index, illustrative format/size/orientation/finish, selected photo, gallery records and crop (ratio, zoom, horizontal/vertical position, rotation). One state object drives controls, captions and review.
- Forward navigation requires a successfully decoded photo. Back retains valid edits. Pending photo decode blocks forward navigation; cancellation/failure retains the previous photo. New successful photos reset crop, not product choices.
- Local photo types: JPEG, PNG, WebP and HEIC/HEIF where native decode succeeds. File signatures are checked. Local safety limits are 20 MiB and 40 megapixels; these are not production upload policies.
- Latest photo selection wins. Cancel and destroy invalidate older decode work. Decode times out after 15 seconds. Gallery thumbnails are generated at a maximum 320px edge; active and thumbnail object URLs are revoked when replaced, deleted or destroyed.
- Duplicate uploads are identified by SHA-256 where Web Crypto is available, with a filename/size/date fallback. Browser storage errors keep the current selection usable for this visit and disclose that it will not persist.
- Gallery entries show filenames in compact thumbnail cards. Pixel dimensions and date are retained internally but not repeated in the strip. Selecting an entry updates the single main preview. Delete uses the browser's native confirmation prompt; deleting the selected entry returns the workspace to its empty state while other photos remain selectable.
- Delete all appears only with uploaded photos. Native confirmation explains that it clears this browser's local gallery, not original device files. IndexedDB is cleared in one transaction before local records and owned URLs are released. Cancellation changes nothing; failure retains the gallery and selection. A selected sample survives clearing uploaded photos.
- Gallery cards have a neutral one-pixel normal border, a two-pixel selected border and check indicator, and a separate native overflow disclosure. On hover-capable desktops the menu trigger appears on hover/focus; touch layouts leave it visible. The menu's Delete photo action is separate from the thumbnail selection button.
- The gallery is hidden when empty, displays the first 20 thumbnails, then reveals additional entries in chunks of 20. Its scroll strip uses generated thumbnails, lazy image loading and `scroll-snap` rather than rendering all originals.
- The selected customer or sample photo appears once in the main preview. Samples remain transient, separate from the uploaded gallery, and are selected through a native modal dialog. Escape, Close and backdrop dismissal return focus to the dialog trigger.
- The progress indicator reflects current/completed/upcoming state from the active stage. Desktop uses four equal-width columns in a centred wrapper with balanced connectors; completed markers show a check. Mobile uses a compact step label and progress bar.
- Step 01 has no Exit action. The dock shows a decorative selected-image thumbnail, photo status and Continue to customise. Later stages retain Back. The white dock is capped at 900px and stacks its summary and CTA on mobile. Its sticky wrapper remains inside the designer form and releases before the footer. No shadow token exists; contrast, border, radius and spacing provide separation without adding a shadow.
- Size values are the three Figma examples, not verified product availability. Custom sizes are unavailable without a catalogue. Finishes are illustrative examples, not production compatibility rules.
- Selecting a size or orientation fits the crop to the illustrative print proportions, retaining zoom/position. A labelled Print size crop option restores that ratio. Pointer dragging and keyboard-operable position ranges both adjust the crop; zoom, rotate and reset remain reversible.
- The displayed PPI is a local estimate from the source crop and illustrative dimensions. No production threshold or validation service exists, so it is not a suitability or production approval.
- Review repeats the crop-based PPI estimate with the selected physical dimensions. It updates through the existing render cycle when photo, size, orientation, crop, zoom or rotation changes. Its neutral status is `unverified`; it does not display Good/Acceptable/Low bands or replace/continue-anyway quality decisions because no production thresholds are available.
- The Wall preview dot uses the existing muted text token. There is no approved success/green status token in the current palette; it indicates preview availability only and never print quality.
- Forward/Back navigation never silently changes a chosen crop ratio. A mismatched photo/print ratio is contained with visible margins and an explanatory warning; nothing is silently trimmed.
- Review uses the exact print crop and includes edit links to all earlier stages. Preview download exports the front-view canvas, not the room composition. Add to basket remains disabled and explains that no basket service is connected; the flow never shows a false success.
- The scene's Print preview control opens the same front-view canvas in a popover on pointer hover or keyboard focus; click pins it for touch, and Escape dismisses it. Its expanded and hidden states stay synchronised for assistive technology.
- The popover contains only the preview canvas. The Print preview control is its positioned containing block, so it opens directly above the button and is right-aligned with it. Its width uses container units from the caption/utility row (`container-type: inline-size`): 80% on mobile, 50% on tablet and 40% on desktop. Hover is limited to the trigger and popover, and the pointer can move between them without closing it.
- Step changes use a brief opacity/vertical entrance; the popover uses a short opacity/position transition. Both are disabled for reduced-motion preferences.
- The photo stage has one upload/preview workspace; the empty state contains the upload control and displays the library shortcut only when saved photos exist. Customer thumbnails sit horizontally below the main preview; sample photos are available from the modal only.
- The crop stage keeps its preview and controls side by side on desktop, with compact control spacing and a single row of five ratio choices. Pointer dragging is touch-enabled and position ranges remain available to keyboard users. Normal navigation clears the visible live-region step message; focus moves to the page heading.

## States & Variants

Default/selected option tiles retain native radio semantics, but every radio circle is visually hidden using the existing `.visually-hidden` utility. Selected tiles retain the stronger border and use a 600-weight label; `:focus-within` outlines the whole tile, not the clipped input. The preview popover is available while the room is visible and has closed/open states. Gallery entries support normal, selected, focused, overflow-menu, delete-confirmation, empty and unavailable-storage states. Progress supports completed, active and upcoming states. File loading/cancelled/failed/loaded, disabled forward navigation, crop reset, rotation, review and disabled basket states are represented. Errors use an alert, loading/step feedback uses a polite status. No fake upload progress, price, production quality or basket success.

30/10/2026 option-tile checks: build passes; all 18 radio inputs retain native roles and are clipped to 1px instead of using display:none. Label clicks update crop, size and orientation; input focus produces tile-level focus styling. Mobile screenshot confirms circles are absent. Arrow-key automation was inconclusive in the background integrated-browser tab, so a complete keyboard retest remains pending.

## Responsive Behaviour

Mobile-first stacking; desktop two-column grids at 1200px for non-photo stages; the Photo stage is full-width at all breakpoints. The larger main preview is contained on the existing warm-neutral surface, capped at 40% of desktop viewport height, and never crops the original. Desktop gallery cards are 184px wide with 4:3 thumbnails; mobile uses a horizontal carousel. Selected padding compensates for its extra border pixel, avoiding layout shift. Overflow targets are 32px on hover-capable desktops and 44px on touch. Delete all and the sample link sit in the gallery header; an empty library shows the standalone sample link. The sticky dock includes mobile safe-area padding. Existing 24px gutters remain. The shared body minimum still causes 15px document overflow at a 320px outer viewport with classic scrollbars; global CSS was not changed.

## Accessibility

Native fieldsets/radios/selects/file input/ranges/buttons. Progress marks current/completed stages with accessible state. Focus moves to the heading on stage changes, returns to the sample-dialog trigger when dismissed, and moves to the file input when deletion leaves the gallery empty. Gallery thumbnails are buttons with `aria-pressed` selected state and labelled delete actions. All previews have accessible names; filenames use `textContent`. Crop ranges provide keyboard alternatives to pointer dragging. Native dialog provides modal semantics; Escape, Close and backdrop dismissal close it. Delete confirmation uses the browser-native prompt.

The print-preview button exposes `aria-expanded` and controls a labelled region whose `aria-hidden` state follows pointer, focus and click-pin state. Escape dismisses it; moving focus away or clicking elsewhere closes a pinned preview. Reduced-motion disables both flow and popover transitions.

## Tokens Used

Existing `--color-*`, `--font-*`, `--line-height-*`, `--space-*`, `--radius-control`, `--radius-media` and `--layer-menu` tokens only. No added tokens or dependencies.

## Edge Cases

| Category | Status | Coverage |
|---|---|---|
| Content | Covered | Empty/missing nodes fail closed; long filenames wrap; names render as text; selections are allowlisted. |
| Visual states | Covered | Native selected, disabled, focus, loading, empty upload, horizontal gallery selection, sample dialog and unavailable basket states. |
| Interaction | Covered | Duplicate selection, latest-selection wins, cancel, retry by reselection, image timeout, gallery deletion, sample dialog, Back retention and crop reset/rotation. |
| Responsive | Unresolved | Four stages checked at five widths; component fits. Existing global body minimum causes 15px document overflow at a 320px window with classic scrollbars. |
| Forms | Covered | File signatures/limits/decode, one-file drop, associated errors and guarded navigation. No production submission. |
| Accessibility | Unresolved | Native semantics, focus, names and visible focus checked in browser. Manual screen-reader, contrast and cross-browser sign-off pending. |
| Lifecycle | Covered | Scoped instance state, idempotent init, destroy, IndexedDB close, object URL/timer/listener cleanup. One main per page. |
| Production services | Unresolved | No live catalogue, remote account gallery, production quality rules or basket contract exists in this workspace. |

## Tests

Checks run on 04/11/2026 for the Print preview positioning fix:

- `npm run build` passed: 49/49 tokens, Sass without warnings and all four generated pages.
- Integrated browser at 320, 375, 768, 1200 and 1600px: the popover's bottom edge matched the button's top edge and its right edge matched the button's right edge at every width, and the popover stayed inside the scene horizontally. Mouse hover opened it at 375, 768 and 1600px (`aria-expanded` and visibility updated). No added horizontal overflow. A desktop screenshot was inspected.
- On mobile the wall scene is shorter than the popover, so the popover still covers most of the scene while it is open.
- W3C validation, keyboard, screen-reader, real-device touch, Figma comparison and Lighthouse were not re-run for this fix. No colour pairs, tokens, images or JavaScript changed.

Checks run on 03/11/2026:

- Final reference refinement: at 1600px, the centred stepper had four equal 271px columns. Gallery cards measured 184px with identical selected/normal heights; the dock measured 900px wide and 78px tall. Portrait and landscape images retained their original aspect ratios. No Exit element remains.
- Bulk deletion: cancelling retained two uploaded test images and the selection. Confirmation removed the records from IndexedDB (verified after reload), cleared a selected upload and disabled Continue. A simulated storage failure retained the gallery with an announced error. Clearing uploads with a selected sample retained the sample and enabled Continue. Test files were removed after verification.
- Touch browser context: the menu trigger remained visible, measured 44 x 44px, and opened Delete photo on tap. At 375px there was no horizontal page overflow; the selected-photo summary and CTA were stacked. At 320px only the existing shared body-minimum overflow remained. Forward/Back navigation retained the photo and updated progress; the dock stopped above the footer. No page errors occurred in that navigation check.
- Isolated desktop regression: selecting the other photo updated the preview; Add photo opened the existing file picker; Enter on the focused overflow summary opened its disclosure. Cancelling Delete photo retained both uploads, deleting an unselected image preserved the active preview, and deleting the last selected upload hid the gallery and disabled Continue. The isolated test context was closed without touching customer storage.
- Measured contrast: primary text/white 17.90:1, muted text/white 5.98:1, dock border/white 5.98:1. These measured pairs do not establish full WCAG conformance. Manual screen-reader, cross-browser, full keyboard and W3C checks for this revision remain outstanding.

- `npm run build`: token lint passed (49/49), Sass compiled, and all four pages generated. Native Node ES module syntax check passed.
- Browser walkthrough: photo → configure → crop → review; Back returned to configuration without losing the format. Review edit links and disabled Add to basket state rendered as expected.
- Browser photo gallery: two distinct local PNGs were added and restored after reload; selecting either changes the single main preview without altering the other. Deleting the selected file cleared the preview and retained the other entry. Compact thumbnails display filenames only.
- Step 01 photo-first layout: the empty gallery and library shortcut are hidden; sample selection changes the main preview but leaves gallery count unchanged. Configure → Back retains the selected image. Continue stays disabled with no valid image. Adding a photo appends an Add photo tile.
- Sample dialog and actions: open/close, Escape handler, focus return and sample selection passed with DOM-dispatched browser interactions. Physical Escape-key automation was unavailable.
- Review screen refinement: badge is inside the scene; Print preview control is below the image and retains its current canvas/popover behavior. With the Forest sample, 90 × 60cm and a 4:3 crop, Review displays a local estimate of approximately 5 PPI and explicitly says production quality is unverified. The dock continues to show disabled Add to basket.
- Review responsive check: no new component overflow at 320/375/768/1200/1600px; the shared 320px body-minimum overflow is unchanged. Preview utility row remains below the scene. The status text/background measured contrast is 10.30:1 using the existing neutral tokens.
- Earlier gallery/dock checks used the previous 760px dock and 50px menu target; these dimensions are superseded by the final reference refinement measurements above. Normal and selected borders remain distinct, and deleting an unselected photo preserves the active preview.
- Browser crop: dragging changed horizontal crop position from 50 to 38; 90° rotation updated the canvas accessibility label and review summary. Local PPI estimate was shown with an explicit no-production-approval caveat. No page errors occurred.
- Not run: manual screen-reader/physical-device testing, formal contrast audit, W3C validator, Safari/Firefox, real HEIC decoding, IndexedDB quota/private-mode behavior or production catalogue/basket scenarios. The local browser smoke tests do not establish WCAG conformance.

Historical checks run on 30/10/2026:

- Upload-tile state update: `npm run build` passes with 49/49 tokens. Browser checks confirm an empty initial photo state, visible upload and Forest tiles, no sample-only Replace/Delete actions, both actions for an uploaded PNG, and same-step upload-tile restoration after Delete with focus returned to Browse photos. At 320px the content itself fits; the existing global 320px body minimum still creates a 15px root overflow when a classic scrollbar reduces the available width to 305px. The shared reset is unchanged. Editor diagnostics report no errors.
- Desktop crop layout update: at 1440 × 900px the preview and controls are side by side, all five ratios fit one row, and the Continue action ends at 887px. The image overlay shows the Change photo icon and label; navigation clears the visible footer status while focusing the heading. At 375px the layout stacks without horizontal overflow, and Change photo returns to the photo step. Build and editor diagnostics pass.
- Latest print-preview update: `npm run build` passes with the 49-token check; the edited partial returns zero W3C messages. Browser checks confirm pointer hover, focus reveal, Escape dismissal via a dispatched key event, click pin/outside dismissal, 46px trigger height, normal step animation and no animation under reduced motion. At 375px, the control and popover remain inside the wall scene with no page overflow. Integrated-browser native key input and a stable screenshot were not available in this pass.
- Image-only popover update: build passes; mobile browser check confirms hover open, pointer transfer onto the image without dismissal, and close on pointer exit. The canvas is the only child; measured popover width is 87% of the scene at 375px and 63% at 1280px.
- Selected-photo card: browser upload of a valid PNG rendered at 1376 × 768px and displayed its filename and 1.4 MiB size. Replace invokes the file input; Delete hides the card, clears its image source, disables forward navigation, restores focus to the file input and leaves Forest lake available. The uploaded object URL was confirmed revoked. W3C reports zero messages for the partial.
- `npm run build`: token lint, Sass and all four HTML pages pass. Editor diagnostics and native Node ES module syntax check pass.
- W3C validator: standalone new content has zero messages. Complete generated page has one existing shared-header error: `aria-label` on `.site-header__actions` without an appropriate role. Header remains unchanged.
- Exact SHA-256 comparisons: local room, beach and forest images match their Figma asset downloads. All three load successfully with correct dimensions and MIME types.
- Browser: six screens x 320/375/768/1200/1600px, one visible step per screen, no new-content overflow, no runtime page errors during the normal walkthrough. At 320px the document has 15px overflow because the existing body minimum is 320px and the classic scrollbar leaves 305px. The existing Wall Art category page reproduces this unchanged issue.
- Browser interaction: format/finish sync; source photo retained through Back; portrait size summary; 150/170% zoom retention; explicit crop ratio retained through forward/Back; margin warning appears only for mismatched proportions; Print size resolves the mismatch. Room and print canvases have identical preview pixels.
- Browser files: unsupported, empty, >20 MiB and corrupt files show specific errors and block forward navigation when no valid photo exists. A valid PNG decodes; special-character filenames remain literal text. Remove clears every canvas, blocks forward navigation and focuses the file input.
- Browser cancellation: intercepted slow sample load blocks forward navigation; cancellation retains the prior beach photo. The intentionally aborted request produced an expected browser network error, not an application exception.
- Lifecycle: repeated init creates only one object URL for one selected file; destroy revokes it, hides the form and clears all canvases. Reinitialisation works. A real 1 x 10,000px PNG keeps non-editor canvases bounded to 1 x 640px.
- Keyboard: radio arrow navigation updates the format, Enter advances, focus moves to the heading, range ArrowRight changes zoom, visible focus outline confirmed. Forced-colour/reduced-motion media emulation retains the primary action. CSS zoom 200% at 1600px reflows without overflow; this is not a physical browser-zoom or screen-reader pass.
- Contrast: primary/white 17.90:1, body/secondary surface 10.30:1, muted/secondary surface 5.68:1 and interactive border/white 5.98:1; inverse button and focus pairs use the same tokens.
- Export: browser canvas produces a non-empty image/png blob (579,322 bytes in the exercised sample). Download-request feedback checked. The integrated browser did not emit a download event, so actual file saving is not verified.
- HTTP: all four pages, CSS, JS and the three assets return 200 from the existing server at port 8012.
- Desktop/mobile initial screenshots inspected against Figma. Full per-step visual sign-off remains pending: integrated screenshots intermittently lost the page ID or showed the initial view after scripted transitions.
- Not run: manual screen-reader pass, physical browser zoom, actual touch/HEIC device decoding, Safari/Firefox checks, production PPI/subject/edge validation and full-page Lighthouse. No new test dependency or Lighthouse installation was added; only Sass is approved locally.

## Known Limitations

- Uploaded originals and thumbnails persist in IndexedDB for this browser/device. They are not uploaded to an account; browser clearing, quota, private browsing and device changes can remove or prevent storage. If storage is unavailable, the current visit remains usable and this limitation is shown.
- The flow stores gallery photos locally, but does not restore the full design/crop selection across reloads.
- Prices, availability, complete product taxonomy, production resolution/safe-area/subject validation and real basket submission require service contracts. None are simulated as successful.
- The 192 x 128 forest sample is the exact Figma asset, suitable only for demonstration, not production printing.
- Existing tokens take precedence over unapproved raw design values: mobile 28px title uses the existing 32px heading; 9-11/13px text uses existing 12/14px tokens; 10/12/14px corners use existing 8px; green/red quality states and shadows are not introduced. Recommended missing tokens: approved mobile title/body scale and semantic status colours, subject to separate approval.
- Tablet layout uses the existing mobile-first breakpoints; no tablet frame was supplied. Mobile gutters stay 24px rather than Figma's 20px. Off-scale gaps map to the shared spacing scale.
- Crop supports pointer dragging, labelled position ranges, zoom, rotation and reset. Pinch zoom and production trim-boundary validation are not implemented.
- PPI is an estimate based on local source pixels and illustrative product dimensions. No suitability threshold is known and the estimate is not production validation.
- Prototype labels replace production success claims. Add to basket is disabled until a real basket contract is available. The front-view preview sits below the room on desktop rather than adding a third narrow column.
- Shared header validation and body-minimum overflow issues described above remain outside this page-only change.
- Canonical URL is omitted and noindex applied until a production route is approved.

## Changelog

See `docs/CHANGELOG.md`, 03/11/2026, four-stage local Wall Art Designer.