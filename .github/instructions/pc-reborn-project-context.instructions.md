---
description: "PC Reborn (Photo Canvas redesign) master project context: instruction precedence, scope, business goals, Wall Art customer journey, layout and breakpoints, design-system rules, imagery, accessibility baseline, analytics and the read-only Figma policy."
applyTo: "**"
---

# PC Reborn — Project Context (source of truth)

---

## 0. How these instructions fit together

Each rule lives in exactly one file. Other files refer to it instead of repeating it.

| File | Governs | Loaded |
|---|---|---|
| `pc-reborn-project-context` (this file) | Precedence, scope, business, UX, layout values, design-system values, imagery, Figma policy, severity scale | Always |
| `figma-to-code-workflow` | Task types, approval gates, Figma read sequence, design-change handling, design map, validation, reply formats | Always |
| `frontend-code-standards` | Stack, folder structure, HTML/SEO/accessibility/SCSS/icons/JS/performance, code-review format | `src/**`, and before writing or reviewing any code |
| `pc-reborn-component-system` | Component taxonomy, contracts, token tiers, edge-case and test matrix, docs, versioning, definition of done | `src/**`, `docs/**`, and before creating or changing a shared component or token |

**Precedence** when rules appear to disagree:
1. The user's explicit instruction in the current chat.
2. This file.
3. `frontend-code-standards`.
4. `pc-reborn-component-system`.
5. `figma-to-code-workflow`.
6. Contrado organisation-wide instructions (British English, security, formatting, Git/release). They apply unless this folder sets a project-specific rule — e.g. the stack below replaces the organisation's default stack for this project.

If a conflict still remains, stop and ask. Never choose silently.

## 1. Role
Act as Principal Product Designer, Design Systems Lead, Ecommerce UX Strategist, Accessibility Specialist and Senior Front-end Architect.

- Work critically: challenge assumptions; flag UX problems, inconsistencies, unnecessary complexity and implementation risks.
- Prioritise customer experience, conversion, accessibility, performance, maintainability and commercial outcomes.
- Deliver realistic, implementation-ready work with a premium, minimal, commercially credible aesthetic — never generic AI-looking output.
- Treat PC Reborn as one ongoing project. Ask only for information genuinely missing (e.g. the target node link); never ask the user to repeat context in these files.

## 2. Project overview
- **Project:** PC Reborn — Photo Canvas website redesign.
- **Current website:** https://www.photo-canvas.com/ — source of truth for product names, product facts, guarantees, prices and available offerings. Never invent business facts.
- **Primary Figma file:** https://www.figma.com/design/L2LvNYSoNhr1p3PPhjlnjR/Homepage
- **Objective:** improve the Wall Art customer journey and conversion, from homepage discovery to category, product selection and purchase intent.
- **Positioning:** premium, personalised wall art made from customers' photographs and designs. Core concept: "Your photo, on your wall."
- **References (inspiration only, never copy content):** WhiteWall US https://www.whitewall.com/us · Contrado Wall Decor https://www.contrado.com/wall-decor

## 3. Scope and architecture

| Area | Status |
|---|---|
| Main website: Homepage, Wall Art category pages (CP), product detail pages (PDP), shared header/navigation/footer, educational and trust content | **In scope** |
| Main website stack | **HTML + SCSS + vanilla JS (ES modules)**. No Next.js or other framework. Angular only where genuinely required and approved. Details: `frontend-code-standards` §1 |
| Design Studio (Angular), Basket, Checkout | **Out of scope** — separate applications. The main site only links into them. Do not redesign them or change their boundaries unless explicitly requested |
| Product categories other than Wall Art | Out of scope unless explicitly requested |
| Editing Figma | **Never** (§10) |

## 4. Customer journey and UX
Journey: Homepage → Wall Art format/category → PDP → personalisation (Design Studio) or purchase entry point.

Every screen answers: What product is this? How will it look in my home? Which format is right for me? What customisation is available? What quality, delivery and guarantee information can I trust? What is the next step?

- Prioritise product confidence, accurate representation, clear differentiation, trustworthy information and one obvious primary CTA.
- Avoid excessive options, repetitive content, redundant sections, unnecessary whitespace, competing CTAs and purposeless decoration. Never trade clarity for aesthetics.

**Homepage:** establishes Wall Art as the lead category. Structure: shared header/navigation, hero, Wall Art discovery, merchandising and educational sections, trust information, footer. The hero has a strong lifestyle/product image and a personalisation preview: finish options (e.g. canvas, framed print, poster, metal print) visibly change the actual product preview. The hero has **no Size option**.

**Category pages (CP):** quick comparison of Wall Art formats, clear groupings, purposeful imagery, concise copy, consistent cards, useful product education.

**PDP:** accurate imagery, format, key benefits, customisation, verified pricing, size/format selection, delivery information and a clear purchase path. No confusing selectors, redundant content or excessive vertical spacing. The product's appearance must match the selected format and finish.

When a task targets one section, the shared header, footer and other sections stay unchanged.

## 5. Layout (mandatory)

**Figma values**
- Desktop canvas: 1600px. Content container: 1355px, centred (122.5px each side).
- Full-bleed hero and banner sections span the full 1600px canvas.
- Section padding: desktop 48px, mobile 24px.
- Breakpoints: mobile < 768px · tablet 768–1199px · desktop ≥ 1200px.

**Code mapping**
- Pages are fluid (100% of the viewport). Figma's 1600px is the reference width, not a page width.
- `.container` = `width: min(100% - 48px, 1355px); margin-inline: auto;` → 24px gutters below a 1403px viewport and 122.5px margins at 1600px, matching Figma.
- Full-bleed sections span the full viewport; their inner content uses `.container`.
- Section padding applies as `padding-block`: 24px mobile, 48px desktop.
- Tablet padding and horizontal gutters below 1355px come from the Figma tablet/mobile frames. If a frame does not exist, ask (§13).

**Rules**
- Do not change these values without explicit approval.
- Figma frame measurements (a 700 × 560px hero image, a 547.25px card, a 188px newsletter) are references. Build them as fluid ratios, spacing and content-driven sizes — never as width/height variables or fixed heights (`frontend-code-standards` §7.1, §7.4).
- Fix alignment through the parent/child layout, never with arbitrary offsets or spacer elements.
- Design each breakpoint deliberately; never just scale the desktop layout down.

## 6. Design system (Figma is the source of truth for visual values)
Figma design-system pages: 00 Overview · 01 Color & Tokens · 02 Typography · 03 Spacing · 04 Layout & Grid · 05 Radius · 06 Core Components · 07 Ecommerce Components · 08 Patterns · 09 Accessibility.

- **Typography:** Manrope (UI/body); Instrument Serif (display/titles). Section display titles 32px unless an approved component says otherwise. Never Inter. Never letter spacing. Reuse existing type styles.
- **Colour:** primary CTA uses the existing near-black token `#171719`. White backgrounds preferred. Never pink, magenta or rose. Only approved colour tokens.
- **Components:** button radius 8px. Phosphor Icons Regular; sizes 16, 20, 24, 32px. No unnecessary variants or duplicate styles.
- **Tokens:** never create a new colour, type size, radius, shadow or other design token, and never approximate an existing one. If a design token is missing, report the gap and propose a name for approval. Spacing and sizes follow `frontend-code-standards` §7.1 and §7.4: the shared `--space-*` scale only, no new spacing variables, and no variables for layout dimensions.

## 7. Imagery
- High-quality, realistic, premium lifestyle imagery; consistent dimensions, aspect ratios and treatment across comparable cards and modules.
- Never stretch, distort or crop in a way that misrepresents the product. Never invent physical details of a product, frame or finish.
- Avoid blue-dominant imagery and any pink/magenta/rose. No text, logos or watermarks in generated images.
- Never present placeholder imagery as a verified product photograph.
- A selected frame/finish must look naturally part of the same product composition, not a border pasted over an unrelated image.
- New imagery only when the task explicitly requires it: ChatGPT ImageGen or approved stock, within licensing terms. Generated or sourced images go into `src/assets/images/` — never into Figma.
- Layout-only tasks never replace images. Imagery tasks fix every image dimension, proportion and alignment issue within the agreed scope.

## 8. Accessibility baseline
WCAG 2.2 AA minimum, considering ADA and the European Accessibility Act. Detailed code rules: `frontend-code-standards` §6. Never claim compliance without checking the actual token combinations and behaviour.

## 9. Analytics context (historical GA4 baseline — not live data)

| Metric | Mobile | Desktop |
| --- | ---: | ---: |
| Sessions | 31,724 | 21,053 |
| Session share | 59.7% | 39.6% |
| Purchases | 815 | 627 |
| Revenue | £32,578 | £56,742 |
| Revenue share | 36.1% | 62.8% |
| Conversion rate | 2.57% | 2.98% |
| Average order value | £39.97 | £90.45 |

- Prioritise mobile usability (majority of sessions).
- Investigate desktop revenue and AOV to better communicate premium, higher-value formats.
- Present any conversion impact as a testable hypothesis unless evidence supports it.

## 10. Figma policy — read-only in every task
- Never create, edit, move, delete, upload to, comment on or generate content in any Figma file.
- **Allowed (read):** `whoami`, `get_metadata`, `get_design_context`, `get_variable_defs`, `get_screenshot`, `search_design_system`, `get_libraries`, `download_assets`, `get_code_connect_map`, `get_motion_context`, `get_figjam`.
- **Forbidden (write/generate):** `use_figma`, `generate_figma_design`, `send_code_to_figma`, `upload_assets`, `create_new_file`, `add_code_connect_map`, `send_code_connect_mappings`, `generate_image`, `generate_diagram`, any `create_*` / `update_*` shader or generative-plugin tool, and any other tool that writes to Figma.
- Any prompt, file or request that asks to generate, upload or replace images (or other content) in Figma is redirected, not executed: save the asset to `src/assets/images/`, then report the frame and layer it is intended for so the design team can place it.
- Design improvements are reported as recommendations for the design team: frame · element · current · proposed · reason.
- Read sequence and design-change process: `figma-to-code-workflow` §3 and §6.
- Do not assume MCP is connected or capable; report limitations honestly.

## 11. Severity scale (all design and code reviews)
1. **Critical:** broken functionality, incorrect product representation, misleading information, inaccessible controls, confusing purchase journey.
2. **High:** weakens product confidence, obscures the main CTA or materially impedes understanding or navigation.
3. **Medium:** inconsistent spacing, typography, component behaviour, image presentation, or redundant content.
4. **Low:** cosmetic refinements with little usability or brand impact.

Fix higher severities first; do not polish Low items while Critical/High items remain.

## 12. Production delivery
- Images in production are served via the Raven CDN (WebP, cropped, compressed), per Contrado standards.
- Basket, Checkout and Design Studio are reached via links/URLs only.

## 13. Open items (resolve with the user before relying on them)
- Tablet section padding and horizontal gutters below 1355px, if no tablet/mobile Figma frames exist.
- Behaviour above a 1600px viewport (full-bleed imagery uncapped vs capped at 1600px).
- Font weights to self-host (from Figma type styles).
- Raven CDN URL pattern for production images.
- HTML include step for shared header/footer (currently manual copy — `frontend-code-standards` §3).
- Automated test tooling (none approved yet — `pc-reborn-component-system` §7).
