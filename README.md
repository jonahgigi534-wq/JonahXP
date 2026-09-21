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

`assets/wallpaper.webp` is the desktop background (1756x895). The carved
name spans roughly 11-87% of its width, so `css/desktop.css` picks a layout
by screen shape:

- **16:9 and wider** -- `cover`, shifted to 42% so the name centres in the crop.
- **Narrower than ~1.56:1** (3:2, tablets, phones) -- fit to width, pin to
  the bottom, and extend the sky above with a gradient sampled from the
  photo's top edge, feathered across the seam.

To replace it, keep the same dimensions and drop in a new file; if the
aspect changes, update `--wp-h` (height / width, in `vw`) in `css/desktop.css`.

`scripts/make_wallpaper.py` still generates the older procedural SVG
(`assets/wallpaper.svg`). It is no longer referenced by the site.

## Sound

`js/audio.js` synthesises every cue at runtime with the Web Audio API --
there are no audio files in this repo. Each sound is a small stack of sine
partials with a bell-like decay:

| Cue | Fires on |
|-----|----------|
| `startup` | clicking the login tile |
| `logoff` | Log Off / Shut Down |
| `open` / `close` | a window opening or closing |
| `minimize` | a window minimising |
| `menu` | opening the Start menu |
| `error` | unused; kept for future dialogs |

Browsers block audio until the visitor interacts with the page, which works
in our favour: the first gesture is the click on the login tile, and that is
exactly when the start-up chime belongs. Before then `play()` is a no-op.

The speaker in the system tray toggles mute, and the choice is remembered in
`localStorage`. To change the overall level, edit `MASTER` at the top of
`js/audio.js`.

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
