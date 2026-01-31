import {
  Body,
  Equator,
  Horizon,
  Illumination,
  Observer,
} from "astronomy-engine";

const DEFAULT_BODIES = [
  {
    key: "Sun",
    body: Body.Sun,
    kind: "sun",
    color: "#ffd166",
    radius: 6,
  },
  {
    key: "Moon",
    body: Body.Moon,
    kind: "moon",
    color: "#e9ecef",
    radius: 5.5,
  },
  {
    key: "Mercury",
    body: Body.Mercury,
    kind: "planet",
    color: "#c2c2c2",
    radius: 4,
  },
  {
    key: "Venus",
    body: Body.Venus,
    kind: "planet",
    color: "#ffe8a3",
    radius: 4.5,
  },
  {
    key: "Mars",
    body: Body.Mars,
    kind: "planet",
    color: "#ff6b6b",
    radius: 4,
  },
  {
    key: "Jupiter",
    body: Body.Jupiter,
    kind: "planet",
    color: "#f4d6a0",
    radius: 4.8,
  },
  {
    key: "Saturn",
    body: Body.Saturn,
    kind: "planet",
    color: "#f2e2b6",
    radius: 4.6,
  },
  {
    key: "Uranus",
    body: Body.Uranus,
    kind: "planet",
    color: "#b3e5ff",
    radius: 4.2,
  },
  {
    key: "Neptune",
    body: Body.Neptune,
    kind: "planet",
    color: "#6aa5ff",
    radius: 4.2,
  },
];

export function computeSolarSystemObjects(
  date,
  latitude,
  longitude,
  heightMeters = 0,
) {
  const observer = new Observer(latitude, longitude, heightMeters);

  return DEFAULT_BODIES.map((b) => {
    const eq = Equator(b.body, date, observer, true, true);
    const hor = Horizon(date, observer, eq.ra, eq.dec, "normal");
    const illum = b.body === Body.Moon ? Illumination(Body.Moon, date) : null;

    return {
      name: b.key,
      kind: b.kind,
      color: b.color,
      radius: b.radius,
      ra: eq.ra,
      dec: eq.dec,
      altitude: hor.altitude,
      azimuth: hor.azimuth,
      visible: hor.altitude > 0,
      magnitude: illum?.mag,
      phaseFraction: illum?.phase_fraction,
    };
  });
}
