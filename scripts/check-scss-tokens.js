// ==========================================================
// SCSS TOKEN CHECK | Keeps custom properties to design tokens
// ==========================================================
// Custom properties are for reusable design tokens only: colour, type, the
// shared spacing scale, radius, motion and layers. Widths, heights, offsets,
// column sizes and gaps of one component or section are never variables. Size
// layouts with fluid grid/flex tracks (fr, minmax(0, 1fr)), aspect-ratio,
// padding and margin. See frontend-code-standards §7.1 and §7.4.
const { readdir, readFile } = require('node:fs/promises');
const { join, relative, resolve } = require('node:path');

const projectRoot = resolve(__dirname, '..');
const scssRoot = join(projectRoot, 'src', 'scss');

// Adding a spacing step is a design-system change: update the scale in
// base/_root.scss and here together, with approval.
const spaceScale = new Set([1, 2, 3, 4, 6, 8, 12, 16, 20, 24, 32, 36, 48, 88]);
const tokenFamilies = /^--(color|font|line-height|radius|motion|layer)-[a-z0-9-]+$/;

const listScssFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? listScssFiles(path) : [path];
  }));
  return files.flat().filter((file) => file.endsWith('.scss'));
};

const stripComments = (source) => source
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/(^|\s)\/\/.*$/gm, '$1');

const validateDeclaration = (token, value) => {
  const space = token.match(/^--space-(\d+)$/);
  if (space) {
    const step = Number(space[1]);
    if (!spaceScale.has(step)) {
      return `${token} is not on the spacing scale (${[...spaceScale].join(', ')}). Use the nearest scale token instead of adding one.`;
    }
    if (value !== `${step}px`) {
      return `${token} must be ${step}px, found ${value}.`;
    }
    return null;
  }

  if (!tokenFamilies.test(token)) {
    return `${token} is not an approved design token. Do not store layout sizes (width, height, offset, columns, gap) in custom properties.`;
  }
  return null;
};

async function check() {
  const declared = new Map();
  const referenced = new Map();
  const errors = [];

  for (const file of await listScssFiles(scssRoot)) {
    const name = relative(projectRoot, file).replaceAll('\\', '/');
    const source = stripComments(await readFile(file, 'utf8'));

    for (const [, token, value] of source.matchAll(/(?:^|[;{\s])(--[a-z0-9-]+)\s*:\s*([^;}]+)/g)) {
      declared.set(token, name);
      const problem = validateDeclaration(token, value.trim());
      if (problem) {
        errors.push(`${name}: ${problem}`);
      }
    }

    for (const [, token] of source.matchAll(/var\(\s*(--[a-z0-9-]+)/g)) {
      referenced.set(token, name);
    }
  }

  for (const [token, name] of referenced) {
    if (!declared.has(token)) {
      errors.push(`${name}: ${token} is used but never declared.`);
    }
  }

  const unused = [...declared.keys()].filter((token) => !referenced.has(token));
  if (unused.length) {
    console.warn(`Unused tokens (remove them if they are outdated): ${unused.join(', ')}`);
  }

  if (errors.length) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
    return;
  }

  console.log(`SCSS token check passed: ${declared.size} tokens, ${referenced.size} referenced.`);
}

check().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
