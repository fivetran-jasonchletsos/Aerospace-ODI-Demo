import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8 text-center">
      <div className="mono text-xs text-[var(--orange-dim)] tracking-widest">SHEET NOT FOUND</div>
      <h1 className="mt-3 font-serif text-4xl font-semibold text-[var(--ink-strong)]">404</h1>
      <p className="mt-3 text-[var(--ink-muted)]">That route is not on the drawing. Return to the operating picture.</p>
      <Link to="/" className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-[var(--orange)] text-[var(--gunmetal-deep)] font-semibold text-sm">
        Operations home
      </Link>
    </div>
  );
}
