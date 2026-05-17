'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [fetchingData, setFetchingData] = useState(false);

    // Check for existing token on mount
    useEffect(() => {
        const token = localStorage.getItem('nj_admin_token');
        if (token) {
            verifyAndLoad(token);
        } else {
            setLoading(false);
        }
    }, []);

    async function verifyAndLoad(token) {
        try {
            const res = await fetch('/api/admin/auth', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const result = await res.json();
            if (result.valid) {
                setIsLoggedIn(true);
                await loadData(token);
            } else {
                localStorage.removeItem('nj_admin_token');
            }
        } catch {
            localStorage.removeItem('nj_admin_token');
        }
        setLoading(false);
    }

    async function handleLogin(e) {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            const result = await res.json();
            if (result.success) {
                localStorage.setItem('nj_admin_token', result.token);
                setIsLoggedIn(true);
                await loadData(result.token);
            } else {
                setError('Invalid password');
            }
        } catch {
            setError('Login failed');
        }
    }

    async function loadData(token) {
        setFetchingData(true);
        try {
            const res = await fetch('/api/admin/stats', {
                headers: { 'Authorization': `Bearer ${token || localStorage.getItem('nj_admin_token')}` },
            });
            const result = await res.json();
            if (result.success) {
                setData(result);
            }
        } catch (err) {
            console.error('Failed to load data:', err);
        }
        setFetchingData(false);
    }

    function handleLogout() {
        localStorage.removeItem('nj_admin_token');
        setIsLoggedIn(false);
        setData(null);
    }

    if (loading) {
        return (
            <div style={styles.loadingScreen}>
                <div style={styles.spinner}></div>
                <p style={{ color: '#9B9B9B', marginTop: 16 }}>Loading admin...</p>
            </div>
        );
    }

    // Login Screen
    if (!isLoggedIn) {
        return (
            <div style={styles.loginContainer}>
                <div style={styles.loginCard}>
                    <div style={styles.loginLogo}>NOORÉ</div>
                    <p style={styles.loginSubtitle}>Admin Dashboard</p>
                    <form onSubmit={handleLogin} style={styles.loginForm}>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Enter admin password"
                            style={styles.loginInput}
                            autoFocus
                        />
                        {error && <p style={styles.loginError}>{error}</p>}
                        <button type="submit" style={styles.loginBtn}>Login</button>
                    </form>
                </div>
            </div>
        );
    }

    // Dashboard
    const stats = data?.stats || {};
    const orders = data?.orders || [];
    const visitors = data?.visitors || [];
    const abandonedCarts = data?.abandonedCarts || [];
    const analytics = data?.analytics || {};

    return (
        <div style={styles.dashboard}>
            {/* Header */}
            <header style={styles.header}>
                <div style={styles.headerLeft}>
                    <h1 style={styles.headerTitle}>NOORÉ JEWELS</h1>
                    <span style={styles.headerBadge}>Admin</span>
                </div>
                <div style={styles.headerRight}>
                    <button onClick={() => loadData()} style={styles.refreshBtn} disabled={fetchingData}>
                        {fetchingData ? '⏳' : '🔄'} Refresh
                    </button>
                    <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                </div>
            </header>

            {/* Navigation Tabs */}
            <nav style={styles.tabs}>
                {['overview', 'orders', 'visitors', 'abandoned', 'analytics'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={activeTab === tab ? { ...styles.tab, ...styles.tabActive } : styles.tab}
                    >
                        {tab === 'overview' && '📊 '}
                        {tab === 'orders' && '📋 '}
                        {tab === 'visitors' && '👥 '}
                        {tab === 'abandoned' && '🛒 '}
                        {tab === 'analytics' && '📈 '}
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </nav>

            {/* Content */}
            <main style={styles.content}>
                {activeTab === 'overview' && <OverviewTab stats={stats} />}
                {activeTab === 'orders' && <OrdersTab orders={orders} />}
                {activeTab === 'visitors' && <VisitorsTab visitors={visitors} />}
                {activeTab === 'abandoned' && <AbandonedTab carts={abandonedCarts} stats={stats} />}
                {activeTab === 'analytics' && <AnalyticsTab analytics={analytics} stats={stats} />}
            </main>
        </div>
    );
}

// ── OVERVIEW TAB ──
function OverviewTab({ stats }) {
    return (
        <div>
            <div style={styles.statsGrid}>
                <StatCard icon="👥" label="Today's Visitors" value={stats.todayVisitors || 0} />
                <StatCard icon="🛍️" label="Today's Orders" value={stats.todayOrders || 0} />
                <StatCard icon="💰" label="Today's Revenue" value={`₹${(stats.todayRevenue || 0).toLocaleString('en-IN')}`} />
                <StatCard icon="📦" label="Total Orders" value={stats.totalOrders || 0} />
                <StatCard icon="💎" label="Total Revenue" value={`₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`} />
                <StatCard icon="📅" label="This Month Revenue" value={`₹${(stats.monthRevenue || 0).toLocaleString('en-IN')}`} />
                <StatCard icon="🛒" label="Abandoned Carts" value={stats.pendingAbandonedCarts || 0} color="#C0392B" />
                <StatCard icon="💸" label="Lost Cart Value" value={`₹${(stats.abandonedCartValue || 0).toLocaleString('en-IN')}`} color="#C0392B" />
                <StatCard icon="👤" label="Total Customers" value={stats.totalCustomers || 0} />
                <StatCard icon="📝" label="Total Leads" value={stats.totalLeads || 0} />
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }) {
    return (
        <div style={styles.statCard}>
            <div style={styles.statIcon}>{icon}</div>
            <div style={{ ...styles.statValue, color: color || '#1A1A1A' }}>{value}</div>
            <div style={styles.statLabel}>{label}</div>
        </div>
    );
}

// ── ORDERS TAB ──
function OrdersTab({ orders }) {
    return (
        <div>
            <h2 style={styles.tabTitle}>Recent Orders ({orders.length})</h2>
            <div style={styles.tableWrapper}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Order ID</th>
                            <th style={styles.th}>Customer</th>
                            <th style={styles.th}>Items</th>
                            <th style={styles.th}>Amount</th>
                            <th style={styles.th}>City</th>
                            <th style={styles.th}>Date</th>
                            <th style={styles.th}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((o, i) => (
                            <tr key={i} style={i % 2 === 0 ? styles.trEven : {}}>
                                <td style={styles.td}><strong>{o.orderId}</strong></td>
                                <td style={styles.td}>
                                    <div>{o.name}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#9B9B9B' }}>{o.phone}</div>
                                </td>
                                <td style={styles.td}>
                                    {o.items?.map((item, j) => (
                                        <div key={j} style={{ fontSize: '0.75rem' }}>
                                            {item.productName} ×{item.quantity}
                                        </div>
                                    ))}
                                </td>
                                <td style={styles.td}><strong>₹{o.totalAmount?.toLocaleString('en-IN')}</strong></td>
                                <td style={styles.td}>{o.city}</td>
                                <td style={styles.td}>{o.date ? new Date(o.date).toLocaleDateString('en-IN') : '-'}</td>
                                <td style={styles.td}>
                                    <span style={{
                                        ...styles.statusBadge,
                                        background: o.paymentStatus === 'Paid' ? '#D4EDDA' : '#FFF3CD',
                                        color: o.paymentStatus === 'Paid' ? '#155724' : '#856404',
                                    }}>{o.paymentStatus}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ── VISITORS TAB ──
function VisitorsTab({ visitors }) {
    return (
        <div>
            <h2 style={styles.tabTitle}>Recent Visitors ({visitors.length})</h2>
            <div style={styles.tableWrapper}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Time</th>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>Page</th>
                            <th style={styles.th}>City</th>
                            <th style={styles.th}>Device</th>
                            <th style={styles.th}>Source</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visitors.map((v, i) => (
                            <tr key={i} style={i % 2 === 0 ? styles.trEven : {}}>
                                <td style={styles.td}>{v.timestamp}</td>
                                <td style={styles.td}>
                                    <span style={v.name === 'Guest' ? { color: '#9B9B9B' } : { fontWeight: 500 }}>
                                        {v.name}
                                    </span>
                                </td>
                                <td style={styles.td}>{v.page}</td>
                                <td style={styles.td}>{v.city}</td>
                                <td style={styles.td}>
                                    <span style={styles.deviceBadge}>
                                        {v.device === 'Mobile' ? '📱' : v.device === 'Desktop' ? '🖥️' : '📱'} {v.device}
                                    </span>
                                </td>
                                <td style={styles.td}>{v.referrer}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ── ABANDONED CARTS TAB ──
function AbandonedTab({ carts, stats }) {
    return (
        <div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                <StatCard icon="🛒" label="Pending Carts" value={stats.pendingAbandonedCarts || 0} color="#C0392B" />
                <StatCard icon="💸" label="Total Lost Value" value={`₹${(stats.abandonedCartValue || 0).toLocaleString('en-IN')}`} color="#C0392B" />
            </div>

            <h2 style={styles.tabTitle}>Abandoned Carts</h2>
            <div style={styles.tableWrapper}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Customer</th>
                            <th style={styles.th}>Items</th>
                            <th style={styles.th}>Cart Value</th>
                            <th style={styles.th}>When</th>
                            <th style={styles.th}>Reminders</th>
                            <th style={styles.th}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carts.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ ...styles.td, textAlign: 'center', color: '#9B9B9B', padding: 40 }}>
                                    No abandoned carts yet 🎉
                                </td>
                            </tr>
                        ) : carts.map((c, i) => {
                            let items = [];
                            try { items = JSON.parse(c.items); } catch {}
                            return (
                                <tr key={i} style={i % 2 === 0 ? styles.trEven : {}}>
                                    <td style={styles.td}>
                                        <div style={{ fontWeight: 500 }}>{c.name || 'Unknown'}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#9B9B9B' }}>{c.phone}</div>
                                        {c.email && <div style={{ fontSize: '0.7rem', color: '#9B9B9B' }}>{c.email}</div>}
                                    </td>
                                    <td style={styles.td}>
                                        {items.map((item, j) => (
                                            <div key={j} style={{ fontSize: '0.75rem' }}>{item.name}</div>
                                        ))}
                                    </td>
                                    <td style={styles.td}><strong>₹{c.cartValue?.toLocaleString('en-IN')}</strong></td>
                                    <td style={styles.td}>{c.createdAt}</td>
                                    <td style={styles.td}>{c.remindersSent}</td>
                                    <td style={styles.td}>
                                        <a
                                            href={`https://wa.me/91${c.phone?.replace(/\D/g, '').slice(-10)}?text=Hi ${c.name || ''}! 💎 You left a beautiful ring in your cart at Noore Jewels. Complete your purchase now → noorejewels.in/shop`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={styles.waBtn}
                                        >
                                            💬 Send WhatsApp
                                        </a>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ── ANALYTICS TAB ──
function AnalyticsTab({ analytics, stats }) {
    return (
        <div>
            <div style={styles.analyticsGrid}>
                {/* Traffic Sources */}
                <div style={styles.analyticsCard}>
                    <h3 style={styles.analyticsTitle}>🌐 Traffic Sources</h3>
                    {analytics.trafficSources?.map((s, i) => (
                        <div key={i} style={styles.barRow}>
                            <span style={styles.barLabel}>{s.source}</span>
                            <div style={styles.barTrack}>
                                <div style={{
                                    ...styles.barFill,
                                    width: `${Math.min(100, (s.count / (analytics.trafficSources[0]?.count || 1)) * 100)}%`
                                }}></div>
                            </div>
                            <span style={styles.barValue}>{s.count}</span>
                        </div>
                    ))}
                </div>

                {/* Top Cities */}
                <div style={styles.analyticsCard}>
                    <h3 style={styles.analyticsTitle}>📍 Top Cities</h3>
                    {analytics.topCities?.map((c, i) => (
                        <div key={i} style={styles.barRow}>
                            <span style={styles.barLabel}>{c.city}</span>
                            <div style={styles.barTrack}>
                                <div style={{
                                    ...styles.barFill,
                                    width: `${Math.min(100, (c.count / (analytics.topCities[0]?.count || 1)) * 100)}%`,
                                    background: '#C5A467',
                                }}></div>
                            </div>
                            <span style={styles.barValue}>{c.count}</span>
                        </div>
                    ))}
                </div>

                {/* Device Breakdown */}
                <div style={styles.analyticsCard}>
                    <h3 style={styles.analyticsTitle}>📱 Devices</h3>
                    {analytics.devices?.map((d, i) => (
                        <div key={i} style={styles.barRow}>
                            <span style={styles.barLabel}>
                                {d.device === 'Mobile' ? '📱' : d.device === 'Desktop' ? '🖥️' : '📱'} {d.device}
                            </span>
                            <div style={styles.barTrack}>
                                <div style={{
                                    ...styles.barFill,
                                    width: `${Math.min(100, (d.count / (analytics.devices[0]?.count || 1)) * 100)}%`,
                                    background: '#4A7C59',
                                }}></div>
                            </div>
                            <span style={styles.barValue}>{d.count}</span>
                        </div>
                    ))}
                </div>

                {/* Top Pages */}
                <div style={styles.analyticsCard}>
                    <h3 style={styles.analyticsTitle}>📄 Top Pages</h3>
                    {analytics.topPages?.map((p, i) => (
                        <div key={i} style={styles.barRow}>
                            <span style={styles.barLabel}>{p.page}</span>
                            <div style={styles.barTrack}>
                                <div style={{
                                    ...styles.barFill,
                                    width: `${Math.min(100, (p.count / (analytics.topPages[0]?.count || 1)) * 100)}%`,
                                    background: '#B76E79',
                                }}></div>
                            </div>
                            <span style={styles.barValue}>{p.count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── STYLES ──
const styles = {
    loadingScreen: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#F7F3ED' },
    spinner: { width: 32, height: 32, border: '3px solid #E8E2D8', borderTopColor: '#C5A467', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },

    loginContainer: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)' },
    loginCard: { background: '#fff', padding: '48px 40px', maxWidth: 380, width: '90%', textAlign: 'center' },
    loginLogo: { fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: 400, letterSpacing: '0.15em', color: '#1A1A1A', marginBottom: 4 },
    loginSubtitle: { fontSize: '0.75rem', color: '#9B9B9B', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 32 },
    loginForm: { display: 'flex', flexDirection: 'column', gap: 12 },
    loginInput: { padding: '14px 16px', border: '1px solid #E8E2D8', fontSize: '0.85rem', fontFamily: 'inherit', outline: 'none', textAlign: 'center' },
    loginError: { fontSize: '0.78rem', color: '#C0392B' },
    loginBtn: { padding: '14px', background: '#C5A467', color: '#fff', border: 'none', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' },

    dashboard: { minHeight: '100vh', background: '#F7F3ED', fontFamily: "'Helvetica Neue', Arial, sans-serif" },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', background: '#1A1A1A', color: '#fff', flexWrap: 'wrap', gap: 12 },
    headerLeft: { display: 'flex', alignItems: 'center', gap: 12 },
    headerTitle: { fontFamily: 'Georgia, serif', fontSize: '1.2rem', fontWeight: 400, letterSpacing: '0.12em' },
    headerBadge: { fontSize: '0.6rem', background: '#C5A467', color: '#fff', padding: '3px 10px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 },
    headerRight: { display: 'flex', gap: 8 },
    refreshBtn: { padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'inherit' },
    logoutBtn: { padding: '8px 16px', background: 'transparent', color: '#9B9B9B', border: '1px solid #555', fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'inherit' },

    tabs: { display: 'flex', gap: 0, borderBottom: '1px solid #E8E2D8', background: '#fff', overflowX: 'auto', padding: '0 16px' },
    tab: { padding: '14px 20px', fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B6B6B', cursor: 'pointer', border: 'none', background: 'none', borderBottom: '2px solid transparent', whiteSpace: 'nowrap', fontFamily: 'inherit' },
    tabActive: { color: '#C5A467', borderBottomColor: '#C5A467' },

    content: { padding: '24px', maxWidth: 1400, margin: '0 auto' },

    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 24 },
    statCard: { background: '#fff', padding: '20px 16px', textAlign: 'center', border: '1px solid #E8E2D8' },
    statIcon: { fontSize: '1.5rem', marginBottom: 8 },
    statValue: { fontSize: '1.5rem', fontWeight: 600, color: '#1A1A1A', marginBottom: 4 },
    statLabel: { fontSize: '0.68rem', color: '#9B9B9B', letterSpacing: '0.05em', textTransform: 'uppercase' },

    tabTitle: { fontFamily: 'Georgia, serif', fontSize: '1.2rem', fontWeight: 400, marginBottom: 16, color: '#1A1A1A' },

    tableWrapper: { overflowX: 'auto', background: '#fff', border: '1px solid #E8E2D8' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' },
    th: { textAlign: 'left', padding: '12px 16px', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B6B6B', borderBottom: '2px solid #E8E2D8', whiteSpace: 'nowrap' },
    td: { padding: '10px 16px', borderBottom: '1px solid #F0ECE4', verticalAlign: 'top' },
    trEven: { background: '#FDFBF7' },

    statusBadge: { display: 'inline-block', padding: '3px 10px', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' },
    deviceBadge: { fontSize: '0.75rem' },

    waBtn: { display: 'inline-block', padding: '6px 12px', background: '#25D366', color: '#fff', fontSize: '0.68rem', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' },

    analyticsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 },
    analyticsCard: { background: '#fff', padding: '20px', border: '1px solid #E8E2D8' },
    analyticsTitle: { fontFamily: 'Georgia, serif', fontSize: '1rem', fontWeight: 400, marginBottom: 16, color: '#1A1A1A' },
    barRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 },
    barLabel: { fontSize: '0.75rem', color: '#6B6B6B', minWidth: 80, flexShrink: 0 },
    barTrack: { flex: 1, height: 8, background: '#F0ECE4', borderRadius: 4, overflow: 'hidden' },
    barFill: { height: '100%', background: '#1A1A1A', borderRadius: 4, transition: 'width 0.5s ease' },
    barValue: { fontSize: '0.75rem', fontWeight: 600, color: '#1A1A1A', minWidth: 30, textAlign: 'right' },
};
