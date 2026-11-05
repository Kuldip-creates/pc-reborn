# Shared Site Footer — Status: Draft

Figma: [HP Desktop footer](https://www.figma.com/design/L2LvNYSoNhr1p3PPhjlnjR/Homepage?node-id=3752-12261)  
Version: Approved HP Desktop frame `3752:11954`; no named version supplied.

## Purpose

Provide the shared site footer on the homepage, Wall Art category page, Large Canvas Prints page and personalisation page. The Figma footer is the homepage visual reference; existing routes and shared navigation remain the code source of truth.

## Anatomy

- Brand and short tagline.
- Shop, Inspiration, Help and Company link columns.
- Copyright and verified Privacy, Terms and Cookies links.
- Shared markup in `src/partials/site-footer.html`, styles in `src/scss/layout/_site-footer.scss`.
- `scripts/build-html.js` supplies page-specific destinations for Shop by room, Find your finish, Inspiration and guidance, and How it works.

## Responsive behaviour

- Mobile starts with two columns; the brand spans the grid.
- At `md`, the grid uses four columns; at `lg`, it uses five columns with a wider brand column.
- Footer and legal links wrap instead of forcing horizontal overflow.

## Link handling

- The homepage Shop by room link targets `./index.html#formats` while the source section is disabled on the homepage.
- Existing shop, help, inspiration and company destinations are retained. The locally implemented Canvas Prints page remains `./large-canvas-prints.html`.
- Privacy and Cookies link to the verified privacy policy; Terms links to the verified terms page.
- The Figma Accessibility URL returned 404 when checked and is not linked.

## Validation

- `npm run build` passes token lint, Sass compilation and generation of all four pages.
- Homepage overflow was checked at 320, 375, 768, 1200 and 1600 CSS viewport widths; no horizontal document overflow was found.
- Cross-page visual, W3C and screen-reader review remain outstanding. The integrated browser did not sustain a 1600px screenshot.
