import { useEffect, useState } from 'react';
import { api } from '../api/queries';
import PageHeader from '../components/PageHeader';

interface ComplianceRow { control: string; status: string; note: string }

export default function PolicyPage() {
  const [compliance, setCompliance] = useState<ComplianceRow[]>([]);

  useEffect(() => {
    api.getDefense().then((d) => setCompliance(d.compliance)).catch(() => {});
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Policy Brief"
        title="Why aerospace and defense data is fragmented — and how ODI bridges it."
        blurb="A short brief for the COO and CSCO on why operations data is harder to unify in a defense prime than in a commercial-only business, and what an Open Data Infrastructure does about it under FAR/DFARS authority."
        callout="REV. C · SHEET 07 OF 08"
      />

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <article className="spec-card p-6">
          <div className="eyebrow mb-2">Section 01</div>
          <h2 className="font-serif text-2xl font-semibold text-[var(--ink-strong)]">Why the data is fragmented</h2>
          <p className="mt-3 text-[var(--ink-muted)] leading-relaxed">
            A tier-1 aerospace and defense prime sits on six structurally separate systems of
            record. SAP S/4HANA owns the financial ledger and material master. Siemens Teamcenter
            owns the engineering bill of materials and configuration baseline. Apriso MES owns
            the shop-floor traveler. IBM Maximo owns the MRO asset and work-package state.
            Deltek Costpoint owns the program accounting that keeps Argent auditable under
            DCAA. SAP Ariba owns the supplier network. Each was procured by a different VP
            in a different decade. Each is correct in its own domain. None of them is a single
            source of truth for an operating decision.
          </p>
          <p className="mt-3 text-[var(--ink-muted)] leading-relaxed">
            Layered on top of that, the OEM customer portals — Boeing, Airbus, Lockheed —
            publish shipset demand and OEM-side quality scorecards on their own schedules
            and formats. None of these systems is going away over the life of the next
            commercial program, let alone a thirty-year defense program.
          </p>
        </article>

        <article className="spec-card p-6" style={{ borderColor: 'var(--defense)' }}>
          <div className="eyebrow mb-2" style={{ color: 'var(--defense)' }}>Section 02</div>
          <h2 className="font-serif text-2xl font-semibold text-[var(--ink-strong)]">The defense authority boundary</h2>
          <p className="mt-3 text-[var(--ink-muted)] leading-relaxed">
            Half of the systems above carry Controlled Unclassified Information (CUI). The
            Fort Worth and Huntsville Apriso instances, the Lockheed customer-portal feed
            and the Costpoint program-accounting streams are subject to DFARS 252.204-7012
            and the NIST SP 800-171 control set. Argent maintains CMMC Level 2 across the
            defense estate. The commercial-OEM estate is unclassified — but a careless join
            that mixed the two would create an authority-boundary violation by default.
          </p>
          <p className="mt-3 text-[var(--ink-muted)] leading-relaxed">
            The classical answer is to maintain two parallel warehouses and accept that the
            COO never sees the joined picture. The ODI answer is to land each feed into a
            CUI-tagged Iceberg namespace on AWS GovCloud, land the commercial feeds into a
            separate AWS public account, and let the catalog enforce the boundary at query
            time — under FAR and DFARS, not at the dashboard layer.
          </p>
        </article>

        <article className="spec-card p-6">
          <div className="eyebrow mb-2">Section 03</div>
          <h2 className="font-serif text-2xl font-semibold text-[var(--ink-strong)]">How ODI bridges it</h2>
          <p className="mt-3 text-[var(--ink-muted)] leading-relaxed">
            Fivetran lands each of the seven source systems into its correct destination —
            Snowflake-managed Iceberg for the hot path, raw Iceberg on S3 for the open path,
            CUI Iceberg on GovCloud for the defense path. dbt builds bronze, silver and gold
            marts with AS9100-aligned data-quality tests. The catalog (Glue plus Snowflake
            Horizon) carries a <span className="mono">data_handling</span> tag on every
            object. The catalog is what enforces the boundary, not the application.
          </p>
          <p className="mt-3 text-[var(--ink-muted)] leading-relaxed">
            The operating picture this site presents is the union of the two pipelines. The
            COO sees one number for on-time delivery to the OEM line. The CSCO sees one
            supplier-risk panel. The defense-program manager sees the CUI subset their
            citizenship attestation entitles them to see. The agents that read the lake
            obey the same access policy.
          </p>
        </article>

        {compliance.length > 0 && (
          <article className="spec-card p-6">
            <div className="eyebrow mb-2">Compliance posture</div>
            <h2 className="font-serif text-2xl font-semibold text-[var(--ink-strong)]">Controls in scope</h2>
            <ul className="mt-4 space-y-3">
              {compliance.map((c) => (
                <li key={c.control} className="flex items-start gap-3">
                  <span className="pill green mt-0.5 shrink-0">{c.status}</span>
                  <div className="min-w-0">
                    <div className="font-serif font-semibold text-[var(--ink-strong)]">{c.control}</div>
                    <div className="text-sm text-[var(--ink-muted)] mt-0.5">{c.note}</div>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        )}
      </section>
    </>
  );
}
