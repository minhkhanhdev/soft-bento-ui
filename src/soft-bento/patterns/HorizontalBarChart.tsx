import { useEffect, useState } from 'react';
import { Button } from '@heroui/react';
import type { StatusPillTone } from '../primitives/Badge';

export interface HorizontalBarItem {
  key: string;
  label: string;
  count: number;
  tone: Exclude<StatusPillTone, 'neutral'>;
  ariaLabel?: string;
}

export interface HorizontalBarChartProps {
  items: HorizontalBarItem[];
  total?: number;
  unitLabel?: string;
  emptyText?: string;
  ariaLabel?: string;
  className?: string;
  onSelectItem?: (item: HorizontalBarItem) => void;
}

/**
 * Proportional horizontal bar chart pattern where bar widths strictly match
 * `count / total` percentages, with interactive row hover tooltips and filtering.
 */
export function HorizontalBarChart({
  items,
  total: totalOverride,
  unitLabel = 'mục',
  emptyText = 'Chưa có dữ liệu',
  ariaLabel,
  className,
  onSelectItem,
}: HorizontalBarChartProps) {
  const computedTotal = totalOverride ?? items.reduce((sum, item) => sum + item.count, 0);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  useEffect(() => {
    setHoverIdx(null);
  }, [computedTotal]);

  const hoveredItem = hoverIdx === null ? null : (items[hoverIdx] ?? null);
  const hoveredPct =
    hoveredItem && computedTotal > 0 ? Math.round((hoveredItem.count / computedTotal) * 100) : 0;

  return (
    <div
      className={`bento-bar-chart order-status-chart ${className ?? ''}`.trim()}
      role="group"
      aria-label={ariaLabel}
    >
      {hoveredItem && hoveredItem.count > 0 && computedTotal > 0 && (
        <div
          className={`status-chart-tooltip pointer-events-none absolute right-0 z-10 whitespace-nowrap rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[11px] font-medium text-[var(--foreground)] shadow-[var(--bento-shadow-float)] ${hoverIdx !== null && hoverIdx < 3 ? 'top-[calc(100%+4px)]' : 'bottom-[calc(100%+4px)]'}`}
          aria-hidden="true"
        >
          <span className="font-semibold">{hoveredItem.label}</span>: {hoveredItem.count} {unitLabel}{' '}
          · {hoveredPct}%
        </div>
      )}
      <div className="state-bars">
        {items.map((item, i) => {
          const pct = computedTotal > 0 ? Math.round((item.count / computedTotal) * 100) : 0;
          const barWidth =
            computedTotal > 0 && item.count > 0 ? `${(item.count / computedTotal) * 100}%` : '0%';
          const isDimmed = hoverIdx !== null && hoverIdx !== i;

          return (
            <Button
              key={item.key}
              variant="ghost"
              size="sm"
              className="state-row"
              style={{ opacity: isDimmed ? 0.52 : 1 }}
              onPress={() => onSelectItem?.(item)}
              onHoverChange={hovered => {
                if (item.count > 0) setHoverIdx(hovered ? i : prev => (prev === i ? null : prev));
              }}
              aria-label={item.ariaLabel ?? `${item.label}: ${item.count} ${unitLabel} (${pct}%)`}
            >
              <span className="state-bar-label">
                <i className={`state-color bento-tone-bg-${item.tone}`} />
                <span>{item.label}</span>
              </span>
              <span className="state-bar-track" aria-hidden="true">
                {item.count > 0 && (
                  <span
                    className={`state-bar-fill bento-tone-bg-${item.tone}`}
                    style={{ width: barWidth }}
                  />
                )}
              </span>
              <span className="state-bar-metrics">
                <b>{item.count}</b>
                <span className="state-bar-pct">{pct}%</span>
              </span>
            </Button>
          );
        })}
      </div>
      {computedTotal === 0 && <span className="status-empty-note">{emptyText}</span>}
    </div>
  );
}
