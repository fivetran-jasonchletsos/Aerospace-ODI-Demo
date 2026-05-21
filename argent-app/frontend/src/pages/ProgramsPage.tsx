import { useEffect, useMemo, useState } from 'react';
import { api, fmtUSD, fmtPct } from '../api/queries';
import type { Program, DefenseAward } from '../types';
import PageHeader from '../components/PageHeader';

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [awards, setAwards] = useState<DefenseAward[]>([]);
  const [seg, setSeg] = useState<'all' | 'commercial' | 'defense'>('all');

  useEffect(() => {
    api.getPrograms().then(setPrograms).catch(() => {});
    api.getDefense().then((d) => setAwards(d.awards)).catch(() => {});
  }, []);

  const filtered = useMemo(() => programs.filter((p) => seg === 'all' || p.segment === seg), [programs, seg]);

  const rollups = useMemo(() => {
    if (programs.length === 0) return null;
    const commercial = programs.filter((p) => p.segment === 'commercial');
    const defense = programs.filter((p) => p.segment === 'defense');
    return {
      backlog: programs.reduce((s, p) => s + p.contract_value_usd, 0),
      commercial_backlog: commercial.reduce((s, p) => s + p.contract_value_usd, 0),
      defense_backlog:    defense.reduce((s, p) => s + p.contract_value_usd, 0),
      high_risk: programs.filter((p) => p.risk_bucket === 'high' || p.risk_bucket === 'elevated').length,
      avg_margin: programs.reduce((s, p) => s + p.margin_pct, 0) / programs.length,
    };
  }, [programs]);

  return (
    <>
      <PageHeader
        eyebrow="Programs · COO Brief"
        title="15 active programs. One milestone clock."
        blurb="The active program portfolio across commercial OEM, defense and after-market MRO. Milestone progress, risk scoring and the defense bid pipeline that pays for the next 36 months."
        callout="REV. C · SHEET 06 OF 08"
      />

      {/* Rollups */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <RollupTile label="Total backlog"           value={rollups ? fmtUSD(rollups.backlog) : '—'}              sub="firm + funded" />
          <RollupTile label="Commercial backlog"      value={rollups ? fmtUSD(rollups.commercial_backlog) : '—'}  sub="OEM build-to-print" accent="orange" />
          <RollupTile label="Defense backlog"          value={rollups ? fmtUSD(rollups.defense_backlog) : '—'}     sub="DoD + allied" accent="defense" />
          <RollupTile label="Programs at risk"        value={rollups ? `${rollups.high_risk}` : '—'}              sub="elevated + high" tone="bad" />
          <RollupTile label="Weighted margin"         value={rollups ? fmtPct(rollups.avg_margin) : '—'}          sub="across portfolio" />
        </div>
      </section>

      {/* Filter strip */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="inline-flex rounded-sm border border-[var(--hairline)] bg-white p-1 text-sm">
          {(['all', 'commercial', 'defense'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSeg(s)}
              className={`px-3 py-1.5 rounded-sm text-[12px] font-semibold uppercase tracking-wider transition-colors ${
                seg === s ? 'bg-[var(--gunmetal)] text-white' : 'text-[var(--ink-muted)] hover:text-[var(--ink-strong)]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      {/* Program table */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="spec-card overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[var(--paper-deep)] text-[var(--ink-soft)] text-[11px] uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-2">Program</th>
                <th className="text-left px-4 py-2">Segment</th>
                <th className="text-left px-4 py-2">Customer</th>
                <th className="text-left px-4 py-2">Role</th>
                <th className="text-right px-4 py-2">Contract</th>
                <th className="text-center px-4 py-2">Milestones</th>
                <th className="text-right px-4 py-2">Margin</th>
                <th className="text-right px-4 py-2">Risk</th>
                <th className="text-left px-4 py-2">Next milestone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--hairline-soft)]">
              {filtered.map((p) => {
                const pct = (p.milestones_complete / p.milestones_planned) * 100;
                return (
                  <tr key={p.program_id} className="hover:bg-[var(--paper-deep)]/40 align-top">
                    <td className="px-4 py-3">
                      <div className="mono text-[11px] text-[var(--ink-soft)]">{p.program_id}</div>
                      <div className="font-serif font-semibold text-[var(--ink-strong)] mt-0.5">{p.name}</div>
                      {p.notes && <div className="text-[11px] text-[var(--ink-soft)] mt-1 italic">{p.notes}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`pill ${p.segment === 'defense' ? 'defense' : 'orange'}`}>{p.segment}</span>
                    </td>
                    <td className="px-4 py-3 text-[var(--ink-muted)]">{p.customer}</td>
                    <td className="px-4 py-3 mono text-[11px] uppercase text-[var(--ink-soft)]">{p.prime_or_sub}</td>
                    <td className="px-4 py-3 text-right tabular">{fmtUSD(p.contract_value_usd)}</td>
                    <td className="px-4 py-3 w-44">
                      <div className="flex items-center gap-2 justify-center">
                        <div className="mono text-[11px] text-[var(--ink-soft)]">{p.milestones_complete}/{p.milestones_planned}</div>
                        <div className="flex-1 h-1.5 bg-[var(--paper-deep)] rounded-full overflow-hidden">
                          <div className="h-full bg-[var(--gunmetal)]" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right tabular">{fmtPct(p.margin_pct)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`pill ${p.risk_bucket === 'high' ? 'red' : p.risk_bucket === 'elevated' ? 'amber' : p.risk_bucket === 'moderate' ? 'neutral' : 'green'}`}>
                        {Math.round(p.risk_score)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-[13px]">{p.next_milestone}</div>
                      <div className="mono text-[11px] text-[var(--ink-soft)] mt-0.5">{p.next_milestone_date}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Defense bid pipeline */}
      <section className="bg-[var(--defense-bg)] border-y border-[var(--hairline)]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-5">
            <div className="eyebrow mb-1" style={{ color: 'var(--defense)' }}>Defense bid pipeline</div>
            <h2 className="font-serif text-2xl font-semibold text-[var(--ink-strong)]">Awards funnel</h2>
            <p className="text-sm text-[var(--ink-muted)] mt-1 max-w-3xl">
              Pre-solicit, proposal, down-select and awarded opportunities. pWin is a calibrated
              probability derived from the proposal-color-team score, customer history and prior
              earned-value performance on adjacent programs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {awards.map((a) => (
              <div key={a.award_id} className="spec-card p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="mono text-[11px] text-[var(--ink-soft)]">{a.award_id}</span>
                  <span className={`pill ${a.status === 'awarded' ? 'green' : a.status === 'down_select' ? 'amber' : 'defense'}`}>{a.status.replace('_', ' ')}</span>
                </div>
                <h3 className="font-serif text-base font-semibold text-[var(--ink-strong)]">{a.program}</h3>
                <div className="text-[12px] text-[var(--ink-muted)] mt-0.5">{a.customer}</div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[10px] text-[var(--ink-soft)] uppercase tracking-wider">Ceiling</div>
                    <div className="font-serif font-semibold text-[var(--ink-strong)] tabular">{fmtUSD(a.ceiling_value_usd)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[var(--ink-soft)] uppercase tracking-wider">pWin</div>
                    <div className="font-serif font-semibold text-[var(--ink-strong)] tabular">{a.pwin_pct}%</div>
                  </div>
                </div>
                <div className="mt-3 text-[11px] text-[var(--ink-soft)] mono">Decision {a.decision_date}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function RollupTile({ label, value, sub, tone, accent }: { label: string; value: string; sub: string; tone?: 'bad'; accent?: 'orange' | 'defense' }) {
  const accentColor =
    accent === 'orange' ? 'var(--orange)' :
    accent === 'defense' ? 'var(--defense)' :
    'var(--gunmetal)';
  const color = tone === 'bad' ? 'var(--red)' : 'var(--ink-strong)';
  return (
    <div className="spec-card p-4 relative">
      <div className="absolute top-0 left-0 h-[3px] w-10" style={{ background: accentColor }} />
      <div className="text-[10.5px] font-semibold text-[var(--ink-soft)] uppercase tracking-[0.08em]">{label}</div>
      <div className="mt-1 font-serif text-2xl font-semibold tabular" style={{ color }}>{value}</div>
      <div className="mt-1 text-[11px] text-[var(--ink-soft)]">{sub}</div>
    </div>
  );
}
