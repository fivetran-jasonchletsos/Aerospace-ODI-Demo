interface PageHeaderProps {
  eyebrow: string;
  title: string;
  blurb?: string;
  callout?: string;
}

export default function PageHeader({ eyebrow, title, blurb, callout }: PageHeaderProps) {
  return (
    <header className="border-b border-[var(--hairline-navy)] bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 panel-bracket">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="max-w-3xl">
            <div className="eyebrow mb-2">{eyebrow}</div>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--ink-strong)]">
              {title}
            </h1>
            {blurb && <p className="mt-3 text-sm sm:text-base text-[var(--ink-muted)] leading-relaxed">{blurb}</p>}
          </div>
          {callout && (
            <div className="mono text-[11px] text-[var(--ink-soft)] tracking-wider whitespace-nowrap border-l-2 border-[var(--orange)] pl-3">
              {callout}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
