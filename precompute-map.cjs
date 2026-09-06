const fs = require("fs");
const g = JSON.parse(fs.readFileSync("src/data/idn.json", "utf-8"));

function flatten(geo) {
  const out = [];
  function push(c) { out.push([c[0], c[1]]); }
  function walk(t) {
    if (Array.isArray(t[0]) && typeof t[0][0] === "number") { t.forEach(ring => ring.forEach(push)); }
    else t.forEach(walk);
  }
  walk(geo.coordinates);
  return out;
}

const all = g.features.flatMap(f => flatten(f.geometry));
const lngs = all.map(p => p[0]);
const lats = all.map(p => p[1]);
const minL = Math.min(...lngs), maxL = Math.max(...lngs);
const minLa = Math.min(...lats), maxLa = Math.max(...lats);
const m = 0.06;
const W = 680, H = 450;

function px(v) { return m + (v - minL) / (maxL - minL) * (1 - 2 * m); }
function py(v) { return 1 - m - (v - minLa) / (maxLa - minLa) * (1 - 2 * m); }

function toPath(geo) {
  function ring(r) {
    return "M" + r.map(c => `${px(c[0]).toFixed(4)},${py(c[1]).toFixed(4)}`).join("L") + "Z";
  }
  if (geo.type === "Polygon") return geo.coordinates.map(ring).join(" ");
  if (geo.type === "MultiPolygon") return geo.coordinates.flat().map(ring).join(" ");
  return "";
}

const res = { provinces: {} };
for (const f of g.features) {
  const name = f.properties.name.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const pts = flatten(f.geometry);
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  res.provinces[name] = {
    path: toPath(f.geometry),
    cx: +px(cx).toFixed(4),
    cy: +py(cy).toFixed(4),
  };
}

const raw = JSON.stringify(res);
console.log(`${Object.keys(res.provinces).length} provinces, raw: ${(raw.length/1024).toFixed(0)}KB`);

fs.writeFileSync("data/map-precomputed.json", raw);
console.log("saved");