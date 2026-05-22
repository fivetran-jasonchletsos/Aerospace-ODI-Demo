// ============================================================
// Argent Aerospace — Related Parts similarity engine.
//
// Computes top-K nearest-neighbor list for each part using
// weighted Jaccard similarity over five feature dimensions:
//
//   system_family  (weight 1.6) — highest signal
//   ata_chapter    (weight 1.4) — second-highest
//   platforms      (weight 0.9) — fleet platform overlap
//   failure_modes  (weight 0.8) — shared failure signatures
//   supplier_id    (weight 0.4) — same supplier panel
//
// Mirrors what a Cortex embedding pipeline would produce in
// production — the math runs locally so the static site ships
// the part network without a runtime API.
// ============================================================

import { PARTS_CATALOG, SYSTEM_FAMILY_LABEL, ATA_LABEL, type Part } from "../data/parts-catalog";

export const K = 8; // neighbors per part

// ---------------------------------------------------------------------------
// Weights
// ---------------------------------------------------------------------------
const W_SYSTEM_FAMILY = 1.6;
const W_ATA           = 1.4;
const W_PLATFORM      = 0.9;
const W_FAILURE_MODE  = 0.8;
const W_SUPPLIER      = 0.4;

const W_TOTAL = W_SYSTEM_FAMILY + W_ATA + W_PLATFORM + W_FAILURE_MODE + W_SUPPLIER;

// ---------------------------------------------------------------------------
// Output types
// ---------------------------------------------------------------------------
export type RelatedNeighbor = {
  part_no: string;
  part: Part;
  score: number;    // 0..1
  why: string;      // human-readable reason
  sharedFailureModes: string[];
  sharedPlatforms: string[];
};

// ---------------------------------------------------------------------------
// Jaccard
// ---------------------------------------------------------------------------
function jaccard(a: string[], b: string[]): { score: number; shared: string[] } {
  if (a.length === 0 || b.length === 0) return { score: 0, shared: [] };
  const setA = new Set(a);
  const shared = b.filter((x) => setA.has(x));
  const union = new Set([...a, ...b]).size;
  return { score: shared.length / union, shared };
}

// ---------------------------------------------------------------------------
// Pairwise score
// ---------------------------------------------------------------------------
function scorePair(a: Part, b: Part): {
  score: number;
  sharedFailureModes: string[];
  sharedPlatforms: string[];
  sameSystemFamily: boolean;
  sameAta: boolean;
  sameSup: boolean;
} {
  const sysFamily = a.system_family === b.system_family ? 1 : 0;
  const ata       = a.ata_chapter === b.ata_chapter ? 1 : 0;
  const plat      = jaccard(a.platforms, b.platforms);
  const fail      = jaccard(a.failure_modes, b.failure_modes);
  const sup       = a.supplier_id === b.supplier_id ? 1 : 0;

  const raw =
    W_SYSTEM_FAMILY * sysFamily +
    W_ATA           * ata +
    W_PLATFORM      * plat.score +
    W_FAILURE_MODE  * fail.score +
    W_SUPPLIER      * sup;

  return {
    score: raw / W_TOTAL,
    sharedFailureModes: fail.shared,
    sharedPlatforms: plat.shared,
    sameSystemFamily: sysFamily === 1,
    sameAta: ata === 1,
    sameSup: sup === 1,
  };
}

// ---------------------------------------------------------------------------
// "Why related" label
// ---------------------------------------------------------------------------
function whyCopy(
  s: { sharedFailureModes: string[]; sharedPlatforms: string[]; sameSystemFamily: boolean; sameAta: boolean; sameSup: boolean },
  a: Part,
  _b: Part
): string {
  if (s.sameSystemFamily && s.sameAta) {
    const sys = SYSTEM_FAMILY_LABEL[a.system_family] ?? a.system_family;
    return `Same system family and ATA chapter — ${sys}`;
  }
  if (s.sameSystemFamily) {
    const sys = SYSTEM_FAMILY_LABEL[a.system_family] ?? a.system_family;
    return `Same system family — ${sys}`;
  }
  if (s.sameAta) {
    return `Same chapter — ${ATA_LABEL[a.ata_chapter] ?? `ATA ${a.ata_chapter}`}`;
  }
  if (s.sharedFailureModes.length >= 2) {
    const [f1, f2] = s.sharedFailureModes;
    return `Shared failure modes: ${fmt(f1)} and ${fmt(f2)}`;
  }
  if (s.sharedFailureModes.length === 1) {
    return `Shared failure mode: ${fmt(s.sharedFailureModes[0])}`;
  }
  if (s.sharedPlatforms.length > 0) {
    return `Both installed on ${s.sharedPlatforms[0].replace(/_/g, " ")}`;
  }
  if (s.sameSup) return `Same supplier — ${a.supplier_id}`;
  // Cross-system through ATA proximity
  return `Adjacent systems on ${a.platforms[0]?.replace(/_/g, " ") ?? "fleet"}`;
}

function fmt(token: string): string {
  return token.replace(/_/g, " ");
}

// ---------------------------------------------------------------------------
// Top-K cache
// ---------------------------------------------------------------------------
let _cache: Map<string, RelatedNeighbor[]> | null = null;

function build(): Map<string, RelatedNeighbor[]> {
  const catalog = PARTS_CATALOG;
  const result = new Map<string, RelatedNeighbor[]>();

  for (let i = 0; i < catalog.length; i++) {
    const a = catalog[i];
    const scored: RelatedNeighbor[] = [];

    for (let j = 0; j < catalog.length; j++) {
      if (i === j) continue;
      const b = catalog[j];
      const s = scorePair(a, b);
      if (s.score <= 0) continue;
      scored.push({
        part_no: b.part_no,
        part: b,
        score: s.score,
        why: whyCopy(s, a, b),
        sharedFailureModes: s.sharedFailureModes,
        sharedPlatforms: s.sharedPlatforms,
      });
    }

    scored.sort((x, y) => y.score - x.score);
    result.set(a.part_no, scored.slice(0, K));
  }

  return result;
}

export function relatedFor(partNo: string): RelatedNeighbor[] {
  if (!_cache) _cache = build();
  return _cache.get(partNo) ?? [];
}

export function partWithRelated(partNo: string): {
  part: Part;
  neighbors: RelatedNeighbor[];
} | null {
  const part = PARTS_CATALOG.find((p) => p.part_no === partNo);
  if (!part) return null;
  return { part, neighbors: relatedFor(partNo) };
}
