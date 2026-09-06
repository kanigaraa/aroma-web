// Safe to import from both server and client — no Node.js APIs.
// Real map data is loaded server-side only via data/map-precomputed.json.

export type MapProvince = { name: string; path: string };

// Always exported as literals — never computed at import time
export const MAP_W = 680;
export const MAP_H = 450;