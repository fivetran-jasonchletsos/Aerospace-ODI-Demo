import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildGraph, systemColor, type GraphNode, type GraphEdge } from "../lib/part-graph";
import { relatedFor } from "../lib/related";
import { ATA_LABEL, SYSTEM_FAMILY_LABEL, PLATFORM_LABEL } from "../data/parts-catalog";
import PageHeader from "../components/PageHeader";

// ---------------------------------------------------------------------------
// Force simulation
// ---------------------------------------------------------------------------
type Vec2 = { x: number; y: number };

function runSimulation(
  nodes: GraphNode[],
  edges: GraphEdge[],
  width: number,
  height: number,
  onTick: (positions: Vec2[], alpha: number) => void,
  onDone: (positions: Vec2[]) => void
) {
  const n = nodes.length;
  const pos: Vec2[] = nodes.map(() => ({
    x: width / 2 + (Math.random() - 0.5) * Math.min(width, height) * 0.55,
    y: height / 2 + (Math.random() - 0.5) * Math.min(width, height) * 0.55,
  }));
  const vel: Vec2[] = nodes.map(() => ({ x: 0, y: 0 }));

  const idToIdx = new Map(nodes.map((nd, i) => [nd.id, i]));
  type AdjEntry = { target: number; score: number };
  const adjMap = new Map<string, AdjEntry[]>();
  for (const e of edges) {
    const si = idToIdx.get(e.source);
    const ti = idToIdx.get(e.target);
    if (si == null || ti == null) continue;
    if (!adjMap.has(e.source)) adjMap.set(e.source, []);
    if (!adjMap.has(e.target)) adjMap.set(e.target, []);
    adjMap.get(e.source)!.push({ target: ti, score: e.score });
    adjMap.get(e.target)!.push({ target: si, score: e.score });
  }

  const REPEL   = 4000;
  const SPRING  = 0.035;
  const REST    = 120;
  const CENTER  = 0.006;
  const DAMP    = 0.80;

  let alpha = 1.0;
  let frame = 0;
  let rafId: number;

  function tick() {
    alpha *= 0.993;
    const cx = width / 2;
    const cy = height / 2;

    for (let i = 0; i < n; i++) {
      let fx = 0;
      let fy = 0;

      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const dx = pos[i].x - pos[j].x;
        const dy = pos[i].y - pos[j].y;
        const dist2 = dx * dx + dy * dy + 1;
        const dist = Math.sqrt(dist2);
        const str = REPEL / dist2;
        fx += (dx / dist) * str;
        fy += (dy / dist) * str;
      }

      const nbrs = adjMap.get(nodes[i].id) ?? [];
      for (const { target: j, score } of nbrs) {
        const dx = pos[j].x - pos[i].x;
        const dy = pos[j].y - pos[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy) + 0.01;
        const stretch = dist - REST * (1 - score * 0.35);
        fx += (dx / dist) * SPRING * stretch;
        fy += (dy / dist) * SPRING * stretch;
      }

      fx += (cx - pos[i].x) * CENTER;
      fy += (cy - pos[i].y) * CENTER;

      vel[i].x = (vel[i].x + fx * alpha) * DAMP;
      vel[i].y = (vel[i].y + fy * alpha) * DAMP;
      pos[i].x = Math.max(22, Math.min(width  - 22, pos[i].x + vel[i].x));
      pos[i].y = Math.max(22, Math.min(height - 22, pos[i].y + vel[i].y));
    }

    frame++;
    if (frame % 4 === 0) onTick([...pos.map((p) => ({ ...p }))], alpha);
    if (alpha > 0.01 && frame < 700) {
      rafId = requestAnimationFrame(tick);
    } else {
      onDone([...pos.map((p) => ({ ...p }))]);
    }
  }

  rafId = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(rafId);
}

// ---------------------------------------------------------------------------
// Canvas draw
// ---------------------------------------------------------------------------
const NODE_R     = 7;
const NODE_R_SEL = 12;
const NODE_R_HOV = 10;

function drawGraph(
  ctx: CanvasRenderingContext2D,
  nodes: GraphNode[],
  edges: GraphEdge[],
  positions: Vec2[],
  idToIdx: Map<string, number>,
  selectedId: string | null,
  hoveredId:  string | null
) {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#0a1628";
  ctx.fillRect(0, 0, W, H);

  // Edges
  for (const e of edges) {
    const si = idToIdx.get(e.source);
    const ti = idToIdx.get(e.target);
    if (si == null || ti == null) continue;
    const sp = positions[si];
    const tp = positions[ti];
    if (!sp || !tp) continue;
    const highlighted =
      e.source === selectedId || e.target === selectedId ||
      e.source === hoveredId  || e.target === hoveredId;

    ctx.beginPath();
    ctx.moveTo(sp.x, sp.y);
    ctx.lineTo(tp.x, tp.y);
    if (highlighted) {
      ctx.strokeStyle = `rgba(237,137,54,${0.25 + e.score * 0.45})`;
      ctx.lineWidth = 1 + e.score * 1.8;
    } else {
      ctx.strokeStyle = `rgba(180,196,208,${0.03 + e.score * 0.07})`;
      ctx.lineWidth = 0.4 + e.score * 0.9;
    }
    ctx.stroke();
  }

  // Nodes — normal first, special on top
  const special = new Set([selectedId, hoveredId].filter(Boolean));

  const drawNode = (node: GraphNode, i: number) => {
    const p = positions[i];
    if (!p) return;
    const isSel = node.id === selectedId;
    const isHov = node.id === hoveredId;
    const r = isSel ? NODE_R_SEL : isHov ? NODE_R_HOV : NODE_R;
    const color = systemColor(node.systemFamily);

    if (isSel) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, r + 9, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(237,137,54,0.15)";
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.strokeStyle = isSel
      ? "#ed8936"
      : isHov
      ? "rgba(212,221,232,0.8)"
      : `rgba(180,196,208,0.2)`;
    ctx.lineWidth = isSel ? 2 : 1;
    ctx.stroke();

    if (isSel || isHov) {
      const raw = node.part.description;
      const label = raw.length > 32 ? raw.slice(0, 30) + "…" : raw;
      ctx.font = `600 10px 'JetBrains Mono', monospace`;
      ctx.fillStyle = isSel ? "#ed8936" : "#d4dde8";
      ctx.textAlign = "center";
      ctx.fillText(label, p.x, p.y + r + 14);
      ctx.font = `9px 'JetBrains Mono', monospace`;
      ctx.fillStyle = "rgba(180,196,208,0.55)";
      ctx.fillText(node.part.part_no, p.x, p.y + r + 26);
    }
  };

  nodes.forEach((nd, i) => { if (!special.has(nd.id)) drawNode(nd, i); });
  nodes.forEach((nd, i) => { if (special.has(nd.id)) drawNode(nd, i); });
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function RelatedPage() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const posRef     = useRef<Vec2[]>([]);
  const rafRef     = useRef<number>(0);
  const dragging   = useRef<{ sx: number; sy: number; tx: number; ty: number } | null>(null);

  const [positions,   setPositions]   = useState<Vec2[]>([]);
  const [simDone,     setSimDone]     = useState(false);
  const [selectedId,  setSelectedId]  = useState<string | null>(null);
  const [hoveredId,   setHoveredId]   = useState<string | null>(null);
  const [transform,   setTransform]   = useState({ x: 0, y: 0, scale: 1 });
  const [size,        setSize]        = useState({ w: 900, h: 620 });
  const navigate = useNavigate();

  const { nodes, edges } = useMemo(() => buildGraph(), []);
  const idToIdx = useMemo(() => new Map(nodes.map((n, i) => [n.id, i])), [nodes]);

  // Responsive canvas size
  useEffect(() => {
    function measure() {
      const el = canvasRef.current?.parentElement;
      if (el) setSize({ w: el.clientWidth, h: Math.min(el.clientWidth * 0.7, 640) });
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Run simulation
  useEffect(() => {
    if (size.w < 100) return;
    setSimDone(false);
    const stop = runSimulation(
      nodes, edges, size.w, size.h,
      (pos) => { posRef.current = pos; setPositions([...pos]); },
      (pos) => { posRef.current = pos; setPositions([...pos]); setSimDone(true); }
    );
    return stop;
  }, [nodes, edges, size.w, size.h]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || posRef.current.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;

    canvas.width  = size.w * dpr;
    canvas.height = size.h * dpr;
    canvas.style.width  = `${size.w}px`;
    canvas.style.height = `${size.h}px`;
    ctx.scale(dpr, dpr);

    cancelAnimationFrame(rafRef.current);

    function frame() {
      if (!ctx) return;
      const logW = canvas!.width  / dpr;
      const logH = canvas!.height / dpr;
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#0a1628";
      ctx.fillRect(0, 0, logW, logH);
      ctx.translate(transform.x + logW / 2, transform.y + logH / 2);
      ctx.scale(transform.scale, transform.scale);
      ctx.translate(-logW / 2, -logH / 2);
      drawGraph(ctx, nodes, edges, posRef.current, idToIdx, selectedId, hoveredId);
      ctx.restore();
      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [positions, selectedId, hoveredId, transform, size, nodes, edges, idToIdx]);

  // Canvas-space conversion
  function toCanvas(cx: number, cy: number): Vec2 {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const lx = cx - rect.left;
    const ly = cy - rect.top;
    const halfW = size.w / 2;
    const halfH = size.h / 2;
    return {
      x: (lx - halfW - transform.x) / transform.scale + halfW,
      y: (ly - halfH - transform.y) / transform.scale + halfH,
    };
  }

  function nearestNode(cx: number, cy: number): GraphNode | null {
    let best: GraphNode | null = null;
    let bestDist = 22;
    posRef.current.forEach((p, i) => {
      if (!p) return;
      const d = Math.hypot(p.x - cx, p.y - cy);
      if (d < bestDist) { bestDist = d; best = nodes[i]; }
    });
    return best;
  }

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (dragging.current) {
      const dx = e.clientX - dragging.current.sx;
      const dy = e.clientY - dragging.current.sy;
      setTransform((t) => ({ ...t, x: dragging.current!.tx + dx, y: dragging.current!.ty + dy }));
      return;
    }
    const { x, y } = toCanvas(e.clientX, e.clientY);
    const node = nearestNode(x, y);
    setHoveredId(node?.id ?? null);
    (e.currentTarget as HTMLCanvasElement).style.cursor = node ? "pointer" : "grab";
  }, [transform, size]); // eslint-disable-line react-hooks/exhaustive-deps

  function onMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    dragging.current = { sx: e.clientX, sy: e.clientY, tx: transform.x, ty: transform.y };
  }

  function onMouseUp(e: React.MouseEvent<HTMLCanvasElement>) {
    const moved = dragging.current
      ? Math.hypot(e.clientX - dragging.current.sx, e.clientY - dragging.current.sy) > 4
      : false;
    dragging.current = null;
    if (!moved) {
      const { x, y } = toCanvas(e.clientX, e.clientY);
      const node = nearestNode(x, y);
      setSelectedId(node?.id ?? null);
    }
  }

  function onWheel(e: React.WheelEvent<HTMLCanvasElement>) {
    e.preventDefault();
    const f = e.deltaY < 0 ? 1.1 : 0.9;
    setTransform((t) => ({ ...t, scale: Math.max(0.25, Math.min(5, t.scale * f)) }));
  }

  const selected  = selectedId ? nodes.find((n) => n.id === selectedId) : null;
  const neighbors = selectedId ? relatedFor(selectedId) : [];

  // Color legend entries
  const legendEntries = [
    ["flight_controls", "Flight Controls"],
    ["landing_gear",    "Landing Gear"],
    ["hydraulics",      "Hydraulics"],
    ["propulsion",      "Propulsion"],
    ["avionics",        "Avionics"],
    ["electrical",      "Electrical"],
    ["pneumatics",      "Pneumatics / ECS"],
    ["structure",       "Structures"],
    ["cabin_systems",   "Cabin Systems"],
    ["fuel_system",     "Fuel System"],
  ] as const;

  return (
    <>
      <PageHeader
        eyebrow="Parts Network · Similarity Graph"
        title="Related parts and failure-mode network"
        blurb="Force-directed graph of the Argent parts catalog. Edges connect parts with overlapping ATA chapter, system family, platform, failure-mode signature, and supplier. Stronger edges reflect higher composite similarity. Click any node to explore its nearest neighbors."
        callout="REV. A · SHEET 09 OF 08"
      />

      <div className="flex flex-col lg:flex-row border-b border-[var(--hairline-navy)]">
        {/* Canvas area */}
        <div className="flex-1 min-w-0 relative" style={{ background: "#0a1628", minHeight: `${size.h}px` }}>
          <canvas
            ref={canvasRef}
            onMouseMove={onMouseMove}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseLeave={() => { setHoveredId(null); dragging.current = null; }}
            onWheel={onWheel}
            style={{ display: "block", cursor: "grab", userSelect: "none" }}
          />

          {!simDone && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="mono text-[11px] uppercase tracking-[0.3em] text-[var(--silver-accent)] opacity-60 animate-pulse">
                Calculating similarity graph…
              </p>
            </div>
          )}

          {/* Status bar */}
          <div className="absolute top-3 left-4 mono text-[9px] uppercase tracking-[0.2em] text-[var(--silver-dim)]">
            {nodes.length} parts · {edges.length} similarity edges · {simDone ? "settled" : "settling…"}
          </div>

          {/* Controls hint */}
          <div className="absolute top-3 right-4 mono text-[9px] uppercase tracking-[0.2em] text-[var(--silver-dim)] text-right">
            Drag to pan · scroll to zoom · click any part
          </div>

          {/* Legend */}
          <div className="absolute bottom-3 left-4 flex flex-wrap gap-x-3 gap-y-1 max-w-sm">
            {legendEntries.map(([family, label]) => (
              <span key={family} className="flex items-center gap-1">
                <span
                  className="inline-block rounded-full"
                  style={{ width: 7, height: 7, background: systemColor(family) }}
                />
                <span className="mono text-[9px] uppercase tracking-[0.15em]" style={{ color: "rgba(180,196,208,0.5)" }}>
                  {label}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Side panel */}
        <aside
          className="w-full lg:w-80 flex-none overflow-y-auto border-t lg:border-t-0 lg:border-l border-[var(--hairline-navy)] bg-white"
          style={{ maxHeight: `${size.h + 80}px` }}
        >
          {selected ? (
            <div className="p-5">
              {/* Part header */}
              <div className="mb-1 eyebrow">{SYSTEM_FAMILY_LABEL[selected.part.system_family] ?? selected.part.system_family}</div>
              <h2 className="font-serif text-base font-semibold text-[var(--ink-strong)] leading-snug">
                {selected.part.description}
              </h2>
              <div className="mono text-[10px] text-[var(--ink-soft)] mt-1 tracking-wide">
                {selected.part.part_no}
              </div>

              {/* Attributes */}
              <div className="mt-4 space-y-2 text-sm">
                <AttrRow label="ATA chapter" value={ATA_LABEL[selected.part.ata_chapter] ?? `ATA ${selected.part.ata_chapter}`} />
                <AttrRow label="Platforms" value={selected.part.platforms.map((p) => PLATFORM_LABEL[p] ?? p).join(", ")} />
                <AttrRow label="Segment" value={selected.part.segment} />
                <AttrRow label="Supplier" value={selected.part.supplier_id} />
              </div>

              {/* Failure modes */}
              <div className="mt-4">
                <div className="mono text-[9px] uppercase tracking-[0.25em] text-[var(--ink-soft)] mb-1.5">
                  Failure modes
                </div>
                <div className="flex flex-wrap gap-1">
                  {selected.part.failure_modes.map((fm) => (
                    <span key={fm} className="mono text-[9px] px-1.5 py-0.5 border border-[var(--hairline-navy)] text-[var(--ink-muted)] rounded-sm">
                      {fm.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </div>

              {/* Neighbors */}
              <div className="mt-5 border-t border-[var(--hairline)] pt-4">
                <div className="mono text-[9px] uppercase tracking-[0.3em] text-[var(--ink-soft)] mb-2">
                  Related parts — top {neighbors.length}
                </div>
                <ol className="space-y-1">
                  {neighbors.map((nb) => (
                    <li key={nb.part_no}>
                      <button
                        onClick={() => setSelectedId(nb.part_no)}
                        className="w-full text-left px-2 py-2 border-l-2 border-[var(--hairline-navy)] hover:border-[var(--orange)] hover:bg-[var(--orange-bg)] transition-colors"
                      >
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="font-serif text-sm text-[var(--ink-strong)] truncate leading-tight">
                            {nb.part.description}
                          </span>
                          <span className="mono text-[9px] text-[var(--orange-dim)] flex-none">
                            {Math.round(nb.score * 100)}%
                          </span>
                        </div>
                        <div className="mono text-[9px] text-[var(--ink-soft)] truncate mt-0.5">
                          {nb.part_no}
                        </div>
                        <div className="mono text-[9px] text-[var(--ink-muted)] truncate mt-0.5">
                          {nb.why}
                        </div>
                        {nb.sharedFailureModes.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {nb.sharedFailureModes.map((fm) => (
                              <span key={fm} className="mono text-[8px] px-1 py-0.5 bg-[var(--red-bg)] border border-[var(--red)]/20 text-[var(--red)] rounded-sm">
                                {fm.replace(/_/g, " ")}
                              </span>
                            ))}
                          </div>
                        )}
                      </button>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Jump to supply chain */}
              <div className="mt-5 border-t border-[var(--hairline)] pt-4">
                <button
                  onClick={() => navigate("/supply-chain")}
                  className="mono text-[9px] uppercase tracking-[0.25em] text-[var(--orange-dim)] border border-[var(--orange)]/40 px-3 py-1.5 hover:bg-[var(--orange-bg)] transition-colors"
                >
                  View supply chain risk
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5 flex flex-col gap-3">
              <div className="mono text-[9px] uppercase tracking-[0.3em] text-[var(--ink-soft)]">
                Click any node to explore
              </div>
              <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                Each node is a part or assembly in the Argent catalog. Edges connect parts that share
                ATA chapter, system family, fleet platform, failure-mode signatures, or supplier panel
                membership. Clusters reflect natural system boundaries — flight controls in one region,
                structures in another, avionics bridging across.
              </p>
              <p className="mono text-[9px] uppercase tracking-[0.2em] text-[var(--ink-soft)] mt-1">
                {nodes.length} parts · {edges.length} connections
              </p>
              <div className="mt-3 border-t border-[var(--hairline)] pt-3 text-[11px] text-[var(--ink-soft)] leading-relaxed">
                Similarity computed from weighted Jaccard overlap.
                System family and ATA chapter carry the highest weight.
                Platform and failure-mode signature follow.
                Supplier panel membership is a tiebreaker.
              </div>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}

function AttrRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="mono text-[9px] uppercase tracking-[0.18em] text-[var(--ink-soft)] w-24 flex-none">{label}</span>
      <span className="text-[var(--ink-muted)] text-xs">{value}</span>
    </div>
  );
}
