// ============================================================
// Argent Aerospace — shared types
// Mirror the gold-layer dbt models on Snowflake + Iceberg:
//   gold.dim_program           (active programs)
//   gold.fct_site_production   (per-site daily takt / yield)
//   gold.fct_mro_workpackage   (MRO bay turnaround + work packages)
//   gold.fct_supplier_risk     (Top suppliers with composite risk)
//   gold.fct_quality_metric    (AS9100 / escape / SCAR)
//   gold.fct_defense_program   (defense-only program-mgmt view)
// ============================================================

export type DataSource = 'live' | 'demo';

export interface SummaryStats {
  revenue_ytd_usd: number;
  revenue_ytd_label: string;
  on_time_delivery_pct: number;
  on_time_delivery_delta_bps: number;
  defense_win_rate_pct: number;
  defense_win_rate_delta_bps: number;
  mro_turnaround_days: number;
  mro_turnaround_delta_days: number;
  supplier_scorecard_avg: number;
  supplier_scorecard_delta: number;
  in_service_fleet: number;
  sites_count: number;
  programs_active: number;
  iceberg_table_count: number;
  s3_bytes: number;
  generated_at?: string;
  source?: DataSource;
}

export type ProgramSegment = 'commercial' | 'defense';
export type RiskBucket = 'low' | 'moderate' | 'elevated' | 'high';

export interface Program {
  program_id: string;
  name: string;
  segment: ProgramSegment;
  customer: string;
  prime_or_sub: 'prime' | 'sub';
  contract_value_usd: number;
  milestones_complete: number;
  milestones_planned: number;
  risk_score: number;
  risk_bucket: RiskBucket;
  next_milestone: string;
  next_milestone_date: string;
  margin_pct: number;
  notes?: string;
}

export interface Site {
  site_id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
  function: 'manufacturing' | 'mro' | 'engineering' | 'integration';
  segment: ProgramSegment | 'mixed';
  headcount: number;
  takt_seconds: number | null;
  yield_pct: number | null;
  on_time_pct: number | null;
  as9100_status: 'certified' | 'audit_open' | 'recert_due';
  part145_status: 'active' | 'na' | 'audit_open';
}

export interface MROWorkPackage {
  wp_id: string;
  bay_id: string;
  site_id: string;
  airframe: string;
  customer: string;
  check_type: 'A' | 'C' | 'D' | 'engine' | 'avionics';
  start_date: string;
  est_complete_date: string;
  days_elapsed: number;
  days_remaining: number;
  parts_fill_rate_pct: number;
  on_schedule: boolean;
}

export interface MROBay {
  bay_id: string;
  site_id: string;
  utilization_pct: number;
  current_wp: string | null;
}

export interface FleetAircraft {
  tail: string;
  airframe: string;
  operator: string;
  next_heavy_check: string;
  hours_since_check: number;
  due_within_days: number;
}

export interface Supplier {
  supplier_id: string;
  name: string;
  country: string;
  tier: 1 | 2 | 3;
  commodity: string;
  spend_usd_ytd: number;
  risk_score: number;
  risk_bucket: RiskBucket;
  financial_health: number;
  geopolitical_exposure: number;
  single_source_flag: boolean;
  lead_time_variance_days: number;
  tariff_exposure_pct: number;
  on_time_pct: number;
  scar_open: number;
}

export interface ShortageAlert {
  part_no: string;
  description: string;
  affected_programs: string[];
  weeks_of_supply: number;
  root_cause: string;
}

export interface DefenseAward {
  award_id: string;
  program: string;
  customer: string;
  status: 'awarded' | 'down_select' | 'proposal' | 'pre_solicit';
  ceiling_value_usd: number;
  decision_date: string;
  pwin_pct: number;
}

export interface QualityMetric {
  site_id: string;
  escape_rate_ppm: number;
  scar_open: number;
  scar_overdue: number;
  faa_reportable_events_ytd: number;
  as9100_audit_findings: number;
}

export interface IcebergTable {
  database: 'bronze' | 'silver' | 'gold';
  table: string;
  rows: number;
  bytes: number;
  partitions: string[];
  source_system: 'sap_s4' | 'teamcenter' | 'apriso' | 'maximo' | 'costpoint' | 'ariba' | 'customer_portal' | 'derived';
  last_updated_at: string;
  schema_columns: number;
  data_handling: 'unclassified' | 'cui';
}

export interface PipelineLayerStats {
  layer: 'connector' | 'bronze' | 'silver' | 'gold';
  rows_in: number;
  rows_out: number;
  tables: number;
  last_run: string;
  status: 'ok' | 'running' | 'failed';
}

export interface PipelineConnector {
  source: string;
  fivetran_id: string;
  rows_24h: number;
  last_sync: string;
  status: 'ok' | 'sync' | 'failed';
  destination: 'snowflake' | 'iceberg';
  data_handling: 'unclassified' | 'cui';
}
