// ============================================================
// Argent — API helpers reading Iceberg gold layer landed by Fivetran
// from the Snowflake + Iceberg gold layer.
// ============================================================

import type {
  SummaryStats,
  Program,
  Site,
  MROWorkPackage,
  MROBay,
  FleetAircraft,
  Supplier,
  ShortageAlert,
  DefenseAward,
  QualityMetric,
  IcebergTable,
  PipelineLayerStats,
  PipelineConnector,
  DataSource,
} from '../types';

export type { DataSource };

let lastSource: DataSource = 'demo';
let snapshotGeneratedAt: string | null = null;
const listeners = new Set<(s: DataSource) => void>();

function setSource(s: DataSource) {
  if (s === lastSource) return;
  lastSource = s;
  listeners.forEach((l) => l(s));
}

export function subscribeSource(fn: (s: DataSource) => void): () => void {
  listeners.add(fn);
  fn(lastSource);
  return () => listeners.delete(fn);
}

export function getSnapshotTime(): string | null {
  return snapshotGeneratedAt;
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  return (await res.json()) as T;
}

let summaryCache: SummaryStats | null = null;
let programsCache: Program[] | null = null;
let productionCache: { sites: Site[]; generated_at?: string } | null = null;
let mroCache: { bays: MROBay[]; work_packages: MROWorkPackage[]; due_for_check: FleetAircraft[]; turnaround_by_airframe: { airframe: string; days_avg: number; trend: number[] }[] } | null = null;
let supplyChainCache: { suppliers: Supplier[]; shortages: ShortageAlert[]; tariff_exposure_usd_by_country: { country: string; usd: number }[] } | null = null;
let defenseCache: { awards: DefenseAward[]; compliance: { control: string; status: string; note: string }[]; cmmc_level: number } | null = null;
let qualityCache: { metrics: QualityMetric[]; site_rollup: { escape_rate_ppm: number; scar_open: number; scar_overdue: number; faa_events_ytd: number }; trend: { month: string; escape_rate_ppm: number }[] } | null = null;
let icebergCache: IcebergTable[] | null = null;
let pipelineCache: { layers: PipelineLayerStats[]; connectors: PipelineConnector[] } | null = null;

export const api = {
  async getSummary(): Promise<SummaryStats> {
    if (summaryCache) return summaryCache;
    const data = await fetchJson<SummaryStats>('/data/summary.json');
    if (data.generated_at) snapshotGeneratedAt = data.generated_at;
    if (data.source) setSource(data.source);
    summaryCache = data;
    return data;
  },
  async getPrograms(): Promise<Program[]> {
    if (programsCache) return programsCache;
    const raw = await fetchJson<{ programs: Program[] }>('/data/programs.json');
    programsCache = raw.programs;
    return raw.programs;
  },
  async getProduction(): Promise<{ sites: Site[]; generated_at?: string }> {
    if (productionCache) return productionCache;
    productionCache = await fetchJson('/data/production.json');
    return productionCache!;
  },
  async getMRO() {
    if (mroCache) return mroCache;
    mroCache = await fetchJson('/data/mro.json');
    return mroCache!;
  },
  async getSupplyChain() {
    if (supplyChainCache) return supplyChainCache;
    supplyChainCache = await fetchJson('/data/supply_chain.json');
    return supplyChainCache!;
  },
  async getDefense() {
    if (defenseCache) return defenseCache;
    defenseCache = await fetchJson('/data/defense.json');
    return defenseCache!;
  },
  async getQuality() {
    if (qualityCache) return qualityCache;
    qualityCache = await fetchJson('/data/quality.json');
    return qualityCache!;
  },
  async getIceberg(): Promise<IcebergTable[]> {
    if (icebergCache) return icebergCache;
    const data = await fetchJson<{ tables: IcebergTable[] }>('/data/iceberg.json');
    icebergCache = data.tables;
    return icebergCache;
  },
  async getPipeline() {
    if (pipelineCache) return pipelineCache;
    pipelineCache = await fetchJson('/data/pipeline.json');
    return pipelineCache!;
  },
};

// ---------- Formatting helpers ----------

export function fmtUSD(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return '—';
  const abs = Math.abs(n);
  if (abs >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `$${(n / 1e9).toFixed(abs >= 100e9 ? 0 : 1)}B`;
  if (abs >= 1e6) return `$${(n / 1e6).toFixed(abs >= 100e6 ? 0 : 1)}M`;
  if (abs >= 1e3) return `$${Math.round(n / 1e3)}k`;
  return `$${Math.round(n)}`;
}

export function fmtNum(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return '—';
  return new Intl.NumberFormat('en-US').format(n);
}

export function fmtPct(n: number | null | undefined, digits = 1): string {
  if (n == null || Number.isNaN(n)) return '—';
  return `${n.toFixed(digits)}%`;
}

export function fmtBps(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return '—';
  return `${n >= 0 ? '+' : ''}${Math.round(n)} bps`;
}

export function fmtBytes(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return '—';
  const abs = Math.abs(n);
  if (abs >= 1024 ** 4) return `${(n / 1024 ** 4).toFixed(2)} TB`;
  if (abs >= 1024 ** 3) return `${(n / 1024 ** 3).toFixed(2)} GB`;
  if (abs >= 1024 ** 2) return `${(n / 1024 ** 2).toFixed(1)} MB`;
  if (abs >= 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${n} B`;
}
