'use client';

// ── STAT CARD ──
export function StatCard({ icon, label, value, change, changeLabel, accent }) {
    const isUp = change > 0;
    const isDown = change < 0;
    return (
        <div className="admin-stat-card" style={accent ? { '--accent': accent } : {}}>
            <div className="admin-stat-header">
                <span className="admin-stat-label">{label}</span>
                <span className="admin-stat-icon">{icon}</span>
            </div>
            <div className="admin-stat-value">{value}</div>
            {change !== undefined && (
                <span className={`admin-stat-change ${isUp ? 'up' : isDown ? 'down' : 'neutral'}`}>
                    {isUp ? '↑' : isDown ? '↓' : '–'} {Math.abs(change)}% {changeLabel || 'vs yesterday'}
                </span>
            )}
        </div>
    );
}

// ── MINI LINE CHART (SVG) ──
export function MiniLineChart({ data, color = '#C5A467', height = 160 }) {
    if (!data || data.length === 0) return <div style={{ color: '#52525b', fontSize: '0.8rem', padding: 20 }}>No data yet</div>;
    const max = Math.max(...data.map(d => d.value), 1);
    const w = 100;
    const h = height;
    const step = w / Math.max(data.length - 1, 1);
    const points = data.map((d, i) => `${i * step},${h - (d.value / max) * (h - 20) - 10}`);
    const polyline = points.join(' ');
    const areaPoints = `0,${h} ${polyline} ${(data.length - 1) * step},${h}`;
    // Show only every ~5th label
    const labelStep = Math.max(1, Math.floor(data.length / 6));

    return (
        <svg viewBox={`0 0 ${w} ${h + 20}`} className="admin-svg-chart" preserveAspectRatio="none" style={{ height }}>
            <defs>
                <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon points={areaPoints} fill={`url(#grad-${color.replace('#','')})`} />
            <polyline points={polyline} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
            {data.map((d, i) => i % labelStep === 0 || i === data.length - 1 ? (
                <text key={i} x={i * step} y={h + 16} fill="#52525b" fontSize="3" textAnchor="middle">{d.label}</text>
            ) : null)}
        </svg>
    );
}

// ── BAR LIST ──
export function BarList({ items, labelKey, valueKey, color = '#C5A467', maxItems = 8 }) {
    if (!items || items.length === 0) return <div style={{ color: '#52525b', fontSize: '0.8rem' }}>No data</div>;
    const sliced = items.slice(0, maxItems);
    const max = Math.max(...sliced.map(i => i[valueKey]), 1);
    return (
        <div>
            {sliced.map((item, i) => (
                <div key={i} className="admin-bar-row">
                    <span className="admin-bar-label">{item[labelKey]}</span>
                    <div className="admin-bar-track">
                        <div className="admin-bar-fill" style={{ width: `${(item[valueKey] / max) * 100}%`, background: color }} />
                    </div>
                    <span className="admin-bar-val">{item[valueKey]}</span>
                </div>
            ))}
        </div>
    );
}

// ── DONUT CHART (SVG) ──
export function DonutChart({ items, labelKey, valueKey, colors }) {
    if (!items || items.length === 0) return <div style={{ color: '#52525b', fontSize: '0.8rem' }}>No data</div>;
    const total = items.reduce((s, i) => s + i[valueKey], 0) || 1;
    const defaultColors = ['#C5A467', '#3b82f6', '#22c55e', '#ef4444', '#a855f7', '#eab308'];
    let offset = 0;

    return (
        <div className="admin-donut-wrap">
            <svg width="100" height="100" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                {items.slice(0, 6).map((item, i) => {
                    const pct = (item[valueKey] / total) * 100;
                    const dash = `${pct} ${100 - pct}`;
                    const el = (
                        <circle key={i} cx="18" cy="18" r="14" fill="none"
                            stroke={(colors || defaultColors)[i % 6]} strokeWidth="4"
                            strokeDasharray={dash} strokeDashoffset={-offset}
                            transform="rotate(-90 18 18)" />
                    );
                    offset += pct;
                    return el;
                })}
                <text x="18" y="19" textAnchor="middle" fill="#e4e4e7" fontSize="5" fontWeight="600">{total}</text>
                <text x="18" y="23" textAnchor="middle" fill="#71717a" fontSize="2.5">total</text>
            </svg>
            <div className="admin-donut-legend">
                {items.slice(0, 6).map((item, i) => (
                    <div key={i} className="admin-donut-legend-item">
                        <span className="admin-donut-dot" style={{ background: (colors || defaultColors)[i % 6] }} />
                        <span style={{ flex: 1 }}>{item[labelKey]}</span>
                        <span style={{ fontWeight: 600, color: '#e4e4e7' }}>{item[valueKey]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── FORMAT HELPERS ──
export function formatINR(n) { return '₹' + (n || 0).toLocaleString('en-IN'); }
export function pctChange(current, previous) {
    if (!previous || previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
}
