# Jack de Haan - Planetarium Portfolio

An interactive personal website featuring a real-time accurate sky map with clickable constellations.

## Features

- **Accurate Star Positions**: Real astronomical calculations based on your location and current time
- **Interactive Constellations**: Hover over constellations to highlight them, click to explore different sections
- **Real-time Sky Map**: Shows the actual stars visible from your location
- **Twinkling Stars**: Realistic star twinkling effect
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **React + Vite**: Modern, fast development experience

## Sections

- **Ursa Major** → About Me
- **Orion** → Projects
- **Cassiopeia** → Research
- **Lyra** → Music
- **Aquila** → Thoughts/Blog
- **Gemini** → Experience & Skills

## Setup

# Jack de Haan – Planetarium Portfolio

An interactive personal website with a real-time planetarium background, card-based navigation, and scroll-stacked content pages.

## Tech Stack

- **React 18** + **Vite** (single-page app)
- **React Router** for routing
- **Canvas API** for the planetarium
- **GSAP** and light CSS transitions for micro-interactions

## App Structure

### Entry & Layout

- **src/main.jsx** – React/Vite bootstrap.
- **src/App.jsx** – Declares all routes (Home, About, Projects, Research, Music, etc.) and wraps everything in the site layout.
- **src/components/SiteLayout.jsx** – Global shell:
  - Header with brand panel and card-style dropdown navigation (CardNav).
  - Dock at the bottom for quick navigation (Dock).
  - Hosts a single full-viewport `GalaxyCanvas` planetarium behind all pages and coordinates “intro vs planetarium” state via custom events.
  - Handles special cases like 404 and Coming Soon.

### Planetarium & Backgrounds

- **src/components/GalaxyCanvas.jsx** – The main planetarium:
  - Renders stars, constellations, Milky Way band, and solar system bodies on `<canvas>`.
  - Handles drag/zoom interaction, pointer hit-testing, and selection highlights.
  - Listens to and emits custom events (e.g., `planetarium:loaded`, `planetarium:first-drag`, `planetarium:click`).
- **src/components/Galaxy.jsx** – Lightweight shader-ish background used for pages like 404/Coming Soon.
- **src/components/LightPillar.jsx** – Accent background element used on the Now page.

### Navigation Components

- **src/components/CardNav.jsx** – Animated dropdown card navigation:
  - Uses GSAP timelines to expand/collapse the nav.
  - Renders a stack of route cards (About, Now, Projects, Research, etc.).
- **src/components/Dock.jsx** – Bottom dock with quick links:
  - Includes a “planetarium” control wired to Home via custom events.

### Pages

- **Home (src/pages/Home.jsx)** – Landing page:
  - Controls whether the planetarium is in “immersive” mode or overlaid with intro content.
  - Listens for constellation clicks and opens contextual cards or routes.
  - Locks/unlocks scroll when entering/exiting planetarium mode.
- **About (src/pages/About.jsx)** – Bio, skills, and a portrait carousel.
- **Now (src/pages/Now.jsx)** – “Now” page with LightPillar and current focus areas.
- **ThisSite (src/pages/ThisSite.jsx)** – Technical overview of the build plus a data & acknowledgements section.
- **Projects (src/pages/Projects.jsx)** – Uses ScrollStack to render a vertical stack of project cards with smooth stacking/pinning.
- **Research (src/pages/Research.jsx)** – Same ScrollStack layout, tuned for research roles and labs.
- **Music (src/pages/Music.jsx)** – CardSwap carousel containing Apple Music embeds and descriptions for different listening eras.
- **Thoughts, Contact, Photography/Videography, Resume** – Simple content pages using shared `page`/`page__card` styling.
- **NotFound / ComingSoon** – 404 and production “coming soon” pages with a separate Galaxy background and locked scroll.

### Shared UI Components

- **src/components/ScrollStack.jsx** – Internal scroll container that:
  - Positions stacked cards and pins them as you scroll.
  - Uses `requestAnimationFrame` to keep transforms smooth.
- **src/components/CardSwap.jsx** – Card carousel (used on Music):
  - Cycles through overlaid cards with GSAP animations.
  - Supports pause-on-hover and click callbacks.
- **src/components/ImageCarousel.jsx** – Simple image carousel used on About.
- **src/components/RotatingText.jsx** – Animated, rotating text for the Home hero.
- **src/components/ContentSection.jsx** – Generic content overlay section (used in earlier iterations / optional).

### Styling

- **src/pages/Page.css** – Shared layout primitives (`.page`, `.page__card`, typography, lists, etc.).
- Per-page CSS (e.g., `Home.css`, `Projects.css`, `Research.css`) adds page-specific layout and styling.

## Media Assets (logos & photos)

Put images you want to reference directly in the app under:

- `public/media/logos/` for organization logos
- `public/media/photos/` for photography and other images

Because Vite serves `public/` from the site root, reference assets in React like:

- `<img src="/media/logos/prime.jpg" alt="PRIME logo" />`
- `<img src="/media/photos/leaf.JPG" alt="Leaf" />`

For CSS backgrounds, use:

```css
background-image: url("/media/photos/leaf.JPG");
```

## How the Sky Rendering Works

1. **Location & Time** – The app uses your location (and optional overrides) plus the current time or a time offset.
2. **Star Catalog** – A pre-generated subset of the HYG star catalog is loaded from `src/data/hipStars.generated.js`.
3. **Coordinate Transforms** – Right Ascension/Declination → local Alt/Az → screen coordinates via a projection.
4. **Drawing** – The canvas render loop draws stars, constellations, and other layers with proper ordering and blending.
5. **Interaction** – Pointer events are mapped back to sky coordinates for hover and click hit-testing.

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run development server:**

   ```bash
   npm run dev
   ```

3. **Build for production:**

   ```bash
   npm run build
   ```

4. **Preview production build:**

   ```bash
   npm run preview
   ```

## Customization Pointers

- **Planetarium behaviour** – Tweak props and state handling in `GalaxyCanvas.jsx` and `Home.jsx` for different default views or controls.
- **Navigation items** – Edit the nav configuration in `SiteLayout.jsx` to add/remove routes.
- **ScrollStack tuning** – Adjust `itemDistance`, `itemStackDistance`, and `baseScale` in `Projects.jsx` / `Research.jsx` for different stacking feels.

## Data Sources / Attribution

- Constellation line patterns are generated into `src/data/constellationLines.generated.js` from Stellarium skyculture data (Western):
  - Upstream: https://github.com/Stellarium/stellarium-skycultures
  - To regenerate locally: `npm run generate:constellation-lines`
  - Licensing: CC BY-SA (see the western skyculture description in the Stellarium repo).

- Star positions for constellation endpoints are generated into `src/data/hipStars.generated.js` from the HYG Database (astronexus):
  - Upstream: https://github.com/astronexus/HYG-Database
  - To regenerate locally: `npm run generate:hip-subset`
  - Licensing: CC BY-SA 4.0 (see the HYG repo and included license files).

## Deployment

This repository is set up for GitHub Pages (`jacksharks05.github.io`):

1. Build the production bundle:

   ```bash
   npm run build
   ```

2. The built files will be in the `dist` folder.
3. Push `dist` to GitHub Pages or use a GitHub Action to deploy automatically.

## Browser Support

Works in modern browsers that support:

- Canvas API
- ES6+ JavaScript
- CSS Grid and Flexbox

## License

- Code: MIT (this repository).
- Data derived from HYG: `src/data/hipStars.generated.js` is under CC BY-SA 4.0; if you redistribute that data, you must comply with the upstream license.

---

## cc (URL shortener subdomain)

This repo also includes a minimal URL shortener that mirrors the `cc` program API:

- `POST /put` with request body being the long URL (plain text)
- returns JSON `{ ok: boolean, msg: string }` where `msg` is the code or an error message
- `GET /<code>` responds with `308` redirect to the original URL

### Hosting model

This is implemented as Vercel serverless functions backed by Upstash Redis.
It is designed to run cleanly on `s.jackdehaan.com` without breaking the main SPA routing.

Relevant files:

- [api/put.js](api/put.js)
- [api/r.js](api/r.js)
- [public/cc/index.html](public/cc/index.html)
- [vercel.json](vercel.json)

### Custom codes (optional)

To request a specific short code, send JSON to the same endpoint:

- `POST /api/put` with body `{ "url": "https://example.com", "code": "my-link" }`

Behavior:

- If no custom code is provided and the URL was already shortened, the existing (canonical) code is returned.
- If a custom `code` is provided, it will create/return that code even if the URL already has another (canonical) code.
- If the requested `code` is already taken for a different URL, the API returns `409`.

### Deleting entries

There is a deletion endpoint:

- `POST /api/del` (or `POST /del` on `s.jackdehaan.com`)

Delete by code (recommended):

```bash
curl -X POST https://s.jackdehaan.com/api/del \
  -H 'content-type: application/json' \
  -d '{"code":"my-link"}'
```

Delete by URL (removes all codes for that URL):

```bash
curl -X POST https://s.jackdehaan.com/api/del \
  -H 'content-type: application/json' \
  -d '{"url":"https://example.com"}'
```

Optional protection: set `CC_ADMIN_TOKEN` in Vercel env vars and then send either:

- `Authorization: Bearer <token>` or
- `x-cc-admin-token: <token>`

Generate a token (pick one):

```bash
# base64url-ish token (no + / =)
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"

# or base64 (fine for headers, includes +/ and maybe =)
openssl rand -base64 32
```

Delete by code using plain text (no JSON):

```bash
curl -X POST https://s.jackdehaan.com/api/del \
  -H 'content-type: text/plain' \
  --data 'my-link'
```

Delete all entries (DANGEROUS):

- Requires `CC_ADMIN_TOKEN` to be set.
- Requires `confirm: "DELETE_ALL"`.

```bash
curl -X POST https://s.jackdehaan.com/api/del \
  -H 'authorization: Bearer YOURTOKEN' \
  -H 'content-type: application/json' \
  -d '{"all":true,"confirm":"DELETE_ALL"}'
```

### Redis (Upstash) setup

Create a Redis store via Vercel Marketplace (Upstash Redis) and add the env vars:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `UPSTASH_REDIS_REST_READ_ONLY_TOKEN` (optional)

Note: depending on how the integration was added, Vercel may instead create variables like
`UPSTASH_REDIS_REST_KV_REST_API_URL` / `UPSTASH_REDIS_REST_KV_REST_API_TOKEN` (or sometimes `UPSTASH_REDIS_REST_KV_URL` alongside the token).
The API handlers in this repo accept these naming schemes.

### Subdomain wiring

In Vercel, add the custom domain `s.jackdehaan.com` to the same project.
The routing is host-based: requests for `s.jackdehaan.com` will route:

- `/` -> the shortener UI (SPA)
- `/put` -> the API handler at `/api/put`
- `/<code>` -> the redirect handler at `/api/r?code=<code>`

### Local testing

Vite dev (`npm run dev`) does not run Vercel serverless functions.
To test the shortener locally, use `vercel dev` (Vercel CLI) so `/put` and `/<code>` work.
