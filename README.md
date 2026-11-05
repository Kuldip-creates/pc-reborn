# PC Reborn

## Local development

Use Node.js 22 or later. From the project folder in PowerShell, run:

```powershell
npm run dev
```

Stop any existing server on port 8000 first. Open
<http://localhost:8000/index.html>, <http://localhost:8000/wall-art.html> or
<http://localhost:8000/large-canvas-prints.html>.

The command builds the site once and starts a local-only development server with
correct JavaScript MIME types. While it runs, saving, adding or deleting a file
under `src/js/` automatically reloads open pages. JavaScript is served directly
from source, without another build or a copy into `dist/`. Keep the terminal
running; press Ctrl+C to stop.

HTML, SCSS and asset changes are not watched by this command. After changing
those files, run `npm run build` in another terminal and refresh the browser.
Development reload code is injected only by the server, never into built files.

To use another port:

```powershell
$env:PORT = '8001'
npm run dev
```

## Production build

```powershell
npm run build
```

Deploy `dist/` using a static server that serves `.js` files as
`text/javascript`. The development server is not for production use.
