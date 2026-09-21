# JonahXP — portfolio

A personal portfolio built as a Windows XP desktop: welcome screen, wallpaper,
desktop icons, draggable/resizable windows, taskbar and Start menu.

Static site. No build step, no dependencies, no framework — open `index.html`
and it runs.

## Structure

```
index.html        shell markup (splash, login, desktop, taskbar)
css/
  base.css        tokens, reset, scrollbars
  cursors.css     custom arrow / hand / I-beam / busy cursors
  boot.css        boot splash + login screen + brand lockup
  desktop.css     wallpaper + icon grid
  window.css      Luna window chrome
  taskbar.css     taskbar, tray, Start menu
  apps.css        content surfaces for each app
js/
  icons.js        inline SVG icon set
  brand.js        four-pane flag + wordmark lockup
  data.js         profile + project content  <- edit this to add a project
  windows.js      window manager (drag, resize, min/max, back/forward)
  apps.js         About / Projects / Contact / Resume views
  desktop.js      desktop icon grid
  taskbar.js      task buttons, tray, clock
  startmenu.js    Start menu
  boot.js         splash -> login -> desktop sequence
  main.js         boot order
assets/
  wallpaper.svg   generated; do not hand-edit
scripts/
  make_wallpaper.py  regenerates the wallpaper
  serve.py           no-cache local preview server
```

All artwork is hand-drawn SVG or CSS — the flag, the icons, the cursors and
the wallpaper. No Microsoft assets are shipped and there are no bitmap files.

## Adding a project

Everything lives in `js/data.js`. Append an entry to the `projects` array:

```js
{
  id: 'my-project',            // used in the fake address bar
  title: 'My Project',
  tagline: 'One line summary',
  category: 'ml',              // 'ml' | 'apps' | 'hardware'
  badge: 'Machine learning',   // shown on the thumbnail
  meta: 'Python · FastAPI',
  repo: 'https://github.com/...',
  thumb: thumbSolar,           // reuse one, or write a new svg(...) helper
  summary: ['Paragraph one.', 'Paragraph two.'],
  features: ['Bullet', 'Bullet'],
  stack: ['Python', 'FastAPI'],
  notes: 'Caveats, limitations, anything worth flagging.'
}
```

Categories are defined in the `filters` array in the same file.

## The wallpaper

`assets/wallpaper.svg` is generated, not hand-written. It is a Bliss-style
hillside with roughly 45,000 individual grass blades and the name cut into
the turf. To change the name or re-roll it:

```bash
python scripts/make_wallpaper.py --name JONAH
```

It is ~1.6 MB on disk, ~512 KB gzipped. If that is too heavy, lower the
blade counts in the three `turf(...)` calls near the bottom of `build()`.

## The boot sequence

`js/boot.js` runs splash -> login -> desktop. The splash holds for
`SPLASH_MS` (2.6s) and is skipped on repeat visits within the same tab, via
a `sessionStorage` flag. "Restart JonahXP" on the login screen replays it.

## Running locally

```bash
python scripts/serve.py
```

Then open <http://localhost:4173>. This server sends `no-store`, so edits
show up on reload instead of being masked by the browser cache.

Asset links in `index.html` carry a `?v=` stamp. Bump it when you deploy a
change and want to be sure visitors get the new file.

## Deploying to GitHub Pages

Push to a repo, then Settings → Pages → Source: *Deploy from a branch*,
branch `main`, folder `/ (root)`. No workflow needed since there is no build.

## Browser notes

Windows drag and resize via Pointer Events. Below 760px wide, windows open
maximised and the projects sidebar collapses to icons.
