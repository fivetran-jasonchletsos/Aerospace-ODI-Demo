interface KpiTileProps {
  label: string;
  value: string;
  delta?: string | null;
  deltaTone?: 'good' | 'bad' | 'neutral';
  sub?: string;
  accent?: 'orange' | 'defense' | 'neutral';
}

export default function KpiTile({ label, value, delta, deltaTone = 'neutral', sub, accent = 'neutral' }: KpiTileProps) {
  const accentColor =
    accent === 'orange' ? 'var(--orange)' :
    accent === 'defense' ? 'var(--defense)' :
    'var(--gunmetal)';
  const deltaColor =
    deltaTone === 'good' ? 'var(--green)' :
    deltaTone === 'bad'  ? 'var(--red)'   :
    'var(--ink-soft)';
  return (
    <div className="spec-card px-4 py-4 relative">
      <div className="absolute top-0 left-0 h-[3px] w-10" style={{ background: accentColor }} />
      <div className="text-[10.5px] font-semibold text-[var(--ink-soft)] uppercase tracking-[0.10em]">{label}</div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <div className="font-serif text-3xl font-semibold text-[var(--ink-strong)] leading-none tabular">{value}</div>
        {delta != null && (
          <span className="mono text-[11px] font-semibold tabular" style={{ color: deltaColor }}>{delta}</span>
        )}
      </div>
      {sub && <div className="mt-2 text-[11px] text-[var(--ink-soft)] leading-snug">{sub}</div>}
    </div>
  );
}
