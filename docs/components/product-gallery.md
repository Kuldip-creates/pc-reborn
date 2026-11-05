# Product gallery — Status: Draft
Figma: `3230:7511` (instance of "Product image gallery — Image, Video & 3D viewer", `2613:909`); full-screen state from `3195:4633` · Version: not named

## Purpose
Shows the PDP media: one main image, a strip of thumbnails, previous/next controls, a position counter and a full-screen preview. Use on product pages. Not for editorial image grids.

## Anatomy
```html
<div class="product-gallery" data-js="product-gallery">
  <div class="product-gallery__stage">
    <img class="product-gallery__image" data-js="gallery-image" …>
    <span class="badge">Large canvas</span>
    <button class="product-gallery__control product-gallery__control--expand" data-js="gallery-expand" aria-label="View image full screen">…</button>
    <button class="product-gallery__control product-gallery__control--prev" data-js="gallery-prev" aria-label="Previous image">…</button>
    <button class="product-gallery__control product-gallery__control--next" data-js="gallery-next" aria-label="Next image">…</button>
    <p class="product-gallery__counter" aria-hidden="true" data-js="gallery-counter">01 / 05</p>
  </div>
  <ul class="product-gallery__thumbs">
    <li><button class="product-gallery__thumb" aria-current="true" data-gallery-index="0" data-src="…" data-alt="…" data-label="Room view" aria-label="Show image 1 of 5: room view">…</button></li>
  </ul>
  <p class="visually-hidden" aria-live="polite" data-js="gallery-status"></p>
  <dialog class="product-gallery__dialog" data-js="gallery-dialog">… <button data-js="gallery-close">Close</button> <img data-js="gallery-dialog-image"></dialog>
</div>
```

## Contract
| Input (on each thumbnail) | Type | Required | Notes |
|---|---|---|---|
| `data-gallery-index` | number | yes | Marks the button as a gallery item; DOM order is the media order |
| `data-src` / `data-alt` | string | yes | Applied to the main image when selected |
| `data-label` | string | yes | Used in the live announcement |
| `data-note` | string | no | Appended to the announcement (e.g. video not available) |
| `aria-current="true"` | attribute | no | Initial item; defaults to the first |

State: `aria-current` on the selected thumbnail; counter text; `dialog.open`. No custom events. `initProductGallery(root)` is idempotent (`data-initialized`).

## States & variants
Thumbnail: default, hover (dark border), current (dark border + 1px ring), focus-visible (global outline). The video thumbnail adds the Figma play affordance.

## Accessibility
- Buttons with accessible names; Left/Right arrow keys move through the media while focus is on a gallery control, and focus follows when it is on a thumbnail.
- The selection is announced through a polite live region; the visual counter is hidden from assistive technology.
- Native modal `<dialog>`: focus moves to Close, Escape or Close dismisses it, focus returns to the expand button.

## Tokens used
`--color-surface-primary`, `--color-surface-secondary`, `--color-text-primary`, `--color-border-interactive`, `--radius-media`, `--radius-control`, `--radius-input`, `--space-4/6/8/12/24/36/48`, `--font-size-small`, `--font-size-body`.

## Edge cases
| Case | Status |
|---|---|
| One item | Covered — prev/next wrap to the same item |
| Missing dialog markup | Covered — gallery works without full screen |
| Video playback | Unresolved — no video asset; announced as unavailable |
| 3D view | Not applicable — not on the canvas PDP |
| Multiple instances | Covered — each root initialises separately |

## Tests
28/10/2026, headless Edge: next/previous with wrap-around, thumbnail click, arrow keys and focus, live announcement text, dialog open/Escape/focus return, 1600px screenshot compared with Figma. Screen-reader pass not run.

## Known limitations
All media are the placeholder image; no `srcset`/WebP pipeline yet.

## Changelog
See `docs/CHANGELOG.md`, 28/10/2026 — Photo Canvas PDP.
