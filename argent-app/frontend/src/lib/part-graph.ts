// ============================================================
// Argent Aerospace — Part network graph data builder.
// Converts the top-K neighbor lists into a node/edge set
// suitable for the force-directed canvas renderer.
// ============================================================

import { PARTS_CATALOG, SYSTEM_FAMILY_LABEL, type Part } from "../data/parts-catalog";
import { relatedFor, K } from "./related";

export type GraphNode = {
  id: string;          // part_no
  part: Part;
  label: string;       // short label for canvas
  systemFamily: string;
};

export type GraphEdge = {
  source: string;
  target: string;
  score: number;
};

// Build full graph from all parts
export function buildGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = PARTS_CATALOG.map((p) => ({
    id: p.part_no,
    part: p,
    label: p.part_no.length > 20 ? p.part_no.slice(0, 18) + "…" : p.part_no,
    systemFamily: p.system_family,
  }));

  const edgeSet = new Set<string>();
  const edges: GraphEdge[] = [];

  for (const part of PARTS_CATALOG) {
    const neighbors = relatedFor(part.part_no);
    for (const nb of neighbors.slice(0, Math.min(K, 6))) {
      // Undirected: only add each pair once
      const key = [part.part_no, nb.part_no].sort().join("||");
      if (edgeSet.has(key)) continue;
      edgeSet.add(key);
      edges.push({ source: part.part_no, target: nb.part_no, score: nb.score });
    }
  }

  return { nodes, edges };
}

// Color by system family — amber/orange palette with differentiation
const FAMILY_COLORS: Record<string, string> = {
  flight_controls: "#ed8936",
  landing_gear:    "#e53e3e",
  hydraulics:      "#3182ce",
  propulsion:      "#f6ad55",
  avionics:        "#805ad5",
  electrical:      "#38a169",
  pneumatics:      "#00b5d8",
  structure:       "#718096",
  cabin_systems:   "#dd6b20",
  fuel_system:     "#d69e2e",
};

export function systemColor(family: string): string {
  return FAMILY_COLORS[family] ?? "#a0aec0";
}

export { SYSTEM_FAMILY_LABEL };
