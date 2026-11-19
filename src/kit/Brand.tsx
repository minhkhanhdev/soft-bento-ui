import { Layers3 } from 'lucide-react';

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand" aria-label={compact ? 'PrintOS' : undefined}>
      <span className="brand-mark" aria-hidden="true">
        <Layers3 size={22} strokeWidth={1.85} aria-hidden="true" />
      </span>
      {!compact && (
        <span>
          print<span className="brand-os">os</span>
          <span className="brand-dot">.</span>
        </span>
      )}
    </div>
  );
}
