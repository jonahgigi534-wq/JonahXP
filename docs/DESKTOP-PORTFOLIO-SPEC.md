# Desktop-OS Portfolio — build spec

A portfolio site presented as a working desktop operating system. This
document is the complete context for rebuilding it. Part 1 describes the
reference implementation (Windows XP). Part 2 is the build spec for a
**classic Mac OS** version.

It is written to be handed to a person *or* to a coding agent as the sole
brief. Nothing here assumes you have seen the original.

---

## Part 0 — The idea in one paragraph

The site boots like an operating system, then presents the author's work as
applications inside draggable windows. It is a static site: no build step,
no framework, no dependencies, no bundler. Plain HTML, CSS and classic
`<script>` tags. Everything deploys to GitHub Pages by pushing to `main`.
The whole thing is about 2,500 lines.

The bet is that the novelty earns attention and the content keeps it. So the
shell must be convincing *and* the project pages must be substantive — a
visitor who came for the gimmick should leave knowing what you build.

---

## Part 1 — The reference implementation

### 1.1 File map

```
index.html          shell markup: splash, login, desktop, taskbar
css/
  base.css          design tokens, reset, scrollbars
  cursors.css       custom cursors as SVG data URIs
  boot.css          splash + login + welcome + brand lockup
  desktop.css       wallpaper + icon grid
  window.css        window chrome
  taskbar.css       taskbar, tray, start menu
  apps.css          content surfaces for each app
js/
  icons.js          inline SVG icon set            -> window.XPIcons
  brand.js          logo lockup                    -> window.XPBrand
  audio.js          synthesised sound cues         -> window.XPAudio
  data.js           profile + project content      -> window.XPData
  windows.js        window manager                 -> window.XPWM
  apps.js           the apps themselves            -> window.XPApps
  desktop.js        desktop icon grid              -> window.XPDesktop
  taskbar.js        task buttons, tray, clock      -> window.XPTaskbar
  startmenu.js      start menu                     -> window.XPStartMenu
  boot.js           boot sequence                  -> window.XPBoot
  main.js           boot order
assets/
  wallpaper.webp    desktop background
scripts/
  serve.py          no-cache local preview server
  make_wallpaper.py generates a procedural wallpaper (optional)
```

Scripts load in dependency order at the end of `<body>`; `main.js` calls
`XPBoot.init()`, `XPDesktop.render()`, `XPTaskbar.init()`,
`XPStartMenu.init()`. Every module is an IIFE assigning one global. There
are no ES modules and no `fetch`, which means **the site also works opened
directly from the filesystem** (`file://`). Keep that property.

### 1.2 The window manager — the one piece worth reusing wholesale

`js/windows.js` is ~310 lines and splits cleanly:

| Generic (keep as-is) | Theme-specific (rewrite) |
|---|---|
| `open` `close` `minimize` `restore` `focus` `toggle` `toggleMax` | `chromeMarkup(opts)` — builds title bar, menu bar, toolbar |
| `applyRect` — geometry, cascade placement, viewport clamping | the CSS class names it emits |
| `wireDrag` / `wireResize` — Pointer Events drag and resize | which widgets exist (min/max/close vs close/zoom/collapse) |
| `makeApi` — per-window view stack: `navigate` `back` `forward` `setStatus` | |

`open(opts)` takes:

```js
XPWM.open({
  id: 'projects',          // unique; opening twice focuses the existing one
  title: 'My Projects',
  icon: 'globe',           // key into the icon set
  chrome: 'simple',        // or omit for the full browser chrome
  width: 960, height: 640,
  maximized: true,
  statusRight: 'My Projects',
  view: someView(),             // initial view (see below)
  tools: [{ id, label, icon }], // extra toolbar buttons
  onTool: (id, api) => {}
});
```

A **view** is the universal content unit:

```js
{ title: 'PDF Pilot', address: 'https://.../pdf-pilot',
  render(rootEl, api) { /* build DOM into rootEl */ } }
```

`api.navigate(view)` pushes onto that window's history, so Back and Forward
work per-window. This is how the projects grid drills into a project page.
**Keep this contract** — the Mac port changes the chrome around it, not this.

Windows below 760px wide open maximised. A `xp:windows` CustomEvent fires on
any change so the taskbar can re-render.

### 1.3 Content model — `js/data.js`

The only file most people need to edit. Frozen object, no I/O:

```js
profile = { name, role, github, email, linkedin, about[], skills[] }
filters = [{ id, label, icon }]          // category sidebar
projects = [{
  id, title, tagline,
  category,        // matches a filter id
  badge,           // shown on the thumbnail
  meta,            // "Electron / JavaScript"
  repo,
  thumb(),         // returns an SVG string - generated cover art
  summary[],       // paragraphs
  features[],      // bullets
  stack[],         // tags
  notes            // caveats / limitations
}]
```

The `notes` field matters. Each project page ends with a "Worth knowing"
section stating what the project does *not* do well, drawn from the real
README. It reads as confidence rather than marketing.

### 1.4 Apps

| App | Window | Content |
|---|---|---|
| About Me | simple chrome | bio paragraphs, skill chips, links |
| My Projects | full chrome | sidebar filters + card grid, drills into project pages |
| Contact Me | simple chrome | email + GitHub rows |
| Resume | simple chrome | plain-text resume generated from `data.js` |

The projects grid is modelled on a video library: 16:9 cover, avatar, title,
two-line meta. It is the one screen that must look genuinely good.

### 1.5 Boot sequence — `js/boot.js`

```
splash (2.6s)  ->  login  ->  [click user]  ->  welcome (2.2s)  ->  desktop
```

- **Splash**: black screen, logo lockup, three-block progress marquee,
  corner notices. Skipped on repeat visits in the same tab via a
  `sessionStorage` flag.
- **Login**: banded screen, logo left, user tile right, Restart action.
- **Welcome**: the same frame with everything but one word removed; the
  desktop cross-fades in *underneath* it rather than cutting through black.
- A re-entrancy guard ignores repeat clicks during the transition.

### 1.6 Sound — `js/audio.js`

Every cue is synthesised at runtime with the Web Audio API. **No audio
files.** A cue is a stack of sine partials with an exponential bell decay:
fundamental plus a detuned octave and a fifth, which is what stops it
sounding like a bare test tone.

| Cue | Fires on |
|---|---|
| `startup` | the desktop appearing |
| `logoff` | log off / shut down |
| `open` / `close` | a window opening or closing |
| `minimize` | a window minimising |
| `menu` | opening the start menu |
| `error` | unused, kept for dialogs |

Browsers block audio until the visitor interacts. That constraint is useful:
the first gesture is the login click, so `unlock()` runs there and the chime
plays when the desktop appears. Before unlock, `play()` is a no-op. A
speaker in the system tray toggles mute, persisted to `localStorage`. Every
storage call is wrapped in try/catch — private mode throws.

### 1.7 Artwork

Everything is drawn in SVG or CSS: icons, logo, cursors, project covers. The
only binary is the wallpaper photo. This keeps the repo small and avoids
shipping anyone else's assets (see Part 4).

---

## Part 2 — The classic Mac OS build

### 2.1 Pick an era first

| Era | Look | Verdict |
|---|---|---|
| System 6 | 1-bit black and white, Chicago | Striking, too austere for project covers |
| System 7 | B&W or colour, Chicago, flat | Charming and simple to draw |
| **Mac OS 8/9 "Platinum"** | Grey 3D, pinstripes, Charcoal | **Recommended** |

Platinum has enough visual interest to carry a portfolio, its widgets are
distinctive, and reference screenshots are plentiful. The rest of this spec
assumes Mac OS 8.5–9.2.

### 2.2 The mapping table

This is the core of the port. The architecture does not change; the shell
vocabulary does.

| Windows XP | Classic Mac OS | Notes |
|---|---|---|
| Taskbar along the bottom | **Menu bar along the top** | Biggest structural change |
| Start button and menu | **Apple menu** (top-left) | Holds About, Resume, Contact, project shortcuts |
| Taskbar window buttons | **Application menu** (top-right) | Lists open windows; selecting focuses one |
| System tray | Right side of the menu bar | Clock, sound toggle |
| Desktop icons top-**left** | Desktop icons top-**right** | Hard rule; Mac icons flow down the right edge |
| — | **Trash, bottom-right** | Expected; decorative is fine |
| Title bar: icon left, buttons right | **Close box left; collapse and zoom right** | Title is *centred*, not left-aligned |
| Blue gradient title bar | **Horizontal pinstripes** | Active only; inactive is plain grey |
| Minimise | **Collapse** (windowshade - rolls up into the title bar) | Replaces minimise entirely |
| Maximise | **Zoom** (fits content) | Not a fullscreen toggle |
| Menu bar inside each window | Menus live in the **global menu bar** | Contents change with the focused window |
| Status bar | Finder status: "3 items, 1.2 GB available" | |
| Address bar | Drop it, or use a Finder path popup | |
| Boot splash and login | **Happy Mac, then Welcome to Mac OS** | See 2.5 |
| Windows startup chime | A Mac-like chord | Synthesise it; see 2.7 |

### 2.3 Platinum visual tokens

Replace `css/base.css` wholesale:

```css
:root {
  --face:        #dddddd;   /* window and dialog grey */
  --face-light:  #eeeeee;
  --white:       #ffffff;   /* top-left bevel */
  --grey-mid:    #aaaaaa;
  --grey-dark:   #888888;   /* bottom-right bevel */
  --outline:     #000000;   /* 1px frame, always pure black */
  --stripe-lo:   #cccccc;   /* title bar pinstripe */
  --stripe-hi:   #eeeeee;
  --accent:      #3366cc;   /* selection */
  --accent-soft: #b6cff5;
  --menubar:     #ffffff;
  --desktop:     #6e7e96;   /* default desktop blue-grey */
  --titlebar-h:  20px;
  --menubar-h:   20px;
}
```

Platinum bevels are **1px, hard, never blurred**: white on the top-left,
`--grey-dark` on the bottom-right, inside a 1px black outline. No shadows on
widgets. Windows get a soft drop shadow; nothing else does.

Title bar pinstripes are alternating 1px rows:

```css
.win-title {
  background: repeating-linear-gradient(
    to bottom, var(--stripe-hi) 0 1px, var(--stripe-lo) 1px 2px);
}
.win.is-inactive .win-title { background: var(--face); }
```

### 2.4 Typography

Apple's originals (Chicago, Charcoal, Geneva, Monaco) **must not be
redistributed**. Options, best first:

1. A permissively licensed lookalike, self-hosted. Check each candidate's
   licence yourself — several popular Chicago clones are freeware for
   personal use only, which is not the same as redistributable.
2. A CSS stack that uses the real fonts when the visitor is on a Mac that
   has them, and degrades gracefully:
   `font-family: Charcoal, Chicago, Geneva, Verdana, sans-serif;`
3. Any clean geometric sans at small sizes. Most of the period feel comes
   from the widgets, not the letterforms.

Sizes: 12px for UI and titles, 9–10px for icon labels and status text.
Classic Mac UI text is **bold far more often** than Windows — menu bar
items, window titles and button labels are all bold.

### 2.5 Boot sequence

Classic Mac OS has no login screen, so the XP flow needs rethinking rather
than translating:

```
grey screen + Happy Mac (1.2s)
  -> "Welcome to Mac OS" splash, extension icons marching along the
     bottom row, left to right (2.5s)
  -> desktop fades in, chime plays
```

The marching extension icons are the most recognisable part of a Mac boot
and they replace the XP progress marquee. Draw 8–12 tiny SVG icons and
reveal them one at a time, roughly 180ms apart.

**If you want the "click your name" beat**, Mac OS 9's Multiple Users login
dialog is the only period-correct option: a small centred Platinum dialog
with a user list and a Log In button. Legitimate, but obscure. Otherwise go
straight to the desktop — the Happy Mac already gives the site its opening
moment.

Keep the skip-on-repeat-visit behaviour either way.

### 2.6 Windows, menus and controls

Window chrome, rewriting `chromeMarkup`:

```
+---------------------------------------------+
| [X]  ====== Macintosh HD ======      [=] [O]|   close left, collapse+zoom right
+---------------------------------------------+
|                                           ^ |
|  content                                  # |   scrollbar: square arrows
|                                           v |   at both ends
+---------------------------------------------+
| 3 items                                  // |   status + grow box
+---------------------------------------------+
```

- Widgets are ~11px squares with the 1px bevel treatment.
- **Inactive windows hide their widgets entirely** and lose the pinstripes.
  This is very visible and very Mac; get it right.
- The resize grip is a **grow box in the bottom-right corner only** —
  classic Mac windows do not resize from their edges. Simplify `wireResize`
  accordingly.
- Scrollbar arrows sit at **both ends** of the trough.

**Menu bar**: 20px, white, 1px black bottom border, Apple logo at the left,
then File / Edit / View / Special. Clicking opens a pull-down with a 1px
black border and a hard drop shadow; the open title inverts. Disabled items
are grey. Keyboard shortcuts are right-aligned with the command glyph.

**The Application menu** at the far right is how window switching works — it
replaces the taskbar. Show the focused window's name and icon, and list all
open windows in the pull-down.

### 2.7 Sound

The Mac startup chime is **Apple's trademark**; do not sample it.
Synthesise something in its spirit with the same `voice()` and `bell()`
helpers:

- A single lush major chord struck once: slow attack (~80ms), long decay
  (~2.5s), rather than XP's four rising notes. Root, major third, fifth and
  octave, slightly detuned, over a low pad.
- `open` and `close` become softer and shorter; classic Mac is quieter
  than XP.
- Add a `beep` cue for alerts — a single short square-wave blip.

Keep the gesture-gated unlock and the mute toggle, moving the toggle to the
menu bar.

### 2.8 Desktop and wallpaper

Classic Mac desktops were usually a **pattern**, not a photo. That is good
news: a repeating 8x8 or 16x16 CSS or SVG pattern is a few hundred bytes and
sidesteps every cropping problem in §3.2.

Icons: 32x32, flowing **top-right downward**, label centred underneath in
9–10px white text with no shadow. The selected state inverts the label to a
solid accent block and darkens the icon. Trash sits bottom-right.

### 2.9 App translation

| App | Mac form |
|---|---|
| About Me | **About This Computer** under the Apple menu — a Platinum dialog with the logo, your name, and "Built-in Memory" style rows repurposed for skills |
| My Projects | A **Finder window** with icon view and a list-view toggle. Each project is a folder; opening one drills into its page via the existing view stack |
| Project page | A **Get Info window**, or a SimpleText document |
| Resume | **SimpleText** — Monaco, plain text, a real text window |
| Contact | A small Platinum dialog, or a mock Mail window |

The Finder list view is worth building: columns for Name, Kind, Size and
Date. It reads as authentically Mac and suits a project index.

### 2.10 Cursors

Redraw, do not copy. Four are enough: arrow (hotspot top-left), I-beam,
pointing hand, and the **watch** for loading. Animate the watch — swap a few
frames on an interval while the shell boots.

### 2.11 Suggested rename map

Cosmetic, but it keeps the port honest: `XPWM` to `MacWM`, `XPIcons` to
`MacIcons`, `XPAudio` to `MacAudio`, `taskbar.js` to `menubar.js`,
`startmenu.js` to `applemenu.js`.

---

## Part 3 — Hard-won lessons

These cost real time in the original build. Read before starting.

### 3.1 The browser cache will lie to you

`python -m http.server` lets the browser hold stale CSS and JS between
edits. You will change a file, reload, see no change, and start debugging
code that was already correct. Two fixes, use both:

- Serve with `no-store` (`scripts/serve.py` does this — copy it).
- Put a `?v=N` stamp on every `<link>` and `<script>` in `index.html` and
  bump it when you deploy.

### 3.2 A wide photo cannot fill a narrow screen

A 1.96:1 wallpaper with text spanning 11–87% of its width loses letters to
`cover` cropping on anything narrower than ~1.56:1, and worse once you zoom
in. The fix is two layouts chosen by aspect ratio:

- Wide screens: `cover`, anchored horizontally so the text centres in the
  visible crop — not 50%, compute it.
- Narrow screens: fit to width, pin to the bottom, and extend the sky above
  with a gradient sampled from the photo's own top row, feathered across the
  seam so there is no hard line.

Before shipping, check the arithmetic across 21:9, 16:9, 16:10, 3:2, 4:3 and
phone portrait rather than eyeballing two sizes. A ten-line script that
prints the visible fraction per aspect ratio pays for itself.

**A desktop pattern avoids all of this.** Prefer it.

### 3.3 Autoplay policy is a feature

Audio is blocked until the visitor interacts. Rather than fighting it, put
the unlock on the one click the flow already requires and schedule the chime
for the moment the desktop appears.

### 3.4 Duplicated SVG gradient IDs

If every window's chrome embeds the same `<linearGradient id="x">`, they
collide. Pass a per-instance id suffix such as `w-${opts.id}` into the icon
factory.

### 3.5 Flex children do not shrink by default

A long title inside a fixed-width menu will blow out the column instead of
ellipsising. `text-overflow: ellipsis` is not enough — every ancestor in the
flex chain needs `min-width: 0`.

### 3.6 Verify with the DOM, not screenshots

Preview panes crop and return stale frames, especially at tall emulated
viewports. When a screenshot disagrees with what the code should do, check
computed styles, element rectangles and hit-testing before changing
anything. In the original build, "the grass is missing" was a cropped
capture three times running.

### 3.7 Generated art gets big fast

A procedural SVG wallpaper with 65,000 grass blades was 6.4 MB. Grouping
blades by quantised colour and width and emitting strokes instead of filled
outlines brought it to 1.3 MB. What actually fixed it was spending detail
only where the eye reads it: procedural texture for the far field, real
geometry up close. The photo that eventually replaced it was 374 KB.

---

## Part 4 — Asset and legal rules

The original build followed these and the port should too.

- **Do not ship Apple's system assets.** No Finder icons, no Happy Mac
  bitmap, no Chicago or Charcoal font files, no startup chime recording. All
  of it is copyrighted, and the chime is a registered trademark.
- **Draw your own in SVG.** Redrawing the Platinum widget set is a few
  hundred lines and makes the project self-contained and legally clean.
- **Do not reuse another person's portfolio assets**, even when borrowing
  the concept. In the original build a logo image was supplied that turned
  out to carry the reference site owner's own name; it was rebuilt from
  scratch instead. Taking visual inspiration is fine. Shipping someone
  else's files, or their name, is not.
- Check the licence of any lookalike font before self-hosting it. "Free to
  download" frequently is not "free to redistribute".

---

## Part 5 — Build order

1. `data.js` with your real content, from your real READMEs. Do this first;
   it keeps every later decision honest.
2. `serve.py` and the cache-busting stamp. Five minutes, saves hours.
3. Static desktop: pattern, menu bar, icons top-right, Trash. No behaviour.
4. Window chrome, one hard-coded window. Get the pinstripes, the 1px bevels
   and the widget placement right before anything moves.
5. Port `windows.js` — keep the generic half, rewrite `chromeMarkup`, swap
   minimise for collapse, reduce resize to the grow box.
6. Apple menu and Application menu.
7. Apps, starting with the Finder-style project browser since it carries the
   content.
8. Boot sequence.
9. Sound.
10. Cursors.
11. Responsive pass, then deploy.

Deployment: push to `main`, then Settings, Pages, Deploy from a branch,
`main` and `/ (root)`. No workflow needed; there is nothing to build.

---

## Part 6 — Definition of done

- Boots, with a sequence that is skipped on repeat visits in the same tab.
- Windows open, focus, drag, collapse, zoom, resize from the grow box and
  close.
- Window switching works through the Application menu.
- Every project has a page with summary, features, stack and honest caveats.
- Sound plays after the first gesture and can be muted; the choice persists.
- No console errors on a clean load.
- Usable at phone width — windows open maximised, menus stay reachable.
- Opens correctly from `file://` as well as over HTTP.
- No third-party or vendor assets in the repository.
