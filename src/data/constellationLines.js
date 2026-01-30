// Constellation line patterns using HIP (Hipparcos) star catalog IDs.
//
// Primary source:
// - Stellarium skyculture data (Western) from https://github.com/Stellarium/stellarium-skycultures
//
// This file intentionally just re-exports the generated data so you can regenerate
// without touching the renderer.

import { constellationLines as stellariumConstellationLines } from "./constellationLines.generated.js";

// Optional local overrides (keep empty unless you need a one-off correction).
const OVERRIDES = {
  // Example:
  // Dra: [[...], [...]],
};

export const constellationLines = {
  ...stellariumConstellationLines,
  ...OVERRIDES,
};
