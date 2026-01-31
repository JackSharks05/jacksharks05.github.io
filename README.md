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

## Media assets (logos & photos)

Put images you want to reference directly in the app under:

- `public/media/logos/` for organization logos
- `public/media/photos/` for everything else (carousels, page images, etc.)

Anything in `public/` is served from the site root, so you reference files like:

- `/media/logos/duane-lab.png`
- `/media/photos/headshot.jpg`

## How It Works

### Astronomical Calculations

The website uses real astronomical calculations to position stars accurately:

1. **Geolocation**: Automatically detects your location via IP
2. **Celestial Coordinates**: Uses real star catalog data (Right Ascension, Declination)
3. **Coordinate Transformation**: Converts celestial coordinates to horizontal coordinates (altitude, azimuth) based on your location and current time
4. **Screen Projection**: Maps sky coordinates to screen positions using stereographic projection

### Technologies

- **React 18**: Component-based UI
- **Vite**: Fast build tool and dev server
- **Canvas API**: For rendering stars and constellations
- **Astronomical Algorithms**: Custom implementation of coordinate transformations

## Customization

### Adding Content

Edit the content sections in `src/App.jsx` to add your personal information, projects, research, etc.

### Adjusting Star Brightness

Modify the star size calculation in `src/components/GalaxyCanvas.jsx`:

```javascript
const size = Math.max(0.5, 3 - star.mag * 0.4);
```

### Changing Constellation Mappings

Edit `src/data/starCatalog.js` to modify which stars belong to each constellation or add new constellations.

## Data Sources / Attribution

- Constellation line patterns are generated into [src/data/constellationLines.generated.js](src/data/constellationLines.generated.js) from Stellarium skyculture data (Western): https://github.com/Stellarium/stellarium-skycultures
- To regenerate that file locally: `npm run generate:constellation-lines`
- Stellarium western skyculture licensing: Text and data are CC BY-SA (see https://github.com/Stellarium/stellarium-skycultures/blob/master/western/description.md)

- Star positions for constellation endpoints are generated into [src/data/hipStars.generated.js](src/data/hipStars.generated.js) from the HYG Database (astronexus).
- To regenerate that file locally: `npm run generate:hip-subset`

HYG Database licensing: CC BY-SA 4.0 (see https://github.com/astronexus/HYG-Database and their included license files).

## Deployment

Since this is a GitHub Pages repository (`jacksharks05.github.io`), you can deploy by:

1. Build the production version:

   ```bash
   npm run build
   ```

2. The built files will be in the `dist` folder

3. Push the dist folder to GitHub Pages (or use a GitHub Action for automatic deployment)

## Browser Support

Works in all modern browsers that support:

- Canvas API
- ES6+ JavaScript
- CSS Grid and Flexbox

## License

Code: MIT (this repository).

Data: [src/data/hipStars.generated.js](src/data/hipStars.generated.js) is derived from the HYG Database and is under CC BY-SA 4.0; if you redistribute that data, ensure you comply with the upstream license.
