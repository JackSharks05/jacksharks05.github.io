import https from "node:https";

console.log("[inspectStellariumIndex] starting...");

const URL =
  "https://raw.githubusercontent.com/Stellarium/stellarium-skycultures/master/western/index.json";

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (
          res.statusCode &&
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          fetchText(res.headers.location).then(resolve).catch(reject);
          return;
        }

        if (res.statusCode !== 200) {
          reject(new Error(`${res.statusCode} ${res.statusMessage} (${url})`));
          return;
        }

        res.setEncoding("utf8");
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

function summarizeValue(v) {
  if (v == null) return String(v);
  if (Array.isArray(v)) return `Array(${v.length})`;
  if (typeof v === "object") return `Object(${Object.keys(v).length} keys)`;
  return `${typeof v}`;
}

const text = await fetchText(URL);
const json = JSON.parse(text);

console.log("Top-level keys:");
console.log(Object.keys(json));

const constellations = Array.isArray(json.constellations)
  ? json.constellations
  : [];
console.log("Constellations:", constellations.length);

const first = constellations[0];
if (first) {
  console.log("\nFirst constellation keys:");
  console.log(
    Object.fromEntries(
      Object.entries(first).map(([k, v]) => [k, summarizeValue(v)]),
    ),
  );
}

const dra = constellations.find((c) => c.id === "Dra" || c.iau === "Dra");
console.log("\nFound Draco:", !!dra);
if (dra) {
  console.log(
    Object.fromEntries(
      Object.entries(dra).map(([k, v]) => [k, summarizeValue(v)]),
    ),
  );
  console.log("\nDraco lines preview:");
  console.dir(dra.lines, { depth: 4, maxArrayLength: 10 });
}
