import { BentoIcon } from '../primitives/Icon';
import { useId, type ReactNode } from 'react';
import { Button, Card, Tooltip, Typography } from '@heroui/react';
import { CircleHelp, type LucideIcon } from 'lucide-react';
import { StatGlowBadge, type GlowLevel } from '../primitives/Badge';

export { StatGlowBadge, type GlowLevel };

export function MoneyText({ value, suffix = ' ₫' }: { value: string; suffix?: string }) {
  const isCurrency = suffix ? value.endsWith(suffix) : false;
  const mainValue = isCurrency && suffix ? value.slice(0, -suffix.length) : value;
  return (
    <>
      {mainValue}
      {isCurrency && <span className="currency-unit">{suffix}</span>}
    </>
  );
}

export function buildSparklinePath(values: number[] | undefined) {
  const width = 112;
  const height = 44;
  const startX = 3;
  const endX = width - 3;

  if (!values || values.length === 0) {
    const flat = `M ${startX},35 L ${endX},35`;
    return { linePath: flat, areaPath: `${flat} L ${endX},${height} L ${startX},${height} Z` };
  }

  if (values.length === 1) {
    const y = values[0] > 0 ? 19 : 35;
    const flat = `M ${startX},${y} L ${endX},${y}`;
    return { linePath: flat, areaPath: `${flat} L ${endX},${height} L ${startX},${height} Z` };
  }

  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min;

  const stepX = (endX - startX) / (values.length - 1);
  const pts = values.map((val, idx) => {
    const ratio = span === 0 ? (max > 0 ? 0.55 : 0.14) : 0.14 + ((val - min) / span) * 0.8;
    return {
      x: Number((startX + idx * stepX).toFixed(1)),
      y: Number((39 - ratio * 31).toFixed(1)),
    };
  });

  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const curr = pts[i];
    const next = pts[i + 1];
    const midX = Number(((curr.x + next.x) / 2).toFixed(1));
    d += ` C ${midX},${curr.y} ${midX},${next.y} ${next.x},${next.y}`;
  }

  const area = `${d} L ${pts[pts.length - 1].x},${height} L ${pts[0].x},${height} Z`;
  return { linePath: d, areaPath: area };
}

export type StatTone = 'blue' | 'emerald' | 'indigo' | 'amber';

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  note: ReactNode;
  helpText?: string;
  helpAriaLabel?: string;
  tone?: StatTone;
  trend?: number[];
  currencySuffix?: string;
  className?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  note,
  helpText,
  helpAriaLabel,
  tone = 'blue',
  trend,
  currencySuffix = ' ₫',
  className,
}: StatCardProps) {
  const gradId = useId();
  const { linePath, areaPath } = buildSparklinePath(trend);

  return (
    <Card className={`stat-card stat-card-${tone} ${className ?? ''}`.trim()}>
      <Card.Header className="stat-header">
        <span className={`stat-icon stat-icon-${tone}`} aria-hidden="true">
          <BentoIcon icon={Icon} size={20} />
        </span>
        <div className="stat-main">
          <Card.Title className="stat-title-row">
            <span>{label}</span>
            {helpText && (
              <Tooltip delay={150}>
                <Button
                  isIconOnly
                  size="sm"
                  variant="ghost"
                  className="stat-help-trigger"
                  aria-label={helpAriaLabel ?? `Giải thích ${label}`}
                >
                  <BentoIcon icon={CircleHelp} size={12} />
                </Button>
                <Tooltip.Content placement="top" className="stat-help-tooltip">
                  {helpText}
                </Tooltip.Content>
              </Tooltip>
            )}
          </Card.Title>
          <Typography type="h3" render={props => <div {...props} />} className="stat-value">
            <MoneyText value={value} suffix={currencySuffix} />
          </Typography>
        </div>
      </Card.Header>
      <Card.Footer className="stat-meta">{note}</Card.Footer>
      <svg
        className={`stat-sparkline stat-sparkline-${tone}`}
        viewBox="0 0 112 44"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.34" />
            <stop offset="75%" stopColor="currentColor" stopOpacity="0.09" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#${gradId})`} />
        <path
          d={linePath}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Card>
  );
}
