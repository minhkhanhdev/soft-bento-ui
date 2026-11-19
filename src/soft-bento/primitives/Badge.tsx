import { BentoIcon } from './Icon';
import type { ReactNode } from 'react';
import { Chip } from '@heroui/react';
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from 'lucide-react';

export type GlowLevel = 'positive' | 'warning' | 'danger' | 'info' | 'indigo';

export function StatGlowBadge({
  level = 'positive',
  trend,
  dot = false,
  children,
}: {
  level?: GlowLevel;
  trend?: 'up' | 'down';
  dot?: boolean;
  children: ReactNode;
}) {
  return (
    <span className={`stat-glow-badge stat-glow-${level}`}>
      {trend === 'up' && <BentoIcon icon={ArrowUpRight} size={12} />}
      {trend === 'down' && <BentoIcon icon={ArrowDownRight} size={12} />}
      {dot && <i className="stat-glow-dot" aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
}

export type StatusPillTone = 'amber' | 'blue' | 'indigo' | 'sky' | 'emerald' | 'danger' | 'neutral';

const chipColorByTone: Record<StatusPillTone, 'warning' | 'accent' | 'default' | 'success' | 'danger'> = {
  amber: 'warning',
  blue: 'accent',
  indigo: 'default',
  sky: 'default',
  emerald: 'success',
  danger: 'danger',
  neutral: 'default',
};

export interface StatusPillProps {
  tone?: StatusPillTone;
  dot?: boolean;
  icon?: LucideIcon;
  className?: string;
  children: ReactNode;
}

/**
 * Domain-neutral semantic status pill built on HeroUI v3 Chip with symmetrical spacing,
 * supporting either a clean status dot or an optional leading icon.
 */
export function StatusPill({
  tone = 'neutral',
  dot = true,
  icon: Icon,
  className,
  children,
}: StatusPillProps) {
  return (
    <Chip
      color={chipColorByTone[tone]}
      variant="soft"
      size="sm"
      className={`status-chip status-pill-${tone} ${className ?? ''}`.trim()}
    >
      {Icon ? (
        <BentoIcon icon={Icon} size={12} className="status-chip-icon" />
      ) : (
        dot && <span className="status-chip-dot" aria-hidden="true" />
      )}
      <Chip.Label>{children}</Chip.Label>
    </Chip>
  );
}
