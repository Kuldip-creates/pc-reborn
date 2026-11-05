const { watch } = require('node:fs');
const { readFile, realpath } = require('node:fs/promises');
const { createServer } = require('node:http');
const { extname, isAbsolute, join, relative, resolve, sep } = require('node:path');

const projectRoot = resolve(__dirname, '..');
const outputRoot = join(projectRoot, 'dist');
const scriptRoot = join(projectRoot, 'src', 'js');
const port = Number(process.env.PORT ?? 8000);
const clients = new Set();
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf'
};
const reloadScript = `<script>
(() => {
  const updates = new EventSource('/__dev/events');
  updates.addEventListener('reload', () => location.reload());
  updates.addEventListener('error', () => {
    console.warn('Development reload disconnected; waiting for the server.');
  });
})();
</script>`;

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535.');
}

const isWithin = (root, path) => {
  const remainder = relative(root, path);
  return remainder !== '..' && !remainder.startsWith(`..${sep}`) && !isAbsolute(remainder);
};

const server = createServer(async (request, response) => {
  response.setHeader('Cache-Control', 'no-store');

  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end('Method not allowed');
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch {
    response.writeHead(400);
    response.end('Invalid request URL');
    return;
  }

  if (pathname === '/__dev/events') {
    response.writeHead(200, {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive'
    });
    if (request.method === 'HEAD') {
      response.end();
      return;
    }
    response.write(': connected\n\n');
    clients.add(response);
    response.on('close', () => clients.delete(response));
    return;
  }

  // Serve modules from source so edits, additions and deletions need no rebuild.
  const isScript = pathname.startsWith('/js/');
  const root = isScript ? scriptRoot : outputRoot;
  const resource = isScript ? pathname.slice(4) : pathname === '/' ? 'index.html' : pathname.slice(1);
  const file = resolve(root, resource);
  if (pathname.includes('\0') || !isWithin(root, file)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  try {
    const resolvedFile = await realpath(file);
    if (!isWithin(root, resolvedFile)) {
      response.writeHead(403);
      response.end('Forbidden');
      return;
    }
    const extension = extname(resolvedFile).toLowerCase();
    let content = await readFile(resolvedFile);
    if (extension === '.html') {
      content = Buffer.from(content.toString('utf8').replace('</body>', `${reloadScript}\n</body>`));
    }
    response.writeHead(200, {
      'Content-Type': mimeTypes[extension] ?? 'application/octet-stream',
      'Content-Length': content.length
    });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch (error) {
    const notFound = ['ENOENT', 'ENOTDIR', 'EISDIR'].includes(error.code);
    if (!notFound) console.error(`Cannot serve ${pathname}:`, error);
    response.writeHead(notFound ? 404 : 500);
    response.end(notFound ? 'Not found' : 'Development server error; see terminal');
  }
});

let reloadTimer;
const watcher = watch(scriptRoot, { recursive: true }, (event, filename) => {
  if (filename && !['.js', '.mjs'].includes(extname(filename).toLowerCase())) return;
  clearTimeout(reloadTimer);
  reloadTimer = setTimeout(() => {
    console.log(`JavaScript changed: ${filename ?? event}. Reloading browsers.`);
    for (const client of clients) client.write('event: reload\ndata: changed\n\n');
  }, 150);
});

const shutdown = () => {
  clearTimeout(reloadTimer);
  watcher.close();
  for (const client of clients) client.end();
  server.close();
  server.closeAllConnections();
};

watcher.on('error', (error) => {
  console.error('JavaScript watcher failed:', error);
  process.exitCode = 1;
  shutdown();
});
server.on('error', (error) => {
  console.error(`Cannot start development server on port ${port}:`, error.message);
  console.error('Stop the existing server or choose another port using $env:PORT.');
  process.exitCode = 1;
  shutdown();
});
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

server.listen(port, '127.0.0.1', () => {
  console.log(`Development site: http://localhost:${port}/index.html`);
  console.log('Watching src/js: save a JavaScript file to reload. Press Ctrl+C to stop.');
});
