import { useEffect, useState } from 'react';
import { api } from '../api/queries';
import type { MROBay, MROWorkPackage, FleetAircraft } from '../types';
import PageHeader from '../components/PageHeader';

interface TurnByAirframe { airframe: string; days_avg: number; trend: number[] }

export default function MROPage() {
  const [bays, setBays] = useState<MROBay[]>([]);
  const [wps, setWPs] = useState<MROWorkPackage[]>([]);
  const [fleet, setFleet] = useState<FleetAircraft[]>([]);
  const [turn, setTurn] = useState<TurnByAirframe[]>([]);

  useEffect(() => {
    api.getMRO().then((d) => {
      setBays(d.bays);
      setWPs(d.work_packages);
      setFleet(d.due_for_check);
      setTurn(d.turnaround_by_airframe);
    }).catch(() => {});
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="MRO Operations"
        title="11 bays, 4 sites, one turnaround clock"
        blurb="Bay utilization, parts-fill-rate, work-package status and the in-service fleet due for heavy check in the next 30 days. The MRO planner agent reads gold.fct_mro_workpackage and gold.fct_supplier_risk to flag at-risk inductions before they're scheduled."
        callout="REV. C · SHEET 05 OF 08"
      />

      {/* Bay utilization */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-4 border-b border-[var(--hairline)] pb-3">
          <div className="eyebrow mb-1">Bay Utilization</div>
          <h2 className="font-serif text-2xl font-semibold text-[var(--ink-strong)]">Live by-bay status across MRO sites</h2>
          <p className="text-sm text-[var(--ink-muted)] mt-1">Atlanta engine MRO, Dallas heavy MRO, Jacksonville defense MRO, Singapore heavy MRO.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {bays.map((b) => {
            const over = b.utilization_pct > 100;
            const tone = over ? 'red' : b.utilization_pct >= 90 ? 'amber' : 'green';
            return (
              <div key={b.bay_id} className="spec-card p-4">
                <div className="flex items-center justify-between">
                  <div className="mono text-[11px] text-[var(--ink-strong)] font-semibold">{b.bay_id}</div>
                  <span className={`pill ${tone}`}>{b.utilization_pct}%</span>
                </div>
                <div className="mt-3 h-2 bg-[var(--paper-deep)] rounded-full overflow-hidden">
                  <div
                    className="h-full"
                    style={{
                      width: `${Math.min(100, b.utilization_pct)}%`,
                      background: tone === 'red' ? 'var(--red)' : tone === 'amber' ? 'var(--amber)' : 'var(--green)',
                    }}
                  />
                </div>
                <div className="mt-2 mono text-[10px] text-[var(--ink-soft)] truncate">{b.current_wp ?? 'idle'}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Active work packages */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 border-b border-[var(--hairline)] pb-3">
          <div className="eyebrow mb-1">Active work packages</div>
          <h2 className="font-serif text-2xl font-semibold text-[var(--ink-strong)]">In progress today</h2>
        </div>
        <div className="spec-card overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[var(--paper-deep)] text-[var(--ink-soft)] text-[11px] uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-2">WP</th>
                <th className="text-left px-4 py-2">Bay</th>
                <th className="text-left px-4 py-2">Airframe</th>
                <th className="text-left px-4 py-2">Customer</th>
                <th className="text-left px-4 py-2">Check</th>
                <th className="text-right px-4 py-2">Elapsed</th>
                <th className="text-right px-4 py-2">Remaining</th>
                <th className="text-right px-4 py-2">Parts fill</th>
                <th className="text-left px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--hairline-soft)]">
              {wps.map((wp) => (
                <tr key={wp.wp_id} className="hover:bg-[var(--paper-deep)]/40">
                  <td className="px-4 py-2 mono text-[var(--ink-strong)]">{wp.wp_id}</td>
                  <td className="px-4 py-2 mono text-[var(--ink-soft)]">{wp.bay_id}</td>
                  <td className="px-4 py-2">{wp.airframe}</td>
                  <td className="px-4 py-2 text-[var(--ink-muted)]">{wp.customer}</td>
                  <td className="px-4 py-2 mono text-[var(--ink-soft)] uppercase">{wp.check_type}</td>
                  <td className="px-4 py-2 text-right tabular">{wp.days_elapsed}d</td>
                  <td className="px-4 py-2 text-right tabular">{wp.days_remaining}d</td>
                  <td className="px-4 py-2 text-right tabular">
                    <span className={wp.parts_fill_rate_pct >= 90 ? '' : 'text-[var(--red)]'}>{wp.parts_fill_rate_pct}%</span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`pill ${wp.on_schedule ? 'green' : 'red'}`}>{wp.on_schedule ? 'on schedule' : 'slipping'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Turnaround by airframe */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-4 border-b border-[var(--hairline)] pb-3">
          <div className="eyebrow mb-1">Turnaround by airframe</div>
          <h2 className="font-serif text-2xl font-semibold text-[var(--ink-strong)]">Weighted average days, 7-week trend</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {turn.map((t) => {
            const last = t.trend[t.trend.length - 1];
            const first = t.trend[0];
            const better = last < first;
            return (
              <div key={t.airframe} className="spec-card p-4">
                <div className="font-serif text-sm font-semibold text-[var(--ink-strong)]">{t.airframe}</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <div className="font-serif text-3xl font-semibold text-[var(--ink-strong)] tabular">{t.days_avg.toFixed(1)}</div>
                  <div className="text-[11px] text-[var(--ink-soft)]">days</div>
                </div>
                <Sparkline values={t.trend} positive={better} />
                <div className={`mt-1 text-[11px] font-semibold ${better ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
                  {better ? '−' : '+'}{Math.abs(last - first).toFixed(1)} days vs 7 weeks ago
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Fleet due for check */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-4 border-b border-[var(--hairline)] pb-3">
          <div className="eyebrow mb-1">Top 10 in-service aircraft due for heavy check</div>
          <h2 className="font-serif text-2xl font-semibold text-[var(--ink-strong)]">Next 30 days</h2>
        </div>
        <div className="spec-card overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[var(--paper-deep)] text-[var(--ink-soft)] text-[11px] uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-2">Tail</th>
                <th className="text-left px-4 py-2">Airframe</th>
                <th className="text-left px-4 py-2">Operator</th>
                <th className="text-left px-4 py-2">Next check</th>
                <th className="text-right px-4 py-2">Hours since</th>
                <th className="text-right px-4 py-2">Due in</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--hairline-soft)]">
              {fleet.map((f) => (
                <tr key={f.tail} className="hover:bg-[var(--paper-deep)]/40">
                  <td className="px-4 py-2 mono text-[var(--ink-strong)] font-semibold">{f.tail}</td>
                  <td className="px-4 py-2">{f.airframe}</td>
                  <td className="px-4 py-2 text-[var(--ink-muted)]">{f.operator}</td>
                  <td className="px-4 py-2">{f.next_heavy_check}</td>
                  <td className="px-4 py-2 text-right tabular">{f.hours_since_check.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right">
                    <span className={`pill ${f.due_within_days <= 7 ? 'red' : f.due_within_days <= 14 ? 'amber' : 'green'}`}>
                      {f.due_within_days}d
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function Sparkline({ values, positive }: { values: number[]; positive: boolean }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const w = 100, h = 24;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-2 w-full h-6" preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={positive ? 'var(--green)' : 'var(--red)'} strokeWidth="1.5" />
    </svg>
  );
}
