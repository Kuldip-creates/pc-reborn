---
description: "Use when creating, changing, documenting or testing a PC Reborn shared component, section pattern or design token: component taxonomy, canonical contract template, token tiers and naming, public API (modifiers, data attributes, custom events), edge-case and test matrix, docs, versioning and definition of done."
applyTo: "src/**, docs/**"
---

# PC Reborn — Component System & Governance

Code-level rules live in `frontend-code-standards`; the process and approval gates live in `figma-to-code-workflow`. This file defines **what** a reusable component is and how it is governed.

---

## 1. Principles
- Inspect before creating; reuse before creating; specify before coding.
- One clear responsibility per component. Composition over configuration — avoid many loosely related flags; split a component whose variants have different responsibilities.
- Generalise only to the use cases evidenced in approved Figma frames. No speculative abstraction; do not over-engineer simple components.
- Keep presentation separate from business logic. No hidden coupling to pages, routes or parents; no global side effects.
- Preserve working functionality. Optimise for correctness, consistency, accessibility and maintainability — not the shortest code.

## 2. Three layers per component
| Layer | What | Where |
|---|---|---|
| A. Specification | Purpose, visuals, states, behaviour, accessibility, edge cases | `docs/components/<name>.md` |
| B. Contract | Technology-neutral API: inputs, events, state transitions | Same doc, "Contract" section |
| C. Implementation | HTML pattern + SCSS partial + JS module (vanilla). Angular only if approved | `src/` per `frontend-code-standards` §3 |

The doc is the behavioural source of truth. If an Angular version is ever approved, it implements the same contract; it never becomes a second source of truth.

## 3. Taxonomy → folders

| Level | Examples | SCSS / JS folder |
|---|---|---|
| Foundation | Tokens, fonts, typography, container, grid, breakpoints, focus, motion, z-index | `abstracts/`, `base/`, `layout/` |
| Core UI | Button, icon button, link, input, select, checkbox, radio group, switch, form field, badge, tooltip, spinner, skeleton, alert | `components/` |
| Composite | Dropdown, dialog, drawer, tabs, accordion, toast, pagination, breadcrumbs, empty/error state | `components/` |
| Commerce (domain) | Product card, product gallery, format selector, finish/frame selector, image preview, price summary, delivery info, trust block, purchase CTA | `commerce/` |
| Section (pattern) | Home hero, format grid, shop-by-room, PDP info block | `sections/` |
| Page | Homepage, CP, PDP templates | `pages/*.html` (+ `scss/pages/` exceptions only) |

- Header and footer are layout-level shared blocks in `layout/`.
- Domain logic never goes into core components.
- A one-off page layout is a section, not a component. Promote a section to a component only when a second approved use exists.

## 4. Naming
- One identity everywhere: Figma component name → kebab-case BEM block → file names → doc name → design-map row. Example: Figma "Product Card" → `.product-card`, `_product-card.scss`, `product-card.js`, `docs/components/product-card.md`.
- Names describe purpose. Banned: `common`, `helper`, `misc`, `base-thing`, `custom-2`, `utils` for anything that is not a pure utility.
- Public vs internal: BEM blocks, modifiers, documented `data-` attributes and custom events are public. Everything else is internal and may change freely.

## 5. Design tokens
**Tiers**
| Tier | Purpose | Defined in | Used by |
|---|---|---|---|
| Primitive | Raw values (palette, scale steps) | `abstracts/_tokens.scss` as SCSS variables | `base/_root.scss` and `abstracts/` only |
| Semantic | Purpose (`text-primary`, `surface-default`, `action-primary`, `border-subtle`, section spacing) | `base/_root.scss` as CSS custom properties on `:root` | All components |
| Component | Override of colour, type, radius or motion for one component | The component partial, as a custom property | That component only — needs approval and a documented reason. Never a layout size, offset, column or gap (`frontend-code-standards` §7.1, §7.4) |

**Naming:** mirror the Figma variable path exactly — lowercase, `/` and spaces become `-`. Example: Figma `color/text/primary` → `--color-text-primary`; primitive `$color-neutral-900`. Do not rename Figma variables in code.

**Rules**
1. Components use semantic custom properties (`var(--…)`). Breakpoints stay SCSS-only (custom properties cannot be used in media queries).
2. Never duplicate a token under another name, approximate one, or bypass one with a raw value.
3. A missing colour, type, radius, shadow or motion token is reported with a proposed name and waits for approval (workflow Type D). Spacing follows `frontend-code-standards` §7.1.
4. Every semantic colour pair is contrast-checked (`frontend-code-standards` §6).
5. No undefined or circular references.
6. Changing or removing a token is a token-breaking change (§9).
7. Spacing tokens are one shared scale; an off-scale value maps to the nearest scale token (`frontend-code-standards` §7.1). A variable named for one component's width, height, offset, column track or gap is never a token. `npm run lint:tokens` rejects any custom property outside the approved families, any `--space-<n>` off the scale, and any token used but not declared.

## 6. Public contract (vanilla implementation)
| Contract part | Vanilla form |
|---|---|
| Variants and sizes | BEM modifiers: `.button--secondary`, `.icon--sm` |
| Inputs / configuration | Documented `data-` attributes on the root (`data-max="5"`), native attributes (`disabled`, `aria-*`), and child markup |
| State | Native or ARIA attributes (`aria-expanded`, `aria-selected`, `aria-invalid`, `hidden`) plus `is-` state classes only when no attribute fits |
| Events (outputs) | `CustomEvent` named `<block>:<action>`, dispatched on the root, `bubbles: true`, payload in `detail`. Example: `format-selector:change` → `{ value: 'framed-print' }` |
| Lifecycle | `init(root)` — idempotent; `destroy(root)` when the component adds global listeners, timers or observers |

For every input, document: name, type, required/optional, default, allowed values, invalid-value behaviour.
For every event, document: trigger, payload, when it is suppressed (e.g. disabled), whether it can fire repeatedly.
State has one source of truth. For async actions, define pending, duplicate-submission, failure and retry behaviour.
Never invent API or event behaviour during implementation — resolve it in the doc first.

## 7. Edge cases and testing
In each component doc, mark every row **Covered / Not applicable / Unresolved**, with a one-line reason for N/A and Unresolved.

| Category | Cases |
|---|---|
| Content | Missing/empty values, very long text, translated strings, special characters/Unicode, many items, duplicates, dynamic updates |
| Visual states | Default, hover, focus-visible, active, disabled, loading, empty, error, success, selected, expanded/collapsed |
| Interaction | Rapid repeated clicks, double submit, out-of-order or failed async responses, cancellation, focus restoration after overlays |
| Responsive | 320 / 375 / 768 / 1200 / 1600px, 200% zoom, overflow, touch targets, on-screen keyboard, sticky elements |
| Forms | Required, invalid, boundaries, paste, autofill, reset, server-side error, label/error association |
| Accessibility | Keyboard-only, accessible name/role/state, tab order, focus trap/return, live announcements, reduced motion, forced colours |
| Lifecycle | Multiple instances, re-init, listener/timer/observer cleanup, global CSS interference |

**Testing (current tooling: none approved)**
- Required now: Sass compile, W3C HTML validation, a manual keyboard and screen-reader pass, a contrast check and a Figma screenshot comparison, recorded in the doc's "Tests" section with the date.
- Automated unit, accessibility or visual-regression tooling (e.g. Playwright + axe) is a Type D proposal. Do not add it without approval.
- Never claim a test passed unless it was run.

## 8. Documentation
```
docs/
  design-map.md            # Figma ↔ code register (workflow §5)
  CHANGELOG.md             # dated change log (§9)
  components/<name>.md     # one per shared component / section pattern
```
**Component doc template**
```markdown
# <Name>  — Status: Draft | Experimental | Stable | Deprecated
Figma: <node link> · Version: <named Figma version>
## Purpose            — what it does; when to use; when not to use
## Anatomy            — HTML pattern (minimal, real)
## Contract           — modifiers · data attributes · events · state (§6 tables)
## States & variants
## Responsive behaviour
## Accessibility      — semantics, keyboard map, focus, announcements
## Tokens used        — semantic tokens only
## Edge cases         — §7 matrix
## Tests              — what was run, date, result
## Known limitations
## Changelog          — links to docs/CHANGELOG.md entries
```
Examples must match the real implementation. Never document a feature that does not exist.

## 9. Status, versioning and change management
**Status:** Draft (in progress) → Experimental (usable, API may change) → Stable (definition of done met) → Deprecated (replacement named, removal date set).

**Change classes** (record one in every `docs/CHANGELOG.md` entry):
- Non-breaking
- Behaviour-changing
- Visually breaking
- API-breaking — removing or renaming a block, modifier, data attribute or event
- Token-breaking
- Accessibility- or security-critical

**Breaking changes:** Type D approval → keep the old API working alongside the new one → migrate every page listed in the design map → remove the old API → log the change. Never rename or remove a public API in a single step.

## 10. Definition of done (required for Stable)
- [ ] Doc complete; contract, states and edge-case matrix filled in
- [ ] Existing tokens and components reused; no duplicates; dependencies follow the layer order
- [ ] All applicable states implemented and matching Figma at every available breakpoint
- [ ] Keyboard, focus, names, contrast and reduced motion checked
- [ ] No global side effects; listeners/timers cleaned up; safe for multiple instances
- [ ] Validation checks run and recorded (workflow §7)
- [ ] Design-map row and changelog updated
- [ ] Known limitations listed

## 11. Performance, security and reliability
- No unbounded DOM creation, repeated expensive computation or listener accumulation.
- No `innerHTML` with untrusted data; validate URLs before using them in `href`/`src`; never expose secrets.
- Handle async errors visibly; no unhandled promise rejections.
- Optimise based on evidence, not by premature micro-optimisation.
