# Option selector — Status: Draft
Figma: `3230:7528` (design type), `3230:7536` (canvas wrap) · Version: not named

## Purpose
Single choice between a few product options, shown as equal-width tiles. Use for short labels (two to four options). For long lists use `.select-field`.

## Anatomy
```html
<fieldset class="option-selector" aria-describedby="design-type-help">
  <legend class="option-selector__legend">Choose your design</legend>
  <div class="option-selector__options">
    <label class="option-selector__option"><input class="visually-hidden" type="radio" name="design-type" value="single-photo" checked><span>Single photo</span></label>
    <label class="option-selector__option"><input class="visually-hidden" type="radio" name="design-type" value="photo-montage"><span>Photo montage</span></label>
  </div>
  <p class="option-selector__help" id="design-type-help">…</p>
</fieldset>
```

## Contract
Native radio group: `name`, `value`, `checked` and `disabled` on each input. No JavaScript and no custom events; read the value with the standard `change` event or form data. Columns are created automatically, one per option.

## States & variants
Default (grey border); hover (dark border); selected (`:has(input:checked)`: dark border, warm fill and a second 1px ring, so the state is not shown by colour alone); focus-visible (2px outline on the tile); disabled (55% opacity, not-allowed cursor).

## Accessibility
Fieldset and legend name the group; arrow keys move the selection natively; the helper text is linked with `aria-describedby`.

## Tokens used
`--color-text-primary`, `--color-text-muted`, `--color-border-interactive`, `--color-surface-primary`, `--color-surface-secondary`, `--radius-control`, `--space-4/8/12`, `--font-size-control`, `--font-size-small`.

## Edge cases
| Case | Status |
|---|---|
| Long labels | Covered — tiles shrink (`minmax(0, 1fr)`); text wraps |
| Many options | Unresolved — more than four tiles become narrow; use `.select-field` |
| Price/preview update on change | Unresolved — no product data or per-option assets |

## Tests
28/10/2026, headless Edge: arrow-key selection, selected and focus styles. Contrast: dark border on white 17.9:1; grey border on white 5.98:1.

## Known limitations
Selections are not passed to Design Studio (no hand-off contract).

## Changelog
See `docs/CHANGELOG.md`, 28/10/2026 — Photo Canvas PDP.
