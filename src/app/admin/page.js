'use client';
import { useState, useEffect } from 'react';
import { StatCard, MiniLineChart, BarList, DonutChart, formatINR, pctChange } from './components';
import './admin.css';

const TABS = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'orders', icon: '📦', label: 'Orders' },
    { id: 'analytics', icon: '📈', label: 'Analytics' },
    { id: 'visitors', icon: '👥', label: 'Live Visitors' },
    { id: 'abandoned', icon: '🛒', label: 'Recovery' },
    { id: 'products', icon: '💎', label: 'Products' },
];

export default function AdminDashboard() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [pw, setPw] = useState('');
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');
    const [data, setData] = useState(null);
    const [tab, setTab] = useState('overview');
    const [fetching, setFetching] = useState(false);
    const [sideOpen, setSideOpen] = useState(false);

    useEffect(() => {
        const t = localStorage.getItem('nj_admin_token');
        if (t) { verify(t); } else { setLoading(false); }
    }, []);

    async function verify(token) {
        try {
            const r = await fetch('/api/admin/auth', { headers: { Authorization: `Bearer ${token}` } });
            const d = await r.json();
            if (d.valid) { setLoggedIn(true); await load(token); }
            else localStorage.removeItem('nj_admin_token');
        } catch { localStorage.removeItem('nj_admin_token'); }
        setLoading(false);
    }

    async function login(e) {
        e.preventDefault(); setErr('');
        try {
            const r = await fetch('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) });
            const d = await r.json();
            if (d.success) { localStorage.setItem('nj_admin_token', d.token); setLoggedIn(true); await load(d.token); }
            else setErr('Invalid password');
        } catch { setErr('Login failed'); }
    }

    async function load(token) {
        setFetching(true);
        try {
            const r = await fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token || localStorage.getItem('nj_admin_token')}` } });
            const d = await r.json();
            if (d.success) setData(d);
        } catch (e) { console.error(e); }
        setFetching(false);
    }

    if (loading) return <div className="admin-loading"><div className="admin-spinner" /><p style={{ color: '#71717a', marginTop: 16, fontSize: '0.8rem' }}>Loading dashboard...</p></div>;

    if (!loggedIn) return (
        <div className="admin-login-wrap">
            <div className="admin-login-card">
                <div className="admin-login-logo">NOORÉ</div>
                <p className="admin-login-sub">Admin Dashboard</p>
                <form onSubmit={login}>
                    <input className="admin-login-input" type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Enter password" autoFocus />
                    {err && <p className="admin-login-err">{err}</p>}
                    <button className="admin-login-btn" type="submit">Sign In</button>
                </form>
            </div>
        </div>
    );

    const s = data?.stats || {};
    const orders = data?.orders || [];
    const visitors = data?.visitors || [];
    const carts = data?.abandonedCarts || [];
    const a = data?.analytics || {};
    const trends = data?.trends || {};

    return (
        <div className="admin-root">
            <div className="admin-layout">
                {/* Sidebar */}
                <aside className={`admin-sidebar ${sideOpen ? 'open' : ''}`}>
                    <div className="admin-sidebar-logo">
                        <h1>NOORÉ JEWELS</h1>
                        <span>Admin Panel</span>
                    </div>
                    <nav className="admin-sidebar-nav">
                        {TABS.map(t => (
                            <button key={t.id} className={`admin-nav-item ${tab === t.id ? 'active' : ''}`}
                                onClick={() => { setTab(t.id); setSideOpen(false); }}>
                                <span className="admin-nav-icon">{t.icon}</span>{t.label}
                            </button>
                        ))}
                    </nav>
                    <div className="admin-sidebar-footer">
                        <button className="admin-logout-btn" onClick={() => { localStorage.removeItem('nj_admin_token'); setLoggedIn(false); setData(null); }}>
                            Sign Out
                        </button>
                    </div>
                </aside>

                {/* Main */}
                <div className="admin-main">
                    <div className="admin-topbar">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <button className="admin-mobile-toggle" onClick={() => setSideOpen(!sideOpen)}>☰</button>
                            <span className="admin-topbar-title">{TABS.find(t => t.id === tab)?.icon} {TABS.find(t => t.id === tab)?.label}</span>
                        </div>
                        <div className="admin-topbar-actions">
                            <span style={{ fontSize: '0.68rem', color: '#52525b' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            <button className="admin-refresh-btn" onClick={() => load()} disabled={fetching}>{fetching ? '⏳' : '🔄'} Refresh</button>
                        </div>
                    </div>

                    <div className="admin-content">
                        {tab === 'overview' && <OverviewTab s={s} trends={trends} a={a} />}
                        {tab === 'orders' && <OrdersTab orders={orders} s={s} />}
                        {tab === 'analytics' && <AnalyticsTab a={a} s={s} trends={trends} />}
                        {tab === 'visitors' && <VisitorsTab visitors={visitors} s={s} />}
                        {tab === 'abandoned' && <AbandonedTab carts={carts} s={s} />}
                        {tab === 'products' && <ProductsTab a={a} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── OVERVIEW ──
function OverviewTab({ s, trends, a }) {
    return (<>
        <div className="admin-stats-row">
            <StatCard icon="💰" label="Today's Revenue" value={formatINR(s.todayRevenue)} change={pctChange(s.todayRevenue, s.yesterdayRevenue)} accent="#22c55e" />
            <StatCard icon="🛍️" label="Today's Orders" value={s.todayOrders || 0} change={pctChange(s.todayOrders, s.yesterdayOrders)} accent="#3b82f6" />
            <StatCard icon="👥" label="Today's Visitors" value={s.todayVisitors || 0} accent="#a855f7" />
            <StatCard icon="📈" label="Conversion Rate" value={`${s.conversionRate || 0}%`} accent="#eab308" />
        </div>
        <div className="admin-stats-row">
            <StatCard icon="📅" label="This Month" value={formatINR(s.monthRevenue)} change={pctChange(s.monthRevenue, s.lastMonthRevenue)} changeLabel="vs last month" accent="#C5A467" />
            <StatCard icon="📊" label="Week Revenue" value={formatINR(s.weekRevenue)} accent="#3b82f6" />
            <StatCard icon="🧾" label="Avg Order Value" value={formatINR(s.avgOrderValue)} accent="#22c55e" />
            <StatCard icon="🛒" label="Abandoned Carts" value={s.pendingAbandonedCarts || 0} accent="#ef4444" />
        </div>

        {/* Revenue Chart */}
        <div className="admin-charts-row">
            <div className="admin-chart-card">
                <div className="admin-chart-title">Revenue Trend</div>
                <div className="admin-chart-subtitle">Last 30 days</div>
                <MiniLineChart data={trends.dailyRevenue} color="#C5A467" height={180} />
            </div>
            <div className="admin-chart-card">
                <div className="admin-chart-title">Devices</div>
                <div className="admin-chart-subtitle">All-time breakdown</div>
                <DonutChart items={a.devices || []} labelKey="device" valueKey="count" colors={['#C5A467', '#3b82f6', '#22c55e']} />
            </div>
        </div>

        <div className="admin-charts-row">
            <div className="admin-chart-card">
                <div className="admin-chart-title">Daily Visitors</div>
                <div className="admin-chart-subtitle">Last 30 days</div>
                <MiniLineChart data={trends.dailyVisitors} color="#a855f7" height={140} />
            </div>
            <div className="admin-chart-card">
                <div className="admin-chart-title">Top Cities</div>
                <div className="admin-chart-subtitle">By visitor count</div>
                <BarList items={a.topCities} labelKey="city" valueKey="count" color="#C5A467" maxItems={5} />
            </div>
        </div>

        {/* Quick Stats */}
        <div className="admin-stats-row">
            <StatCard icon="💎" label="Total Revenue" value={formatINR(s.totalRevenue)} accent="#C5A467" />
            <StatCard icon="📦" label="Total Orders" value={s.totalOrders || 0} accent="#3b82f6" />
            <StatCard icon="👤" label="Customers" value={s.totalCustomers || 0} accent="#22c55e" />
            <StatCard icon="📝" label="Leads" value={s.totalLeads || 0} accent="#a855f7" />
            <StatCard icon="🔁" label="Recovered Carts" value={s.recoveredCarts || 0} accent="#22c55e" />
        </div>
    </>);
}

// ── ORDERS ──
function OrdersTab({ orders, s }) {
    const [filter, setFilter] = useState('all');
    const filtered = filter === 'all' ? orders : orders.filter(o => o.paymentStatus?.toLowerCase() === filter);
    return (<>
        <div className="admin-stats-row">
            <StatCard icon="📦" label="Total Orders" value={s.totalOrders || 0} accent="#3b82f6" />
            <StatCard icon="💰" label="Total Revenue" value={formatINR(s.totalRevenue)} accent="#22c55e" />
            <StatCard icon="🧾" label="Avg Order" value={formatINR(s.avgOrderValue)} accent="#C5A467" />
            <StatCard icon="📅" label="This Month" value={`${s.monthOrders || 0} orders`} accent="#a855f7" />
        </div>
        <div className="admin-table-card">
            <div className="admin-table-header">
                <span className="admin-table-title">All Orders</span>
                <div style={{ display: 'flex', gap: 6 }}>
                    {['all', 'paid', 'pending'].map(f => (
                        <button key={f} onClick={() => setFilter(f)} style={{
                            padding: '4px 12px', borderRadius: 6, border: '1px solid', fontSize: '0.68rem', cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize',
                            background: filter === f ? 'rgba(197,164,103,0.15)' : 'transparent',
                            borderColor: filter === f ? 'rgba(197,164,103,0.3)' : 'rgba(255,255,255,0.1)',
                            color: filter === f ? '#C5A467' : '#71717a',
                        }}>{f}</button>
                    ))}
                    <span className="admin-table-count">{filtered.length}</span>
                </div>
            </div>
            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead><tr>
                        <th>Order ID</th><th>Customer</th><th>Items</th><th>Amount</th><th>City</th><th>Date</th><th>Status</th>
                    </tr></thead>
                    <tbody>
                        {filtered.slice(0, 50).map((o, i) => (
                            <tr key={i}>
                                <td><strong style={{ color: '#C5A467' }}>{o.orderId}</strong></td>
                                <td><div style={{ fontWeight: 500 }}>{o.name}</div><div style={{ fontSize: '0.7rem', color: '#52525b' }}>{o.phone}</div></td>
                                <td>{o.items?.map((it, j) => <div key={j} style={{ fontSize: '0.75rem' }}>{it.productName} ×{it.quantity}</div>)}</td>
                                <td><strong>{formatINR(o.totalAmount)}</strong></td>
                                <td>{o.city || '–'}</td>
                                <td style={{ whiteSpace: 'nowrap' }}>{o.date ? new Date(o.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '–'}</td>
                                <td><span className={`admin-badge ${o.paymentStatus === 'Paid' ? 'admin-badge-green' : 'admin-badge-yellow'}`}>{o.paymentStatus}</span></td>
                            </tr>
                        ))}
                        {filtered.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', color: '#52525b', padding: 40 }}>No orders found</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    </>);
}

// ── ANALYTICS ──
function AnalyticsTab({ a, s, trends }) {
    return (<>
        <div className="admin-charts-row">
            <div className="admin-chart-card">
                <div className="admin-chart-title">Daily Orders</div>
                <div className="admin-chart-subtitle">Last 30 days</div>
                <MiniLineChart data={trends.dailyOrders} color="#3b82f6" height={180} />
            </div>
            <div className="admin-chart-card">
                <div className="admin-chart-title">Traffic Sources</div>
                <div className="admin-chart-subtitle">Where visitors come from</div>
                <DonutChart items={a.trafficSources || []} labelKey="source" valueKey="count" />
            </div>
        </div>
        <div className="admin-grid-2">
            <div className="admin-chart-card">
                <div className="admin-chart-title">📍 Top Visitor Cities</div>
                <BarList items={a.topCities} labelKey="city" valueKey="count" color="#C5A467" />
            </div>
            <div className="admin-chart-card">
                <div className="admin-chart-title">📦 Top Order Cities</div>
                <BarList items={a.orderCities} labelKey="city" valueKey="count" color="#22c55e" />
            </div>
        </div>
        <div className="admin-grid-3">
            <div className="admin-chart-card">
                <div className="admin-chart-title">📄 Top Pages</div>
                <BarList items={a.topPages} labelKey="page" valueKey="count" color="#a855f7" />
            </div>
            <div className="admin-chart-card">
                <div className="admin-chart-title">🌐 Browsers</div>
                <DonutChart items={a.browsers || []} labelKey="browser" valueKey="count" colors={['#3b82f6', '#22c55e', '#ef4444', '#eab308', '#a855f7']} />
            </div>
            <div className="admin-chart-card">
                <div className="admin-chart-title">💻 Operating Systems</div>
                <DonutChart items={a.osSplit || []} labelKey="os" valueKey="count" colors={['#C5A467', '#3b82f6', '#22c55e', '#ef4444', '#a855f7']} />
            </div>
        </div>
        {a.couponUsage?.length > 0 && (
            <div className="admin-chart-card" style={{ marginBottom: 24 }}>
                <div className="admin-chart-title">🎫 Coupon Usage</div>
                <BarList items={a.couponUsage} labelKey="code" valueKey="count" color="#eab308" />
            </div>
        )}
    </>);
}

// ── VISITORS ──
function VisitorsTab({ visitors, s }) {
    return (<>
        <div className="admin-stats-row">
            <StatCard icon="👥" label="Total Visitors" value={s.totalVisitors || 0} accent="#a855f7" />
            <StatCard icon="🌐" label="Unique Visitors" value={s.uniqueVisitors || 0} accent="#3b82f6" />
            <StatCard icon="📱" label="Today" value={s.todayVisitors || 0} accent="#22c55e" />
        </div>
        <div className="admin-table-card">
            <div className="admin-table-header">
                <span className="admin-table-title">Recent Visitors</span>
                <span className="admin-table-count">{visitors.length}</span>
            </div>
            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead><tr><th>Time</th><th>Name</th><th>Page</th><th>City</th><th>Device</th><th>Browser</th><th>Source</th></tr></thead>
                    <tbody>
                        {visitors.slice(0, 100).map((v, i) => (
                            <tr key={i}>
                                <td style={{ whiteSpace: 'nowrap', fontSize: '0.72rem', color: '#71717a' }}>{v.timestamp}</td>
                                <td><span style={v.name === 'Guest' ? { color: '#52525b' } : { fontWeight: 500 }}>{v.name}</span></td>
                                <td><span className="admin-badge admin-badge-blue">{v.page}</span></td>
                                <td>{v.city || '–'}</td>
                                <td>{v.device === 'Mobile' ? '📱' : '🖥️'} {v.device}</td>
                                <td style={{ color: '#71717a' }}>{v.browser}</td>
                                <td style={{ color: '#71717a', fontSize: '0.72rem' }}>{v.referrer || 'Direct'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </>);
}

// ── ABANDONED CARTS ──
function AbandonedTab({ carts, s }) {
    return (<>
        <div className="admin-stats-row">
            <StatCard icon="🛒" label="Pending Carts" value={s.pendingAbandonedCarts || 0} accent="#ef4444" />
            <StatCard icon="💸" label="Lost Value" value={formatINR(s.abandonedCartValue)} accent="#ef4444" />
            <StatCard icon="✅" label="Recovered" value={s.recoveredCarts || 0} accent="#22c55e" />
            <StatCard icon="💰" label="Recovered Value" value={formatINR(s.recoveredCartValue)} accent="#22c55e" />
        </div>
        <div className="admin-table-card">
            <div className="admin-table-header">
                <span className="admin-table-title">Abandoned Carts</span>
                <span className="admin-table-count">{carts.length} pending</span>
            </div>
            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead><tr><th>Customer</th><th>Items</th><th>Value</th><th>When</th><th>Reminders</th><th>Action</th></tr></thead>
                    <tbody>
                        {carts.length === 0 ? (
                            <tr><td colSpan={6} style={{ textAlign: 'center', color: '#52525b', padding: 40 }}>No abandoned carts 🎉</td></tr>
                        ) : carts.map((c, i) => {
                            let items = [];
                            try { items = JSON.parse(c.items); } catch {}
                            return (
                                <tr key={i}>
                                    <td><div style={{ fontWeight: 500 }}>{c.name || 'Unknown'}</div><div style={{ fontSize: '0.7rem', color: '#52525b' }}>{c.phone}</div>{c.email && <div style={{ fontSize: '0.7rem', color: '#52525b' }}>{c.email}</div>}</td>
                                    <td>{items.map((it, j) => <div key={j} style={{ fontSize: '0.75rem' }}>{it.name}</div>)}</td>
                                    <td><strong style={{ color: '#ef4444' }}>{formatINR(c.cartValue)}</strong></td>
                                    <td style={{ fontSize: '0.75rem', color: '#71717a' }}>{c.createdAt}</td>
                                    <td><span className="admin-badge admin-badge-yellow">{c.remindersSent}</span></td>
                                    <td>
                                        <a className="admin-wa-btn" target="_blank" rel="noopener noreferrer"
                                            href={`https://wa.me/91${c.phone?.replace(/\D/g, '').slice(-10)}?text=Hi ${c.name || ''}! 💎 You left something beautiful in your cart at Noore Jewels. Complete your purchase → noorejewels.in/shop`}>
                                            💬 WhatsApp
                                        </a>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    </>);
}

// ── TOP PRODUCTS ──
function ProductsTab({ a }) {
    const products = a.topProducts || [];
    return (<>
        <div className="admin-chart-card" style={{ marginBottom: 24 }}>
            <div className="admin-chart-title">🏆 Top Products by Revenue</div>
            <div className="admin-chart-subtitle">Best performing products</div>
            <BarList items={products.map(p => ({ name: p.name, revenue: p.revenue }))} labelKey="name" valueKey="revenue" color="#C5A467" maxItems={10} />
        </div>
        <div className="admin-table-card">
            <div className="admin-table-header">
                <span className="admin-table-title">Product Performance</span>
                <span className="admin-table-count">{products.length} products</span>
            </div>
            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead><tr><th>#</th><th>Product</th><th>Qty Sold</th><th>Revenue</th></tr></thead>
                    <tbody>
                        {products.map((p, i) => (
                            <tr key={i}>
                                <td style={{ color: '#52525b' }}>{i + 1}</td>
                                <td style={{ fontWeight: 500 }}>{p.name}</td>
                                <td>{p.qty}</td>
                                <td><strong style={{ color: '#22c55e' }}>{formatINR(p.revenue)}</strong></td>
                            </tr>
                        ))}
                        {products.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', color: '#52525b', padding: 40 }}>No product data yet</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    </>);
}
