import { useEffect, useState } from 'react';
import { api, fmtBytes, fmtNum } from '../api/queries';
import type { IcebergTable } from '../types';
import PageHeader from '../components/PageHeader';

export default function ArchitecturePage() {
  const [tables, setTables] = useState<IcebergTable[]>([]);

  useEffect(() => { api.getIceberg().then(setTables).catch(() => {}); }, []);

  const bySource = ['sap_s4', 'teamcenter', 'apriso', 'maximo', 'costpoint', 'ariba', 'customer_portal'] as const;

  return (
    <>
      <PageHeader
        eyebrow="ODI Architecture"
        title="Six source systems. One governed lake. Two authority boundaries."
        blurb="Argent's operating data lives in SAP, Teamcenter, Apriso, Maximo, Costpoint, Ariba and OEM portals. Fivetran lands each into Snowflake + Apache Iceberg. CUI defense-program data is segregated on AWS GovCloud; commercial-OEM data lands in the public account. dbt builds the bronze, silver and gold marts that this site reads."
        callout="REV. C · SHEET 02 OF 08"
      />

      {/* Source systems */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="eyebrow mb-1">Source Systems</div>
          <h2 className="font-serif text-2xl font-semibold text-[var(--ink-strong)]">Seven connectors. Two destinations.</h2>
          <p className="text-sm text-[var(--ink-muted)] mt-1 max-w-3xl">
            Each source has its own ownership boundary, its own audit posture, and its own change
            cadence. Fivetran handles the schema drift; the lake takes the bytes; dbt builds the
            semantic layer the COO actually reads.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SOURCE_CARDS.map((c) => (
            <div key={c.system} className="spec-card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="layer-chip bronze">{c.system}</span>
                <span className={`pill ${c.handling === 'CUI' ? 'defense' : 'neutral'}`}>{c.handling}</span>
              </div>
              <h3 className="font-serif text-lg font-semibold text-[var(--ink-strong)]">{c.title}</h3>
              <p className="mt-2 text-sm text-[var(--ink-muted)] leading-relaxed">{c.body}</p>
              <div className="mt-3 mono text-[10px] text-[var(--ink-soft)] uppercase tracking-wider">
                DEST: {c.dest}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Flow diagram */}
      <section className="bg-white border-y border-[var(--hairline)]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="eyebrow mb-1">Lineage</div>
            <h2 className="font-serif text-2xl font-semibold text-[var(--ink-strong)]">From source system to operating decision</h2>
          </div>
          <ol className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[
              { tag: '01', label: 'Sources', desc: 'SAP, Teamcenter, Apriso, Maximo, Costpoint, Ariba, OEM portals.', chip: 'bronze' as const },
              { tag: '02', label: 'Ingest',  desc: 'Fivetran lands each into Snowflake + Apache Iceberg. CUI feeds routed to GovCloud.', chip: 'bronze' as const },
              { tag: '03', label: 'Transform', desc: 'dbt builds silver (conformed) and gold (operations-ready) marts with AS9100-aligned tests.', chip: 'silver' as const },
              { tag: '04', label: 'Serve',   desc: 'Snowflake serves the COO portal; Athena and DuckDB read the same Iceberg gold layer.', chip: 'gold' as const },
              { tag: '05', label: 'Reason',  desc: 'Supplier-risk and program-health agents read gold-layer Iceberg through the Glue catalog.', chip: 'gold' as const },
            ].map((s) => (
              <li key={s.tag} className="spec-card p-4 hover:border-[var(--orange)] transition-colors">
                <div className="mono text-[10px] font-bold text-[var(--orange-dim)] tracking-wider">{s.tag}</div>
                <div className="mt-1 font-serif text-base font-semibold text-[var(--ink-strong)]">{s.label}</div>
                <p className="mt-2 text-xs text-[var(--ink-muted)] leading-relaxed">{s.desc}</p>
                <div className="mt-3"><span className={`layer-chip ${s.chip}`}>{s.chip}</span></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Iceberg tables */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between border-b border-[var(--hairline)] pb-3">
          <div>
            <div className="eyebrow mb-1">Iceberg Catalog</div>
            <h2 className="font-serif text-2xl font-semibold text-[var(--ink-strong)]">{tables.length} representative tables</h2>
            <p className="text-sm text-[var(--ink-muted)] mt-1">Sampled from the bronze, silver and gold namespaces. CUI rows live in a separate Iceberg namespace on GovCloud.</p>
          </div>
        </div>
        <div className="spec-card overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[var(--paper-deep)] text-[var(--ink-soft)] text-[11px] uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-2">Layer</th>
                <th className="text-left px-4 py-2">Table</th>
                <th className="text-left px-4 py-2">Source</th>
                <th className="text-left px-4 py-2">Handling</th>
                <th className="text-right px-4 py-2">Rows</th>
                <th className="text-right px-4 py-2">Bytes</th>
                <th className="text-right px-4 py-2">Cols</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--hairline-soft)]">
              {tables.map((t) => (
                <tr key={`${t.database}.${t.table}`} className="hover:bg-[var(--paper-deep)]/40">
                  <td className="px-4 py-2"><span className={`layer-chip ${t.database === 'bronze' ? 'bronze' : t.database === 'silver' ? 'silver' : 'gold'}`}>{t.database}</span></td>
                  <td className="px-4 py-2 mono text-[var(--ink-strong)]">{t.table}</td>
                  <td className="px-4 py-2 text-[var(--ink-muted)]">{bySource.includes(t.source_system as any) ? t.source_system : 'derived'}</td>
                  <td className="px-4 py-2"><span className={`pill ${t.data_handling === 'cui' ? 'defense' : 'neutral'}`}>{t.data_handling.toUpperCase()}</span></td>
                  <td className="px-4 py-2 text-right tabular">{fmtNum(t.rows)}</td>
                  <td className="px-4 py-2 text-right tabular">{fmtBytes(t.bytes)}</td>
                  <td className="px-4 py-2 text-right tabular">{t.schema_columns}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Authority boundary callout */}
      <section className="bg-[var(--defense-bg)] border-y border-[var(--hairline)]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <div className="eyebrow mb-1" style={{ color: 'var(--defense)' }}>FAR / DFARS Authority Boundary</div>
              <h2 className="font-serif text-2xl font-semibold text-[var(--ink-strong)]">Two accounts. Two boundaries. One catalog.</h2>
              <p className="mt-3 text-sm text-[var(--ink-muted)] leading-relaxed">
                Argent runs two AWS organizations: a public commercial-OEM account and a GovCloud
                account for CUI defense-program data. Fivetran connectors land each feed into the
                correct account. The Iceberg catalog presents one logical surface — but every
                gold-layer model has a <span className="mono">data_handling</span> tag, and queries
                that join CUI to commercial are blocked at the catalog layer unless the requesting
                user is US-person-attested.
              </p>
            </div>
            <div className="spec-card p-5">
              <div className="mono text-[10px] uppercase tracking-wider text-[var(--ink-soft)]">CMMC Level 2 · DFARS 252.204-7012 · ITAR</div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <Field label="Commercial OEM data" value="AWS public · Iceberg + Snowflake" />
                <Field label="Defense / CUI data"   value="AWS GovCloud · separate Iceberg namespace" />
                <Field label="Catalog enforcement" value="Glue + Snowflake Horizon tags" />
                <Field label="US-person check"     value="At query time, via attribute-based access" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const SOURCE_CARDS = [
  { system: 'sap_s4',          handling: 'Unclassified', title: 'SAP S/4HANA',           dest: 'Snowflake (managed Iceberg)', body: 'Enterprise ERP. Material master, POs, production orders, plant inventory, financials.' },
  { system: 'teamcenter',      handling: 'Unclassified', title: 'Siemens Teamcenter',    dest: 'Iceberg',                     body: 'PLM. Engineering BOM, revision history, change orders, effectivity windows.' },
  { system: 'apriso',          handling: 'Mixed',        title: 'Apriso MES',            dest: 'Iceberg (per-site)',          body: 'Manufacturing execution per site. CUI tag applied for Fort Worth and Huntsville defense sites; commercial sites land in the public account.' },
  { system: 'maximo',          handling: 'Unclassified', title: 'IBM Maximo',            dest: 'Iceberg',                     body: 'MRO asset management. Bay assignments, work packages, parts consumption, AD/SB compliance.' },
  { system: 'costpoint',       handling: 'CUI',          title: 'Deltek Costpoint',      dest: 'Snowflake (CUI schema)',      body: 'DCAA-compliant program accounting. Indirect-rate pools, earned-value reporting, government audit trail.' },
  { system: 'ariba',           handling: 'Unclassified', title: 'SAP Ariba',             dest: 'Snowflake',                   body: 'Supplier network. Supplier master, qualification, contracts, sourcing events.' },
  { system: 'customer_portal', handling: 'Mixed',        title: 'OEM customer portals',  dest: 'Iceberg',                     body: 'Shipset demand and OEM-side quality. Commercial-OEM feeds in the public account; defense-prime feeds CUI-tagged.' },
];

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold text-[var(--ink-soft)] uppercase tracking-[0.08em]">{label}</div>
      <div className="mt-0.5 font-serif text-[15px] text-[var(--ink-strong)]">{value}</div>
    </div>
  );
}
