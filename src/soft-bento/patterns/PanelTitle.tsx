import { BentoIcon } from '../primitives/Icon';
import type { ReactNode } from 'react';
import { Card } from '@heroui/react';
import type { LucideIcon } from 'lucide-react';

export type PanelTitleTone = 'blue' | 'indigo' | 'emerald' | 'amber' | 'sky';

export interface PanelTitleProps {
  icon?: LucideIcon;
  tone?: PanelTitleTone;
  title: string;
  subtitle?: ReactNode;
  badge?: ReactNode;
  className?: string;
}

export function PanelTitle({
  icon: Icon,
  tone = 'blue',
  title,
  subtitle,
  badge,
  className,
}: PanelTitleProps) {
  return (
    <Card.Title className={`panel-title-row ${subtitle ? 'has-subtitle' : ''} ${className ?? ''}`.trim()}>
      {Icon && (
        <span className={`panel-icon-badge panel-icon-${tone}`} aria-hidden="true">
          <BentoIcon icon={Icon} size={16} />
        </span>
      )}
      {subtitle ? (
        <span className="panel-title-stack">
          <span className="panel-title-main">
            <span>{title}</span>
            {badge}
          </span>
          <span className="panel-subtitle">{subtitle}</span>
        </span>
      ) : (
        <>
          <span>{title}</span>
          {badge}
        </>
      )}
    </Card.Title>
  );
}
