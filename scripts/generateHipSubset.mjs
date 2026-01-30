import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import readline from "node:readline";

import { constellationLines } from "../src/data/constellationLines.js";

const ROOT = path.resolve(process.cwd());

const CSV_URL =
  "https://raw.githubusercontent.com/astronexus/HYG-Database/main/hyg/CURRENT/hygdata_v41.csv";
const CACHE_DIR = path.join(ROOT, "scripts", ".cache");
const CSV_PATH = path.join(CACHE_DIR, "hyg_v41.csv");
const OUT_PATH = path.join(ROOT, "src", "data", "hipStars.generated.js");

function collectHipIdsFromLines() {
  const hipIds = new Set();
  for (const pairs of Object.values(constellationLines)) {
    for (const [a, b] of pairs) {
      if (Number.isFinite(a)) hipIds.add(a);
      if (Number.isFinite(b)) hipIds.add(b);
    }
  }
  return hipIds;
}

function parseCsvLine(line) {
  // Minimal CSV parser supporting quoted fields.
  const fields = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (inQuotes) {
      if (ch === '"') {
        // Escaped quote
        if (line[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else {
      if (ch === ",") {
        fields.push(field);
        field = "";
      } else if (ch === '"') {
        inQuotes = true;
      } else {
        field += ch;
      }
    }
  }

  fields.push(field);
  return fields;
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });

    const tmpPath = `${destPath}.tmp`;
    const file = fs.createWriteStream(tmpPath);

    https
      .get(url, (res) => {
        if (
          res.statusCode &&
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          // Follow redirect
          file.close();
          fs.rmSync(tmpPath, { force: true });
          downloadFile(res.headers.location, destPath)
            .then(resolve)
            .catch(reject);
          return;
        }

        if (res.statusCode !== 200) {
          file.close();
          fs.rmSync(tmpPath, { force: true });
          reject(
            new Error(
              `Failed to download CSV: ${res.statusCode} ${res.statusMessage}`,
            ),
          );
          return;
        }

        res.pipe(file);
        file.on("finish", () => {
          file.close(() => {
            fs.renameSync(tmpPath, destPath);
            resolve();
          });
        });
      })
      .on("error", (err) => {
        file.close();
        fs.rmSync(tmpPath, { force: true });
        reject(err);
      });
  });
}

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
          reject(
            new Error(
              `Failed to fetch: ${res.statusCode} ${res.statusMessage} (${url})`,
            ),
          );
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

async function fetchHipFromVizier(hip) {
  // VizieR Hipparcos main catalog (I/239/hip_main)
  // Use RAhms/DEdms because some entries have blank RAICRS/DEICRS.
  const url =
    "https://vizier.cds.unistra.fr/viz-bin/asu-tsv" +
    `?-source=I/239/hip_main&-out=HIP&-out=RAhms&-out=DEdms&-out=Vmag&HIP=${encodeURIComponent(
      hip,
    )}`;

  const text = await fetchText(url);
  const lines = text
    .split("\n")
    .map((l) => l.trimEnd())
    .filter((l) => l && !l.startsWith("#"));

  if (lines.length < 2) {
    return null;
  }

  const dataLine = lines.find((l) => l.trimStart().startsWith(String(hip)));
  if (!dataLine) {
    return null;
  }

  const row = dataLine.split("\t");
  const hipStr = row[0];
  const raHms = (row[1] || "").trim();
  const decDms = (row[2] || "").trim();
  const vmag = Number.parseFloat(row[3]);

  const hipNum = Number.parseInt(hipStr, 10);
  if (!Number.isFinite(hipNum) || hipNum !== hip) return null;
  if (!raHms || !decDms || !Number.isFinite(vmag)) return null;

  const [hh, hm, hs] = raHms.split(/\s+/).map((v) => Number.parseFloat(v));
  const ra = hh + hm / 60 + hs / 3600;

  const decParts = decDms.split(/\s+/);
  const decSign = decParts[0]?.startsWith("-") ? -1 : 1;
  const dd = Math.abs(Number.parseFloat(decParts[0]));
  const dm = Number.parseFloat(decParts[1]);
  const ds = Number.parseFloat(decParts[2]);
  const dec = decSign * (dd + dm / 60 + ds / 3600);

  if (!Number.isFinite(ra) || !Number.isFinite(dec)) return null;

  return {
    hip,
    name: "",
    ra,
    dec,
    mag: vmag,
    con: "",
  };
}

async function ensureCsv() {
  if (fs.existsSync(CSV_PATH) && fs.statSync(CSV_PATH).size > 1_000_000) {
    return;
  }

  console.log(
    `Downloading HYG catalog to ${path.relative(ROOT, CSV_PATH)} ...`,
  );
  await downloadFile(CSV_URL, CSV_PATH);
}

async function extractHipStars(csvPath, hipIds) {
  const input = fs.createReadStream(csvPath, { encoding: "utf8" });
  const rl = readline.createInterface({ input, crlfDelay: Infinity });

  let header = null;
  let indices = null;

  const found = new Map();

  for await (const line of rl) {
    if (!header) {
      header = parseCsvLine(line);
      const idx = (name) => header.indexOf(name);
      indices = {
        hip: idx("hip"),
        ra: idx("ra"),
        dec: idx("dec"),
        mag: idx("mag"),
        proper: idx("proper"),
        con: idx("con"),
      };

      for (const [k, v] of Object.entries(indices)) {
        if (v === -1) {
          throw new Error(`Missing required column '${k}' in HYG CSV`);
        }
      }

      continue;
    }

    const cols = parseCsvLine(line);
    const hipRaw = cols[indices.hip];
    if (!hipRaw) continue;

    const hip = Number.parseInt(hipRaw, 10);
    if (!Number.isFinite(hip) || !hipIds.has(hip)) continue;

    const ra = Number.parseFloat(cols[indices.ra]);
    const dec = Number.parseFloat(cols[indices.dec]);
    const mag = Number.parseFloat(cols[indices.mag]);
    const proper = cols[indices.proper] || "";
    const con = cols[indices.con] || "";

    if (
      !Number.isFinite(ra) ||
      !Number.isFinite(dec) ||
      !Number.isFinite(mag)
    ) {
      continue;
    }

    found.set(hip, {
      hip,
      name: proper,
      ra,
      dec,
      mag,
      con,
    });

    if (found.size === hipIds.size) {
      break;
    }
  }

  return found;
}

function writeModule(outPath, hipStarMap) {
  const entries = [...hipStarMap.entries()].sort((a, b) => a[0] - b[0]);

  const lines = [];
  lines.push(
    "/* eslint-disable */\n" +
      "// Auto-generated file. Do not edit by hand.\n" +
      "//\n" +
      "// Source data: HYG Database (astronexus) — CC BY-SA 4.0\n" +
      "// https://github.com/astronexus/hyg-database\n" +
      "// This file contains a minimal subset: only HIP IDs referenced by src/data/constellationLines.js\n" +
      "\n" +
      "export const hipStars = {",
  );

  for (const [hip, s] of entries) {
    const safeName = JSON.stringify(s.name || "");
    lines.push(
      `  ${hip}: { hip: ${hip}, name: ${safeName}, ra: ${s.ra}, dec: ${s.dec}, mag: ${s.mag}, con: ${JSON.stringify(s.con || "")} },`,
    );
  }

  lines.push("};\n");

  fs.writeFileSync(outPath, lines.join("\n"), "utf8");
}

async function main() {
  const hipIds = collectHipIdsFromLines();
  console.log(`Need ${hipIds.size} HIP stars from constellation lines.`);

  await ensureCsv();

  console.log("Extracting subset from CSV...");
  const found = await extractHipStars(CSV_PATH, hipIds);

  let missing = [...hipIds].filter((id) => !found.has(id));

  if (missing.length) {
    console.log(`Missing ${missing.length} HIP IDs in HYG; trying VizieR...`);
    for (const hip of missing) {
      try {
        const recovered = await fetchHipFromVizier(hip);
        if (recovered) {
          found.set(hip, recovered);
        }
      } catch {
        // ignore; we'll report remaining missing
      }
    }

    missing = [...hipIds].filter((id) => !found.has(id));
  }

  writeModule(OUT_PATH, found);

  console.log(
    `Wrote ${found.size} stars to ${path.relative(ROOT, OUT_PATH)}.` +
      (missing.length ? ` Missing ${missing.length} HIP IDs.` : ""),
  );

  if (missing.length) {
    console.log(
      `Missing HIP IDs (first 50): ${missing.slice(0, 50).join(", ")}`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
