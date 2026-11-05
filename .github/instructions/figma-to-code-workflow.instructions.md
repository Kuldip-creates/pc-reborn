---
description: "Use for every PC Reborn task: task types and approval gates, Figma MCP read-only sequence, building from a Figma node, handling future design changes, the design-to-code register, validation and reply formats."
applyTo: "**"
---

# PC Reborn — Workflow (Figma → Code, Reviews, Design Changes)

---

## 1. Classify the task first

| Type | Example request | Edits allowed | Gate |
|---|---|---|---|
| **A. Design / UX review** | "Review the PDP frame" | None | Report only |
| **B. Code review** | "Review `_home-hero.scss`" | None | Report only (fixes shown as code) |
| **C. Build or update** one section, component or page from an approved Figma node | "Build the homepage hero" | Only the files of that item, plus its `docs/` entries | Post the plan, then proceed |
| **D. Shared-level change** | New or changed token, breakpoint, shared component API, folder structure, build config, dependency, Angular use, shared header/footer, any change touching more than one page | After explicit approval | Propose, then **wait** |
| **E. Architecture / audit** | "Propose the component architecture" | None | Report only |

- A Type C task that turns out to need a Type D change pauses at that point and asks.
- A mixed request uses the strictest gate. If the type is unclear, ask.
- Figma is read-only in **every** type (project context §10).

## 2. Inputs required before building (Type C)
1. A Figma link **with `node-id`** for each target frame (desktop; plus tablet and mobile if they exist).
2. Confirmation that the frame is approved for development.
3. A factual content source (photo-canvas.com or user-supplied) for product names, prices, guarantees and delivery facts.

If any input is missing, ask **one** question that lists everything missing. Do not ask for context already in these instructions.

## 3. Figma MCP read sequence (each node fetched once)
1. `get_metadata` — only for large frames, to find child node IDs.
2. `get_design_context` — structure, layout and styles.
3. `get_variable_defs` — the variables/tokens the node uses.
4. `get_screenshot` — the visual reference for validation.
5. `download_assets` — only when the node's images or SVGs are needed in code.

- Treat generated code as reference only; never paste it.
- Ignore absolute positioning and fixed sizes unless the design needs them; translate auto layout into flex/grid.
- If MCP is not connected or a call fails, run `whoami`, report the limitation and stop. Never build from memory or guesses.

## 4. Build steps (Type C)
1. **Plan** (max 10 lines): items, what is reused, what is new, files to create/change, open questions.
2. **Reuse check**: search `src/` and `docs/design-map.md` before creating anything.
3. **Token mapping**: map every Figma colour and type value to an existing token. For a missing token, report the gap with a proposed name (Type D) and continue only the parts that do not depend on it. Never hardcode it as a stopgap. Sizes, offsets and frame heights are not tokens: build them with fluid layout (`frontend-code-standards` §7.4).
4. **Build** in this order: HTML → SCSS partial → JS module (only when interaction needs it), following `frontend-code-standards.instructions.md`.
5. **Document**: update the `docs/design-map.md` row; for shared components also update `docs/components/<name>.md` (`pc-reborn-component-system` §8).
6. **Validate** (§7) and **reply** (§8).

## 5. Design-to-code register — `docs/design-map.md`
The only place that links Figma to code. Every component, section and page has one row:

| Name | Level | Figma node link | Figma version | Code files | Used on | Status |
|---|---|---|---|---|---|---|
| product-card | commerce | `…?node-id=…` | "Product card v2 – approved" | `scss/commerce/_product-card.scss`, `js/commerce/product-card.js` | index, cp-wall-art | Draft |

- Level: foundation, component, commerce, section, page.
- Status: Draft, Experimental, Stable, Deprecated (`pc-reborn-component-system` §9).
- Create or update the row in the same change as the code.

## 6. Handling future design changes
Figma is read-only, so the design team makes design changes. Code follows only **approved, named** Figma versions.

1. The designer saves a named version in Figma (e.g. "Home hero v3 – approved") and shares the node link.
2. Find the item in `docs/design-map.md` → affected files and pages.
3. Fetch only that node (§3); list each difference as *element · Figma value · code value*.
4. Classify the change:

| Change | Edit only | Re-validate | Type |
|---|---|---|---|
| Token value (colour, type, spacing, radius) | `abstracts/_tokens.scss` / `base/_root.scss` | Every page | D |
| Shared component or shared header/footer | That block's files (+ every page copy for header/footer) | Every page in "Used on" | D |
| One section | That section's files | That page | C |
| Content only | The HTML text/data | That page | C |
| New interaction or state | Component doc → code | Keyboard + accessibility checks | D if shared, else C |

5. Change only the affected files. Unrelated sections, header and footer stay untouched.
6. Validate every page in "Used on" (§7).
7. Update the design-map version/status and add a `docs/CHANGELOG.md` entry: date (DD/MM/YYYY), item, change, change class (`pc-reborn-component-system` §9).

Never sync code to an unapproved or unversioned Figma state, and never regenerate a whole page for a section-level change.

## 7. Validation (every code change)
Run what exists; report anything that could not be run, and why.
- `npm run build` passes: token check (`lint:tokens`), Sass compile with no errors or warnings, HTML build.
- HTML passes the W3C validator.
- Matches the Figma screenshot at each breakpoint that exists in Figma.
- Check widths 320, 375, 768, 1200 and 1600px; no horizontal scroll at 320px.
- Keyboard-only pass with visible focus; accessible names present.
- Contrast checked for every new text/background or UI pair.
- No console errors, no unused CSS/JS.
- Lighthouse 90+ in all four categories for full pages.

Never claim a check passed unless it was actually run.

## 8. Reply formats (short; no restating the request; no tutorials)
- **Type A / E:** Summary → Findings grouped Critical / High / Medium / Low (problem · customer impact · recommended fix) → Proposed Figma changes for the design team (if any) → Open questions.
- **Type B:** `frontend-code-standards` §11.
- **Type C:** Plan → Files (path — purpose, then code; for changed files show only the changed parts) → Validation results → Open questions (max 5).
- **Type D:** Proposal → Affected files and pages → Compatibility and migration → "Awaiting approval".

## 9. Git
Do not commit unless asked. Commit messages follow the Contrado format: `TICKET-ID: concise description` (max 72 characters).
