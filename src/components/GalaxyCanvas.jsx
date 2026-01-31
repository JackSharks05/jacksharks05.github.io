import React, { useEffect, useRef, useState } from "react";
import {
  equatorialToHorizontal,
  horizontalToScreen,
  getUserLocation,
} from "../utils/astronomy";
import {
  fetchStarCatalog,
  constellationMappings,
  buildConstellationConnections,
  getConstellationHipIds,
  getAllConstellationKeys,
} from "../data/starCatalog";
import { getConstellationCard } from "../data/constellationCards";
import EarthGlobe from "./EarthGlobe";
import { computeSolarSystemObjects } from "../utils/solarSystem";
import "./GalaxyCanvas.css";

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

const hash32 = (n) => {
  let x = (n | 0) >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x7feb352d) >>> 0;
  x ^= x >>> 15;
  x = Math.imul(x, 0x846ca68b) >>> 0;
  x ^= x >>> 16;
  return x >>> 0;
};

const hashString32 = (s) => {
  // Simple stable string hash (FNV-1a-ish)
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const hash01 = (n, salt = 0) => {
  const x = hash32((n ^ (salt * 0x9e3779b9)) >>> 0);
  return x / 4294967296;
};

// Approximate Kelvin -> RGB (Tanner Helland-style). Returns 0-255 ints.
const temperatureToRgb = (tempK) => {
  const t = clamp(tempK, 1000, 40000) / 100;

  let r;
  let g;
  let b;

  if (t <= 66) {
    r = 255;
    g = 99.4708025861 * Math.log(t) - 161.1195681661;
    b = t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  } else {
    r = 329.698727446 * Math.pow(t - 60, -0.1332047592);
    g = 288.1221695283 * Math.pow(t - 60, -0.0755148492);
    b = 255;
  }

  return {
    r: Math.round(clamp(r, 0, 255)),
    g: Math.round(clamp(g, 0, 255)),
    b: Math.round(clamp(b, 0, 255)),
  };
};

const degToRad = (deg) => (deg * Math.PI) / 180;
const radToDeg = (rad) => (rad * 180) / Math.PI;

// Galactic <-> Equatorial (ICRS/J2000) using the standard rotation matrix.
// We only need galactic -> equatorial for a Milky Way plane visualization.
const galacticToEquatorial = (lDeg, bDeg) => {
  const l = degToRad(lDeg);
  const b = degToRad(bDeg);

  // Galactic Cartesian
  const xg = Math.cos(b) * Math.cos(l);
  const yg = Math.cos(b) * Math.sin(l);
  const zg = Math.sin(b);

  // Transpose of the equatorial->galactic matrix
  const xe = -0.0548755604 * xg + 0.4941094279 * yg + -0.867666149 * zg;
  const ye = -0.8734370902 * xg + -0.44482963 * yg + -0.1980763734 * zg;
  const ze = -0.4838350155 * xg + 0.7469822445 * yg + 0.4559837762 * zg;

  const decRad = Math.asin(Math.max(-1, Math.min(1, ze)));
  let raRad = Math.atan2(ye, xe);
  if (raRad < 0) raRad += Math.PI * 2;

  const raDeg = radToDeg(raRad);
  const decDeg = radToDeg(decRad);
  return { raHours: raDeg / 15, decDeg };
};

const pickStarRgb = (starId, mag) => {
  // We don't have spectral/type/color-index data in our minimal catalog.
  // Use a stable, subtle temperature tint distribution that matches naked-eye
  // appearance (mostly white with mild blue/yellow; avoids cartoon-red stars).
  const u = hash01(starId, 1);
  const v = hash01(starId, 2);

  const m = Number.isFinite(mag) ? mag : 6;
  const sat = clamp(0.22 - 0.015 * (1.5 - m), 0.14, 0.24);

  let tempK;
  if (u < 0.14) {
    tempK = 9000 + v * 4000; // blue-white
  } else if (u < 0.72) {
    tempK = 5600 + v * 1400; // white-ish
  } else if (u < 0.98) {
    tempK = 4700 + v * 900; // warm white / pale yellow
  } else {
    tempK = 4100 + v * 500; // soft orange (no deep reds)
  }

  const rgb = temperatureToRgb(tempK);

  // Blend toward white so colors stay subtle.
  return {
    r: Math.round(255 * (1 - sat) + rgb.r * sat),
    g: Math.round(255 * (1 - sat) + rgb.g * sat),
    b: Math.round(255 * (1 - sat) + rgb.b * sat),
  };
};

const wrapLongitude = (lon) => {
  // Wrap into [-180, 180)
  const x = (((lon + 180) % 360) + 360) % 360;
  return x - 180;
};

const formatDateTimeLocal = (date) => {
  const pad = (n) => String(n).padStart(2, "0");
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  return `${y}-${m}-${d}T${hh}:${mm}`;
};

const parseDateTimeLocal = (value) => {
  // value: YYYY-MM-DDTHH:mm
  if (!value) return null;
  const [ymd, hm] = value.split("T");
  if (!ymd || !hm) return null;
  const [y, m, d] = ymd.split("-").map((x) => Number(x));
  const [hh, mm] = hm.split(":").map((x) => Number(x));
  if (
    !Number.isFinite(y) ||
    !Number.isFinite(m) ||
    !Number.isFinite(d) ||
    !Number.isFinite(hh) ||
    !Number.isFinite(mm)
  ) {
    return null;
  }
  return new Date(y, m - 1, d, hh, mm, 0, 0);
};

const GalaxyCanvas = ({
  onConstellationClick,
  forcedProjectionMode,
  onLoaded,
  onFirstDrag,
  selectedConstellationKey,
  selectedConstellationKeys,
  interactive = true,
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [hoveredConstellation, setHoveredConstellation] = useState(null);
  const [hoveredStar, setHoveredStar] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Mapping the cosmos...");
  const [showAllStars, setShowAllStars] = useState(false);
  const [showAllConstellations, setShowAllConstellations] = useState(false);
  const [showSolarSystem, setShowSolarSystem] = useState(false);
  const [starBrightness, setStarBrightness] = useState(1);
  const [showMilkyWay, setShowMilkyWay] = useState(false);
  const [projectionMode, setProjectionMode] = useState("fill"); // 'fill' | 'accurate'
  const [controlsVisible, setControlsVisible] = useState(false);
  const [controlsUnlocked, setControlsUnlocked] = useState(false);
  const [hasMovedOnce, setHasMovedOnce] = useState(false);
  const [customLat, setCustomLat] = useState(null);
  const [customLon, setCustomLon] = useState(null);
  const [timeOffset, setTimeOffset] = useState(0); // hours offset from current time
  const [timeOffsetTarget, setTimeOffsetTarget] = useState(0);
  const [locationName, setLocationName] = useState("");
  const [locationCache, setLocationCache] = useState({}); // Cache location lookups
  const locationTimeoutRef = useRef(null);
  const animationRef = useRef(null);
  const resetAnimRef = useRef(null);
  const timeAnimRef = useRef(null);
  const [isResetting, setIsResetting] = useState(false);

  const dragRef = useRef({ active: false, moved: false, pointerId: null });
  const [isDragging, setIsDragging] = useState(false);

  const [latText, setLatText] = useState("");
  const [lonText, setLonText] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [locationSearchMessage, setLocationSearchMessage] = useState("");
  const [dateTimeText, setDateTimeText] = useState("");

  const hasLocationTimeOverrides =
    customLat !== null ||
    customLon !== null ||
    Math.abs(timeOffsetTarget || 0) > 0.001;

  const userLocationRef = useRef(userLocation);
  const customLatRef = useRef(customLat);
  const customLonRef = useRef(customLon);
  const timeOffsetRef = useRef(timeOffset);
  const showAllConstellationsRef = useRef(showAllConstellations);
  const showSolarSystemRef = useRef(showSolarSystem);
  const showMilkyWayRef = useRef(showMilkyWay);
  const projectionModeRef = useRef(projectionMode);
  // 0 => fill, 1 => accurate. Smoothly animated in the rAF loop.
  const projectionBlendRef = useRef(projectionMode === "accurate" ? 1 : 0);
  const projectionBlendTargetRef = useRef(
    projectionMode === "accurate" ? 1 : 0,
  );
  const lastForcedModeRef = useRef(null);
  const viewportRef = useRef({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const showAllStarsRef = useRef(showAllStars);
  const starBrightnessRef = useRef(starBrightness);
  const hoveredConstellationRef = useRef(hoveredConstellation);
  const selectedConstellationKeyRef = useRef(selectedConstellationKey);
  const selectedConstellationKeysRef = useRef(selectedConstellationKeys);
  const needsRecalcRef = useRef(true);
  const starsRef = useRef([]);
  const starCatalogRef = useRef(null);
  const constellationsRef = useRef([]);
  const solarSystemRef = useRef([]);
  const milkyWayPointsRef = useRef([]);
  const pulseEnabledRef = useRef(true);
  const [hoveredBody, setHoveredBody] = useState(null);
  const constellationPulseRef = useRef({
    activeKey: null,
    startAt: -1,
    dur: 4200,
    amp: 0.16,
    nextAt: performance.now() + 5000,
    pickCount: 0,
  });
  const didSignalLoadedRef = useRef(false);
  const didSignalFirstDragRef = useRef(false);
  const isFirstLoadRef = useRef(true);

  // Get user location and fetch star catalog on mount
  useEffect(() => {
    const initializeData = async () => {
      const isFirstLoad = (() => {
        try {
          return !sessionStorage.getItem("planetarium:loaded");
        } catch {
          return true;
        }
      })();

      isFirstLoadRef.current = isFirstLoad;

      setLoadingMessage("Getting your location...");
      await new Promise((resolve) => setTimeout(resolve, 200));
      const location = await getUserLocation();
      setUserLocation(location);

      setLoadingMessage("Downloading star catalog...");
      await new Promise((resolve) => setTimeout(resolve, 300));
      const catalog = await fetchStarCatalog();
      starCatalogRef.current = catalog;

      setLoadingMessage("Calculating star positions...");
      if (isFirstLoad) {
        setLoadingMessage("Building the universe...");
        await new Promise((resolve) => setTimeout(resolve, 900));
      }
      await new Promise((resolve) =>
        setTimeout(resolve, isFirstLoad ? 700 : 200),
      );

      try {
        sessionStorage.setItem("planetarium:loaded", "1");
      } catch {}

      setLoading(false);
    };

    initializeData();
  }, []);

  useEffect(() => {
    if (loading) return;
    if (didSignalLoadedRef.current) return;
    didSignalLoadedRef.current = true;
    onLoaded?.();
  }, [loading, onLoaded]);

  useEffect(() => {
    selectedConstellationKeyRef.current = selectedConstellationKey;
  }, [selectedConstellationKey]);

  useEffect(() => {
    selectedConstellationKeysRef.current = selectedConstellationKeys;
  }, [selectedConstellationKeys]);

  useEffect(() => {
    // Hide controls until a short beat after load (or until the user moves).
    if (loading) {
      setControlsUnlocked(false);
      setControlsVisible(false);
      return;
    }

    // Returning visitors shouldn't need to wait again.
    if (!isFirstLoadRef.current) {
      setControlsUnlocked(true);
      return;
    }

    const t = window.setTimeout(() => {
      setControlsUnlocked(true);
    }, 5000);

    return () => window.clearTimeout(t);
  }, [loading]);

  useEffect(() => {
    userLocationRef.current = userLocation;
    needsRecalcRef.current = true;
  }, [userLocation]);

  useEffect(() => {
    customLatRef.current = customLat;
    customLonRef.current = customLon;
    timeOffsetRef.current = timeOffset;
    needsRecalcRef.current = true;
  }, [customLat, customLon, timeOffset]);

  // Smoothly animate timeOffset toward timeOffsetTarget.
  useEffect(() => {
    if (isResetting) return;

    if (timeAnimRef.current) {
      cancelAnimationFrame(timeAnimRef.current);
      timeAnimRef.current = null;
    }

    let last = performance.now();
    const tauMs = 140; // smaller = snappier

    const step = (now) => {
      const dt = Math.min(50, now - last);
      last = now;

      setTimeOffset((prev) => {
        const target = timeOffsetTarget;
        const alpha = 1 - Math.exp(-dt / tauMs);
        const next = prev + (target - prev) * alpha;

        if (Math.abs(target - next) < 0.001) {
          return target;
        }

        return next;
      });

      if (Math.abs(timeOffsetTarget - timeOffsetRef.current) < 0.001) {
        timeAnimRef.current = null;
        return;
      }

      timeAnimRef.current = requestAnimationFrame(step);
    };

    timeAnimRef.current = requestAnimationFrame(step);

    return () => {
      if (timeAnimRef.current) {
        cancelAnimationFrame(timeAnimRef.current);
        timeAnimRef.current = null;
      }
    };
  }, [timeOffsetTarget, isResetting]);

  useEffect(() => {
    // Initialize text inputs once we have a location.
    if (!userLocation) return;
    if (!latText)
      setLatText(String((customLat ?? userLocation.latitude).toFixed(5)));
    if (!lonText)
      setLonText(String((customLon ?? userLocation.longitude).toFixed(5)));
    if (!dateTimeText) {
      const d = new Date();
      d.setHours(d.getHours() + timeOffset);
      setDateTimeText(formatDateTimeLocal(d));
    }
  }, [userLocation]);

  useEffect(() => {
    showAllConstellationsRef.current = showAllConstellations;
  }, [showAllConstellations]);

  useEffect(() => {
    showSolarSystemRef.current = showSolarSystem;
    needsRecalcRef.current = true;
  }, [showSolarSystem]);

  useEffect(() => {
    showMilkyWayRef.current = showMilkyWay;
    needsRecalcRef.current = true;
  }, [showMilkyWay]);

  useEffect(() => {
    projectionModeRef.current = projectionMode;
    projectionBlendTargetRef.current = projectionMode === "accurate" ? 1 : 0;
  }, [projectionMode]);

  useEffect(() => {
    const isValid =
      forcedProjectionMode === "fill" || forcedProjectionMode === "accurate";

    if (isValid) {
      lastForcedModeRef.current = forcedProjectionMode;
      // Keep UI + animation target in sync with the forced mode.
      setProjectionMode(forcedProjectionMode);
      projectionBlendTargetRef.current =
        forcedProjectionMode === "accurate" ? 1 : 0;
      return;
    }

    // Force released (e.g. scrolled back to top): snap back to fill once.
    if (lastForcedModeRef.current) {
      lastForcedModeRef.current = null;
      setProjectionMode("fill");
      projectionBlendTargetRef.current = 0;
    }
  }, [forcedProjectionMode]);

  useEffect(() => {
    showAllStarsRef.current = showAllStars;
  }, [showAllStars]);

  useEffect(() => {
    starBrightnessRef.current = starBrightness;
  }, [starBrightness]);

  useEffect(() => {
    hoveredConstellationRef.current = hoveredConstellation;
  }, [hoveredConstellation]);

  // Initialize and animate canvas
  useEffect(() => {
    if (!userLocation || loading || !starCatalogRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      viewportRef.current = { width, height };

      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Draw in CSS pixel coordinates.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      needsRecalcRef.current = true;
    };

    const calculateStarPositions = () => {
      // Apply time offset (supports fractional hours)
      const currentTime = new Date(
        Date.now() + timeOffsetRef.current * 3600000,
      );

      // Use custom location if set, otherwise use detected location
      const loc = userLocationRef.current;
      const latitude =
        customLatRef.current !== null ? customLatRef.current : loc.latitude;
      const longitude =
        customLonRef.current !== null ? customLonRef.current : loc.longitude;

      const { width: viewportW, height: viewportH } = viewportRef.current;

      // Calculate positions for ALL stars (including those below horizon)
      // Keep all stars for constellation building
      starsRef.current = starCatalogRef.current.map((star) => {
        const horizontal = equatorialToHorizontal(
          star.ra,
          star.dec,
          latitude,
          longitude,
          currentTime,
        );

        const screen = horizontalToScreen(
          horizontal.altitude,
          horizontal.azimuth,
          viewportW,
          viewportH,
          { blend: projectionBlendRef.current },
        );

        // Approximate perceived brightness from apparent magnitude (as seen from Earth):
        // brightness \propto 10^{-0.4 m}
        const mag = Number.isFinite(star.mag) ? star.mag : 6;
        const intensity = Math.pow(10, -0.4 * mag);

        // Map intensity into a renderer-friendly range.
        const baseAlpha = Math.min(1, Math.max(0.05, 0.08 + 0.95 * intensity));
        const size = Math.min(
          4.2,
          Math.max(0.6, 0.8 + 3.2 * Math.sqrt(intensity)),
        );

        const id = Number.isFinite(star.id) ? star.id : 0;
        const rgb = pickStarRgb(id, mag);

        // Twinkle: deterministic per-star so it doesn't reshuffle on recompute.
        const roll = hash01(id, 10);
        const roll2 = hash01(id, 11);
        const roll3 = hash01(id, 12);
        const hz =
          roll < 0.02
            ? 4 + roll2 * 6 // 2%: rapid twinkle
            : roll < 0.1
              ? 1.5 + roll2 * 2.5 // 8%: medium
              : 0.2 + roll2 * 1.2; // most: subtle

        const twinkleOmega = (2 * Math.PI * hz) / 1000; // radians per ms
        const twinklePhase = roll3 * Math.PI * 2;

        // Stronger scintillation near the horizon.
        const alt = horizontal.altitude;
        const altFactor = Math.min(1, Math.max(0, alt / 90));
        const twinkleAmp = Math.min(
          0.22,
          Math.max(0.03, 0.04 + 0.12 * (1 - altFactor) + hash01(id, 13) * 0.03),
        );

        return {
          ...star,
          ...horizontal,
          ...screen,
          size,
          baseAlpha,
          rgb,
          twinkleOmega,
          twinklePhase,
          twinkleAmp,
        };
      }); // Don't filter here - need all stars for constellations

      const starsById = new Map(starsRef.current.map((s) => [s.id, s]));

      // Build constellation data from ALL stars (including below horizon)
      constellationsRef.current = getAllConstellationKeys()
        .map((key) => {
          const mapping = constellationMappings[key] || null;
          const card = getConstellationCard(key, "");

          // Build the constellation star set from the HIP endpoints referenced by the
          // authoritative stick-figure line dataset.
          const hipIds = getConstellationHipIds(key);
          const stars = hipIds.map((hip) => starsById.get(hip)).filter(Boolean);

          // Only create constellation if we have at least 2 stars in catalog
          if (stars.length < 2) {
            return null;
          }

          // Use buildConstellationConnections to get proper line patterns from astronomical data
          const connections = buildConstellationConnections(key, stars);

          if (connections.length === 0) {
            return null;
          }

          return {
            key,
            name: card?.title || mapping?.name || key,
            section: mapping?.section || null,
            stars,
            connections,
          };
        })
        .filter(Boolean);

      // Solar system objects (Sun, Moon, planets)
      // IMPORTANT: use CSS pixel viewport size (not DPR-scaled backing canvas)
      // so objects don't jump offscreen when re-computing during drag.
      if (showSolarSystemRef.current) {
        const solar = computeSolarSystemObjects(
          currentTime,
          latitude,
          longitude,
        ).map((obj) => {
          const screenPos = horizontalToScreen(
            obj.altitude,
            obj.azimuth,
            viewportW,
            viewportH,
            { blend: projectionBlendRef.current },
          );

          return {
            ...obj,
            ...screenPos,
          };
        });

        solarSystemRef.current = solar;
      } else {
        solarSystemRef.current = [];
      }

      // Optional Milky Way band (approximate brightness/color, but correct plane
      // orientation that moves with time/location).
      if (showMilkyWayRef.current) {
        const points = [];
        const stepDeg = 4; // performance/quality tradeoff
        for (let l = 0; l < 360; l += stepDeg) {
          const eq = galacticToEquatorial(l, 0);
          const horizontal = equatorialToHorizontal(
            eq.raHours,
            eq.decDeg,
            latitude,
            longitude,
            currentTime,
          );
          const screen = horizontalToScreen(
            horizontal.altitude,
            horizontal.azimuth,
            viewportW,
            viewportH,
            { blend: projectionBlendRef.current },
          );

          points.push({
            altitude: horizontal.altitude,
            azimuth: horizontal.azimuth,
            x: screen.x,
            y: screen.y,
            visible: screen.visible,
          });
        }
        milkyWayPointsRef.current = points;
      } else {
        milkyWayPointsRef.current = [];
      }
    };

    const updateProjectionPositions = () => {
      const blend = projectionBlendRef.current;
      const { width: viewportW, height: viewportH } = viewportRef.current;

      // Re-project stars in-place (fast; avoids recomputing alt/az).
      for (const star of starsRef.current) {
        if (!Number.isFinite(star.altitude) || !Number.isFinite(star.azimuth)) {
          continue;
        }
        const screen = horizontalToScreen(
          star.altitude,
          star.azimuth,
          viewportW,
          viewportH,
          { blend },
        );
        star.x = screen.x;
        star.y = screen.y;
        // Visibility is purely altitude-based in our projection helper.
        star.visible = screen.visible;
      }

      // Re-project solar system objects in-place.
      for (const obj of solarSystemRef.current) {
        if (!Number.isFinite(obj.altitude) || !Number.isFinite(obj.azimuth)) {
          continue;
        }
        const screen = horizontalToScreen(
          obj.altitude,
          obj.azimuth,
          viewportW,
          viewportH,
          { blend },
        );
        obj.x = screen.x;
        obj.y = screen.y;
        obj.visible = screen.visible;
      }

      // Re-project Milky Way points in-place.
      for (const p of milkyWayPointsRef.current) {
        if (!Number.isFinite(p.altitude) || !Number.isFinite(p.azimuth)) {
          continue;
        }
        const screen = horizontalToScreen(
          p.altitude,
          p.azimuth,
          viewportW,
          viewportH,
          {
            blend,
          },
        );
        p.x = screen.x;
        p.y = screen.y;
        p.visible = screen.visible;
      }
    };

    const drawMilkyWay = () => {
      if (!showMilkyWayRef.current) return;
      const pts = milkyWayPointsRef.current;
      if (!pts || pts.length < 2) return;

      const strokeSegments = (lineWidth, strokeStyle) => {
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;

        let started = false;
        let last = null;
        ctx.beginPath();
        for (const p of pts) {
          if (!p.visible) {
            if (started) {
              ctx.stroke();
              ctx.beginPath();
            }
            started = false;
            last = null;
            continue;
          }

          if (last) {
            const dx = p.x - last.x;
            const dy = p.y - last.y;
            // Break the stroke if projection wraps across the screen.
            if (dx * dx + dy * dy > 260 * 260) {
              if (started) {
                ctx.stroke();
                ctx.beginPath();
              }
              started = false;
            }
          }

          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else {
            ctx.lineTo(p.x, p.y);
          }
          last = p;
        }
        if (started) ctx.stroke();
        ctx.restore();
      };

      // Very subtle layered haze; default off and deliberately understated.
      strokeSegments(78, "rgba(85, 120, 255, 0.055)");
      strokeSegments(42, "rgba(210, 215, 255, 0.045)");
      strokeSegments(18, "rgba(255, 215, 160, 0.035)");
    };

    const drawStars = () => {
      const t = performance.now();
      const brightnessMul = clamp(starBrightnessRef.current ?? 1, 0.2, 3);

      // Only draw visible stars (above horizon)
      starsRef.current.forEach((star) => {
        if (!star.visible) return; // Skip stars below horizon

        const altFactor = Math.min(1, Math.max(0, star.altitude / 90));
        const extinction = 0.55 + 0.45 * Math.sqrt(altFactor); // simple horizon dimming

        const tw = Math.sin(t * star.twinkleOmega + star.twinklePhase);
        const brightness = Math.min(
          1,
          Math.max(
            0,
            star.baseAlpha *
              brightnessMul *
              extinction *
              (1 + star.twinkleAmp * tw),
          ),
        );

        // Draw star (subtle temperature tint)
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        const c = star.rgb || { r: 255, g: 255, b: 255 };
        ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${brightness})`;
        ctx.fill();

        // Add glow for bright stars
        if (star.mag < 1.5 && brightness > 0.7) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${brightness * 0.15})`;
          ctx.fill();
        }
      });
    };

    const drawSolarSystem = () => {
      if (!showSolarSystemRef.current) return;

      const blend = projectionBlendRef.current;
      const { width: viewportW, height: viewportH } = viewportRef.current;

      // Keep sizing consistent with the current animated projection.
      const fillRadius = Math.max(viewportW, viewportH) * 0.7;
      const accurateRadius = Math.min(viewportW, viewportH) * 0.48;
      const maxRadius = fillRadius + (accurateRadius - fillRadius) * blend;

      // Scale angular sizes into pixels based on our sky projection.
      // In horizontalToScreen we map 90° (zenith -> horizon) to maxRadius pixels.
      const pxPerDeg = maxRadius / 90;

      const getBodyRadiusPx = (obj) => {
        // Apparent angular diameters (rough)
        const angularDiameterDeg =
          obj.name === "Sun" ? 0.533 : obj.name === "Moon" ? 0.518 : null;

        if (!angularDiameterDeg) {
          return obj.radius;
        }

        // Physically the Sun/Moon would be only a few px with our mapping.
        // Boost visibility while keeping them proportional to each other.
        const visibilityBoost = 6;
        return clamp(
          (angularDiameterDeg / 2) * pxPerDeg * visibilityBoost,
          8,
          18,
        );
      };

      const sun = solarSystemRef.current.find(
        (o) => o.visible && o.name === "Sun",
      );

      solarSystemRef.current.forEach((obj) => {
        if (!obj.visible) return;

        const r = getBodyRadiusPx(obj);

        // Moon: draw phase with terminator oriented toward the Sun.
        if (obj.name === "Moon" && Number.isFinite(obj.phaseFraction)) {
          const phase = clamp(obj.phaseFraction, 0, 1);

          // Direction to Sun in screen-space; if we don't have it, default to right.
          const sunAngle = sun ? Math.atan2(sun.y - obj.y, sun.x - obj.x) : 0;

          ctx.save();
          ctx.translate(obj.x, obj.y);
          ctx.rotate(sunAngle);

          // Base (unlit) disc
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(20, 26, 34, 0.95)";
          ctx.fill();

          // Clip to the lunar disc
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.clip();

          // Draw illuminated portion as a soft terminator gradient.
          // terminator at x = (1 - 2f)r: full => -r (all lit), new => +r (all dark)
          const terminatorX = (1 - 2 * phase) * r;
          const softness = r * 0.18;
          const t = (terminatorX + r) / (2 * r);
          const grad = ctx.createLinearGradient(-r, 0, r, 0);
          const a = clamp(t, 0, 1);
          const left = clamp(a - softness / (2 * r), 0, 1);
          const right = clamp(a + softness / (2 * r), 0, 1);
          grad.addColorStop(0, "rgba(20, 26, 34, 0)");
          grad.addColorStop(left, "rgba(20, 26, 34, 0)");
          grad.addColorStop(right, "rgba(233, 236, 239, 0.95)");
          grad.addColorStop(1, "rgba(233, 236, 239, 0.95)");

          ctx.fillStyle = grad;
          ctx.fillRect(-r, -r, 2 * r, 2 * r);

          // Subtle edge highlight
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.restore();

          // Halo
          ctx.beginPath();
          ctx.arc(obj.x, obj.y, r * 2.1, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(233, 236, 239, 0.09)";
          ctx.fill();

          return;
        }

        // Sun / planet marker
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, r, 0, Math.PI * 2);

        const alpha = 0.95;

        ctx.fillStyle = `rgba(${parseInt(obj.color.slice(1, 3), 16)}, ${parseInt(
          obj.color.slice(3, 5),
          16,
        )}, ${parseInt(obj.color.slice(5, 7), 16)}, ${alpha})`;
        ctx.fill();

        // subtle halo
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, r * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${parseInt(obj.color.slice(1, 3), 16)}, ${parseInt(
          obj.color.slice(3, 5),
          16,
        )}, ${parseInt(obj.color.slice(5, 7), 16)}, ${0.12})`;
        ctx.fill();
      });
    };

    const drawConstellations = () => {
      const nowMs = performance.now();
      const hovered = hoveredConstellationRef.current;
      const selectedKey = selectedConstellationKeyRef.current;
      const selectedKeys = selectedConstellationKeysRef.current;
      const selectedSet = new Set(
        Array.isArray(selectedKeys)
          ? selectedKeys
          : selectedKey
            ? [selectedKey]
            : [],
      );

      const all = constellationsRef.current;

      const getPulseAlpha = (key) => {
        if (!pulseEnabledRef.current) {
          return 0;
        }

        const state = constellationPulseRef.current;

        // Start a new pulse on a fixed cadence.
        if (nowMs >= state.nextAt && all.length > 0) {
          // Only pulse constellations that have at least one visible line segment.
          const eligible = all.filter((c) =>
            c.connections.some(([a, b]) => {
              const s = c.stars[a];
              const t = c.stars[b];
              return !!(s && t && s.visible && t.visible);
            }),
          );

          if (eligible.length === 0) {
            state.activeKey = null;
            state.startAt = -1;
            state.nextAt = nowMs + 5000;
            return 0;
          }

          state.pickCount += 1;
          const u = hash01(hashString32("pulse"), 10 + state.pickCount);
          const idx = Math.floor(u * eligible.length);
          state.activeKey =
            eligible[Math.max(0, Math.min(eligible.length - 1, idx))].key;

          const v = hash01(hashString32("pulse"), 20 + state.pickCount);
          const w = hash01(hashString32("pulse"), 30 + state.pickCount);
          state.startAt = nowMs;
          // Keep duration < cadence so it fully fades out before the next pulse.
          state.dur = 4100 + v * 700; // 4.1s .. 4.8s
          state.amp = 0.12 + w * 0.14;

          // Every 10 seconds.
          state.nextAt = state.startAt + 10000;
        }

        if (!state.activeKey || key !== state.activeKey || state.startAt < 0) {
          return 0;
        }

        const t = (nowMs - state.startAt) / state.dur;
        if (t < 0 || t > 1) {
          return 0;
        }

        // Slow fade in, slow fade out (triangle + smoothstep easing).
        const u = t < 0.5 ? t / 0.5 : (1 - t) / 0.5; // 0..1..0
        const eased = u * u * (3 - 2 * u); // smoothstep
        return state.amp * eased;
      };

      let constellationsToDraw;
      if (showAllConstellationsRef.current) {
        constellationsToDraw = all;
      } else {
        const keys = new Set();
        if (hovered?.key) keys.add(hovered.key);
        for (const k of selectedSet) keys.add(k);
        const activeKey = constellationPulseRef.current.activeKey;
        if (activeKey) keys.add(activeKey);
        constellationsToDraw = keys.size
          ? all.filter((c) => keys.has(c.key))
          : [];
      }

      constellationsToDraw.forEach((constellation) => {
        const isHovered = hovered?.key === constellation.key;
        const isSelected = selectedSet.has(constellation.key);
        const pulse = isHovered ? 0 : getPulseAlpha(constellation.key);
        const base = isHovered ? 1.0 : isSelected ? 0.35 : 0.22;
        const alpha = isHovered
          ? 1.0
          : Math.min(isSelected ? 0.75 : 0.65, base + pulse);
        const color = isHovered ? "rgba(255, 255, 255" : "rgba(74, 158, 255";
        const starSize = isHovered ? 5 : isSelected ? 5 : 4;

        // Draw constellation stars with highlight (only visible ones)
        constellation.stars.forEach((star) => {
          if (!star.visible) return; // Skip stars below horizon

          ctx.beginPath();
          ctx.arc(star.x, star.y, starSize, 0, Math.PI * 2);
          ctx.fillStyle = `${color}, ${alpha})`;
          ctx.fill();

          if (isHovered) {
            ctx.beginPath();
            ctx.arc(star.x, star.y, starSize * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, 0.2)`;
            ctx.fill();
          } else if (isSelected) {
            ctx.beginPath();
            ctx.arc(star.x, star.y, starSize * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(74, 158, 255, 0.18)`;
            ctx.fill();
          }
        });

        // Draw connections (only where both stars are visible)
        ctx.strokeStyle = `${color}, ${alpha})`;
        ctx.lineWidth = isHovered ? 2 : isSelected ? 2 : pulse > 0 ? 2 : 1.5;

        constellation.connections.forEach(([startIdx, endIdx]) => {
          const start = constellation.stars[startIdx];
          const end = constellation.stars[endIdx];

          // Only draw line if both stars exist and are above horizon
          if (start && end && start.visible && end.visible) {
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
          }
        });
      });
    };

    let lastNow = performance.now();
    let lastAutoRecalcWallMs = Date.now();
    const autoRecalcIntervalMs = 2000;

    const animate = () => {
      // Smoothly animate projection mode (fill <-> accurate) so toggling slides.
      // Keep this independent of the heavier alt/az recompute.
      const now = performance.now();
      const dt = Math.min(50, now - lastNow);
      lastNow = now;

      // Advance the sky automatically while the page is open.
      // Recompute alt/az at a low cadence (stars barely move per second).
      const wallNowMs = Date.now() + timeOffsetRef.current * 3600000;
      if (wallNowMs - lastAutoRecalcWallMs >= autoRecalcIntervalMs) {
        lastAutoRecalcWallMs = wallNowMs;
        needsRecalcRef.current = true;
      }

      const target = projectionBlendTargetRef.current;
      const current = projectionBlendRef.current;
      const tauMs = 220;
      const alpha = 1 - Math.exp(-dt / tauMs);
      const next = current + (target - current) * alpha;

      const projectionChanged = Math.abs(next - current) > 1e-5;
      if (projectionChanged) {
        projectionBlendRef.current = next;
        updateProjectionPositions();
      }

      if (needsRecalcRef.current) {
        calculateStarPositions();
        needsRecalcRef.current = false;
      }

      // Clear canvas
      ctx.fillStyle = "rgba(0, 0, 5, 1)";
      {
        const { width: viewportW, height: viewportH } = viewportRef.current;
        ctx.fillRect(0, 0, viewportW, viewportH);
      }

      // Draw stars and constellations
      drawMilkyWay();
      drawStars();
      drawConstellations();
      drawSolarSystem();

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();

    let ro = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => resizeCanvas());
      if (containerRef.current) {
        ro.observe(containerRef.current);
      }
    }

    window.addEventListener("resize", resizeCanvas);
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (ro) {
        ro.disconnect();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [userLocation, loading]);

  // Handle mouse movement
  const handleMouseMove = (e) => {
    if (!interactive) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update mouse position for tooltips
    if (containerRect) {
      setMousePos({
        x: e.clientX - containerRect.left,
        y: e.clientY - containerRect.top,
      });
    } else {
      setMousePos({ x, y });
    }

    if (dragRef.current.active) {
      return;
    }

    // Check solar system objects first (when enabled)
    if (showSolarSystemRef.current) {
      const hoverRadiusSolar = 18;
      let foundBody = null;
      for (const obj of solarSystemRef.current) {
        if (!obj.visible) continue;
        const distance = Math.sqrt(
          Math.pow(x - obj.x, 2) + Math.pow(y - obj.y, 2),
        );
        if (distance < hoverRadiusSolar) {
          foundBody = obj;
          break;
        }
      }

      setHoveredBody(foundBody);
      if (foundBody) {
        setHoveredStar(null);
        setHoveredConstellation(null);
        hoveredConstellationRef.current = null;
        return;
      }
    }

    setHoveredBody(null);

    let foundStar = null;
    const hoverRadius = 15; // pixels

    for (const star of starsRef.current) {
      // Only check visible stars (above horizon)
      if (!star.visible) continue;

      // Show all stars if toggle is on, otherwise only named stars
      const shouldShow =
        showAllStarsRef.current || (star.name && star.name.length > 0);
      if (shouldShow) {
        const distance = Math.sqrt(
          Math.pow(x - star.x, 2) + Math.pow(y - star.y, 2),
        );
        if (distance < hoverRadius) {
          foundStar = star;
          break;
        }
      }
    }

    setHoveredStar(foundStar);

    // Check for constellation hover (only if not hovering over a star)
    if (!foundStar) {
      let foundConstellation = null;
      for (const constellation of constellationsRef.current) {
        if (isPointInConstellation(x, y, constellation)) {
          foundConstellation = constellation;
          break;
        }
      }
      setHoveredConstellation(foundConstellation);
      hoveredConstellationRef.current = foundConstellation;
    } else {
      setHoveredConstellation(null);
      hoveredConstellationRef.current = null;
    }
  };

  const handlePointerDown = (e) => {
    if (!interactive) return;
    if (!canvasRef.current) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (e.pointerType !== "mouse") e.preventDefault();

    // Cancel any reset animation.
    if (resetAnimRef.current) {
      cancelAnimationFrame(resetAnimRef.current);
      resetAnimRef.current = null;
      setIsResetting(false);
    }

    dragRef.current.active = true;
    dragRef.current.moved = false;
    dragRef.current.pointerId = e.pointerId;

    const rect = canvasRef.current.getBoundingClientRect();
    dragRef.current.startX = e.clientX - rect.left;
    dragRef.current.startY = e.clientY - rect.top;
    dragRef.current.startLat =
      customLatRef.current !== null
        ? customLatRef.current
        : (userLocationRef.current?.latitude ?? 0);
    dragRef.current.startLon =
      customLonRef.current !== null
        ? customLonRef.current
        : (userLocationRef.current?.longitude ?? 0);

    // Scale: half a screen drag ~ full range.
    dragRef.current.degPerPxLat = (180 / rect.height) * 0.55;
    dragRef.current.degPerPxLon = (360 / rect.width) * 0.55;

    setHoveredStar(null);
    setHoveredConstellation(null);
    hoveredConstellationRef.current = null;
    setHoveredBody(null);
    setIsDragging(true);

    canvasRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!interactive) return;
    if (!dragRef.current.active) return;
    if (dragRef.current.pointerId !== e.pointerId) return;
    if (!canvasRef.current) return;
    if (e.pointerType !== "mouse") e.preventDefault();

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = x - dragRef.current.startX;
    const dy = y - dragRef.current.startY;

    if (!dragRef.current.moved && Math.hypot(dx, dy) > 4) {
      dragRef.current.moved = true;
      setHasMovedOnce(true);
      if (!didSignalFirstDragRef.current) {
        didSignalFirstDragRef.current = true;
        onFirstDrag?.();
      }
    }

    const nextLat = clamp(
      // drag up increases latitude
      dragRef.current.startLat + dy * dragRef.current.degPerPxLat,
      -90,
      90,
    );
    const nextLon = wrapLongitude(
      // drag right increases longitude
      dragRef.current.startLon + dx * dragRef.current.degPerPxLon,
    );

    setCustomLat(nextLat);
    setCustomLon(nextLon);
  };

  const handlePointerUp = (e) => {
    if (!interactive) return;
    if (!dragRef.current.active) return;
    if (dragRef.current.pointerId !== e.pointerId) return;
    if (e.pointerType !== "mouse") e.preventDefault();
    dragRef.current.active = false;
    dragRef.current.pointerId = null;
    setIsDragging(false);
  };

  const distancePointToSegment = (px, py, ax, ay, bx, by) => {
    const abx = bx - ax;
    const aby = by - ay;
    const apx = px - ax;
    const apy = py - ay;
    const abLen2 = abx * abx + aby * aby;
    if (abLen2 <= 1e-6) {
      return Math.hypot(px - ax, py - ay);
    }
    let t = (apx * abx + apy * aby) / abLen2;
    t = clamp(t, 0, 1);
    const cx = ax + t * abx;
    const cy = ay + t * aby;
    return Math.hypot(px - cx, py - cy);
  };

  // Check if point is in constellation (only considers visible stars)
  const isPointInConstellation = (x, y, constellation) => {
    // Calculate bounds from visible stars only
    const visibleStars = constellation.stars.filter((s) => s.visible);
    if (visibleStars.length === 0) return false;

    const xs = visibleStars.map((s) => s.x);
    const ys = visibleStars.map((s) => s.y);
    const minX = Math.min(...xs) - 40;
    const maxX = Math.max(...xs) + 40;
    const minY = Math.min(...ys) - 40;
    const maxY = Math.max(...ys) + 40;

    if (x < minX || x > maxX || y < minY || y > maxY) {
      return false;
    }

    // Check proximity to any visible star
    if (
      visibleStars.some((star) => {
        const distance = Math.sqrt(
          Math.pow(x - star.x, 2) + Math.pow(y - star.y, 2),
        );
        return distance < 30;
      })
    ) {
      return true;
    }

    // Also allow interaction on the constellation lines.
    const lineHitRadius = 10;
    return constellation.connections.some(([startIdx, endIdx]) => {
      const start = constellation.stars[startIdx];
      const end = constellation.stars[endIdx];
      if (!start || !end || !start.visible || !end.visible) return false;
      const d = distancePointToSegment(x, y, start.x, start.y, end.x, end.y);
      return d <= lineHitRadius;
    });
  };

  // Handle click
  // Reset to current location and time
  const resetView = () => {
    if (!userLocationRef.current) {
      setCustomLat(null);
      setCustomLon(null);
      setTimeOffset(0);
      setTimeOffsetTarget(0);
      return;
    }

    const startLat =
      customLatRef.current !== null
        ? customLatRef.current
        : userLocationRef.current.latitude;
    const startLon =
      customLonRef.current !== null
        ? customLonRef.current
        : userLocationRef.current.longitude;
    const startOffset = timeOffsetRef.current;

    const targetLat = userLocationRef.current.latitude;
    const targetLon = userLocationRef.current.longitude;
    const targetOffset = 0;

    const alreadyAtTarget =
      Math.abs(startLat - targetLat) < 1e-6 &&
      Math.abs(startLon - targetLon) < 1e-6 &&
      Math.abs(startOffset - targetOffset) < 1e-6;
    if (alreadyAtTarget) {
      setCustomLat(null);
      setCustomLon(null);
      setTimeOffset(0);
      return;
    }

    if (resetAnimRef.current) {
      cancelAnimationFrame(resetAnimRef.current);
      resetAnimRef.current = null;
    }

    if (timeAnimRef.current) {
      cancelAnimationFrame(timeAnimRef.current);
      timeAnimRef.current = null;
    }

    setIsResetting(true);
    const durationMs = 1200;
    const startT = performance.now();
    const easeInOutCubic = (p) =>
      p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

    const step = (now) => {
      const raw = (now - startT) / durationMs;
      const p = clamp(raw, 0, 1);
      const e = easeInOutCubic(p);

      const lat = startLat + (targetLat - startLat) * e;
      const lon = startLon + (targetLon - startLon) * e;
      const off = startOffset + (targetOffset - startOffset) * e;

      setCustomLat(lat);
      setCustomLon(lon);
      setTimeOffset(off);
      setTimeOffsetTarget(off);

      if (p < 1) {
        resetAnimRef.current = requestAnimationFrame(step);
      } else {
        resetAnimRef.current = null;
        setCustomLat(null);
        setCustomLon(null);
        setTimeOffset(0);
        setTimeOffsetTarget(0);
        setIsResetting(false);
      }
    };

    resetAnimRef.current = requestAnimationFrame(step);
  };

  // Get location name from coordinates
  const getLocationName = async (lat, lon) => {
    // Round to 2 decimal places for caching
    const cacheKey = `${lat.toFixed(2)},${lon.toFixed(2)}`;

    // Check cache first
    if (locationCache[cacheKey]) {
      return locationCache[cacheKey];
    }

    try {
      // Try OpenStreetMap Nominatim API (more reliable, no rate limits for reasonable use)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
        {
          headers: {
            "User-Agent": "PersonalPortfolio/1.0", // Required by Nominatim
          },
        },
      );

      if (!response.ok) {
        console.log("Nominatim API error:", response.status);
        return `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
      }

      const data = await response.json();
      console.log("Nominatim response:", data); // Debug

      let locationString = "";

      if (data.address) {
        const addr = data.address;
        const city =
          addr.city ||
          addr.town ||
          addr.village ||
          addr.municipality ||
          addr.county ||
          "";
        const country = addr.country || "";

        if (city && country) {
          locationString = `${city}, ${country}`;
        } else if (country) {
          const state = addr.state || "";
          if (state && state !== country) {
            locationString = `${state}, ${country}`;
          } else {
            locationString = country;
          }
        }
      }

      // Check if we're over water
      if (!locationString || data.error === "Unable to geocode") {
        // Fallback to coordinate-based ocean detection
        if (lon >= -180 && lon <= -30) {
          if (lat >= 0 && lat <= 70) locationString = "North Atlantic Ocean";
          else if (lat < 0 && lat >= -60)
            locationString = "South Atlantic Ocean";
        } else if (lon > -30 && lon <= 50) {
          if (lat >= 30) locationString = "Mediterranean Sea";
          else if (lat >= -35) locationString = "Indian Ocean";
        } else if (lon > 50 && lon <= 150) {
          if (lat >= 0) locationString = "North Pacific Ocean";
          else if (lat < 0) locationString = "Indian Ocean";
        } else {
          if (lat >= 0) locationString = "North Pacific Ocean";
          else if (lat < 0 && lat >= -60)
            locationString = "South Pacific Ocean";
        }

        if (!locationString) {
          if (lat < -60) locationString = "Southern Ocean";
          else if (lat > 66) locationString = "Arctic Ocean";
          else locationString = `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
        }
      }

      // Cache the result
      setLocationCache((prev) => ({ ...prev, [cacheKey]: locationString }));

      return locationString;

      return `${lat.toFixed(1)}°, ${lon.toFixed(1)}°`;
    } catch (error) {
      console.error("Error fetching location:", error);
      return `${lat.toFixed(1)}°, ${lon.toFixed(1)}°`;
    }
  };

  // Update location name when coordinates change (with debouncing)
  useEffect(() => {
    if (userLocation) {
      const lat = customLat !== null ? customLat : userLocation.latitude;
      const lon = customLon !== null ? customLon : userLocation.longitude;

      // Clear existing timeout
      if (locationTimeoutRef.current) {
        clearTimeout(locationTimeoutRef.current);
      }

      // Debounce API calls - only call after 500ms of no changes
      locationTimeoutRef.current = setTimeout(() => {
        getLocationName(lat, lon).then(setLocationName);
      }, 500);
    }

    return () => {
      if (locationTimeoutRef.current) {
        clearTimeout(locationTimeoutRef.current);
      }
    };
  }, [customLat, customLon, userLocation]);

  // Get display values for sliders
  const displayLat =
    customLat !== null ? customLat : userLocation?.latitude || 0;
  const displayLon =
    customLon !== null ? customLon : userLocation?.longitude || 0;

  // Calculate current time with offset
  const currentTime = new Date(Date.now() + timeOffset * 3600000);
  const timeDisplay = currentTime.toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const handleClick = (e) => {
    if (!interactive) return;
    if (dragRef.current.moved) {
      dragRef.current.moved = false;
      return;
    }

    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Solar system objects (when enabled): treat as first-class clickable targets.
    if (showSolarSystemRef.current) {
      const blend = projectionBlendRef.current;
      const { width: viewportW, height: viewportH } = viewportRef.current;
      const fillRadius = Math.max(viewportW, viewportH) * 0.7;
      const accurateRadius = Math.min(viewportW, viewportH) * 0.48;
      const maxRadius = fillRadius + (accurateRadius - fillRadius) * blend;
      const pxPerDeg = maxRadius / 90;

      const getBodyRadiusPx = (obj) => {
        const angularDiameterDeg =
          obj.name === "Sun" ? 0.533 : obj.name === "Moon" ? 0.518 : null;
        if (!angularDiameterDeg) return obj.radius;
        const visibilityBoost = 6;
        return clamp(
          (angularDiameterDeg / 2) * pxPerDeg * visibilityBoost,
          8,
          18,
        );
      };

      let clickedBody = null;
      for (const obj of solarSystemRef.current) {
        if (!obj.visible) continue;
        const r = getBodyRadiusPx(obj) + 8;
        const dx = x - obj.x;
        const dy = y - obj.y;
        if (dx * dx + dy * dy <= r * r) {
          clickedBody = obj;
          break;
        }
      }

      if (clickedBody) {
        onConstellationClick?.({
          kind: "body",
          key: clickedBody.name,
          name: clickedBody.name,
          anchorClient: { x: e.clientX, y: e.clientY },
        });
        return;
      }
    }

    let clickedConstellation = null;
    for (const constellation of constellationsRef.current) {
      if (isPointInConstellation(x, y, constellation)) {
        clickedConstellation = constellation;
        break;
      }
    }

    if (clickedConstellation) {
      // Pulsing is only a hint; once the user starts interacting, stop it.
      if (pulseEnabledRef.current) {
        pulseEnabledRef.current = false;
        constellationPulseRef.current.activeKey = null;
        constellationPulseRef.current.startAt = -1;
      }

      const visibleSegments = clickedConstellation.connections
        .map(([a, b]) => {
          const s = clickedConstellation.stars[a];
          const t = clickedConstellation.stars[b];
          if (!s || !t || !s.visible || !t.visible) return null;
          return { mx: (s.x + t.x) / 2, my: (s.y + t.y) / 2 };
        })
        .filter(Boolean);

      const visibleStars = clickedConstellation.stars.filter((s) => s.visible);
      const pts =
        visibleSegments.length > 0
          ? visibleSegments
          : visibleStars.length > 0
            ? visibleStars.map((s) => ({ mx: s.x, my: s.y }))
            : clickedConstellation.stars.map((s) => ({ mx: s.x, my: s.y }));

      const anchor = pts.reduce(
        (acc, p) => ({
          x: acc.x + p.mx / pts.length,
          y: acc.y + p.my / pts.length,
        }),
        { x: 0, y: 0 },
      );

      onConstellationClick?.({
        key: clickedConstellation.key,
        name: clickedConstellation.name,
        section: clickedConstellation.section,
        anchorClient: { x: rect.left + anchor.x, y: rect.top + anchor.y },
      });
    }
  };

  return (
    <div className="galaxy-canvas" ref={containerRef}>
      <canvas
        ref={canvasRef}
        className="galaxy-canvas__canvas"
        onMouseMove={handleMouseMove}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleClick}
        style={{
          cursor: interactive
            ? isDragging
              ? "grabbing"
              : hoveredConstellation || hoveredStar || hoveredBody
                ? "pointer"
                : "crosshair"
            : "default",
          pointerEvents: interactive ? "auto" : "none",
        }}
      />

      {/* Controls Panel */}
      {!loading &&
        interactive &&
        (controlsVisible || controlsUnlocked || hasMovedOnce) && (
          <div
            className={
              controlsVisible
                ? "controls-panel is-ready is-open"
                : "controls-panel is-ready"
            }
          >
            {controlsVisible && (
              <div className="controls-content">
                <div className="control-section">
                  <h3>View Controls</h3>

                  <div className="control-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={showAllStars}
                        onChange={(e) => setShowAllStars(e.target.checked)}
                      />
                      Show all star info on hover
                    </label>
                  </div>

                  <div className="control-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={showAllConstellations}
                        onChange={(e) =>
                          setShowAllConstellations(e.target.checked)
                        }
                      />
                      Show all constellation lines
                    </label>
                  </div>

                  <div className="control-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={showSolarSystem}
                        onChange={(e) => setShowSolarSystem(e.target.checked)}
                      />
                      Show Sun, Moon, and planets
                    </label>
                  </div>

                  <div className="control-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={projectionMode === "accurate"}
                        onChange={(e) =>
                          setProjectionMode(
                            e.target.checked ? "accurate" : "fill",
                          )
                        }
                      />
                      Accurate projection (fit full hemisphere)
                    </label>
                  </div>

                  <div className="control-group">
                    <label>Star brightness: {starBrightness.toFixed(2)}×</label>
                    <input
                      type="range"
                      min="0.4"
                      max="2.4"
                      step="0.05"
                      value={starBrightness}
                      onChange={(e) =>
                        setStarBrightness(parseFloat(e.target.value))
                      }
                    />
                  </div>

                  <div className="control-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={showMilkyWay}
                        onChange={(e) => setShowMilkyWay(e.target.checked)}
                      />
                      Milky Way haze (approx)
                    </label>
                  </div>

                  <div className="control-group">
                    <label>Location</label>
                    <div className="location-display">
                      {locationName || "Loading..."}
                    </div>
                    <div style={{ margin: "10px auto", display: "block" }}>
                      <EarthGlobe
                        latitude={displayLat}
                        longitude={displayLon}
                        width={200}
                        height={200}
                        transitionMs={isResetting ? 0 : 1000}
                        onLocationClick={(lat, lon) => {
                          if (resetAnimRef.current) {
                            cancelAnimationFrame(resetAnimRef.current);
                            resetAnimRef.current = null;
                            setIsResetting(false);
                          }
                          setCustomLat(lat);
                          setCustomLon(lon);
                        }}
                      />
                    </div>
                  </div>

                  <div className="control-group">
                    <label>Latitude: {displayLat.toFixed(2)}°</label>
                    <input
                      type="range"
                      min="-90"
                      max="90"
                      step="0.5"
                      value={displayLat}
                      onChange={(e) => setCustomLat(parseFloat(e.target.value))}
                    />
                  </div>

                  <div className="control-group">
                    <label>Longitude: {displayLon.toFixed(2)}°</label>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      step="0.5"
                      value={displayLon}
                      onChange={(e) => setCustomLon(parseFloat(e.target.value))}
                    />
                  </div>

                  <div className="control-group">
                    <label>Time</label>
                    <div className="time-display">{timeDisplay}</div>
                  </div>

                  <div className="control-group">
                    <label>
                      Time Offset: {timeOffsetTarget > 0 ? "+" : ""}
                      {timeOffsetTarget.toFixed(2)}h
                    </label>
                    <input
                      type="range"
                      min="-12"
                      max="12"
                      step="0.1"
                      value={timeOffsetTarget}
                      onChange={(e) =>
                        setTimeOffsetTarget(parseFloat(e.target.value))
                      }
                    />
                  </div>

                  {/**
                   * Manual Inputs (temporarily disabled)
                   *
                   * If you want these back later, we can also polish validation
                   * and add keyboard shortcuts.
                   */}
                  {false && (
                    <div className="control-section">
                      <h3>Manual Inputs</h3>

                      <div className="control-group">
                        <label>Set Coordinates</label>
                        <div
                          style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
                        >
                          <input
                            type="number"
                            step="0.00001"
                            placeholder="Latitude"
                            value={latText}
                            onChange={(e) => setLatText(e.target.value)}
                            style={{ width: 140 }}
                          />
                          <input
                            type="number"
                            step="0.00001"
                            placeholder="Longitude"
                            value={lonText}
                            onChange={(e) => setLonText(e.target.value)}
                            style={{ width: 140 }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const lat = Number.parseFloat(latText);
                              const lon = Number.parseFloat(lonText);
                              if (
                                !Number.isFinite(lat) ||
                                !Number.isFinite(lon)
                              ) {
                                return;
                              }
                              setCustomLat(clamp(lat, -90, 90));
                              setCustomLon(wrapLongitude(lon));
                            }}
                          >
                            Apply
                          </button>
                        </div>
                      </div>

                      <div className="control-group">
                        <label>Search Location</label>
                        <div style={{ display: "flex", gap: 8 }}>
                          <input
                            type="text"
                            placeholder="e.g. Boston, MA"
                            value={locationQuery}
                            onChange={(e) => setLocationQuery(e.target.value)}
                            style={{ flex: 1 }}
                          />
                          <button
                            type="button"
                            onClick={async () => {
                              const q = locationQuery.trim();
                              if (!q) return;
                              setLocationSearchMessage("Searching...");
                              setLocationResults([]);
                              try {
                                const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(q)}`;
                                const res = await fetch(url);
                                if (!res.ok) {
                                  setLocationSearchMessage(
                                    `Search failed: ${res.status}`,
                                  );
                                  return;
                                }
                                const data = await res.json();
                                const results = (
                                  Array.isArray(data) ? data : []
                                )
                                  .map((r) => ({
                                    name: r.display_name,
                                    lat: Number.parseFloat(r.lat),
                                    lon: Number.parseFloat(r.lon),
                                  }))
                                  .filter(
                                    (r) =>
                                      Number.isFinite(r.lat) &&
                                      Number.isFinite(r.lon),
                                  );
                                setLocationResults(results);
                                setLocationSearchMessage(
                                  results.length ? "" : "No results found.",
                                );
                              } catch (err) {
                                console.error(err);
                                setLocationSearchMessage("Search failed.");
                              }
                            }}
                          >
                            Search
                          </button>
                        </div>

                        {locationSearchMessage && (
                          <div style={{ marginTop: 6, opacity: 0.85 }}>
                            {locationSearchMessage}
                          </div>
                        )}

                        {locationResults.length > 0 && (
                          <div
                            style={{ marginTop: 8, display: "grid", gap: 6 }}
                          >
                            {locationResults.map((r, idx) => (
                              <button
                                key={`${r.lat},${r.lon},${idx}`}
                                type="button"
                                style={{ textAlign: "left" }}
                                onClick={() => {
                                  setCustomLat(clamp(r.lat, -90, 90));
                                  setCustomLon(wrapLongitude(r.lon));
                                  setLocationName(r.name);
                                  setLocationResults([]);
                                  setLocationSearchMessage("");
                                }}
                              >
                                {r.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="control-group">
                        <label>Set Date/Time (local)</label>
                        <div
                          style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
                        >
                          <input
                            type="datetime-local"
                            value={dateTimeText}
                            onChange={(e) => setDateTimeText(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const dt = parseDateTimeLocal(dateTimeText);
                              if (!dt) return;
                              const now = new Date();
                              const hours =
                                (dt.getTime() - now.getTime()) / 3600000;
                              setTimeOffsetTarget(clamp(hours, -12, 12));
                            }}
                          >
                            Apply
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const d = new Date();
                              d.setHours(d.getHours() + timeOffset);
                              setDateTimeText(formatDateTimeLocal(d));
                            }}
                          >
                            Use Current
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="controls-actions">
              {hasLocationTimeOverrides && (
                <button
                  type="button"
                  className="controls-toggle controls-reset"
                  onClick={resetView}
                >
                  ↺ Reset
                </button>
              )}
              <button
                type="button"
                className="controls-toggle"
                onClick={() => setControlsVisible(!controlsVisible)}
              >
                {controlsVisible ? "✕" : "⚙️"} Controls
              </button>
            </div>
          </div>
        )}

      {loading && (
        <div className="loading-screen">
          <div className="loading-content">
            <div className="spinner"></div>
            <p>{loadingMessage}</p>
          </div>
        </div>
      )}

      {hoveredStar && (
        <div
          className="star-tooltip"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
          }}
        >
          <div className="star-name">
            {hoveredStar.name || `Star #${hoveredStar.id || "Unknown"}`}
          </div>
          <div className="star-info">
            {hoveredStar.id && `HIP ${hoveredStar.id} • `}
            RA: {hoveredStar.ra.toFixed(2)}h • Dec: {hoveredStar.dec.toFixed(2)}
            ° • Mag: {hoveredStar.mag.toFixed(2)}
            {hoveredStar.constellation && ` • ${hoveredStar.constellation}`}
          </div>
        </div>
      )}

      {hoveredBody && (
        <div
          className="star-tooltip"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
          }}
        >
          <div className="star-name">{hoveredBody.name}</div>
          <div className="star-info">
            Alt: {hoveredBody.altitude.toFixed(1)}° • Az:{" "}
            {hoveredBody.azimuth.toFixed(1)}°
            {hoveredBody.name === "Moon" &&
              Number.isFinite(hoveredBody.phaseFraction) &&
              ` • Phase: ${(hoveredBody.phaseFraction * 100).toFixed(0)}%`}
          </div>
        </div>
      )}

      {hoveredConstellation && !hoveredStar && (
        <div
          className="constellation-tooltip"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
          }}
        >
          {hoveredConstellation.name}
        </div>
      )}
    </div>
  );
};

export default GalaxyCanvas;
