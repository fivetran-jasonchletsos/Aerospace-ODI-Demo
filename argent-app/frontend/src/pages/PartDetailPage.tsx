import { useParams, Link, useNavigate } from "react-router-dom";
import { partByNo } from "../data/parts-catalog";
import { relatedFor } from "../lib/related";
import { ATA_LABEL, SYSTEM_FAMILY_LABEL, PLATFORM_LABEL } from "../data/parts-catalog";
import { systemColor } from "../lib/part-graph";
import PageHeader from "../components/PageHeader";

export default function PartDetailPage() {
  const { partNo } = useParams<{ partNo: string }>();
  const navigate = useNavigate();
  const part = partNo ? partByNo(decodeURIComponent(partNo)) : undefined;

  if (!part) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="eyebrow mb-2">Part not found</div>
        <h1 className="font-serif text-2xl font-semibold text-[var(--ink-strong)] mb-4">
          {partNo ?? "Unknown part number"}
        </h1>
        <Link to="/related" className="mono text-[11px] uppercase tracking-wider text-[var(--orange-dim)] underline">
          Back to parts network
        </Link>
      </div>
    );
  }

  const neighbors = relatedFor(part.part_no);

  return (
    <>
      <PageHeader
        eyebrow={`${SYSTEM_FAMILY_LABEL[part.system_family] ?? part.system_family} · ${ATA_LABEL[part.ata_chapter] ?? `ATA ${part.ata_chapter}`}`}
        title={part.description}
        callout={part.part_no}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Part attributes */}
          <div className="lg:col-span-2 space-y-6">
            <div className="spec-card p-6">
              <div className="mb-4 border-b border-[var(--hairline)] pb-3">
                <div className="eyebrow mb-1">Part attributes</div>
              </div>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <Attr label="Part number"    value={<span className="partno">{part.part_no}</span>} />
                <Attr label="System family"  value={SYSTEM_FAMILY_LABEL[part.system_family] ?? part.system_family} />
                <Attr label="ATA chapter"    value={ATA_LABEL[part.ata_chapter] ?? `ATA ${part.ata_chapter}`} />
                <Attr label="Segment"        value={part.segment} />
                <Attr label="Supplier"       value={part.supplier_id} />
                <Attr label="Unit cost"      value={`$${part.unit_cost_usd.toLocaleString()}`} />
                <Attr
                  label="Platforms"
                  value={part.platforms.map((p) => PLATFORM_LABEL[p] ?? p).join(", ")}
                />
              </dl>
            </div>

            <div className="spec-card p-6">
              <div className="mb-4 border-b border-[var(--hairline)] pb-3">
                <div className="eyebrow mb-1">Failure mode signatures</div>
                <p className="text-sm text-[var(--ink-muted)]">
                  Observed and potential failure modes from fleet experience and FMEA records.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {part.failure_modes.map((fm) => (
                  <span
                    key={fm}
                    className="inline-flex items-center gap-1.5 px-3 py-1 border border-[var(--hairline-navy)] rounded-sm mono text-[11px] text-[var(--ink-muted)]"
                    style={{ borderLeft: `3px solid var(--red)` }}
                  >
                    {fm.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Related parts panel */}
          <aside className="space-y-4">
            <div className="spec-card overflow-hidden">
              <div className="spec-card-header">
                <div>
                  <div className="eyebrow mb-0.5">Related parts</div>
                  <div className="text-sm text-[var(--ink-muted)]">
                    Top {neighbors.length} by composite similarity
                  </div>
                </div>
                <Link
                  to="/related"
                  className="mono text-[9px] uppercase tracking-[0.2em] text-[var(--orange-dim)] border border-[var(--orange)]/40 px-2 py-1 hover:bg-[var(--orange-bg)] transition-colors"
                >
                  Full network
                </Link>
              </div>

              <ol className="divide-y divide-[var(--hairline-soft)]">
                {neighbors.map((nb) => {
                  const color = systemColor(nb.part.system_family);
                  return (
                    <li key={nb.part_no}>
                      <Link
                        to={`/parts/${encodeURIComponent(nb.part_no)}`}
                        className="block px-4 py-3 hover:bg-[var(--orange-bg)] transition-colors"
                      >
                        <div className="flex items-start gap-2">
                          <span
                            className="mt-1.5 inline-block flex-none rounded-full"
                            style={{ width: 8, height: 8, background: color }}
                          />
                          <div className="min-w-0">
                            <div className="font-serif text-sm text-[var(--ink-strong)] leading-snug">
                              {nb.part.description}
                            </div>
                            <div className="mono text-[9px] text-[var(--ink-soft)] mt-0.5">
                              {nb.part_no}
                            </div>
                            <div className="mono text-[9px] text-[var(--ink-muted)] mt-0.5 truncate">
                              {nb.why}
                            </div>
                            {nb.sharedFailureModes.length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {nb.sharedFailureModes.map((fm) => (
                                  <span
                                    key={fm}
                                    className="mono text-[8px] px-1 py-0.5 bg-[var(--red-bg)] border border-[var(--red)]/20 text-[var(--red)] rounded-sm"
                                  >
                                    {fm.replace(/_/g, " ")}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <span className="mono text-[9px] text-[var(--orange-dim)] flex-none ml-auto">
                            {Math.round(nb.score * 100)}%
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ol>

              <div className="px-4 py-3 bg-[var(--paper-deep)] border-t border-[var(--hairline-soft)] text-[11px] text-[var(--ink-soft)]">
                Similarity: system family and ATA chapter weighted highest, then platform,
                failure-mode signature, and supplier.
              </div>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="mono text-[10px] uppercase tracking-wider text-[var(--ink-soft)] border border-[var(--hairline-navy)] px-3 py-1.5 hover:bg-[var(--paper-deep)] transition-colors w-full"
            >
              Back
            </button>
          </aside>
        </div>
      </div>
    </>
  );
}

function Attr({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="mono text-[9px] uppercase tracking-[0.2em] text-[var(--ink-soft)] mb-1">{label}</dt>
      <dd className="text-[var(--ink-strong)]">{value}</dd>
    </div>
  );
}
