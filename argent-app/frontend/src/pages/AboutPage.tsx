export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Canonical ODI Story block — verbatim copy of FinServ pattern */}
      <section className="spec-card p-6 mb-10" style={{ borderColor: 'var(--orange)' }}>
        <div className="eyebrow mb-2" style={{ color: 'var(--orange-dim)' }}>The ODI Story</div>
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-[var(--ink-strong)]">
          Data infrastructure for agents you trust.
        </h2>
        <p className="mt-3 text-[var(--ink-muted)] leading-relaxed">
          <em>"MDS was optimized for humans. ODI is designed for a future with humans and
          production agents at scale."</em> This demo is one instance of that architecture:
          Fivetran's 750+ connectors and Managed Data Lake Service (MDLS) land data into open
          table formats; dbt transformations build the governed semantic layer; multiple compute
          engines and AI agents read the same gold tables.
        </p>
        <a
          href="https://fivetran-jasonchletsos.github.io/Fivetran-Demo-Repository/story/"
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold hover:underline"
          style={{ color: 'var(--orange-dim)' }}
        >
          Read the full ODI Story →
        </a>
      </section>

      <header className="mb-8">
        <div className="eyebrow mb-1">ODI Reference Architecture</div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-[var(--ink-strong)]">About Argent Aerospace</h1>
        <p className="mt-3 text-[var(--ink-muted)] leading-relaxed">
          Argent Aerospace is a fictional Tier-1 aerospace and defense prime contractor. $24B annual
          revenue. 62,000 employees. Fourteen manufacturing and MRO sites. Three business segments:
          commercial-aircraft components for the major single-aisle programs, defense systems
          covering radar, ISR and air defense, and an after-market MRO services line supporting
          roughly 3,400 in-service aircraft.
        </p>
        <p className="mt-3 text-[var(--ink-muted)] leading-relaxed">
          This site is the operations intelligence portal the COO and the CSCO open every morning.
          It demonstrates how a defense prime can replace a sprawl of department-owned dashboards
          with one governed view, while still honoring the FAR/DFARS authority boundary between
          commercial and CUI defense-program data.
        </p>
      </header>

      <section className="mt-10">
        <h2 className="font-serif text-2xl font-semibold text-[var(--ink-strong)] border-b border-[var(--hairline)] pb-2 mb-4">Why ODI for a defense prime</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PILLARS.map((p) => (
            <div key={p.title} className="spec-card p-5">
              <div className="layer-chip gold inline-flex mb-3">{p.tag}</div>
              <h3 className="font-serif text-lg font-semibold text-[var(--ink-strong)]">{p.title}</h3>
              <p className="mt-1 text-sm text-[var(--ink-muted)] leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-2xl font-semibold text-[var(--ink-strong)] border-b border-[var(--hairline)] pb-2 mb-4">Tech stack</h2>
        <div className="spec-card p-5">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {STACK.map((s) => (
              <li key={s.name} className="flex items-start gap-3">
                <div className="layer-chip silver shrink-0 mt-0.5">{s.layer}</div>
                <div className="min-w-0">
                  <div className="font-serif font-semibold text-[var(--ink-strong)]">{s.name}</div>
                  <div className="text-xs text-[var(--ink-muted)]">{s.note}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-2xl font-semibold text-[var(--ink-strong)] border-b border-[var(--hairline)] pb-2 mb-4">Source systems</h2>
        <div className="space-y-3">
          {SOURCES.map((s) => (
            <article key={s.title} className="spec-card p-5">
              <div className="flex items-start gap-3">
                <span className="layer-chip bronze shrink-0">Source</span>
                <div className="min-w-0">
                  <h3 className="font-serif text-lg font-semibold text-[var(--ink-strong)]">{s.title}</h3>
                  <p className="mt-1 text-sm text-[var(--ink-muted)] leading-relaxed">{s.description}</p>
                  <div className="mt-2 text-xs text-[var(--ink-soft)]">
                    <span className="font-semibold uppercase tracking-wider text-[10px]">Provides:</span> {s.provides}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-sm bg-[var(--paper-deep)] border border-[var(--hairline)] p-5 text-sm">
        <div className="eyebrow mb-2" style={{ color: 'var(--amber)' }}>Disclaimer</div>
        <p className="text-[var(--ink-muted)] leading-relaxed">
          <strong className="text-[var(--ink-strong)]">All data on this site is synthetic.</strong>{' '}
          Argent Aerospace is a fictional prime contractor invented for ODI architecture demonstration.
          Program names, customers, supplier names and contract values are illustrative only. No real
          classified program data, no real DoD program identifiers, and no real OEM proprietary data
          is included.
        </p>
      </section>
    </div>
  );
}

const PILLARS = [
  { tag: 'Pillar 1', title: 'One operating picture across six source systems',
    body: 'ERP, PLM, MES, MRO, program accounting and supplier networks land in one lake — without forcing the operations team to abandon any of them.' },
  { tag: 'Pillar 2', title: 'Authority boundary preserved by storage layout',
    body: 'CUI defense-program data sits in a segregated GovCloud Iceberg namespace. Commercial-OEM data sits in the public account. The catalog presents one logical surface; the bytes never cross.' },
  { tag: 'Pillar 3', title: 'Thirty-year program horizon, vendor-neutral storage',
    body: 'A defense program outlives any single warehouse vendor. Iceberg + Glue gives Argent a storage layer that does not need to be migrated when the compute engine of the day changes.' },
];

const STACK = [
  { layer: 'Ingest',     name: 'Fivetran connectors',         note: 'SAP S/4HANA, Teamcenter, Apriso, Maximo, Costpoint, Ariba, OEM portals.' },
  { layer: 'Storage',    name: 'Snowflake + Iceberg on S3',   note: 'Snowflake-managed Iceberg for the hot path; raw Iceberg for openness.' },
  { layer: 'Catalog',    name: 'AWS Glue + Snowflake Horizon',note: 'CUI tag enforced at the catalog layer. ITAR US-person attestation.' },
  { layer: 'Transform',  name: 'dbt',                          note: 'Bronze → silver → gold with AS9100-aligned data quality tests.' },
  { layer: 'Compute',    name: 'Snowflake + Athena',           note: 'Snowflake for the COO portal; Athena for ad-hoc and the data-science team.' },
  { layer: 'Frontend',   name: 'React 19 + Vite + Tailwind v4', note: 'Static SPA on GitHub Pages, reads JSON snapshot of the gold layer.' },
];

const SOURCES = [
  { title: 'SAP S/4HANA — Enterprise ERP',
    description: 'The system of record for material master, purchase orders, production orders, financials and cost accounting across the commercial segment.',
    provides: 'Material master · PO/PR · production orders · cost centers · plant inventory' },
  { title: 'Siemens Teamcenter — PLM',
    description: 'Engineering bill-of-materials, configuration management, change orders and revision control for every airframe and avionics LRU Argent designs or builds to print.',
    provides: 'eBOM · revision history · change orders · effectivity windows' },
  { title: 'Apriso MES — Manufacturing Execution',
    description: 'Per-site shop-floor execution covering work orders, traveler steps, takt timing, yield, and AS9100-traceable build records. Separate CUI-tagged feeds from the Fort Worth and Huntsville defense sites.',
    provides: 'Work orders · takt · yield · operator + station traceability' },
  { title: 'IBM Maximo — MRO Asset Management',
    description: 'Asset and work-order management for the MRO line. Bay assignments, work-package scope, parts consumption against the IPC, and AD/SB compliance tracking.',
    provides: 'MRO bays · work packages · parts fill rate · AD/SB compliance' },
  { title: 'Deltek Costpoint — DCAA-compliant program accounting',
    description: 'Program-level cost accounting that keeps direct/indirect rate pools auditable for DCAA. Costpoint is the system that lets Argent be auditable as a defense prime; ODI keeps its outputs joinable to the rest of operations.',
    provides: 'Program cost · indirect pools · earned-value (CPI/SPI) · DCAA audit trail' },
  { title: 'SAP Ariba — Supplier network',
    description: 'Supplier master, sourcing events, contracts and supplier qualification. The basis of the supplier scorecard agent.',
    provides: 'Supplier master · qualification status · contract terms · sourcing events' },
  { title: 'OEM customer portals',
    description: 'Shipset demand, schedule changes and quality scorecards published by Argent\'s commercial-OEM customers and defense primes. Pulled as nightly extracts. Commercial-OEM feeds land in the public account; defense-prime feeds land CUI-tagged.',
    provides: 'Shipset demand · OEM line schedule · OEM-side quality scores' },
];
