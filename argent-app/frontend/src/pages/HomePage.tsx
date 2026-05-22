import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, fmtNum, fmtBps } from '../api/queries';
import type { SummaryStats, Site } from '../types';
import KpiTile from '../components/KpiTile';
import SiteMap from '../components/SiteMap';

export default function HomePage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<SummaryStats | null>(null);
  const [sites, setSites] = useState<Site[]>([]);

  useEffect(() => {
    api.getSummary().then(setStats).catch(() => {});
    api.getProduction().then((p) => setSites(p.sites)).catch(() => {});
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="bg-[var(--navy)] text-white relative overflow-hidden tech-grid scanlines">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7">
              <div className="eyebrow-light mb-4">Argent Aerospace · Operations Intelligence</div>
              <h1 className="font-serif text-4xl sm:text-6xl font-semibold text-white leading-[0.98] tracking-tight">
                One operating picture.<br />
                <span className="text-[var(--orange-bright)]">Every airframe.</span><br />
                Every program.
              </h1>
              <p className="mt-6 text-base sm:text-lg text-white/75 max-w-2xl leading-relaxed">
                Fourteen manufacturing and MRO sites. Forty-seven active programs across commercial OEM
                build-to-print, defense systems, and after-market services. Six source systems normalized
                into one governed Iceberg lake — read by the COO, the CSCO, and the agents that work for them.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/programs')}
                  className="inline-flex items-center gap-2 rounded-sm font-semibold text-sm text-[var(--gunmetal-deep)] px-5 py-3 shadow-lg hover:opacity-95 transition-opacity"
                  style={{ background: 'var(--orange)' }}
                >
                  Open the operating picture <span aria-hidden>→</span>
                </button>
                <button
                  onClick={() => navigate('/architecture')}
                  className="inline-flex items-center gap-2 rounded-sm font-semibold text-sm text-white bg-white/5 border border-white/20 px-5 py-3 hover:bg-white/10 transition-colors"
                >
                  See the ODI architecture <span aria-hidden>→</span>
                </button>
              </div>
              <div className="mt-8 mono text-[11px] text-white/55 tracking-wider">
                REV.&nbsp;<span className="text-white/85">C</span> &middot; SHEET 01 OF 08 &middot; SCALE 1:1 &middot; FY26 Q2
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-white text-[var(--ink)] rounded-sm border border-[var(--hairline)] shadow-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-[var(--hairline)] flex items-center justify-between bg-[var(--paper-deep)]">
                  <div className="eyebrow">Lake Snapshot</div>
                  <div className="text-[10px] font-semibold text-[var(--ink-soft)] uppercase tracking-wider mono">Snowflake · Iceberg</div>
                </div>
                <div className="grid grid-cols-2 divide-x divide-y divide-[var(--hairline-soft)] tabular">
                  <Stat label="Programs active" value={stats ? fmtNum(stats.programs_active) : '—'} hint="commercial + defense + MRO" />
                  <Stat label="Sites" value={stats ? fmtNum(stats.sites_count) : '—'} hint="mfg + MRO + integration" />
                  <Stat label="In-service fleet" value={stats ? fmtNum(stats.in_service_fleet) : '—'} hint="aircraft we service" />
                  <Stat label="Iceberg tables" value={stats ? fmtNum(stats.iceberg_table_count) : '—'} hint="bronze + silver + gold" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KPI tile band */}
      <section className="mx-auto max-w-7xl px-4 pt-12 pb-2 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between border-b border-[var(--hairline)] pb-3">
          <div>
            <div className="eyebrow mb-1">Operating Brief</div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--ink-strong)] tracking-tight">
              The factory floor in six numbers
            </h2>
            <p className="text-sm text-[var(--ink-muted)] mt-1 max-w-3xl">
              Revenue, on-time delivery to OEM lines, defense bid-win rate, MRO turnaround, supplier
              scorecard, in-service fleet supported. Sourced from the gold layer on Iceberg.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          <KpiTile label="Revenue YTD"          value={stats?.revenue_ytd_label ?? '—'} sub="vs $24B FY plan" accent="orange" />
          <KpiTile label="On-time to OEM"        value={stats ? `${stats.on_time_delivery_pct.toFixed(1)}%` : '—'}
                   delta={stats ? fmtBps(stats.on_time_delivery_delta_bps) : null}
                   deltaTone={stats && stats.on_time_delivery_delta_bps < 0 ? 'bad' : 'good'}
                   sub="trailing 30 days" />
          <KpiTile label="Defense win rate"      value={stats ? `${stats.defense_win_rate_pct.toFixed(1)}%` : '—'}
                   delta={stats ? fmtBps(stats.defense_win_rate_delta_bps) : null}
                   deltaTone="good"
                   sub="trailing-4Q bids" accent="defense" />
          <KpiTile label="MRO turnaround"        value={stats ? `${stats.mro_turnaround_days.toFixed(1)} d` : '—'}
                   delta={stats ? `${stats.mro_turnaround_delta_days >= 0 ? '+' : ''}${stats.mro_turnaround_delta_days.toFixed(1)} d` : null}
                   deltaTone={stats && stats.mro_turnaround_delta_days <= 0 ? 'good' : 'bad'}
                   sub="weighted across all bays" />
          <KpiTile label="Supplier scorecard"    value={stats ? stats.supplier_scorecard_avg.toFixed(1) : '—'}
                   delta={stats ? `${stats.supplier_scorecard_delta >= 0 ? '+' : ''}${stats.supplier_scorecard_delta.toFixed(1)}` : null}
                   deltaTone={stats && stats.supplier_scorecard_delta >= 0 ? 'good' : 'bad'}
                   sub="top-200 weighted avg" />
          <KpiTile label="In-service fleet"      value={stats ? fmtNum(stats.in_service_fleet) : '—'} sub="aircraft under MRO support" />
        </div>
      </section>

      {/* Top ops issues */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 border-b border-[var(--hairline)] pb-3">
          <div className="eyebrow mb-1">Top Operating Issues — Next 7 Days</div>
          <h2 className="font-serif text-2xl font-semibold text-[var(--ink-strong)]">What needs the COO and CSCO this week</h2>
          <p className="text-sm text-[var(--ink-muted)] mt-1 max-w-3xl">
            Surfaced by an agent reading the supplier-risk, MRO work-package, and defense-program-health gold models on the Iceberg lake.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <IssueCard
            severity="high"
            title="Titanium forging supplier in financial distress"
            body="Meridian Titanium Forging Works (SUP-0001) is the sole source for ARG-3F-71204-A wing-root forging on ARG-C-7301 and ARG-C-7402. Financial-health score dropped to 32. 1.5 weeks of supply on hand. Dual-source qualification accelerated."
            action="Open supply chain →"
            onAction={() => navigate('/supply-chain')}
          />
          <IssueCard
            severity="high"
            title="Dallas MRO Bay 4 over capacity"
            body="Bay 4 at 104% utilization on a single-aisle C-check. WP-44024 trending 18 days behind. Parts-fill-rate 78% on cabin reconfig kit. New bay coming online Q3 — interim plan moves two inductions to ATL-B3."
            action="Open MRO →"
            onAction={() => navigate('/mro')}
          />
          <IssueCard
            severity="medium"
            title="Defense bid response due Friday"
            body="Coastal Surveillance Radar Block 4 down-select decision 2026-05-29. pWin 48%. Color-team review scheduled Thursday. Earned-value SPI on the predecessor block (ARG-D-2110) is 0.92 — recovery plan needs to land in the proposal."
            action="Open programs →"
            onAction={() => navigate('/programs')}
          />
        </div>
      </section>

      {/* Sites map */}
      <section className="bg-white border-y border-[var(--hairline)]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <div className="eyebrow mb-1">Global Footprint</div>
              <h2 className="font-serif text-2xl font-semibold text-[var(--ink-strong)]">14 manufacturing &amp; MRO sites</h2>
              <p className="text-sm text-[var(--ink-muted)] mt-1 max-w-2xl">
                Commercial-OEM (orange), defense (deep blue), mixed (gunmetal). Larger markers
                indicate manufacturing or integration sites. MRO bays clustered at Atlanta, Dallas,
                Jacksonville and Singapore.
              </p>
            </div>
            <div className="dim-callout hidden md:inline-flex">14 SITES &middot; 5 COUNTRIES</div>
          </div>
          {sites.length === 0
            ? <div className="h-[440px] rounded-sm bg-[var(--paper-deep)] animate-pulse" />
            : <SiteMap sites={sites} />}
        </div>
      </section>

      {/* Closing principle */}
      <section className="bg-[var(--navy)] text-white border-t border-[var(--hairline-navy)] scanlines">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <div className="eyebrow-light mb-3">Design Principles</div>
          <p className="font-serif text-2xl sm:text-3xl text-white leading-snug">
            "Lock-in is an architectural choice.<br />
            <span className="text-[var(--orange-bright)]">So is openness.</span>"
          </p>
          <p className="mt-4 text-sm text-white/70 max-w-2xl mx-auto">
            Argent chose ODI because a tier-1 prime cannot bind itself to a single vendor for the
            next thirty-year program. ERP, MES, PLM, MRO, program accounting and supplier networks
            all change vendors over the life of a program. The lake does not.
          </p>
        </div>
      </section>
    </>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="px-5 py-4">
      <div className="text-[10.5px] font-semibold text-[var(--ink-soft)] uppercase tracking-[0.08em]">{label}</div>
      <div className="mt-1 font-serif text-2xl font-semibold text-[var(--ink-strong)] leading-none tabular">{value}</div>
      <div className="mt-1 text-[11px] text-[var(--ink-soft)]">{hint}</div>
    </div>
  );
}

function IssueCard({ severity, title, body, action, onAction }: { severity: 'high' | 'medium' | 'low'; title: string; body: string; action: string; onAction: () => void }) {
  const pillClass = severity === 'high' ? 'pill red' : severity === 'medium' ? 'pill amber' : 'pill green';
  return (
    <div className="spec-card p-5 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <span className={pillClass}>{severity === 'high' ? 'High' : severity === 'medium' ? 'Watch' : 'Monitor'}</span>
        <span className="mono text-[10px] text-[var(--ink-soft)] uppercase tracking-wider">{severity === 'high' ? 'P1' : severity === 'medium' ? 'P2' : 'P3'}</span>
      </div>
      <h3 className="font-serif text-lg font-semibold text-[var(--ink-strong)] tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-[var(--ink-muted)] leading-relaxed flex-1">{body}</p>
      <button onClick={onAction} className="mt-4 text-sm font-semibold text-[var(--orange-dim)] hover:text-[var(--gunmetal)] self-start">
        {action}
      </button>
    </div>
  );
}
