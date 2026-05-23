import { useEffect, useState } from 'react';
import { api, fmtNum } from '../api/queries';
import type { PipelineConnector, PipelineLayerStats } from '../types';
import PageHeader from '../components/PageHeader';

interface ModelRow { name: string; layer: string; tests_pass: number }

export default function PipelinePage() {
  const [layers, setLayers] = useState<PipelineLayerStats[]>([]);
  const [connectors, setConnectors] = useState<PipelineConnector[]>([]);
  const [models, setModels] = useState<ModelRow[]>([]);
  const [failSim, setFailSim] = useState<string | null>(null);

  useEffect(() => {
    api.getPipeline().then((p) => {
      setLayers(p.layers);
      setConnectors(p.connectors);
      // pipeline.json carries a models array; cast via any
      const m = (p as any).models;
      if (Array.isArray(m)) setModels(m);
    }).catch(() => {});
  }, []);

  function simulate(source: string) {
    setFailSim(source);
    setTimeout(() => setFailSim(null), 6000);
  }

  return (
    <>
      <PageHeader
        eyebrow="Pipeline · Operations"
        title="Connectors, dbt layers and lineage"
        blurb="The plumbing under the operating picture. Fourteen connectors, four dbt layers, AS9100-aligned data quality. CUI feeds run in a parallel pipeline on AWS GovCloud — same shape, separate bytes."
        callout="REV. C · SHEET 03 OF 08"
      />

      {/* Layer cards */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-5">
          <div className="eyebrow mb-1">dbt Layers</div>
          <h2 className="font-serif text-2xl font-semibold text-[var(--ink-strong)]">connector → bronze → silver → gold</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {layers.map((l) => {
            const chip = l.layer === 'bronze' ? 'bronze' : l.layer === 'silver' ? 'silver' : l.layer === 'gold' ? 'gold' : 'silver';
            return (
              <div key={l.layer} className="spec-card p-5">
                <span className={`layer-chip ${chip}`}>{l.layer}</span>
                <div className="mt-3 font-serif text-3xl font-semibold text-[var(--ink-strong)] tabular">{fmtNum(l.rows_out)}</div>
                <div className="text-[11px] text-[var(--ink-soft)] uppercase tracking-wider">rows · {l.tables} tables</div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-[var(--ink-muted)]">
                  <span className={`pill ${l.status === 'ok' ? 'green' : l.status === 'failed' ? 'red' : 'amber'}`}>{l.status}</span>
                  <span className="mono">last run {new Date(l.last_run).toLocaleTimeString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Connector table */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-end justify-between border-b border-[var(--hairline)] pb-3">
          <div>
            <div className="eyebrow mb-1">Connectors</div>
            <h2 className="font-serif text-2xl font-semibold text-[var(--ink-strong)]">14 source systems → Fivetran → lake</h2>
            <p className="text-sm text-[var(--ink-muted)] mt-1 max-w-3xl">
              Click <em>simulate failure</em> on any source to see how the COO's operating picture
              degrades gracefully. The lake retains the last good landing; dbt models surface a
              freshness warning rather than going dark.
            </p>
          </div>
        </div>
        <div className="spec-card overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[var(--paper-deep)] text-[var(--ink-soft)] text-[11px] uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-2">Source</th>
                <th className="text-left px-4 py-2">Connector ID</th>
                <th className="text-left px-4 py-2">Handling</th>
                <th className="text-left px-4 py-2">Destination</th>
                <th className="text-right px-4 py-2">Rows / 24h</th>
                <th className="text-left px-4 py-2">Last sync</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-right px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--hairline-soft)]">
              {connectors.map((c) => {
                const failed = failSim === c.source;
                const status = failed ? 'failed' : c.status;
                const fivetranUrl = `https://fivetran.com/dashboard/connectors/${c.fivetran_id}`;
                return (
                  <tr key={c.source} className="hover:bg-[var(--paper-deep)]/40">
                    <td className="px-4 py-2 mono text-[var(--ink-strong)]">{c.source}</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span className="mono text-[11px] text-[var(--ink-soft)]">{c.fivetran_id}</span>
                        <a
                          href={fivetranUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--defense)] hover:text-[var(--defense-soft)] border border-[var(--defense)]/30 hover:border-[var(--defense-soft)] rounded-sm px-1.5 py-0.5 transition-colors whitespace-nowrap"
                          title={`Open connector ${c.fivetran_id} in Fivetran`}
                        >
                          Open in Fivetran
                          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M2 10L10 2M5 2h5v5" />
                          </svg>
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-2"><span className={`pill ${c.data_handling === 'cui' ? 'defense' : 'neutral'}`}>{c.data_handling.toUpperCase()}</span></td>
                    <td className="px-4 py-2 text-[var(--ink-muted)]">{c.destination}</td>
                    <td className="px-4 py-2 text-right tabular">{fmtNum(c.rows_24h)}</td>
                    <td className="px-4 py-2 mono text-[var(--ink-soft)]">{new Date(c.last_sync).toLocaleString()}</td>
                    <td className="px-4 py-2">
                      <span className={`pill ${status === 'ok' ? 'green' : status === 'failed' ? 'red' : 'amber'}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button
                        onClick={() => simulate(c.source)}
                        className="text-[11px] font-semibold text-[var(--orange-dim)] hover:text-[var(--gunmetal)]"
                      >
                        simulate failure
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* dbt models */}
      {models.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-4">
            <div className="eyebrow mb-1">dbt models</div>
            <h2 className="font-serif text-2xl font-semibold text-[var(--ink-strong)]">Representative silver and gold models</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {models.map((m) => (
              <div key={m.name} className="spec-card p-4 flex items-center justify-between">
                <div className="min-w-0">
                  <div className="mono text-sm text-[var(--ink-strong)] truncate">{m.name}</div>
                  <div className="text-[11px] text-[var(--ink-soft)]">{m.tests_pass} dbt tests passing</div>
                </div>
                <span className={`layer-chip ${m.layer === 'gold' ? 'gold' : 'silver'}`}>{m.layer}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Authority callout */}
      <section className="bg-[var(--defense-bg)] border-y border-[var(--hairline)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="eyebrow mb-1" style={{ color: 'var(--defense)' }}>Authority Boundary</div>
          <h2 className="font-serif text-xl font-semibold text-[var(--ink-strong)]">
            CUI-tagged connectors land in GovCloud. Same lineage. Different account.
          </h2>
          <p className="mt-2 text-sm text-[var(--ink-muted)] max-w-3xl">
            Apriso MES feeds from Fort Worth and Huntsville, Costpoint program accounting, and the
            Lockheed customer-portal feed are tagged CUI at the connector. They land in a separate
            AWS GovCloud account, with an isolated Iceberg namespace and a separate dbt project.
            The operating picture you see here is the union of the two pipelines, joined at the
            catalog layer under FAR/DFARS authority.
          </p>
        </div>
      </section>

      {/* dbt-wizard callout */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div
          className="spec-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
          style={{ borderLeft: '4px solid var(--orange)' }}
        >
          <div>
            <div className="eyebrow mb-1">dbt-wizard · On-demand model authoring</div>
            <h2 className="font-serif text-xl font-semibold text-[var(--ink-strong)] mt-0.5">
              Missing gold models authored on demand — same Snowflake account
            </h2>
            <p className="text-sm text-[var(--ink-muted)] mt-1 max-w-2xl">
              When a reliability question has no gold model to answer it, dbt-wizard's four sub-agents
              author, test, and materialize one in under two minutes. Live demo: Chief Reliability Officer
              asks why the Pacific fleet servo removal rate is 2.4x Atlantic — $11M AOG exposure, Airworthiness
              Review in 12 hours. No gold.fct_removal_by_part_route_corridor_60d exists. dbt-wizard builds it
              in 90 seconds.
            </p>
          </div>
          <a
            href="#/dbt-wizard"
            className="inline-flex items-center gap-2 rounded-sm font-semibold text-[var(--gunmetal-deep)] px-5 py-3 whitespace-nowrap hover:opacity-95 transition-opacity shrink-0"
            style={{ background: 'var(--orange)' }}
          >
            Run the scenario
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>
    </>
  );
}
