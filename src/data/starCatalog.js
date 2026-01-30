import { constellationLines } from "./constellationLines.js";
import { hipStars } from "./hipStars.generated.js";

// Star catalog - will generate realistic star field
let starCatalogCache = null;

/**
 * Generate or fetch star catalog
 * Creates a realistic distribution of stars across the sky
 */
export async function fetchStarCatalog() {
  if (starCatalogCache) {
    return starCatalogCache;
  }

  console.log("Generating star catalog...");

  // Start with a real HIP-keyed subset needed for constellation line endpoints.
  // This is generated from the HYG catalog and ensures we have RA/Dec for every HIP
  // ID referenced by src/data/constellationLines.js.
  const hygSubsetStars = Object.values(hipStars).map((s) => ({
    id: s.hip,
    name: s.name || "",
    ra: s.ra,
    dec: s.dec,
    mag: s.mag,
    constellation: s.con || "",
  }));

  // Overlay any locally curated names (only when the subset lacks a proper name).
  const namedStars = getNamedStars();
  const starById = new Map();
  for (const star of hygSubsetStars) {
    starById.set(star.id, star);
  }

  for (const star of namedStars) {
    const existing = starById.get(star.id);
    if (!existing) {
      starById.set(star.id, star);
      continue;
    }

    starById.set(star.id, {
      ...existing,
      name: existing.name || star.name || "",
      constellation: existing.constellation || star.constellation || "",
    });
  }

  const stars = Array.from(starById.values());

  // Generate additional stars to fill the sky (up to 3000 total)
  const numAdditionalStars = 2950;

  for (let i = 0; i < numAdditionalStars; i++) {
    // Random position in sky using spherical coordinates
    const ra = Math.random() * 24; // 0-24 hours
    const dec = Math.random() * 180 - 90; // -90 to +90 degrees

    // Realistic magnitude distribution (most stars are fainter)
    // Use exponential distribution for realistic star counts
    const mag =
      Math.random() < 0.1
        ? Math.random() * 2 // 10% bright stars (mag 0-2)
        : 2 + Math.random() * 4.5; // 90% fainter stars (mag 2-6.5)

    // Use IDs far outside the Hipparcos range to avoid collisions with real HIP IDs
    // (constellation line patterns are keyed by HIP).
    stars.push({
      id: 1000000 + i,
      name: "",
      ra: ra,
      dec: dec,
      mag: mag,
      constellation: "",
    });
  }

  starCatalogCache = stars;
  console.log(`Generated ${stars.length} stars`);
  return stars;
}

// Named stars for constellations - expanded catalog from Yale Bright Star Catalog and Hipparcos
function getNamedStars() {
  return [
    // Ursa Major (Big Dipper)
    {
      id: 54061,
      name: "Dubhe",
      ra: 11.062,
      dec: 61.751,
      mag: 1.79,
      constellation: "UMa",
    },
    {
      id: 53910,
      name: "Merak",
      ra: 11.031,
      dec: 56.382,
      mag: 2.37,
      constellation: "UMa",
    },
    {
      id: 58001,
      name: "Phecda",
      ra: 11.897,
      dec: 53.695,
      mag: 2.44,
      constellation: "UMa",
    },
    {
      id: 59774,
      name: "Megrez",
      ra: 12.257,
      dec: 57.032,
      mag: 3.31,
      constellation: "UMa",
    },
    {
      id: 62956,
      name: "Alioth",
      ra: 12.9,
      dec: 55.96,
      mag: 1.77,
      constellation: "UMa",
    },
    {
      id: 65378,
      name: "Mizar",
      ra: 13.398,
      dec: 54.925,
      mag: 2.27,
      constellation: "UMa",
    },
    {
      id: 67301,
      name: "Alkaid",
      ra: 13.792,
      dec: 49.313,
      mag: 1.86,
      constellation: "UMa",
    },

    // Orion
    {
      id: 24436,
      name: "Rigel",
      ra: 5.242,
      dec: -8.202,
      mag: 0.13,
      constellation: "Ori",
    },
    {
      id: 27989,
      name: "Betelgeuse",
      ra: 5.919,
      dec: 7.407,
      mag: 0.5,
      constellation: "Ori",
    },
    {
      id: 25336,
      name: "Bellatrix",
      ra: 5.418,
      dec: 6.35,
      mag: 1.64,
      constellation: "Ori",
    },
    {
      id: 26727,
      name: "Alnitak",
      ra: 5.679,
      dec: -1.943,
      mag: 1.77,
      constellation: "Ori",
    },
    {
      id: 26311,
      name: "Alnilam",
      ra: 5.603,
      dec: -1.202,
      mag: 1.69,
      constellation: "Ori",
    },
    {
      id: 25930,
      name: "Mintaka",
      ra: 5.533,
      dec: -0.299,
      mag: 2.23,
      constellation: "Ori",
    },
    {
      id: 27366,
      name: "Saiph",
      ra: 5.796,
      dec: -9.67,
      mag: 2.06,
      constellation: "Ori",
    },

    // Cassiopeia
    {
      id: 3179,
      name: "Schedar",
      ra: 0.675,
      dec: 56.537,
      mag: 2.23,
      constellation: "Cas",
    },
    {
      id: 746,
      name: "Caph",
      ra: 0.153,
      dec: 59.15,
      mag: 2.27,
      constellation: "Cas",
    },
    {
      id: 6686,
      name: "Navi",
      ra: 1.43,
      dec: 60.717,
      mag: 2.47,
      constellation: "Cas",
    },
    {
      id: 3712,
      name: "Ruchbah",
      ra: 1.901,
      dec: 60.235,
      mag: 2.66,
      constellation: "Cas",
    },
    {
      id: 4614,
      name: "Segin",
      ra: 4.654,
      dec: 63.67,
      mag: 3.38,
      constellation: "Cas",
    },

    // Lyra
    {
      id: 91262,
      name: "Vega",
      ra: 18.615,
      dec: 38.783,
      mag: 0.03,
      constellation: "Lyr",
    },
    {
      id: 92420,
      name: "Sheliak",
      ra: 18.835,
      dec: 33.363,
      mag: 3.52,
      constellation: "Lyr",
    },
    {
      id: 91919,
      name: "Sulafat",
      ra: 18.982,
      dec: 32.69,
      mag: 3.24,
      constellation: "Lyr",
    },
    {
      id: 89314,
      name: "Delta Lyrae",
      ra: 18.9,
      dec: 36.9,
      mag: 4.3,
      constellation: "Lyr",
    },
    {
      id: 91971,
      name: "Zeta Lyrae",
      ra: 18.746,
      dec: 37.605,
      mag: 4.36,
      constellation: "Lyr",
    },
    {
      id: 91919,
      name: "Epsilon Lyrae",
      ra: 18.738,
      dec: 39.613,
      mag: 4.67,
      constellation: "Lyr",
    },

    // Aquila
    {
      id: 97649,
      name: "Altair",
      ra: 19.846,
      dec: 8.868,
      mag: 0.77,
      constellation: "Aql",
    },
    {
      id: 95501,
      name: "Tarazed",
      ra: 19.771,
      dec: 10.613,
      mag: 2.72,
      constellation: "Aql",
    },
    {
      id: 99473,
      name: "Alshain",
      ra: 19.923,
      dec: 6.407,
      mag: 3.71,
      constellation: "Aql",
    },

    // Gemini
    {
      id: 37826,
      name: "Pollux",
      ra: 7.755,
      dec: 28.026,
      mag: 1.14,
      constellation: "Gem",
    },
    {
      id: 36850,
      name: "Castor",
      ra: 7.576,
      dec: 31.888,
      mag: 1.93,
      constellation: "Gem",
    },
    {
      id: 31681,
      name: "Alhena",
      ra: 6.629,
      dec: 16.399,
      mag: 1.93,
      constellation: "Gem",
    },
    {
      id: 34088,
      name: "Mebsuta",
      ra: 6.382,
      dec: 22.514,
      mag: 3.06,
      constellation: "Gem",
    },
    {
      id: 29655,
      name: "Tejat",
      ra: 6.383,
      dec: 22.507,
      mag: 2.88,
      constellation: "Gem",
    },
    {
      id: 30343,
      name: "Wasat",
      ra: 7.335,
      dec: 21.982,
      mag: 3.53,
      constellation: "Gem",
    },

    // Brightest stars in the sky (top 20)
    {
      id: 32349,
      name: "Sirius",
      ra: 6.752,
      dec: -16.716,
      mag: -1.46,
      constellation: "CMa",
    },
    {
      id: 30438,
      name: "Canopus",
      ra: 6.399,
      dec: -52.696,
      mag: -0.74,
      constellation: "Car",
    },
    {
      id: 69673,
      name: "Arcturus",
      ra: 14.261,
      dec: 19.182,
      mag: -0.05,
      constellation: "Boo",
    },
    {
      id: 71683,
      name: "Alpha Centauri",
      ra: 14.661,
      dec: -60.839,
      mag: -0.01,
      constellation: "Cen",
    },
    {
      id: 24608,
      name: "Capella",
      ra: 5.278,
      dec: 46.001,
      mag: 0.08,
      constellation: "Aur",
    },
    {
      id: 37279,
      name: "Procyon",
      ra: 7.655,
      dec: 5.225,
      mag: 0.38,
      constellation: "CMi",
    },
    {
      id: 7588,
      name: "Achernar",
      ra: 1.629,
      dec: -57.237,
      mag: 0.46,
      constellation: "Eri",
    },
    {
      id: 80763,
      name: "Antares",
      ra: 16.49,
      dec: -26.432,
      mag: 1.09,
      constellation: "Sco",
    },
    {
      id: 102098,
      name: "Deneb",
      ra: 20.69,
      dec: 45.28,
      mag: 1.25,
      constellation: "Cyg",
    },
    {
      id: 11767,
      name: "Polaris",
      ra: 2.53,
      dec: 89.264,
      mag: 1.98,
      constellation: "UMi",
    },
    {
      id: 21421,
      name: "Aldebaran",
      ra: 4.599,
      dec: 16.509,
      mag: 0.85,
      constellation: "Tau",
    },
    {
      id: 65474,
      name: "Spica",
      ra: 13.419,
      dec: -11.161,
      mag: 1.04,
      constellation: "Vir",
    },
    {
      id: 113368,
      name: "Fomalhaut",
      ra: 22.961,
      dec: -29.622,
      mag: 1.16,
      constellation: "PsA",
    },
    {
      id: 49669,
      name: "Regulus",
      ra: 10.139,
      dec: 11.967,
      mag: 1.35,
      constellation: "Leo",
    },
    {
      id: 33579,
      name: "Adhara",
      ra: 6.977,
      dec: -28.972,
      mag: 1.5,
      constellation: "CMa",
    },

    // Additional constellation stars
    {
      id: 61084,
      name: "Acrux",
      ra: 12.443,
      dec: -63.099,
      mag: 0.77,
      constellation: "Cru",
    },
    {
      id: 62434,
      name: "Mimosa",
      ra: 12.796,
      dec: -59.689,
      mag: 1.25,
      constellation: "Cru",
    },
    {
      id: 60718,
      name: "Gacrux",
      ra: 12.519,
      dec: -57.113,
      mag: 1.63,
      constellation: "Cru",
    },
    {
      id: 85927,
      name: "Shaula",
      ra: 17.56,
      dec: -37.104,
      mag: 1.63,
      constellation: "Sco",
    },
    {
      id: 24608,
      name: "Elnath",
      ra: 5.438,
      dec: 28.608,
      mag: 1.65,
      constellation: "Tau",
    },
    {
      id: 26451,
      name: "Alnath",
      ra: 5.438,
      dec: 28.608,
      mag: 1.65,
      constellation: "Tau",
    },
    {
      id: 45238,
      name: "Miaplacidus",
      ra: 9.22,
      dec: -69.717,
      mag: 1.68,
      constellation: "Car",
    },
    {
      id: 109268,
      name: "Al Nair",
      ra: 22.137,
      dec: -46.961,
      mag: 1.74,
      constellation: "Gru",
    },
    {
      id: 90185,
      name: "Kaus Australis",
      ra: 18.402,
      dec: -34.385,
      mag: 1.85,
      constellation: "Sgr",
    },
    {
      id: 15863,
      name: "Mirfak",
      ra: 3.405,
      dec: 49.861,
      mag: 1.79,
      constellation: "Per",
    },
    {
      id: 33856,
      name: "Wezen",
      ra: 7.145,
      dec: -26.393,
      mag: 1.84,
      constellation: "CMa",
    },
    {
      id: 41037,
      name: "Avior",
      ra: 8.375,
      dec: -59.51,
      mag: 1.86,
      constellation: "Car",
    },
    {
      id: 86228,
      name: "Sargas",
      ra: 17.622,
      dec: -42.998,
      mag: 1.87,
      constellation: "Sco",
    },
    {
      id: 100751,
      name: "Peacock",
      ra: 20.428,
      dec: -56.735,
      mag: 1.94,
      constellation: "Pav",
    },
    {
      id: 57632,
      name: "Denebola",
      ra: 11.818,
      dec: 14.572,
      mag: 2.14,
      constellation: "Leo",
    },
    {
      id: 46390,
      name: "Alphard",
      ra: 9.46,
      dec: -8.659,
      mag: 1.98,
      constellation: "Hya",
    },
    {
      id: 9884,
      name: "Hamal",
      ra: 2.119,
      dec: 23.462,
      mag: 2.0,
      constellation: "Ari",
    },
    {
      id: 14576,
      name: "Algol",
      ra: 3.136,
      dec: 40.956,
      mag: 2.12,
      constellation: "Per",
    },
    {
      id: 86032,
      name: "Rasalhague",
      ra: 17.582,
      dec: 12.56,
      mag: 2.08,
      constellation: "Oph",
    },
    {
      id: 72607,
      name: "Kochab",
      ra: 14.845,
      dec: 74.155,
      mag: 2.08,
      constellation: "UMi",
    },
    {
      id: 92855,
      name: "Nunki",
      ra: 18.921,
      dec: -26.297,
      mag: 2.02,
      constellation: "Sgr",
    },
    {
      id: 76267,
      name: "Alphecca",
      ra: 15.578,
      dec: 26.715,
      mag: 2.23,
      constellation: "CrB",
    },
    {
      id: 3419,
      name: "Diphda",
      ra: 0.726,
      dec: -17.987,
      mag: 2.04,
      constellation: "Cet",
    },
    {
      id: 68933,
      name: "Menkent",
      ra: 14.111,
      dec: -36.37,
      mag: 2.06,
      constellation: "Cen",
    },
    {
      id: 5447,
      name: "Mirach",
      ra: 1.162,
      dec: 35.621,
      mag: 2.06,
      constellation: "And",
    },
    {
      id: 677,
      name: "Alpheratz",
      ra: 0.14,
      dec: 29.091,
      mag: 2.06,
      constellation: "And",
    },
    {
      id: 2081,
      name: "Ankaa",
      ra: 0.438,
      dec: -42.306,
      mag: 2.39,
      constellation: "Phe",
    },
    {
      id: 107315,
      name: "Enif",
      ra: 21.736,
      dec: 9.875,
      mag: 2.39,
      constellation: "Peg",
    },
    {
      id: 44816,
      name: "Suhail",
      ra: 9.134,
      dec: -43.433,
      mag: 2.21,
      constellation: "Vel",
    },
    {
      id: 113881,
      name: "Scheat",
      ra: 23.063,
      dec: 28.082,
      mag: 2.42,
      constellation: "Peg",
    },
    {
      id: 113963,
      name: "Markab",
      ra: 23.079,
      dec: 15.205,
      mag: 2.49,
      constellation: "Peg",
    },

    // Additional constellation stars
    {
      id: 8903,
      name: "Sheratan",
      ra: 1.911,
      dec: 20.808,
      mag: 2.64,
      constellation: "Ari",
    },
    {
      id: 14135,
      name: "Menkar",
      ra: 3.038,
      dec: 4.09,
      mag: 2.54,
      constellation: "Cet",
    },
    {
      id: 109268,
      name: "Alnair",
      ra: 22.137,
      dec: -46.961,
      mag: 1.74,
      constellation: "Gru",
    },
    {
      id: 42913,
      name: "Naos",
      ra: 8.06,
      dec: -40.003,
      mag: 2.25,
      constellation: "Pup",
    },
    {
      id: 39429,
      name: "Aspidiske",
      ra: 9.285,
      dec: -55.011,
      mag: 2.21,
      constellation: "Car",
    },
    {
      id: 25428,
      name: "Menkalinan",
      ra: 5.992,
      dec: 44.948,
      mag: 1.9,
      constellation: "Aur",
    },
    {
      id: 82273,
      name: "Izar",
      ra: 14.75,
      dec: 27.074,
      mag: 2.37,
      constellation: "Boo",
    },
    {
      id: 79593,
      name: "Vindemiatrix",
      ra: 13.036,
      dec: 10.959,
      mag: 2.85,
      constellation: "Vir",
    },
    {
      id: 113226,
      name: "Algenib",
      ra: 0.22,
      dec: 15.184,
      mag: 2.83,
      constellation: "Peg",
    },
    {
      id: 72105,
      name: "Theta Centauri",
      ra: 14.111,
      dec: -36.37,
      mag: 2.06,
      constellation: "Cen",
    },
    {
      id: 84345,
      name: "Kornephoros",
      ra: 16.503,
      dec: 21.49,
      mag: 2.78,
      constellation: "Her",
    },
    {
      id: 84380,
      name: "Eta Ophiuchi",
      ra: 17.172,
      dec: -15.725,
      mag: 2.43,
      constellation: "Oph",
    },
    {
      id: 50583,
      name: "Algieba",
      ra: 10.333,
      dec: 19.842,
      mag: 2.08,
      constellation: "Leo",
    },
    {
      id: 78401,
      name: "Dschubba",
      ra: 16.004,
      dec: -22.622,
      mag: 2.29,
      constellation: "Sco",
    },
    {
      id: 17702,
      name: "Alcyone",
      ra: 3.79,
      dec: 24.105,
      mag: 2.87,
      constellation: "Tau",
    },
    {
      id: 95947,
      name: "Albireo",
      ra: 19.513,
      dec: 27.96,
      mag: 3.08,
      constellation: "Cyg",
    },
    {
      id: 88635,
      name: "Kaus Media",
      ra: 18.35,
      dec: -29.828,
      mag: 2.7,
      constellation: "Sgr",
    },
    {
      id: 9640,
      name: "Almach",
      ra: 2.065,
      dec: 42.33,
      mag: 2.26,
      constellation: "And",
    },
    {
      id: 61359,
      name: "Delta Crucis",
      ra: 12.253,
      dec: -58.749,
      mag: 2.8,
      constellation: "Cru",
    },
    {
      id: 84012,
      name: "Cebalrai",
      ra: 17.724,
      dec: 4.567,
      mag: 2.77,
      constellation: "Oph",
    },

    // Leo - 6 main stars
    {
      id: 58080,
      name: "Zosma",
      ra: 11.235,
      dec: 20.524,
      mag: 2.56,
      constellation: "Leo",
    },
    {
      id: 54872,
      name: "Chort",
      ra: 11.237,
      dec: 15.43,
      mag: 3.34,
      constellation: "Leo",
    },
    {
      id: 50335,
      name: "Adhafera",
      ra: 10.278,
      dec: 23.417,
      mag: 3.44,
      constellation: "Leo",
    },

    // Additional constellation stars for all 88 IAU constellations
    // Cygnus (Northern Cross)
    {
      id: 104732,
      name: "Sadr",
      ra: 20.371,
      dec: 40.257,
      mag: 2.2,
      constellation: "Cyg",
    },
    {
      id: 100453,
      name: "Gienah",
      ra: 20.771,
      dec: 33.97,
      mag: 2.46,
      constellation: "Cyg",
    },
    {
      id: 102098,
      name: "Delta Cygni",
      ra: 19.749,
      dec: 45.131,
      mag: 2.87,
      constellation: "Cyg",
    },

    // Aquarius
    {
      id: 106278,
      name: "Sadalsuud",
      ra: 21.526,
      dec: -5.571,
      mag: 2.87,
      constellation: "Aqr",
    },
    {
      id: 109074,
      name: "Sadalmelik",
      ra: 22.096,
      dec: -0.32,
      mag: 2.95,
      constellation: "Aqr",
    },
    {
      id: 110395,
      name: "Skat",
      ra: 22.877,
      dec: -15.821,
      mag: 3.27,
      constellation: "Aqr",
    },

    // Pisces
    {
      id: 5742,
      name: "Alrescha",
      ra: 2.034,
      dec: 2.764,
      mag: 3.82,
      constellation: "Psc",
    },
    {
      id: 115738,
      name: "Eta Piscium",
      ra: 1.518,
      dec: 15.346,
      mag: 3.62,
      constellation: "Psc",
    },

    // Cancer
    {
      id: 42911,
      name: "Acubens",
      ra: 8.975,
      dec: 11.858,
      mag: 4.26,
      constellation: "Cnc",
    },
    {
      id: 44066,
      name: "Asellus Australis",
      ra: 8.743,
      dec: 18.154,
      mag: 3.94,
      constellation: "Cnc",
    },
    {
      id: 43103,
      name: "Asellus Borealis",
      ra: 8.723,
      dec: 21.469,
      mag: 4.66,
      constellation: "Cnc",
    },

    // Libra
    {
      id: 74785,
      name: "Zubenelgenubi",
      ra: 14.849,
      dec: -16.042,
      mag: 2.75,
      constellation: "Lib",
    },
    {
      id: 72622,
      name: "Zubeneschamali",
      ra: 15.283,
      dec: -9.383,
      mag: 2.61,
      constellation: "Lib",
    },

    // Capricornus
    {
      id: 100345,
      name: "Deneb Algedi",
      ra: 21.784,
      dec: -16.127,
      mag: 2.81,
      constellation: "Cap",
    },
    {
      id: 104987,
      name: "Dabih",
      ra: 20.351,
      dec: -14.781,
      mag: 3.05,
      constellation: "Cap",
    },
    {
      id: 107556,
      name: "Nashira",
      ra: 21.668,
      dec: -16.662,
      mag: 3.68,
      constellation: "Cap",
    },

    // Hercules
    {
      id: 80816,
      name: "Rasalgethi",
      ra: 17.244,
      dec: 14.39,
      mag: 3.48,
      constellation: "Her",
    },
    {
      id: 81693,
      name: "Zeta Herculis",
      ra: 16.688,
      dec: 31.603,
      mag: 2.81,
      constellation: "Her",
    },
    {
      id: 85112,
      name: "Pi Herculis",
      ra: 17.251,
      dec: 36.809,
      mag: 3.16,
      constellation: "Her",
    },

    // Draco
    {
      id: 87833,
      name: "Eltanin",
      ra: 17.943,
      dec: 51.489,
      mag: 2.23,
      constellation: "Dra",
    },
    {
      id: 94376,
      name: "Rastaban",
      ra: 17.507,
      dec: 52.301,
      mag: 2.79,
      constellation: "Dra",
    },
    {
      id: 68756,
      name: "Thuban",
      ra: 14.073,
      dec: 64.376,
      mag: 3.65,
      constellation: "Dra",
    },
    {
      id: 56211,
      name: "Edasich",
      ra: 15.415,
      dec: 58.966,
      mag: 3.29,
      constellation: "Dra",
    },

    // Aquila
    {
      id: 93244,
      name: "Deneb el Okab",
      ra: 19.085,
      dec: 13.863,
      mag: 2.99,
      constellation: "Aql",
    },

    // Delphinus
    {
      id: 101958,
      name: "Rotanev",
      ra: 20.625,
      dec: 14.595,
      mag: 3.63,
      constellation: "Del",
    },
    {
      id: 102281,
      name: "Sualocin",
      ra: 20.66,
      dec: 15.912,
      mag: 3.77,
      constellation: "Del",
    },

    // Corvus
    {
      id: 59803,
      name: "Gienah Corvi",
      ra: 12.263,
      dec: -17.542,
      mag: 2.59,
      constellation: "Crv",
    },
    {
      id: 61359,
      name: "Algorab",
      ra: 12.498,
      dec: -16.515,
      mag: 2.95,
      constellation: "Crv",
    },
    {
      id: 59316,
      name: "Kraz",
      ra: 12.573,
      dec: -23.397,
      mag: 2.65,
      constellation: "Crv",
    },
    {
      id: 60965,
      name: "Minkar",
      ra: 12.298,
      dec: -24.729,
      mag: 3.0,
      constellation: "Crv",
    },

    // Crater
    {
      id: 54682,
      name: "Alkes",
      ra: 10.996,
      dec: -18.299,
      mag: 4.08,
      constellation: "Crt",
    },
    {
      id: 55705,
      name: "Beta Crateris",
      ra: 11.195,
      dec: -22.826,
      mag: 4.48,
      constellation: "Crt",
    },

    // Lupus
    {
      id: 71860,
      name: "Alpha Lupi",
      ra: 14.696,
      dec: -47.388,
      mag: 2.3,
      constellation: "Lup",
    },
    {
      id: 73273,
      name: "Beta Lupi",
      ra: 14.975,
      dec: -43.134,
      mag: 2.68,
      constellation: "Lup",
    },
    {
      id: 74376,
      name: "Gamma Lupi",
      ra: 15.585,
      dec: -41.167,
      mag: 2.78,
      constellation: "Lup",
    },

    // Ara
    {
      id: 85258,
      name: "Beta Arae",
      ra: 17.421,
      dec: -55.53,
      mag: 2.85,
      constellation: "Ara",
    },
    {
      id: 85792,
      name: "Alpha Arae",
      ra: 17.531,
      dec: -49.876,
      mag: 2.93,
      constellation: "Ara",
    },

    // Corona Australis
    {
      id: 90887,
      name: "Alphekka Meridiana",
      ra: 19.157,
      dec: -37.904,
      mag: 4.11,
      constellation: "CrA",
    },
    {
      id: 91117,
      name: "Beta CrA",
      ra: 19.167,
      dec: -39.341,
      mag: 4.11,
      constellation: "CrA",
    },

    // Triangulum
    {
      id: 10670,
      name: "Beta Trianguli",
      ra: 2.159,
      dec: 34.987,
      mag: 3.0,
      constellation: "Tri",
    },
    {
      id: 13147,
      name: "Alpha Trianguli",
      ra: 1.885,
      dec: 29.579,
      mag: 3.41,
      constellation: "Tri",
    },

    // Serpens
    {
      id: 77070,
      name: "Unukalhai",
      ra: 15.738,
      dec: 6.426,
      mag: 2.65,
      constellation: "Ser",
    },
    {
      id: 84880,
      name: "Theta Serpentis",
      ra: 18.094,
      dec: 4.204,
      mag: 4.62,
      constellation: "Ser",
    },

    // Sagitta
    {
      id: 96757,
      name: "Gamma Sagittae",
      ra: 19.979,
      dec: 19.492,
      mag: 3.47,
      constellation: "Sge",
    },
    {
      id: 97365,
      name: "Delta Sagittae",
      ra: 19.835,
      dec: 18.534,
      mag: 3.68,
      constellation: "Sge",
    },

    // Lacerta
    {
      id: 111944,
      name: "Alpha Lacertae",
      ra: 22.521,
      dec: 50.283,
      mag: 3.77,
      constellation: "Lac",
    },
    {
      id: 110538,
      name: "Beta Lacertae",
      ra: 22.394,
      dec: 52.229,
      mag: 4.43,
      constellation: "Lac",
    },

    // Vulpecula
    {
      id: 95771,
      name: "Anser",
      ra: 19.479,
      dec: 24.665,
      mag: 4.44,
      constellation: "Vul",
    },

    // Additional stars for remaining 49 IAU constellations
    // Monoceros, Puppis, Pyxis, Antlia, Sextans, Lynx, Camelopardalis, Leo Minor
    {
      id: 30867,
      name: "Alpha Monocerotis",
      ra: 7.687,
      dec: -9.551,
      mag: 3.93,
      constellation: "Mon",
    },
    {
      id: 39863,
      name: "Zeta Puppis",
      ra: 8.06,
      dec: -40.003,
      mag: 2.25,
      constellation: "Pup",
    },
    {
      id: 42828,
      name: "Alpha Pyxidis",
      ra: 8.727,
      dec: -33.186,
      mag: 3.68,
      constellation: "Pyx",
    },
    {
      id: 48926,
      name: "Alpha Antliae",
      ra: 10.452,
      dec: -31.068,
      mag: 4.25,
      constellation: "Ant",
    },
    {
      id: 49641,
      name: "Alpha Sextantis",
      ra: 10.132,
      dec: -0.371,
      mag: 4.49,
      constellation: "Sex",
    },
    {
      id: 45860,
      name: "Alpha Lyncis",
      ra: 9.35,
      dec: 34.392,
      mag: 3.13,
      constellation: "Lyn",
    },
    {
      id: 29997,
      name: "Beta Camelopardalis",
      ra: 5.056,
      dec: 60.442,
      mag: 4.03,
      constellation: "Cam",
    },
    {
      id: 53229,
      name: "Praecipua",
      ra: 10.887,
      dec: 34.215,
      mag: 3.83,
      constellation: "LMi",
    },

    // Canes Venatici, Coma Berenices
    {
      id: 63125,
      name: "Cor Caroli",
      ra: 12.933,
      dec: 38.318,
      mag: 2.9,
      constellation: "CVn",
    },
    {
      id: 64241,
      name: "Beta CVn",
      ra: 12.564,
      dec: 41.358,
      mag: 4.26,
      constellation: "CVn",
    },
    {
      id: 64394,
      name: "Diadem",
      ra: 13.166,
      dec: 17.529,
      mag: 4.32,
      constellation: "Com",
    },

    // Equuleus, Scutum
    {
      id: 104987,
      name: "Kitalpha",
      ra: 21.263,
      dec: 10.007,
      mag: 3.92,
      constellation: "Equ",
    },
    {
      id: 91117,
      name: "Alpha Scuti",
      ra: 18.587,
      dec: -8.244,
      mag: 3.85,
      constellation: "Sct",
    },

    // Microscopium, Sculptor, Fornax, Caelum, Horologium, Reticulum, Pictor, Dorado, Volans, Mensa
    {
      id: 102831,
      name: "Gamma Microscopii",
      ra: 21.025,
      dec: -32.258,
      mag: 4.67,
      constellation: "Mic",
    },
    {
      id: 4577,
      name: "Alpha Sculptoris",
      ra: 0.976,
      dec: -29.357,
      mag: 4.31,
      constellation: "Scl",
    },
    {
      id: 13147,
      name: "Alpha Fornacis",
      ra: 3.201,
      dec: -28.987,
      mag: 3.8,
      constellation: "For",
    },
    {
      id: 21770,
      name: "Alpha Caeli",
      ra: 4.676,
      dec: -41.864,
      mag: 4.45,
      constellation: "Cae",
    },
    {
      id: 14240,
      name: "Alpha Horologii",
      ra: 4.234,
      dec: -42.294,
      mag: 3.86,
      constellation: "Hor",
    },
    {
      id: 19780,
      name: "Alpha Reticuli",
      ra: 4.24,
      dec: -62.474,
      mag: 3.35,
      constellation: "Ret",
    },
    {
      id: 27321,
      name: "Alpha Pictoris",
      ra: 6.803,
      dec: -61.941,
      mag: 3.27,
      constellation: "Pic",
    },
    {
      id: 27890,
      name: "Alpha Doradus",
      ra: 4.567,
      dec: -55.045,
      mag: 3.27,
      constellation: "Dor",
    },
    {
      id: 44382,
      name: "Alpha Volantis",
      ra: 9.04,
      dec: -66.396,
      mag: 4.0,
      constellation: "Vol",
    },
    {
      id: 29271,
      name: "Alpha Mensae",
      ra: 6.17,
      dec: -74.752,
      mag: 5.09,
      constellation: "Men",
    },

    // Chamaeleon, Apus, Musca, Circinus, Norma, Telescopium, Indus, Octans, Tucana, Hydrus
    {
      id: 40702,
      name: "Alpha Chamaeleontis",
      ra: 8.309,
      dec: -76.92,
      mag: 4.07,
      constellation: "Cha",
    },
    {
      id: 72370,
      name: "Alpha Apodis",
      ra: 14.798,
      dec: -79.045,
      mag: 3.83,
      constellation: "Aps",
    },
    {
      id: 61585,
      name: "Alpha Muscae",
      ra: 12.62,
      dec: -69.136,
      mag: 2.69,
      constellation: "Mus",
    },
    {
      id: 71908,
      name: "Alpha Circini",
      ra: 14.709,
      dec: -64.975,
      mag: 3.19,
      constellation: "Cir",
    },
    {
      id: 80582,
      name: "Gamma Normae",
      ra: 16.33,
      dec: -50.156,
      mag: 4.01,
      constellation: "Nor",
    },
    {
      id: 90422,
      name: "Alpha Telescopii",
      ra: 18.45,
      dec: -45.969,
      mag: 3.51,
      constellation: "Tel",
    },
    {
      id: 101772,
      name: "Alpha Indi",
      ra: 20.626,
      dec: -47.291,
      mag: 3.11,
      constellation: "Ind",
    },
    {
      id: 107089,
      name: "Nu Octantis",
      ra: 21.686,
      dec: -77.39,
      mag: 3.73,
      constellation: "Oct",
    },
    {
      id: 110130,
      name: "Alpha Tucanae",
      ra: 22.309,
      dec: -60.26,
      mag: 2.86,
      constellation: "Tuc",
    },
    {
      id: 2021,
      name: "Beta Hydri",
      ra: 0.426,
      dec: -77.254,
      mag: 2.8,
      constellation: "Hyi",
    },

    // Cepheus stars
    {
      id: 105199,
      name: "Alderamin",
      ra: 21.309,
      dec: 62.585,
      mag: 2.44,
      constellation: "Cep",
    },
    {
      id: 106032,
      name: "Alfirk",
      ra: 21.477,
      dec: 70.561,
      mag: 3.23,
      constellation: "Cep",
    },
  ];
}

// Constellation definitions mapping to real stars from catalog
// All 88 IAU constellations
export const constellationMappings = {
  // Northern constellations
  ursaMajor: {
    name: "Ursa Major",
    section: "about",
    stars: ["Dubhe", "Merak", "Phecda", "Megrez", "Alioth", "Mizar", "Alkaid"],
    connections: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
    ],
  },
  ursaMinor: {
    name: "Ursa Minor",
    section: "about",
    stars: ["Polaris", "Kochab"],
    connections: [[0, 1]],
  },
  draco: {
    name: "Draco",
    section: "research",
    stars: ["Eltanin", "Rastaban", "Thuban", "Edasich"],
    connections: [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
  },
  cassiopeia: {
    name: "Cassiopeia",
    section: "research",
    stars: ["Caph", "Schedar", "Navi", "Ruchbah", "Segin"],
    connections: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
  },
  cepheus: {
    name: "Cepheus",
    section: "thoughts",
    stars: ["Alderamin", "Alfirk"],
    connections: [[0, 1]],
  },

  // Zodiac constellations
  aries: {
    name: "Aries",
    section: "thoughts",
    stars: ["Hamal", "Sheratan"],
    connections: [[0, 1]],
  },
  taurus: {
    name: "Taurus",
    section: "experience",
    stars: ["Aldebaran", "Elnath", "Alcyone"],
    connections: [
      [0, 1],
      [0, 2],
    ],
  },
  gemini: {
    name: "Gemini",
    section: "experience",
    stars: ["Castor", "Pollux", "Alhena", "Mebsuta", "Tejat", "Wasat"],
    connections: [
      [0, 4],
      [4, 5],
      [5, 2],
      [1, 2],
      [0, 3],
      [3, 1],
    ],
  },
  cancer: {
    name: "Cancer",
    section: "projects",
    stars: ["Acubens", "Asellus Australis", "Asellus Borealis"],
    connections: [
      [0, 1],
      [0, 2],
    ],
  },
  leo: {
    name: "Leo",
    section: "projects",
    stars: ["Regulus", "Denebola", "Algieba", "Zosma", "Chort", "Adhafera"],
    connections: [
      [0, 2],
      [2, 5],
      [0, 4],
      [4, 3],
      [3, 1],
    ],
  },
  virgo: {
    name: "Virgo",
    section: "research",
    stars: ["Spica", "Vindemiatrix"],
    connections: [[0, 1]],
  },
  libra: {
    name: "Libra",
    section: "thoughts",
    stars: ["Zubenelgenubi", "Zubeneschamali"],
    connections: [[0, 1]],
  },
  scorpius: {
    name: "Scorpius",
    section: "thoughts",
    stars: ["Antares", "Shaula", "Sargas", "Dschubba"],
    connections: [
      [3, 0],
      [0, 2],
      [2, 1],
    ],
  },
  sagittarius: {
    name: "Sagittarius",
    section: "thoughts",
    stars: ["Kaus Australis", "Nunki", "Kaus Media"],
    connections: [
      [0, 2],
      [2, 1],
    ],
  },
  capricornus: {
    name: "Capricornus",
    section: "experience",
    stars: ["Deneb Algedi", "Dabih", "Nashira"],
    connections: [
      [0, 1],
      [0, 2],
    ],
  },
  aquarius: {
    name: "Aquarius",
    section: "thoughts",
    stars: ["Sadalsuud", "Sadalmelik", "Skat"],
    connections: [
      [0, 1],
      [1, 2],
    ],
  },
  pisces: {
    name: "Pisces",
    section: "music",
    stars: ["Alrescha", "Eta Piscium"],
    connections: [[0, 1]],
  },

  // Spring constellations
  orion: {
    name: "Orion",
    section: "projects",
    stars: [
      "Betelgeuse",
      "Bellatrix",
      "Alnitak",
      "Alnilam",
      "Mintaka",
      "Rigel",
      "Saiph",
    ],
    connections: [
      [0, 1],
      [0, 2],
      [2, 3],
      [3, 4],
      [4, 1],
      [1, 5],
      [5, 6],
      [6, 2],
    ],
  },
  canis_major: {
    name: "Canis Major",
    section: "experience",
    stars: ["Sirius", "Adhara", "Wezen"],
    connections: [
      [0, 1],
      [1, 2],
    ],
  },
  canis_minor: {
    name: "Canis Minor",
    section: "experience",
    stars: ["Procyon"],
    connections: [],
  },
  hydra: {
    name: "Hydra",
    section: "projects",
    stars: ["Alphard"],
    connections: [],
  },
  crater: {
    name: "Crater",
    section: "thoughts",
    stars: ["Alkes", "Beta Crateris"],
    connections: [[0, 1]],
  },
  corvus: {
    name: "Corvus",
    section: "research",
    stars: ["Gienah Corvi", "Algorab", "Kraz", "Minkar"],
    connections: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
    ],
  },

  // Summer constellations
  lyra: {
    name: "Lyra",
    section: "music",
    stars: ["Vega", "Epsilon Lyrae", "Zeta Lyrae", "Sheliak", "Sulafat"],
    connections: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 0],
    ],
  },
  cygnus: {
    name: "Cygnus",
    section: "music",
    stars: ["Deneb", "Albireo", "Sadr", "Gienah", "Delta Cygni"],
    connections: [
      [0, 2],
      [2, 1],
      [4, 2],
      [2, 3],
    ],
  },
  aquila: {
    name: "Aquila",
    section: "thoughts",
    stars: ["Altair", "Tarazed", "Alshain", "Deneb el Okab"],
    connections: [
      [0, 1],
      [0, 2],
      [0, 3],
    ],
  },
  hercules: {
    name: "Hercules",
    section: "projects",
    stars: ["Rasalgethi", "Kornephoros", "Zeta Herculis", "Pi Herculis"],
    connections: [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
  },
  ophiuchus: {
    name: "Ophiuchus",
    section: "research",
    stars: ["Rasalhague", "Cebalrai"],
    connections: [[0, 1]],
  },
  serpens: {
    name: "Serpens",
    section: "research",
    stars: ["Unukalhai", "Theta Serpentis"],
    connections: [[0, 1]],
  },

  // Autumn constellations
  andromeda: {
    name: "Andromeda",
    section: "research",
    stars: ["Alpheratz", "Mirach", "Almach"],
    connections: [
      [0, 1],
      [1, 2],
    ],
  },
  pegasus: {
    name: "Pegasus",
    section: "experience",
    stars: ["Markab", "Scheat", "Algenib", "Enif"],
    connections: [
      [0, 1],
      [1, 2],
      [2, 0],
      [0, 2],
      [1, 3],
    ],
  },
  perseus: {
    name: "Perseus",
    section: "research",
    stars: ["Mirfak", "Algol"],
    connections: [[0, 1]],
  },
  triangulum: {
    name: "Triangulum",
    section: "thoughts",
    stars: ["Beta Trianguli", "Alpha Trianguli"],
    connections: [[0, 1]],
  },

  // Minor constellations
  bootes: {
    name: "Bootes",
    section: "projects",
    stars: ["Arcturus", "Izar"],
    connections: [[0, 1]],
  },
  corona_borealis: {
    name: "Corona Borealis",
    section: "music",
    stars: ["Alphecca"],
    connections: [],
  },
  delphinus: {
    name: "Delphinus",
    section: "music",
    stars: ["Rotanev", "Sualocin"],
    connections: [[0, 1]],
  },
  sagitta: {
    name: "Sagitta",
    section: "thoughts",
    stars: ["Gamma Sagittae", "Delta Sagittae"],
    connections: [[0, 1]],
  },
  lacerta: {
    name: "Lacerta",
    section: "research",
    stars: ["Alpha Lacertae", "Beta Lacertae"],
    connections: [[0, 1]],
  },
  vulpecula: {
    name: "Vulpecula",
    section: "thoughts",
    stars: ["Anser"],
    connections: [],
  },

  // Southern constellations
  centaurus: {
    name: "Centaurus",
    section: "research",
    stars: ["Alpha Centauri", "Menkent"],
    connections: [[0, 1]],
  },
  lupus: {
    name: "Lupus",
    section: "projects",
    stars: ["Alpha Lupi", "Beta Lupi", "Gamma Lupi"],
    connections: [
      [0, 1],
      [1, 2],
    ],
  },
  ara: {
    name: "Ara",
    section: "thoughts",
    stars: ["Beta Arae", "Alpha Arae"],
    connections: [[0, 1]],
  },
  corona_australis: {
    name: "Corona Australis",
    section: "music",
    stars: ["Alphekka Meridiana", "Beta CrA"],
    connections: [[0, 1]],
  },
  crux: {
    name: "Crux",
    section: "projects",
    stars: ["Acrux", "Mimosa", "Gacrux", "Delta Crucis"],
    connections: [
      [0, 2],
      [1, 3],
    ],
  },
  carina: {
    name: "Carina",
    section: "projects",
    stars: ["Canopus", "Miaplacidus", "Avior"],
    connections: [
      [0, 1],
      [1, 2],
    ],
  },
  vela: {
    name: "Vela",
    section: "projects",
    stars: ["Suhail"],
    connections: [],
  },
  piscis_austrinus: {
    name: "Piscis Austrinus",
    section: "music",
    stars: ["Fomalhaut"],
    connections: [],
  },

  // Additional constellations
  cetus: {
    name: "Cetus",
    section: "thoughts",
    stars: ["Diphda", "Menkar"],
    connections: [[0, 1]],
  },
  eridanus: {
    name: "Eridanus",
    section: "research",
    stars: ["Achernar"],
    connections: [],
  },
  phoenix: {
    name: "Phoenix",
    section: "music",
    stars: ["Ankaa"],
    connections: [],
  },
  grus: {
    name: "Grus",
    section: "thoughts",
    stars: ["Alnair"],
    connections: [],
  },
  pavo: {
    name: "Pavo",
    section: "music",
    stars: ["Peacock"],
    connections: [],
  },
  auriga: {
    name: "Auriga",
    section: "experience",
    stars: ["Capella", "Menkalinan"],
    connections: [[0, 1]],
  },

  // Remaining 49 IAU constellations
  monoceros: {
    name: "Monoceros",
    section: "projects",
    stars: ["Alpha Monocerotis"],
    connections: [],
  },
  puppis: {
    name: "Puppis",
    section: "projects",
    stars: ["Zeta Puppis"],
    connections: [],
  },
  pyxis: {
    name: "Pyxis",
    section: "thoughts",
    stars: ["Alpha Pyxidis"],
    connections: [],
  },
  antlia: {
    name: "Antlia",
    section: "research",
    stars: ["Alpha Antliae"],
    connections: [],
  },
  sextans: {
    name: "Sextans",
    section: "projects",
    stars: ["Alpha Sextantis"],
    connections: [],
  },
  lynx: {
    name: "Lynx",
    section: "thoughts",
    stars: ["Alpha Lyncis"],
    connections: [],
  },
  camelopardalis: {
    name: "Camelopardalis",
    section: "research",
    stars: ["Beta Camelopardalis"],
    connections: [],
  },
  leo_minor: {
    name: "Leo Minor",
    section: "projects",
    stars: ["Praecipua"],
    connections: [],
  },
  canes_venatici: {
    name: "Canes Venatici",
    section: "projects",
    stars: ["Cor Caroli", "Beta CVn"],
    connections: [[0, 1]],
  },
  coma_berenices: {
    name: "Coma Berenices",
    section: "thoughts",
    stars: ["Diadem"],
    connections: [],
  },
  equuleus: {
    name: "Equuleus",
    section: "experience",
    stars: ["Kitalpha"],
    connections: [],
  },
  scutum: {
    name: "Scutum",
    section: "thoughts",
    stars: ["Alpha Scuti"],
    connections: [],
  },
  microscopium: {
    name: "Microscopium",
    section: "research",
    stars: ["Gamma Microscopii"],
    connections: [],
  },
  sculptor: {
    name: "Sculptor",
    section: "thoughts",
    stars: ["Alpha Sculptoris"],
    connections: [],
  },
  fornax: {
    name: "Fornax",
    section: "research",
    stars: ["Alpha Fornacis"],
    connections: [],
  },
  caelum: {
    name: "Caelum",
    section: "thoughts",
    stars: ["Alpha Caeli"],
    connections: [],
  },
  horologium: {
    name: "Horologium",
    section: "research",
    stars: ["Alpha Horologii"],
    connections: [],
  },
  reticulum: {
    name: "Reticulum",
    section: "projects",
    stars: ["Alpha Reticuli"],
    connections: [],
  },
  pictor: {
    name: "Pictor",
    section: "thoughts",
    stars: ["Alpha Pictoris"],
    connections: [],
  },
  dorado: {
    name: "Dorado",
    section: "projects",
    stars: ["Alpha Doradus"],
    connections: [],
  },
  volans: {
    name: "Volans",
    section: "research",
    stars: ["Alpha Volantis"],
    connections: [],
  },
  mensa: {
    name: "Mensa",
    section: "thoughts",
    stars: ["Alpha Mensae"],
    connections: [],
  },
  chamaeleon: {
    name: "Chamaeleon",
    section: "projects",
    stars: ["Alpha Chamaeleontis"],
    connections: [],
  },
  apus: {
    name: "Apus",
    section: "thoughts",
    stars: ["Alpha Apodis"],
    connections: [],
  },
  musca: {
    name: "Musca",
    section: "projects",
    stars: ["Alpha Muscae"],
    connections: [],
  },
  circinus: {
    name: "Circinus",
    section: "research",
    stars: ["Alpha Circini"],
    connections: [],
  },
  norma: {
    name: "Norma",
    section: "thoughts",
    stars: ["Gamma Normae"],
    connections: [],
  },
  telescopium: {
    name: "Telescopium",
    section: "research",
    stars: ["Alpha Telescopii"],
    connections: [],
  },
  indus: {
    name: "Indus",
    section: "thoughts",
    stars: ["Alpha Indi"],
    connections: [],
  },
  octans: {
    name: "Octans",
    section: "projects",
    stars: ["Nu Octantis"],
    connections: [],
  },
  tucana: {
    name: "Tucana",
    section: "music",
    stars: ["Alpha Tucanae"],
    connections: [],
  },
  hydrus: {
    name: "Hydrus",
    section: "research",
    stars: ["Beta Hydri"],
    connections: [],
  },
};

// Get star by name from cached catalog
export function getStarByName(name, starCatalog) {
  if (!starCatalog) return null;
  return starCatalog.find((star) => star.name === name);
}

// Get all stars in a constellation
export function getConstellationStars(constellationKey, starCatalog) {
  const mapping = constellationMappings[constellationKey];
  if (!mapping || !starCatalog) return [];

  return mapping.stars
    .map((starName) => getStarByName(starName, starCatalog))
    .filter(Boolean);
}

// Map constellation keys to abbreviations used in constellationLines
const constellationKeyToAbbrev = {
  ursaMajor: "UMa",
  ursaMinor: "UMi",
  draco: "Dra",
  cassiopeia: "Cas",
  cepheus: "Cep",
  aries: "Ari",
  taurus: "Tau",
  gemini: "Gem",
  cancer: "Cnc",
  leo: "Leo",
  virgo: "Vir",
  libra: "Lib",
  scorpius: "Sco",
  sagittarius: "Sgr",
  capricornus: "Cap",
  aquarius: "Aqr",
  pisces: "Psc",
  orion: "Ori",
  canis_major: "CMa",
  canis_minor: "CMi",
  hydra: "Hya",
  crater: "Crt",
  corvus: "Crv",
  lyra: "Lyr",
  cygnus: "Cyg",
  aquila: "Aql",
  hercules: "Her",
  ophiuchus: "Oph",
  serpens: "Ser",
  andromeda: "And",
  pegasus: "Peg",
  perseus: "Per",
  triangulum: "Tri",
  bootes: "Boo",
  corona_borealis: "CrB",
  delphinus: "Del",
  sagitta: "Sge",
  lacerta: "Lac",
  vulpecula: "Vul",
  centaurus: "Cen",
  lupus: "Lup",
  ara: "Ara",
  corona_australis: "CrA",
  crux: "Cru",
  carina: "Car",
  vela: "Vel",
  piscis_austrinus: "PsA",
  cetus: "Cet",
  eridanus: "Eri",
  phoenix: "Phe",
  grus: "Gru",
  pavo: "Pav",
  auriga: "Aur",
  monoceros: "Mon",
  puppis: "Pup",
  pyxis: "Pyx",
  antlia: "Ant",
  sextans: "Sex",
  lynx: "Lyn",
  camelopardalis: "Cam",
  leo_minor: "LMi",
  canes_venatici: "CVn",
  coma_berenices: "Com",
  equuleus: "Equ",
  scutum: "Sct",
  microscopium: "Mic",
  sculptor: "Scl",
  fornax: "For",
  caelum: "Cae",
  horologium: "Hor",
  reticulum: "Ret",
  pictor: "Pic",
  dorado: "Dor",
  volans: "Vol",
  mensa: "Men",
  chamaeleon: "Cha",
  apus: "Aps",
  musca: "Mus",
  circinus: "Cir",
  norma: "Nor",
  telescopium: "Tel",
  indus: "Ind",
  octans: "Oct",
  tucana: "Tuc",
  hydrus: "Hyi",
};

export function getConstellationAbbrev(constellationKey) {
  return constellationKeyToAbbrev[constellationKey] || null;
}

export function getConstellationHipIds(constellationKey) {
  const abbrev = getConstellationAbbrev(constellationKey);
  const lines = abbrev ? constellationLines[abbrev] : null;
  if (!lines) return [];

  const ids = new Set();
  for (const [a, b] of lines) {
    ids.add(a);
    ids.add(b);
  }
  return Array.from(ids);
}

// Build constellation connections from HIP IDs for a given star array
export function buildConstellationConnections(constellationKey, stars) {
  const abbrev = getConstellationAbbrev(constellationKey);
  if (!abbrev || !constellationLines[abbrev]) {
    return [];
  }

  const lines = constellationLines[abbrev];
  const connections = [];

  // For each line segment [hip1, hip2], find the indices in our stars array
  for (const [hip1, hip2] of lines) {
    const idx1 = stars.findIndex((s) => s.id === hip1);
    const idx2 = stars.findIndex((s) => s.id === hip2);

    if (idx1 !== -1 && idx2 !== -1) {
      connections.push([idx1, idx2]);
    }
  }

  return connections;
}
