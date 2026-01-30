// Astronomical calculations for accurate star positioning

/**
 * Convert Right Ascension and Declination to Altitude and Azimuth
 * @param {number} ra - Right Ascension in hours (0-24)
 * @param {number} dec - Declination in degrees (-90 to 90)
 * @param {number} lat - Observer's latitude in degrees
 * @param {number} lon - Observer's longitude in degrees
 * @param {Date} date - Observation time
 * @returns {object} - {altitude, azimuth, visible}
 */
export function equatorialToHorizontal(ra, dec, lat, lon, date) {
  // Convert to radians
  const raRad = (ra * 15 * Math.PI) / 180; // RA hours to degrees to radians
  const decRad = (dec * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;

  // Calculate Local Sidereal Time
  const lst = calculateLocalSiderealTime(lon, date);
  const lstRad = (lst * Math.PI) / 180;

  // Calculate Hour Angle
  const ha = lstRad - raRad;

  // Convert to Horizontal coordinates
  // Use an atan2-based formulation to avoid the polar singularity when cos(lat)=0.
  const sinDec = Math.sin(decRad);
  const cosDec = Math.cos(decRad);
  const sinLat = Math.sin(latRad);
  const cosLat = Math.cos(latRad);
  const sinHa = Math.sin(ha);
  const cosHa = Math.cos(ha);

  let sinAlt = sinDec * sinLat + cosDec * cosLat * cosHa;
  sinAlt = Math.max(-1, Math.min(1, sinAlt));
  const altitudeRad = Math.asin(sinAlt);
  const altitude = (altitudeRad * 180) / Math.PI;

  // North-based azimuth (0°=North, 90°=East)
  const x = cosDec * sinHa;
  const y = sinDec * cosLat - cosDec * cosHa * sinLat;
  let azimuth = (Math.atan2(x, y) * 180) / Math.PI;
  azimuth = (azimuth + 360) % 360;

  // Star is visible if altitude > 0
  const visible = altitude > 0;

  return { altitude, azimuth, visible };
}

/**
 * Calculate Local Sidereal Time
 * @param {number} lon - Observer's longitude in degrees
 * @param {Date} date - Observation time
 * @returns {number} - Local Sidereal Time in degrees
 */
export function calculateLocalSiderealTime(lon, date) {
  const jd = dateToJulianDate(date);
  const T = (jd - 2451545.0) / 36525.0;

  // Greenwich Sidereal Time at 0h UT
  let gst =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    T * T * (0.000387933 - T / 38710000.0);

  // Add time of day
  const hours =
    date.getUTCHours() +
    date.getUTCMinutes() / 60.0 +
    date.getUTCSeconds() / 3600.0;
  gst += hours * 15.0;

  // Normalize to 0-360
  gst = gst % 360;
  if (gst < 0) gst += 360;

  // Convert to Local Sidereal Time
  const lst = gst + lon;

  return lst % 360;
}

/**
 * Convert Date to Julian Date
 * @param {Date} date
 * @returns {number} - Julian Date
 */
export function dateToJulianDate(date) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();

  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;

  let jdn =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  let jd = jdn + (hours - 12) / 24 + minutes / 1440 + seconds / 86400;

  return jd;
}

/**
 * Convert Horizontal coordinates to screen coordinates
 * @param {number} altitude - in degrees (0-90)
 * @param {number} azimuth - in degrees (0-360)
 * @param {number} width - canvas width
 * @param {number} height - canvas height
 * @returns {object} - {x, y, visible}
 */
export function horizontalToScreen(
  altitude,
  azimuth,
  width,
  height,
  options = {},
) {
  if (altitude < 0) {
    return { x: 0, y: 0, visible: false };
  }

  // Use a zoomed-in orthographic-like projection that fills the screen
  // Map the visible hemisphere to fill the entire canvas
  const centerX = width / 2;
  const centerY = height / 2;

  const mode = options.mode || "fill"; // 'fill' (default) | 'accurate'
  const hasBlend = Number.isFinite(options.blend);
  const blend = hasBlend ? Math.max(0, Math.min(1, options.blend)) : null;

  // 'fill' intentionally zooms in to use more of the canvas.
  // 'accurate' fits the whole hemisphere inside the canvas to avoid cropping.
  const fillRadius = Math.max(width, height) * 0.7;
  const accurateRadius = Math.min(width, height) * 0.48;
  const maxRadius =
    blend !== null
      ? fillRadius + (accurateRadius - fillRadius) * blend
      : mode === "accurate"
        ? accurateRadius
        : fillRadius;
  const r = maxRadius * (1 - altitude / 90);

  // Convert azimuth to angle (0° = North = top, 90° = East = right)
  const angleRad = ((azimuth - 90) * Math.PI) / 180;

  // Standard screen mapping: East on the right.
  const x = centerX + r * Math.cos(angleRad);
  const y = centerY + r * Math.sin(angleRad);

  return { x, y, visible: true };
}

/**
 * Get user's location via IP geolocation
 * @returns {Promise<object>} - {latitude, longitude, city}
 */
export async function getUserLocation() {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    return {
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city,
    };
  } catch (error) {
    console.log("Could not get location, using default");
    // Default to Greenwich
    return {
      latitude: 51.4779,
      longitude: 0,
      city: "Default",
    };
  }
}
