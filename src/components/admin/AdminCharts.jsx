const GOLD = '#9C7A46';
const INK = '#111111';
const MUTED = '#6F6A62';
const GRID = 'rgba(17,17,17,.10)';
const PALETTE = ['#111111', '#9C7A46', '#D8D0C3', '#6F6A62', '#B9A98F', '#3A3A3A'];

function EmptyChart({ message = 'No data yet.' }) {
  return (
    <div className="flex min-h-56 items-center justify-center border border-dashed border-black/15 bg-white/20 px-6 text-center">
      <div>
        <p className="font-serif text-2xl text-ink">Nothing to chart yet.</p>
        <p className="mt-2 max-w-sm text-xs leading-5 text-muted">{message}</p>
      </div>
    </div>
  );
}

export function Sparkline({ values = [], positive = true }) {
  if (!values.length || values.every((value) => Number(value) === 0)) return null;
  const width = 112;
  const height = 34;
  const clean = values.map((value) => Number(value) || 0);
  const min = Math.min(...clean);
  const max = Math.max(...clean);
  const span = max - min || 1;
  const points = clean.map((value, index) => {
    const x = (index / Math.max(clean.length - 1, 1)) * width;
    const y = height - ((value - min) / span) * (height - 6) - 3;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-9 w-28" aria-hidden="true">
      <polyline points={points} fill="none" stroke={positive ? GOLD : MUTED} strokeWidth="1.7" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function RevenueLineChart({ data = [] }) {
  if (!data.length || data.every((item) => Number(item.revenue) === 0)) {
    return <EmptyChart message="Revenue appears here after you record customer orders and actual payments." />;
  }

  const width = 820;
  const height = 290;
  const pad = { left: 54, right: 16, top: 20, bottom: 38 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;
  const max = Math.max(...data.map((item) => Number(item.revenue) || 0), 1);
  const power = max >= 100000 ? 50000 : max >= 50000 ? 10000 : max >= 10000 ? 5000 : 1000;
  const niceMax = Math.ceil(max / power) * power || power;
  const x = (index) => pad.left + (index / Math.max(data.length - 1, 1)) * chartW;
  const y = (value) => pad.top + chartH - ((Number(value) || 0) / niceMax) * chartH;
  const points = data.map((item, index) => `${x(index)},${y(item.revenue)}`).join(' ');
  const areaPoints = `${pad.left},${pad.top + chartH} ${points} ${pad.left + chartW},${pad.top + chartH}`;

  return (
    <div className="w-full overflow-x-auto no-scrollbar">
      <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[620px] w-full" role="img" aria-label="Cash collected trend line chart">
        {[0, .25, .5, .75, 1].map((fraction) => {
          const yy = pad.top + chartH * fraction;
          const value = niceMax * (1 - fraction);
          return (
            <g key={fraction}>
              <line x1={pad.left} x2={pad.left + chartW} y1={yy} y2={yy} stroke={GRID} />
              <text x={0} y={yy + 4} fill={MUTED} fontSize="10">{value >= 1000 ? `${Math.round(value / 1000)}k` : Math.round(value)}</text>
            </g>
          );
        })}
        <polygon points={areaPoints} fill="rgba(156,122,70,.08)" />
        <polyline points={points} fill="none" stroke={GOLD} strokeWidth="2.4" vectorEffect="non-scaling-stroke" />
        {data.map((item, index) => (
          <g key={`${item.label}-${index}`}>
            <circle cx={x(index)} cy={y(item.revenue)} r="3.5" fill={INK} stroke="#F5F2EC" strokeWidth="2" />
            <text x={x(index)} y={height - 10} textAnchor="middle" fill={MUTED} fontSize="10">{item.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export function DonutChart({ segments = [], totalLabel = 'Orders', emptyMessage }) {
  const clean = segments.filter((item) => Number(item.value) > 0);
  if (!clean.length) return <EmptyChart message={emptyMessage || `No ${String(totalLabel).toLowerCase()} data yet.`} />;

  const total = clean.reduce((sum, item) => sum + Number(item.value || 0), 0);
  let cursor = 0;
  const stops = clean.map((item, index) => {
    const start = cursor;
    const end = cursor + (Number(item.value) / total) * 100;
    cursor = end;
    return `${PALETTE[index % PALETTE.length]} ${start}% ${end}%`;
  }).join(', ');

  return (
    <div className="grid items-center gap-7 sm:grid-cols-[170px_1fr]">
      <div className="relative mx-auto h-40 w-40 rounded-full" style={{ background: `conic-gradient(${stops})` }} role="img" aria-label={`${totalLabel} distribution pie chart`}>
        <div className="absolute inset-7 flex flex-col items-center justify-center rounded-full bg-[#FAF8F3]">
          <strong className="font-serif text-4xl font-medium">{total}</strong>
          <span className="mt-1 text-[9px] uppercase tracking-[.18em] text-muted">{totalLabel}</span>
        </div>
      </div>
      <div className="space-y-3">
        {clean.map((item, index) => (
          <div key={item.label} className="flex items-center justify-between gap-4 text-xs">
            <span className="flex items-center gap-2.5 text-muted">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: PALETTE[index % PALETTE.length] }} />
              {item.label}
            </span>
            <strong className="font-medium text-ink">{item.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HorizontalBars({ data = [], valueFormatter = (value) => value, emptyMessage }) {
  if (!data.length || data.every((item) => Number(item.value) === 0)) {
    return <EmptyChart message={emptyMessage || 'This chart will populate as real records are added.'} />;
  }
  const max = Math.max(...data.map((item) => Number(item.value) || 0), 1);
  return (
    <div className="space-y-5">
      {data.map((item) => (
        <div key={item.label}>
          <div className="mb-2 flex items-center justify-between gap-5 text-xs">
            <span className="truncate text-muted">{item.label}</span>
            <strong className="font-medium text-ink">{valueFormatter(item.value)}</strong>
          </div>
          <div className="h-1.5 bg-black/[.07]">
            <div className="h-full bg-gold transition-[width] duration-700" style={{ width: `${Math.max(3, ((Number(item.value) || 0) / max) * 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function VerticalBarChart({ data = [], valueFormatter = (value) => value, emptyMessage }) {
  if (!data.length || data.every((item) => Number(item.value) === 0)) {
    return <EmptyChart message={emptyMessage || 'This bar graph will populate as real records are added.'} />;
  }

  const width = 760;
  const height = 300;
  const pad = { left: 48, right: 18, top: 18, bottom: 72 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;
  const max = Math.max(...data.map((item) => Number(item.value) || 0), 1);
  const niceMax = Math.ceil(max / Math.max(1, Math.pow(10, String(Math.round(max)).length - 1))) * Math.pow(10, String(Math.round(max)).length - 1) || max;
  const slot = chartW / data.length;
  const barWidth = Math.min(62, slot * 0.56);

  return (
    <div className="w-full overflow-x-auto no-scrollbar">
      <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[650px] w-full" role="img" aria-label="Bar graph">
        {[0, .25, .5, .75, 1].map((fraction) => {
          const yy = pad.top + chartH * fraction;
          const value = niceMax * (1 - fraction);
          return (
            <g key={fraction}>
              <line x1={pad.left} x2={pad.left + chartW} y1={yy} y2={yy} stroke={GRID} />
              <text x="0" y={yy + 4} fill={MUTED} fontSize="10">{valueFormatter(value)}</text>
            </g>
          );
        })}
        {data.map((item, index) => {
          const value = Number(item.value) || 0;
          const barH = (value / niceMax) * chartH;
          const x = pad.left + index * slot + (slot - barWidth) / 2;
          const y = pad.top + chartH - barH;
          return (
            <g key={item.label}>
              <rect x={x} y={y} width={barWidth} height={barH} fill={index % 2 === 0 ? GOLD : INK} opacity={index % 2 === 0 ? 0.92 : 0.82} />
              <text x={x + barWidth / 2} y={Math.max(12, y - 7)} textAnchor="middle" fill={INK} fontSize="10">{valueFormatter(value)}</text>
              <text x={x + barWidth / 2} y={height - 36} textAnchor="middle" fill={MUTED} fontSize="10">
                {String(item.label).length > 15 ? `${String(item.label).slice(0, 14)}…` : item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function MiniBars({ values = [] }) {
  const clean = values.map((value) => Number(value) || 0);
  const max = Math.max(...clean, 1);
  return (
    <div className="flex h-16 items-end gap-1" aria-hidden="true">
      {clean.map((value, index) => (
        <div key={index} className="flex-1 bg-black/10 transition-all" style={{ height: `${Math.max(8, (value / max) * 100)}%` }}>
          <div className="h-full w-full bg-gold/70" />
        </div>
      ))}
    </div>
  );
}
