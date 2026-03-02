'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import CartDrawer from '@/components/CartDrawer';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';

function MyOrdersContent() {
    const { user, openAuth, isInitialized } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        if (isInitialized && user?.phone) {
            fetchOrders();
        } else if (isInitialized) {
            setLoading(false);
        }
    }, [user, isInitialized]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: user.phone }),
            });
            const data = await res.json();
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
        }
        setLoading(false);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            });
        } catch {
            return dateStr;
        }
    };

    const getStatusColor = (status) => {
        const s = (status || '').toLowerCase();
        if (s === 'paid' || s === 'delivered') return '#38A169';
        if (s === 'shipped' || s === 'in transit') return '#3182CE';
        if (s === 'processing') return '#D69E2E';
        if (s === 'cancelled' || s === 'refunded') return '#E53E3E';
        return '#718096';
    };

    const getStatusIcon = (status) => {
        const s = (status || '').toLowerCase();
        if (s === 'delivered') return '✅';
        if (s === 'shipped' || s === 'in transit') return '🚚';
        if (s === 'processing') return '⏳';
        if (s === 'cancelled') return '❌';
        if (s === 'refunded') return '💸';
        return '✓';
    };

    // Not logged in
    if (isInitialized && !user) {
        return (
            <>
                <Navbar />
                <AuthModal />
                <CartDrawer />
                <div style={{
                    textAlign: 'center',
                    padding: '120px 24px',
                    maxWidth: '500px',
                    margin: '0 auto',
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔒</div>
                    <h1 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '2rem',
                        fontWeight: 400,
                        marginBottom: '12px',
                        letterSpacing: '0.05em',
                    }}>
                        Sign In to View Orders
                    </h1>
                    <p style={{
                        fontSize: '0.9rem',
                        color: 'var(--color-text-light)',
                        marginBottom: '32px',
                        lineHeight: 1.8,
                    }}>
                        Please sign in with your phone number to view your order history and track shipments.
                    </p>
                    <button onClick={openAuth} className="btn btn-primary btn-lg">
                        Sign In
                    </button>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <AuthModal />
            <CartDrawer />

            <section style={{ padding: '100px 0 60px', minHeight: '70vh' }}>
                <div className="container">
                    {/* Page Header */}
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <h1 style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '2rem',
                            fontWeight: 400,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            marginBottom: '8px',
                        }}>
                            My Orders
                        </h1>
                        <div className="section-divider"></div>
                        {user && (
                            <p style={{
                                fontSize: '0.85rem',
                                color: 'var(--color-text-light)',
                                marginTop: '12px',
                            }}>
                                Welcome back, <strong>{user.name}</strong>
                            </p>
                        )}
                    </div>

                    {/* Quick Stats */}
                    {!loading && orders.length > 0 && (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                            gap: '16px',
                            marginBottom: '40px',
                            maxWidth: '600px',
                            margin: '0 auto 40px',
                        }}>
                            <div style={{
                                textAlign: 'center',
                                padding: '20px 12px',
                                background: 'var(--color-bg-alt, #F7F3ED)',
                                border: '1px solid var(--color-border-light, #E8E0D4)',
                            }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-gold, #C5A467)' }}>
                                    {orders.length}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '4px' }}>
                                    Total Orders
                                </div>
                            </div>
                            <div style={{
                                textAlign: 'center',
                                padding: '20px 12px',
                                background: 'var(--color-bg-alt, #F7F3ED)',
                                border: '1px solid var(--color-border-light, #E8E0D4)',
                            }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-gold, #C5A467)' }}>
                                    {orders.reduce((sum, o) => sum + o.items.length, 0)}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '4px' }}>
                                    Items Purchased
                                </div>
                            </div>
                            <div style={{
                                textAlign: 'center',
                                padding: '20px 12px',
                                background: 'var(--color-bg-alt, #F7F3ED)',
                                border: '1px solid var(--color-border-light, #E8E0D4)',
                            }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-gold, #C5A467)' }}>
                                    ₹{Math.round(orders.reduce((sum, o) => sum + o.totalAmount, 0)).toLocaleString('en-IN')}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '4px' }}>
                                    Total Spent
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                border: '3px solid var(--color-border-light, #E8E0D4)',
                                borderTopColor: 'var(--color-gold, #C5A467)',
                                borderRadius: '50%',
                                animation: 'spin 0.8s ease-in-out infinite',
                                margin: '0 auto 16px',
                            }} />
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>
                                Loading your orders...
                            </p>
                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && orders.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '60px 24px' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🛍️</div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '1.5rem',
                                fontWeight: 400,
                                marginBottom: '12px',
                            }}>
                                No Orders Yet
                            </h2>
                            <p style={{
                                fontSize: '0.9rem',
                                color: 'var(--color-text-light)',
                                marginBottom: '32px',
                                lineHeight: 1.8,
                            }}>
                                You haven&apos;t placed any orders yet. Start exploring our beautiful collection!
                            </p>
                            <Link href="/shop" className="btn btn-primary btn-lg">
                                Start Shopping
                            </Link>
                        </div>
                    )}

                    {/* Orders List */}
                    {!loading && orders.length > 0 && (
                        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                            {orders.map((order, index) => (
                                <div
                                    key={order.orderId}
                                    style={{
                                        background: '#fff',
                                        border: '1px solid var(--color-border-light, #E8E0D4)',
                                        marginBottom: '16px',
                                        transition: 'box-shadow 0.3s ease',
                                        boxShadow: expandedOrder === index ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
                                    }}
                                >
                                    {/* Order Header (clickable) */}
                                    <button
                                        onClick={() => setExpandedOrder(expandedOrder === index ? null : index)}
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '20px 24px',
                                            background: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            gap: '12px',
                                            flexWrap: 'wrap',
                                        }}
                                    >
                                        <div style={{ flex: '1 1 200px' }}>
                                            <div style={{
                                                fontSize: '0.72rem',
                                                color: 'var(--color-text-muted)',
                                                letterSpacing: '0.08em',
                                                textTransform: 'uppercase',
                                                marginBottom: '4px',
                                            }}>
                                                Order #{order.orderId}
                                            </div>
                                            <div style={{
                                                fontSize: '0.85rem',
                                                color: 'var(--color-text)',
                                            }}>
                                                {order.items.length} item{order.items.length > 1 ? 's' : ''} • {formatDate(order.date)}
                                            </div>
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '16px',
                                        }}>
                                            {/* Status Badge */}
                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                padding: '4px 12px',
                                                fontSize: '0.72rem',
                                                fontWeight: 600,
                                                letterSpacing: '0.05em',
                                                textTransform: 'uppercase',
                                                color: getStatusColor(order.paymentStatus),
                                                background: `${getStatusColor(order.paymentStatus)}15`,
                                                border: `1px solid ${getStatusColor(order.paymentStatus)}30`,
                                                borderRadius: '2px',
                                            }}>
                                                {getStatusIcon(order.paymentStatus)} {order.paymentStatus}
                                            </span>

                                            {/* Amount */}
                                            <span style={{
                                                fontSize: '0.95rem',
                                                fontWeight: 600,
                                                color: 'var(--color-text)',
                                                minWidth: '70px',
                                                textAlign: 'right',
                                            }}>
                                                ₹{Math.round(order.totalAmount).toLocaleString('en-IN')}
                                            </span>

                                            {/* Expand Arrow */}
                                            <span style={{
                                                fontSize: '0.75rem',
                                                color: 'var(--color-text-muted)',
                                                transition: 'transform 0.3s ease',
                                                transform: expandedOrder === index ? 'rotate(180deg)' : 'rotate(0deg)',
                                            }}>
                                                ▼
                                            </span>
                                        </div>
                                    </button>

                                    {/* Order Details (expanded) */}
                                    {expandedOrder === index && (
                                        <div style={{
                                            padding: '0 24px 24px',
                                            borderTop: '1px solid var(--color-border-light, #E8E0D4)',
                                        }}>
                                            {/* Items */}
                                            <div style={{ marginTop: '20px' }}>
                                                <div style={{
                                                    fontSize: '0.72rem',
                                                    color: 'var(--color-text-muted)',
                                                    letterSpacing: '0.08em',
                                                    textTransform: 'uppercase',
                                                    marginBottom: '12px',
                                                    fontWeight: 500,
                                                }}>
                                                    Items Ordered
                                                </div>

                                                {order.items.map((item, i) => (
                                                    <div
                                                        key={i}
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            padding: '12px 0',
                                                            borderBottom: i < order.items.length - 1 ? '1px solid #f0ece6' : 'none',
                                                        }}
                                                    >
                                                        <div>
                                                            <div style={{
                                                                fontSize: '0.88rem',
                                                                fontWeight: 500,
                                                                color: 'var(--color-text)',
                                                                marginBottom: '2px',
                                                            }}>
                                                                {item.productName}
                                                            </div>
                                                            <div style={{
                                                                fontSize: '0.78rem',
                                                                color: 'var(--color-text-light)',
                                                            }}>
                                                                Qty: {item.quantity}
                                                                {item.discount > 0 && (
                                                                    <span style={{ color: '#38A169', marginLeft: '8px' }}>
                                                                        ({item.discount}% off)
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div style={{
                                                            fontSize: '0.88rem',
                                                            fontWeight: 500,
                                                        }}>
                                                            ₹{Math.round(item.finalAmount).toLocaleString('en-IN')}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Delivery Address */}
                                            {order.address && (
                                                <div style={{
                                                    marginTop: '20px',
                                                    padding: '16px',
                                                    background: 'var(--color-bg-alt, #F7F3ED)',
                                                    border: '1px solid var(--color-border-light, #E8E0D4)',
                                                }}>
                                                    <div style={{
                                                        fontSize: '0.72rem',
                                                        color: 'var(--color-text-muted)',
                                                        letterSpacing: '0.08em',
                                                        textTransform: 'uppercase',
                                                        marginBottom: '8px',
                                                        fontWeight: 500,
                                                    }}>
                                                        Delivery Address
                                                    </div>
                                                    <div style={{
                                                        fontSize: '0.85rem',
                                                        color: 'var(--color-text)',
                                                        lineHeight: 1.6,
                                                    }}>
                                                        {order.name}<br />
                                                        {order.address}<br />
                                                        {order.city}{order.state ? `, ${order.state}` : ''} — {order.pincode}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div style={{
                                                display: 'flex',
                                                gap: '10px',
                                                marginTop: '20px',
                                                flexWrap: 'wrap',
                                            }}>
                                                <Link
                                                    href={`/track-order?orderId=${order.orderId}`}
                                                    className="btn btn-outline btn-sm"
                                                >
                                                    📦 Track Order
                                                </Link>
                                                <a
                                                    href={`https://wa.me/919217945235?text=Hi! I need help with my order ${order.orderId}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-outline btn-sm"
                                                    style={{ borderColor: '#25D366', color: '#25D366' }}
                                                >
                                                    💬 Get Help
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Help Section */}
                    {!loading && (
                        <div style={{
                            textAlign: 'center',
                            marginTop: '48px',
                            padding: '32px 24px',
                            background: 'var(--color-bg-alt, #F7F3ED)',
                            border: '1px solid var(--color-border-light, #E8E0D4)',
                            maxWidth: '600px',
                            margin: '48px auto 0',
                        }}>
                            <p style={{
                                fontSize: '0.85rem',
                                color: 'var(--color-text-light)',
                                marginBottom: '16px',
                                lineHeight: 1.7,
                            }}>
                                Need help with an order? We&apos;re here for you!
                            </p>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <Link href="/track-order" className="btn btn-outline btn-sm">
                                    Track Order
                                </Link>
                                <a
                                    href="https://wa.me/919217945235?text=Hi! I need help with my order"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary btn-sm"
                                    style={{ background: '#25D366', borderColor: '#25D366' }}
                                >
                                    💬 WhatsApp Support
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </>
    );
}

export default function MyOrdersPage() {
    return (
        <AuthProvider>
            <CartProvider>
                <MyOrdersContent />
            </CartProvider>
        </AuthProvider>
    );
}
