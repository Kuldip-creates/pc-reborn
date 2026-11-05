const { cp, mkdir, readFile, writeFile } = require('node:fs/promises');
const { join, resolve } = require('node:path');

async function build() {
const projectRoot = resolve(__dirname, '..');
const sourceRoot = join(projectRoot, 'src');
const outputRoot = join(projectRoot, 'dist');
const partialNames = ['site-header', 'newsletter', 'site-footer', 'wall-art-preview'];
const navigation = JSON.parse(await readFile(join(sourceRoot, 'data', 'site-navigation.json'), 'utf8'));
const homepageSections = JSON.parse(await readFile(join(sourceRoot, 'data', 'homepage-sections.json'), 'utf8'));
const wallArtSections = JSON.parse(await readFile(join(sourceRoot, 'data', 'wall-art-sections.json'), 'utf8'));
const pdpSections = JSON.parse(await readFile(join(sourceRoot, 'data', 'pdp-sections.json'), 'utf8'));
const partials = Object.fromEntries(await Promise.all(
  partialNames.map(async (name) => [
    name,
    await readFile(join(sourceRoot, 'partials', `${name}.html`), 'utf8')
  ])
));

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const validateHref = (href) => {
  if (typeof href !== 'string' || (!href.startsWith('https://www.photo-canvas.com/') && !href.startsWith('./'))) {
    throw new Error(`Unsupported navigation URL: ${href}`);
  }
  return escapeHtml(href);
};

const validateAssetPath = (assetPath) => {
  if (!assetPath.startsWith('assets/images/')) {
    throw new Error(`Unsupported navigation asset path: ${assetPath}`);
  }
  return escapeHtml(assetPath);
};

const renderLinks = (links) => links
  .map(({ label, href }) => `<li><a href="${validateHref(href)}">${escapeHtml(label)}</a></li>`)
  .join('\n');

const renderFeatureVisual = (feature) => {
  const image = validateAssetPath(feature.image);
  const artworkImage = `<img src="${image}" alt="" width="4096" height="4096">`;

  if (feature.visual === 'framed') {
    return `<div class="mega-menu__visual mega-menu__visual--framed" aria-hidden="true">
      <span class="mega-menu__art-frame"><span class="mega-menu__art-mount">${artworkImage}</span></span>
    </div>`;
  }

  if (feature.visual === 'canvas') {
    return `<div class="mega-menu__visual mega-menu__visual--canvas" aria-hidden="true">
      <span class="mega-menu__canvas-body"><span class="mega-menu__canvas-face">${artworkImage}</span></span>
    </div>`;
  }

  if (feature.visual === 'wallpaper') {
    return `<div class="mega-menu__visual mega-menu__visual--wallpaper" aria-hidden="true">
      ${artworkImage}
      <span class="mega-menu__wallpaper-baseboard"></span>
      <span class="mega-menu__wallpaper-floor"></span>
      <span class="mega-menu__wallpaper-sofa-back"></span>
      <span class="mega-menu__wallpaper-sofa-seat"></span>
      <span class="mega-menu__wallpaper-sofa-leg mega-menu__wallpaper-sofa-leg--left"></span>
      <span class="mega-menu__wallpaper-sofa-leg mega-menu__wallpaper-sofa-leg--right"></span>
    </div>`;
  }

  if (feature.visual === 'mug') {
    const mugImage = (file, width, height, className) => {
      const dimensions = file.endsWith('.svg') ? '' : ` width="${width}" height="${height}"`;
      return `<img class="mega-menu__mug-layer ${className}" src="assets/images/${file}" alt=""${dimensions}>`;
    };
    return `<div class="mega-menu__visual mega-menu__visual--mug" aria-hidden="true">
      ${mugImage('mega-menu-photo-mug-handle-outer-ring.svg', '48', '55', 'mega-menu__mug-handle-outer')}
      ${mugImage('mega-menu-photo-mug-handle-opening.svg', '30', '35', 'mega-menu__mug-handle-opening')}
      ${mugImage('mega-menu-photo-mug-saucer.svg', '117', '17', 'mega-menu__mug-saucer')}
      <span class="mega-menu__mug-body"></span>
      ${mugImage('mega-menu-photo-mug-lower-curve.svg', '86', '17', 'mega-menu__mug-lower-curve')}
      ${mugImage('mega-menu-photo-mug-upper-rim.svg', '86', '18', 'mega-menu__mug-upper-rim')}
      ${mugImage('mega-menu-photo-mug-open-top.svg', '72', '11', 'mega-menu__mug-open-top')}
      ${mugImage('mega-menu-feature-artwork.png', '4096', '4096', 'mega-menu__mug-photo')}
    </div>`;
  }

  throw new Error(`Unsupported feature visual: ${feature.visual}`);
};

const renderDesktopNavigation = (currentCategory, currentPage) => navigation
  .map(({ id, label, href }) => {
    const safeId = escapeHtml(id);
    const safeLabel = escapeHtml(label);

    if (href === undefined) {
      const currentClass = id === currentCategory ? ' site-nav__trigger--current' : '';
      return `<button class="site-nav__trigger${currentClass}" type="button" aria-expanded="false" aria-controls="site-mega-menu" data-menu-trigger="${safeId}">${safeLabel}</button>`;
    }

    const currentClass = id === currentCategory ? ' site-nav__link--current' : '';
    const currentPageAttribute = href === `./${currentPage}` ? ' aria-current="page"' : '';
    return `<span class="site-nav__item" data-js="desktop-menu-group">
      <a class="site-nav__link${currentClass}" href="${validateHref(href)}"${currentPageAttribute}>${safeLabel}</a>
      <button class="site-nav__trigger site-nav__trigger--disclosure" type="button" aria-label="Browse ${safeLabel} categories" aria-expanded="false" aria-controls="site-mega-menu" data-menu-trigger="${safeId}">
        <!-- Phosphor: caret-right, regular; rotated -->
        <svg class="icon icon--md" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" focusable="false"><path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"/></svg>
      </button>
    </span>`;
  })
  .join('\n');

const renderDesktopMenus = () => navigation.map(({ id, label, links, feature }) => `
  <div class="mega-menu__panel" id="mega-menu-panel-${escapeHtml(id)}" aria-labelledby="mega-menu-heading-${escapeHtml(id)}" data-menu-panel="${escapeHtml(id)}" hidden>
    <div class="mega-menu__links">
      <h2 class="mega-menu__heading" id="mega-menu-heading-${escapeHtml(id)}" data-js="menu-heading">${escapeHtml(label)}</h2>
      <ul>${renderLinks(links)}</ul>
    </div>
    <article class="mega-menu__feature">
      ${renderFeatureVisual(feature)}
      <div class="mega-menu__feature-copy">
        <p class="mega-menu__eyebrow">${escapeHtml(feature.eyebrow)}</p>
        <h3>${escapeHtml(feature.title)}</h3>
        <p class="mega-menu__description">${escapeHtml(feature.description)}</p>
        <a class="button button--primary mega-menu__cta" href="${validateHref(feature.href)}">${escapeHtml(feature.ctaLabel)}</a>
      </div>
    </article>
  </div>`).join('\n');

const renderMobileNavigation = (currentPage) => navigation.map(({ label, href, links, feature }) => {
  const safeLabel = escapeHtml(label);
  const hasDirectLink = href !== undefined;
  const currentPageAttribute = href === `./${currentPage}` ? ' aria-current="page"' : '';
  const directLink = hasDirectLink
    ? `<a class="mobile-nav__link" href="${validateHref(href)}"${currentPageAttribute}>${safeLabel}</a>`
    : '';
  const summaryClass = hasDirectLink ? ' mobile-nav__summary--linked' : '';
  const summaryLabel = hasDirectLink ? `Browse ${safeLabel} categories` : safeLabel;

  return `
  <li>
    ${directLink}
    <details class="mobile-nav__category">
      <summary class="mobile-nav__summary${summaryClass}">${summaryLabel}</summary>
      <ul class="mobile-nav__links">
        ${renderLinks(links)}
        <li><a class="mobile-nav__feature-link" href="${validateHref(feature.href)}">${escapeHtml(feature.ctaLabel)}</a></li>
      </ul>
    </details>
  </li>`;
}).join('\n');

const pages = [
  {
    source: 'personalise-wall-art.html',
    output: 'personalise-wall-art.html',
    currentCategory: 'wall-art',
    values: {
      announcement_message: 'Made in London · Ships in 1–2 days · 10-year print guarantee',
      newsletter_placeholder: 'name@example.com',
      footer_shop_by_room_href: './index.html#formats',
      footer_find_finish_href: './wall-art.html#shop-by-format',
      footer_inspiration_href: './wall-art.html#shop-by-room',
      footer_how_it_works_href: './index.html#personalisation-title'
    }
  },
  {
    source: 'index.html',
    output: 'index.html',
    currentCategory: '',
    sectionMarker: 'home-section',
    sections: homepageSections,
    values: {
      announcement_message: 'Made in London · Ships in 1–2 days · 10-year print guarantee',
      newsletter_placeholder: 'Email address',
      footer_shop_by_room_href: './wall-art.html#shop-by-room',
      footer_find_finish_href: '#formats',
      footer_inspiration_href: './wall-art.html#shop-by-room',
      footer_how_it_works_href: '#personalisation-title'
    }
  },
  {
    source: 'wall-art.html',
    output: 'wall-art.html',
    currentCategory: 'wall-art',
    sectionMarker: 'category-section',
    sections: wallArtSections,
    values: {
      announcement_message: 'Made in London · Ships in 1–2 days · 10-year print guarantee',
      newsletter_placeholder: 'name@example.com',
      footer_shop_by_room_href: '#shop-by-room',
      footer_find_finish_href: '#shop-by-format',
      footer_inspiration_href: '#shop-by-room',
      footer_how_it_works_href: './index.html#personalisation-title'
    }
  },
  {
    source: 'large-canvas-prints.html',
    output: 'large-canvas-prints.html',
    currentCategory: 'canvas-prints',
    sectionMarker: 'pdp-section',
    sections: pdpSections,
    values: {
      announcement_message: 'Made in London · Ships in 1–2 days · 10-year print guarantee',
      newsletter_placeholder: 'name@example.com',
      footer_shop_by_room_href: './index.html#formats',
      footer_find_finish_href: './wall-art.html#shop-by-format',
      footer_inspiration_href: './wall-art.html#shop-by-room',
      footer_how_it_works_href: './index.html#personalisation-title'
    }
  }
];

const renderPage = (template, values, page) => {
  let html = template.replace(/<!--\s*@include:([a-z-]+)\s*-->/g, (include, name) => {
    const partial = partials[name];
    if (!partial) {
      throw new Error(`Unknown HTML partial: ${name}`);
    }
    return partial;
  });

  for (const [name, value] of Object.entries(values)) {
    html = html.replaceAll(`{{${name}}}`, value);
  }

  if (/<!--\s*@include:/.test(html) || /\{\{[^}]+\}\}/.test(html)) {
    throw new Error('Unresolved HTML include or page value.');
  }

  if (page.sections) {
    const sectionPattern = new RegExp(
      `<!--\\s*@${page.sectionMarker}:([a-z-]+)\\s*-->([\\s\\S]*?)<!--\\s*@\\/${page.sectionMarker}\\s*-->`,
      'g'
    );
    html = html.replace(sectionPattern, (section, name, content) => {
      if (!Object.hasOwn(page.sections, name)) {
        throw new Error(`Missing ${page.sectionMarker} visibility setting: ${name}`);
      }
      return page.sections[name] ? content : '';
    });

    const missingSection = Object.keys(page.sections).find((name) => !template.includes(`<!-- @${page.sectionMarker}:${name} -->`));
    if (missingSection) {
      throw new Error(`${page.sectionMarker} visibility setting has no section marker: ${missingSection}`);
    }

    const unresolvedSectionMarker = new RegExp(
      `<!--\\s*@${page.sectionMarker}:|<!--\\s*@\\/${page.sectionMarker}\\s*-->`
    );
    if (unresolvedSectionMarker.test(html)) {
      throw new Error(`Unresolved ${page.sectionMarker} marker.`);
    }
  }

  return html;
};

await mkdir(outputRoot, { recursive: true });

for (const page of pages) {
  const template = await readFile(join(sourceRoot, page.source), 'utf8');
  const values = {
    ...page.values,
    desktop_navigation: renderDesktopNavigation(page.currentCategory, page.output),
    desktop_mega_menus: renderDesktopMenus(),
    mobile_navigation: renderMobileNavigation(page.output)
  };
  await writeFile(join(outputRoot, page.output), renderPage(template, values, page));
}

for (const directory of ['assets', 'css', 'js']) {
  await cp(join(sourceRoot, directory), join(outputRoot, directory), {
    recursive: true,
    force: true
  });
}

console.log(`Built ${pages.map(({ output }) => `dist/${output}`).join(' and ')}`);
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
