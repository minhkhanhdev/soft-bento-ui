import { useEffect, useId, useRef, useState } from 'react';
import { chartPoints, money } from '../demo';

function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M ${pts[0].x},${pts[0].y}`;
  if (pts.length === 2) return `M ${pts[0].x},${pts[0].y} L ${pts[1].x},${pts[1].y}`;

  const n = pts.length;
  const dx: number[] = [];
  const dy: number[] = [];
  const slopes: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx.push(pts[i + 1].x - pts[i].x);
    dy.push(pts[i + 1].y - pts[i].y);
    slopes.push(dx[i] === 0 ? 0 : dy[i] / dx[i]);
  }

  const tangents: number[] = new Array(n).fill(0);
  tangents[0] = slopes[0];
  tangents[n - 1] = slopes[n - 2];
  for (let i = 1; i < n - 1; i++) {
    if (slopes[i - 1] * slopes[i] <= 0) {
      tangents[i] = 0;
    } else {
      tangents[i] = (slopes[i - 1] + slopes[i]) / 2;
    }
  }

  for (let i = 0; i < n - 1; i++) {
    if (slopes[i] === 0) {
      tangents[i] = 0;
      tangents[i + 1] = 0;
    } else {
      const a = tangents[i] / slopes[i];
      const b = tangents[i + 1] / slopes[i];
      const s = a * a + b * b;
      if (s > 9) {
        const t = 3 / Math.sqrt(s);
        tangents[i] = t * a * slopes[i];
        tangents[i + 1] = t * b * slopes[i];
      }
    }
  }

  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    const cp1x = pts[i].x + h;
    const cp1y = pts[i].y + tangents[i] * h;
    const cp2x = pts[i + 1].x - h;
    const cp2y = pts[i + 1].y - tangents[i + 1] * h;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${pts[i + 1].x},${pts[i + 1].y}`;
  }
  return d;
}

export function CashChart({ from, to }: { from: string; to: string }) {
  const data = chartPoints(from, to);
  const [hover, setHover] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const plotRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 740, height: 150 });
  const gradientId = useId();

  useEffect(() => {
    setHover(null);
    setPinned(null);
  }, [from, to]);

  const activeIdx = pinned ?? hover;
  const active = activeIdx === null ? null : (data[activeIdx] ?? null);

  useEffect(() => {
    if (activeIdx === null) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (plotRef.current && !plotRef.current.contains(e.target as Node)) {
        setPinned(null);
        setHover(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPinned(null);
        setHover(null);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIdx]);

  useEffect(() => {
    if (!plotRef.current) return;
    const observer = new ResizeObserver(([entry]) =>
      setSize({
        width: Math.max(200, entry.contentRect.width),
        height: Math.max(70, entry.contentRect.height),
      }),
    );
    observer.observe(plotRef.current);
    return () => observer.disconnect();
  }, []);

  const { width, height } = size;
  const left = 44;
  const right = 20;
  const top = 14;
  const bottom = 28;
  // Minimum peak of 100_000 ensures strictly increasing, distinct Y-axis labels (0, 0,05tr, 0,1tr) when cash is 0.
  const peak = Math.max(...data.map(d => Math.max(d.received, d.paid)), 100_000);
  const magnitude = 10 ** Math.floor(Math.log10(peak / 3));
  const step = [1, 2, 5, 10].find(n => n * magnitude >= peak / 3)! * magnitude;
  const maximum = Math.ceil(peak / step) * step;
  const ticks = Array.from({ length: Math.round(maximum / step) + 1 }, (_, i) => i * step);
  const x = (i: number) =>
    left + (data.length === 1 ? 0.5 : i / (data.length - 1)) * (width - left - right);
  const maxLabels = Math.min(
    data.length,
    Math.max(2, Math.floor((width - left - right) / 62) + 1),
  );
  const labels = (() => {
    if (data.length <= maxLabels) {
      return new Set(Array.from({ length: data.length }, (_, i) => i));
    }
    const last = data.length - 1;
    for (let count = maxLabels; count >= 2; count--) {
      if (last % (count - 1) === 0) {
        const stepIndex = last / (count - 1);
        return new Set(Array.from({ length: count }, (_, i) => i * stepIndex));
      }
    }
    return new Set(
      Array.from({ length: maxLabels }, (_, i) =>
        Math.round((i * last) / Math.max(1, maxLabels - 1)),
      ),
    );
  })();
  const y = (n: number) => top + (1 - n / maximum) * (height - top - bottom);

  const receivedPts = data.map((d, i) => ({ x: x(i), y: y(d.received) }));
  const paidPts = data.map((d, i) => ({ x: x(i), y: y(d.paid) }));
  const receivedPath = smoothPath(receivedPts);
  const paidPath = smoothPath(paidPts);
  const areaPath =
    data.length > 1
      ? `${receivedPath} L ${x(data.length - 1)},${y(0)} L ${x(0)},${y(0)} Z`
      : '';
  const paidAreaPath =
    data.length > 1
      ? `${paidPath} L ${x(data.length - 1)},${y(0)} L ${x(0)},${y(0)} Z`
      : '';

  const nearestIndex = (clientX: number): number | null => {
    if (!plotRef.current || data.length === 0) return null;
    const rect = plotRef.current.getBoundingClientRect();
    if (rect.width <= 0) return null;
    const px = ((clientX - rect.left) / rect.width) * width;
    if (px < left - 16 || px > width - right + 16) return null;
    if (data.length === 1) return 0;
    const span = Math.max(1, width - left - right);
    const ratio = Math.max(0, Math.min(1, (px - left) / span));
    return Math.round(ratio * (data.length - 1));
  };

  const tooltipStyle = (() => {
    if (!active || activeIdx === null) return undefined;
    const activeX = x(activeIdx);
    const activeY = Math.min(y(active.received), y(active.paid));
    const alignLeft = activeX < 110;
    const alignRight = activeX > width - 110;
    const placeBelow = activeY < 76;
    const tx = alignLeft ? '0%' : alignRight ? '-100%' : '-50%';
    const ty = placeBelow ? '0%' : '-100%';
    const leftPx = alignLeft
      ? Math.max(4, activeX - 12)
      : alignRight
        ? Math.min(width - 4, activeX + 12)
        : activeX;
    const topPx = placeBelow ? activeY + 12 : activeY - 12;
    return {
      left: `${leftPx}px`,
      top: `${topPx}px`,
      transform: `translate(${tx}, ${ty})`,
      pointerEvents: 'none' as const,
    };
  })();

  return (
    <div
      className="cash-plot"
      ref={plotRef}
      tabIndex={0}
      aria-label="Biểu đồ dòng tiền, dùng phím mũi tên trái hoặc phải để xem chi tiết từng ngày"
      onMouseDown={e => {
        // Prevent mouse click from moving keyboard focus onto the plot container.
        e.preventDefault();
      }}
      onPointerMove={e => {
        setHover(nearestIndex(e.clientX));
      }}
      onPointerLeave={() => {
        setHover(null);
      }}
      onClick={e => {
        const idx = nearestIndex(e.clientX);
        if (idx === null) {
          setPinned(null);
          setHover(null);
          return;
        }
        if (pinned === idx) {
          setPinned(null);
          setHover(null);
        } else {
          setPinned(idx);
          setHover(idx);
        }
      }}
      onBlur={() => {
        setHover(null);
      }}
      onKeyDown={e => {
        if (data.length === 0) return;
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          setPinned(prev => (prev === null ? 0 : Math.min(data.length - 1, prev + 1)));
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          setPinned(prev => (prev === null ? data.length - 1 : Math.max(0, prev - 1)));
        } else if (e.key === 'Escape') {
          setPinned(null);
          setHover(null);
        }
      }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Biểu đồ thực thu và thực chi từ ${from} đến ${to}; số tiền theo triệu đồng`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-income)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--chart-income)" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id={`${gradientId}-paid`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-expense)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--chart-expense)" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        {ticks.map(value => (
          <g key={value}>
            <line x1={left} y1={y(value)} x2={width - right} y2={y(value)} className="chart-grid" />
            <text x={left - 10} y={y(value) + 4} textAnchor="end" className="chart-axis">
              {value === 0
                ? '0'
                : `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(
                    value / 1_000_000,
                  )}tr`}
            </text>
          </g>
        ))}
        {paidAreaPath && <path d={paidAreaPath} fill={`url(#${gradientId}-paid)`} />}
        {areaPath && <path d={areaPath} fill={`url(#${gradientId})`} />}
        <path d={paidPath} className="chart-line chart-paid" />
        <path d={receivedPath} className="chart-line chart-received" />
        {data.map((d, i) => (
          <g key={i}>
            {labels.has(i) && (
              <text x={x(i)} y={height - 5} textAnchor="middle" className="chart-axis">
                {d.label}
              </text>
            )}
            {data.length === 1 && activeIdx !== i && (
              <>
                <circle
                  cx={x(i)}
                  cy={y(d.received)}
                  r={d.received === d.paid ? 6 : 4}
                  className="chart-dot"
                />
                <circle
                  cx={x(i)}
                  cy={y(d.paid)}
                  r={d.received === d.paid ? 3.2 : 4}
                  className="chart-dot chart-dot-paid"
                  style={d.received === d.paid ? { strokeWidth: 1.5 } : undefined}
                />
              </>
            )}
          </g>
        ))}
        {active && activeIdx !== null && (
          <g>
            <line x1={x(activeIdx)} y1={top} x2={x(activeIdx)} y2={y(0)} className="chart-crosshair" />
            <circle
              cx={x(activeIdx)}
              cy={y(active.received)}
              r={active.received === active.paid ? 10 : 8.5}
              fill="var(--chart-income)"
              fillOpacity={0.18}
            />
            <circle
              cx={x(activeIdx)}
              cy={y(active.paid)}
              r={8}
              fill="var(--chart-expense)"
              fillOpacity={0.16}
            />
            <circle
              cx={x(activeIdx)}
              cy={y(active.received)}
              r={active.received === active.paid ? 6 : 4.5}
              className="chart-dot"
            />
            <circle
              cx={x(activeIdx)}
              cy={y(active.paid)}
              r={active.received === active.paid ? 3.2 : 4.5}
              className="chart-dot chart-dot-paid"
              style={active.received === active.paid ? { strokeWidth: 1.5 } : undefined}
            />
          </g>
        )}
      </svg>
      {active && tooltipStyle && (
        <div
          className="cash-tooltip chart-tooltip pointer-events-none absolute z-10 min-w-[168px] rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[12px] leading-[1.35] text-[var(--foreground)] shadow-[var(--bento-shadow-float)]"
          style={tooltipStyle}
          aria-hidden="true"
        >
          <strong>{active.fullLabel}</strong>
          <span>
            Thực thu: <b>{money(active.received)}</b>
          </span>
          <span>
            Thực chi: <b>{money(active.paid)}</b>
          </span>
          <span>
            Chênh lệch:{' '}
            <b>
              {active.received - active.paid > 0 ? '+' : ''}
              {money(active.received - active.paid)}
            </b>
          </span>
        </div>
      )}
    </div>
  );
}
