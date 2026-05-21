import { useEffect, useMemo, useState } from 'react';
import { api, fmtUSD, fmtNum, fmtPct } from '../api/queries';
import type { Supplier, ShortageAlert } from '../types';
import PageHeader from '../components/PageHeader';

type CountrySpend = { country: string; usd: number };

export default function SupplyChainPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [shortages, setShortages] = useState<ShortageAlert[]>([]);
  const [tariffByCountry, setTariffByCountry] = useState<CountrySpend[]>([]);

  useEffect(() => {
    api.getSupplyChain().then((d) => {
      setSuppliers(d.suppliers);
      setShortages(d.shortages);
      setTariffByCountry(d.tariff_exposure_usd_by_country);
    }).catch(() => {});
  }, []);

  const rollups = useMemo(() => {
    if (suppliers.length === 0) return null;
    const high = suppliers.filter((s) => s.risk_bucket === 'high').length;
    const elevated = suppliers.filter((s) => s.risk_bucket === 'elevated').length;
    const singleSource = suppliers.filter((s) => s.single_source_flag).length;
    const totalSpend = suppliers.reduce((s, x) => s + x.spend_usd_ytd, 0);
    const tariffTotal = tariffByCountry.reduce((s, x) => s + x.usd, 0);
    return { high, elevated, singleSource, totalSpend, tariffTotal };
  }, [suppliers, tariffByCountry]);

  const sortedRisk = useMemo(() => {
    return [...suppliers].sort((a, b) => b.risk_score - a.risk_score);
  }, [suppliers]);

  const top20 = sortedRisk.slice(0, 20);

  return (
    <>
      <PageHeader
        eyebrow="Supply Chain · CSCO Brief"
        title="200 suppliers. One risk picture."
        blurb="Supplier risk derived from financial health, geopolitical exposure, single-source status, lead-time variance and tariff exposure. The supplier-risk agent reads gold.fct_supplier_risk on the Iceberg lake and surfaces the top of the stack here."
        callout="REV. C · SHEET 04 OF 08"
      />

      {/* Rollups */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <RollupTile label="High-risk suppliers"     value={rollups ? fmtNum(rollups.high) : '—'}        sub="risk score ≥ 46" tone="bad" />
          <RollupTile label="Elevated risk"            value={rollups ? fmtNum(rollups.elevated) : '—'}    sub="risk score 36–45" tone="warn" />
          <RollupTile label="Single-source"           value={rollups ? fmtNum(rollups.singleSource) : '—'} sub="of the top-200 panel" />
          <RollupTile label="YTD direct spend"         value={rollups ? fmtUSD(rollups.totalSpend) : '—'}  sub="across top-200 panel" />
          <RollupTile label="Tariff exposure (model)"   value={rollups ? fmtUSD(rollups.tariffTotal) : '—'} sub="weighted by current trade posture" tone="warn" />
        </div>
      </section>

      {/* Shortage alerts */}
      <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <div className="mb-4 border-b border-[var(--hairline)] pb-3">
          <div className="eyebrow mb-1">Critical-parts shortage alerts</div>
          <h2 className="font-serif text-2xl font-semibold text-[var(--ink-strong)]">Parts to clear before they hit the OEM line</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {shortages.map((s) => (
            <div key={s.part_no} className="spec-card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="partno text-sm text-[var(--ink-strong)]">{s.part_no}</span>
                <span className={`pill ${s.weeks_of_supply < 2 ? 'red' : s.weeks_of_supply < 4 ? 'amber' : 'green'}`}>
                  {s.weeks_of_supply.toFixed(1)} weeks
                </span>
              </div>
              <div className="font-serif text-base font-semibold text-[var(--ink-strong)]">{s.description}</div>
              <p className="mt-2 text-sm text-[var(--ink-muted)] leading-relaxed">{s.root_cause}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.affected_programs.map((p) => (
                  <span key={p} className="mono text-[10px] px-1.5 py-0.5 rounded-sm border border-[var(--hairline)] text-[var(--ink-muted)]">{p}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Agent callout */}
      <section className="bg-[var(--orange-bg)] border-y border-[var(--hairline)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-sm flex items-center justify-center shrink-0" style={{ background: 'var(--orange)' }}>
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v18M3 12h18" />
                <circle cx="12" cy="12" r="9" />
              </svg>
            </div>
            <div>
              <div className="eyebrow mb-1">Supplier-Risk Agent</div>
              <h3 className="font-serif text-lg font-semibold text-[var(--ink-strong)]">Reads gold.fct_supplier_risk on Iceberg directly.</h3>
              <p className="mt-2 text-sm text-[var(--ink-muted)] leading-relaxed max-w-3xl">
                Every overnight cycle, the agent re-scores the 200-supplier panel, flags new entrants
                in the high or elevated buckets, and writes a daily brief to the COO and CSCO. No
                warehouse round-trip — the agent queries the same Iceberg gold layer dbt writes.
                If Snowflake is down, Athena is still up; if Athena is down, the agent falls back
                to a DuckDB read of the same parquet files.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top 20 risk table */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-end justify-between border-b border-[var(--hairline)] pb-3">
          <div>
            <div className="eyebrow mb-1">Top-20 by composite risk</div>
            <h2 className="font-serif text-2xl font-semibold text-[var(--ink-strong)]">Where the CSCO is spending the next 30 days</h2>
          </div>
        </div>
        <div className="spec-card overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[var(--paper-deep)] text-[var(--ink-soft)] text-[11px] uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-2">Supplier</th>
                <th className="text-left px-4 py-2">Country</th>
                <th className="text-left px-4 py-2">Commodity</th>
                <th className="text-right px-4 py-2">Spend YTD</th>
                <th className="text-right px-4 py-2">Risk</th>
                <th className="text-right px-4 py-2">Fin. health</th>
                <th className="text-right px-4 py-2">Geopol</th>
                <th className="text-right px-4 py-2">Tariff</th>
                <th className="text-right px-4 py-2">OTD</th>
                <th className="text-left px-4 py-2">Flags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--hairline-soft)]">
              {top20.map((s) => (
                <tr key={s.supplier_id} className="hover:bg-[var(--paper-deep)]/40">
                  <td className="px-4 py-2 font-serif text-[var(--ink-strong)]">{s.name}</td>
                  <td className="px-4 py-2 mono text-[var(--ink-soft)]">{s.country}</td>
                  <td className="px-4 py-2 text-[var(--ink-muted)]">{s.commodity}</td>
                  <td className="px-4 py-2 text-right tabular">{fmtUSD(s.spend_usd_ytd)}</td>
                  <td className="px-4 py-2 text-right">
                    <span className={`pill ${s.risk_bucket === 'high' ? 'red' : s.risk_bucket === 'elevated' ? 'amber' : 'neutral'}`}>
                      {s.risk_score.toFixed(0)}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right tabular">{s.financial_health.toFixed(0)}</td>
                  <td className="px-4 py-2 text-right tabular">{s.geopolitical_exposure.toFixed(0)}</td>
                  <td className="px-4 py-2 text-right tabular">{fmtPct(s.tariff_exposure_pct)}</td>
                  <td className="px-4 py-2 text-right tabular">{fmtPct(s.on_time_pct)}</td>
                  <td className="px-4 py-2">
                    {s.single_source_flag && <span className="mono text-[10px] text-[var(--red)] font-semibold">SINGLE-SRC</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tariff exposure */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-4 border-b border-[var(--hairline)] pb-3">
          <div className="eyebrow mb-1">Tariff exposure model</div>
          <h2 className="font-serif text-2xl font-semibold text-[var(--ink-strong)]">By supplier country, weighted by YTD spend</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {tariffByCountry.slice(0, 9).map((t) => (
            <div key={t.country} className="spec-card p-4">
              <div className="flex items-center justify-between">
                <div className="mono text-sm text-[var(--ink-strong)] font-semibold">{t.country}</div>
                <div className="font-serif text-xl font-semibold text-[var(--ink-strong)] tabular">{fmtUSD(t.usd)}</div>
              </div>
              <div className="mt-2 h-1.5 bg-[var(--paper-deep)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--orange)]" style={{ width: `${Math.min(100, (t.usd / tariffByCountry[0].usd) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function RollupTile({ label, value, sub, tone }: { label: string; value: string; sub: string; tone?: 'good' | 'bad' | 'warn' }) {
  const color =
    tone === 'bad'  ? 'var(--red)' :
    tone === 'warn' ? 'var(--amber)' :
    tone === 'good' ? 'var(--green)' :
    'var(--ink-strong)';
  return (
    <div className="spec-card p-4 relative">
      <div className="absolute top-0 left-0 h-[3px] w-10" style={{ background: color }} />
      <div className="text-[10.5px] font-semibold text-[var(--ink-soft)] uppercase tracking-[0.08em]">{label}</div>
      <div className="mt-1 font-serif text-2xl font-semibold tabular" style={{ color }}>{value}</div>
      <div className="mt-1 text-[11px] text-[var(--ink-soft)]">{sub}</div>
    </div>
  );
}
