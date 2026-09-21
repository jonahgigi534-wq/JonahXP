# JonahXP — portfolio

A personal portfolio built as a Windows XP desktop: welcome screen, wallpaper,
desktop icons, draggable/resizable windows, taskbar and Start menu.

Static site. No build step, no dependencies, no framework — open `index.html`
and it runs.

## Structure

```
index.html        shell markup (boot screen, desktop, taskbar)
css/
  base.css        tokens, reset, scrollbars
  boot.css        welcome / login screen
  desktop.css     wallpaper + icon grid
  window.css      Luna window chrome
  taskbar.css     taskbar, tray, Start menu
  apps.css        content surfaces for each app
js/
  icons.js        inline SVG icon set
  data.js         profile + project content  <- edit this to add a project
  windows.js      window manager (drag, resize, min/max, back/forward)
  apps.js         About / Projects / Contact / Resume views
  desktop.js      desktop icon grid
  taskbar.js      task buttons, tray, clock
  startmenu.js    Start menu
  boot.js         welcome screen
  main.js         boot order
```

All artwork is hand-drawn SVG or CSS. No Microsoft assets or image files are
used, so the whole site is a few hundred KB of text.

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

## Running locally

```bash
python -m http.server 4173
```

Then open <http://localhost:4173>.

## Deploying to GitHub Pages

Push to a repo, then Settings → Pages → Source: *Deploy from a branch*,
branch `main`, folder `/ (root)`. No workflow needed since there is no build.

## Browser notes

Windows drag and resize via Pointer Events. Below 760px wide, windows open
maximised and the projects sidebar collapses to icons.
