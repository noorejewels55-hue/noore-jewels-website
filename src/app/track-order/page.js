'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import CartDrawer from '@/components/CartDrawer';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';

function TrackOrderPage() {
    const [awb, setAwb] = useState('');
    const [tracking, setTracking] = useState(null);
    const [orders, setOrders] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [notConfigured, setNotConfigured] = useState(false);

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!awb.trim()) {
            setError('Please enter your AWB tracking number.');
            return;
        }
        setLoading(true);
        setError('');
        setTracking(null);
        setOrders(null);
        setNotConfigured(false);

        try {
            const res = await fetch('/api/tracking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    awb: awb.trim(),
                }),
            });
            const data = await res.json();

            if (data.configured === false) {
                setNotConfigured(true);
            } else if (data.success && data.tracking) {
                setTracking(data.tracking);
            } else if (data.success && data.orders) {
                setOrders(data.orders);
            } else {
                setError(data.message || 'No tracking information found.');
            }
        } catch (err) {
            setError('Something went wrong. Please try again later.');
        }
        setLoading(false);
    };

    // Track a specific order from the orders list
    const trackSpecificOrder = async (id) => {
        setLoading(true);
        setError('');
        setOrders(null);
        try {
            const res = await fetch('/api/tracking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: String(id) }),
            });
            const data = await res.json();
            if (data.success && data.tracking) {
                setTracking(data.tracking);
            } else {
                setError(data.message || 'Could not fetch tracking details.');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        }
        setLoading(false);
    };

    const statusColors = {
        'DELIVERED': '#38A169',
        'IN TRANSIT': '#3182CE',
        'OUT FOR DELIVERY': '#D69E2E',
        'SHIPPED': '#3182CE',
        'PICKED UP': '#805AD5',
        'PENDING': '#E53E3E',
        'RTO': '#E53E3E',
        'CANCELLED': '#E53E3E',
    };

    const getStatusColor = (status) => {
        const upper = (status || '').toUpperCase();
        for (const [key, color] of Object.entries(statusColors)) {
            if (upper.includes(key)) return color;
        }
        return '#718096';
    };

    return (
        <>
            <Navbar />
            <AuthModal />
            <CartDrawer />

            <section style={{
                padding: '120px 0 80px',
                background: 'var(--color-bg)',
                minHeight: '100vh',
            }}>
                <div className="container">
                    <h1 className="section-title">Track Your Order</h1>
                    <div className="section-divider"></div>
                    <p className="section-subtitle">Enter your AWB tracking number to check your order status</p>

                    <div style={{
                        maxWidth: '560px',
                        margin: '48px auto 0',
                        background: 'var(--color-bg-alt, #FDFBF7)',
                        padding: '40px',
                        borderRadius: '12px',
                        border: '1px solid var(--color-border, #E8E0D4)',
                    }}>
                        <form onSubmit={handleTrack} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.8rem',
                                    fontWeight: 500,
                                    color: 'var(--color-text)',
                                    marginBottom: '6px',
                                    letterSpacing: '0.05em',
                                }}>AWB Tracking Number</label>
                                <input
                                    type="text"
                                    placeholder="Enter your AWB number (e.g. 59632218892)"
                                    value={awb}
                                    onChange={e => setAwb(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: '1px solid var(--color-border, #E8E0D4)',
                                        borderRadius: '6px',
                                        fontSize: '0.88rem',
                                        background: 'var(--color-bg)',
                                        color: 'var(--color-text)',
                                        outline: 'none',
                                        transition: 'border-color 0.3s',
                                        boxSizing: 'border-box',
                                    }}
                                />
                                <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                                    Your AWB number is shared via email once your order is shipped.
                                </p>
                            </div>

                            {error && (
                                <p style={{
                                    color: '#e53e3e',
                                    fontSize: '0.82rem',
                                    margin: 0,
                                    padding: '8px 12px',
                                    background: '#fff5f5',
                                    borderRadius: '6px',
                                    border: '1px solid #fed7d7',
                                }}>{error}</p>
                            )}

                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Searching...' : 'Track Order'}
                            </button>
                        </form>

                        {/* Not Configured Message */}
                        {notConfigured && (
                            <div style={{
                                marginTop: '24px',
                                padding: '20px',
                                background: '#EBF8FF',
                                border: '1px solid #BEE3F8',
                                borderRadius: '8px',
                                textAlign: 'center',
                            }}>
                                <p style={{
                                    fontSize: '0.88rem',
                                    color: '#2B6CB0',
                                    margin: '0 0 16px',
                                    lineHeight: '1.6',
                                }}>Order tracking is being finalized. Please contact us for order updates.</p>
                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                    <a
                                        href="mailto:noore.jewels55@gmail.com?subject=Order%20Status%20Inquiry"
                                        className="btn btn-outline"
                                        style={{ fontSize: '0.8rem', padding: '10px 20px' }}
                                    >
                                        📧 Email Us
                                    </a>
                                    <a
                                        href="https://wa.me/919217945235?text=Hi! I want to check my order status."
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary"
                                        style={{ fontSize: '0.8rem', padding: '10px 20px', background: '#25D366', borderColor: '#25D366' }}
                                    >
                                        💬 WhatsApp
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Tracking Info */}
                        {tracking && (
                            <div style={{
                                marginTop: '24px',
                                padding: '24px',
                                background: '#F7FAFC',
                                border: '1px solid #E2E8F0',
                                borderRadius: '10px',
                            }}>
                                {/* Status Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Status</div>
                                        <div style={{
                                            display: 'inline-block',
                                            padding: '6px 16px',
                                            background: getStatusColor(tracking.status),
                                            color: '#fff',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                        }}>{tracking.status}</div>
                                    </div>
                                    {tracking.courier !== 'N/A' && (
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '0.75rem', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Courier</div>
                                            <div style={{ fontSize: '0.88rem', fontWeight: 500, color: '#2D3748' }}>{tracking.courier}</div>
                                        </div>
                                    )}
                                </div>

                                {/* Details Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                                    {tracking.awb !== 'N/A' && (
                                        <div style={{ padding: '12px', background: '#EDF2F7', borderRadius: '6px' }}>
                                            <div style={{ fontSize: '0.7rem', color: '#718096', marginBottom: '2px' }}>AWB Number</div>
                                            <div style={{ fontSize: '0.82rem', fontWeight: 500, color: '#2D3748' }}>{tracking.awb}</div>
                                        </div>
                                    )}
                                    {tracking.etd !== 'N/A' && (
                                        <div style={{ padding: '12px', background: '#EDF2F7', borderRadius: '6px' }}>
                                            <div style={{ fontSize: '0.7rem', color: '#718096', marginBottom: '2px' }}>Expected Delivery</div>
                                            <div style={{ fontSize: '0.82rem', fontWeight: 500, color: '#2D3748' }}>{tracking.etd}</div>
                                        </div>
                                    )}
                                </div>

                                {/* Activity Timeline */}
                                {tracking.activities && tracking.activities.length > 0 && (
                                    <div>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#2D3748', marginBottom: '12px', letterSpacing: '0.05em' }}>Tracking Timeline</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                                            {tracking.activities.map((act, i) => (
                                                <div key={i} style={{
                                                    display: 'flex',
                                                    gap: '12px',
                                                    paddingBottom: i < tracking.activities.length - 1 ? '16px' : '0',
                                                    position: 'relative',
                                                }}>
                                                    {/* Timeline dot & line */}
                                                    <div style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        width: '16px',
                                                        flexShrink: 0,
                                                    }}>
                                                        <div style={{
                                                            width: '10px',
                                                            height: '10px',
                                                            borderRadius: '50%',
                                                            background: i === 0 ? getStatusColor(tracking.status) : '#CBD5E0',
                                                            border: i === 0 ? `2px solid ${getStatusColor(tracking.status)}33` : 'none',
                                                            boxSizing: 'border-box',
                                                            flexShrink: 0,
                                                            marginTop: '4px',
                                                        }} />
                                                        {i < tracking.activities.length - 1 && (
                                                            <div style={{
                                                                width: '2px',
                                                                flex: 1,
                                                                background: '#E2E8F0',
                                                                minHeight: '20px',
                                                            }} />
                                                        )}
                                                    </div>
                                                    {/* Activity content */}
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{
                                                            fontSize: '0.82rem',
                                                            color: i === 0 ? '#2D3748' : '#718096',
                                                            fontWeight: i === 0 ? 500 : 400,
                                                            lineHeight: '1.5',
                                                        }}>{act.activity}</div>
                                                        <div style={{
                                                            fontSize: '0.72rem',
                                                            color: '#A0AEC0',
                                                            marginTop: '2px',
                                                        }}>
                                                            {act.date}{act.location ? ` • ${act.location}` : ''}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Orders List (when searched by phone) */}
                        {orders && orders.length > 0 && (
                            <div style={{ marginTop: '24px' }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '12px' }}>
                                    Found {orders.length} order{orders.length > 1 ? 's' : ''}
                                </div>
                                {orders.map((order, i) => (
                                    <div key={i} style={{
                                        padding: '16px',
                                        background: '#F7FAFC',
                                        border: '1px solid #E2E8F0',
                                        borderRadius: '8px',
                                        marginBottom: '10px',
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#2D3748' }}>
                                                Order #{order.orderId}
                                            </div>
                                            <div style={{
                                                fontSize: '0.72rem',
                                                padding: '3px 10px',
                                                background: getStatusColor(order.status),
                                                color: '#fff',
                                                borderRadius: '12px',
                                                fontWeight: 500,
                                            }}>{order.status}</div>
                                        </div>
                                        <div style={{ fontSize: '0.78rem', color: '#718096', marginBottom: '4px' }}>
                                            {order.products}
                                        </div>
                                        <div style={{ fontSize: '0.72rem', color: '#A0AEC0', marginBottom: '10px' }}>
                                            Placed: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>
                                        <button
                                            className="btn btn-outline"
                                            style={{ fontSize: '0.75rem', padding: '6px 16px' }}
                                            onClick={() => trackSpecificOrder(order.awb || order.id)}
                                        >
                                            Track This Order →
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {orders && orders.length === 0 && (
                            <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: '#718096' }}>
                                No orders found for this phone number.
                            </p>
                        )}
                    </div>

                    {/* FAQ Section */}
                    <div style={{
                        maxWidth: '560px',
                        margin: '48px auto 0',
                    }}>
                        <h2 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.1rem',
                            fontWeight: 500,
                            color: 'var(--color-text)',
                            marginBottom: '20px',
                            textAlign: 'center',
                            letterSpacing: '0.05em',
                        }}>Frequently Asked Questions</h2>

                        {[
                            {
                                q: 'Where do I find my Order ID?',
                                a: 'Your Order ID is sent to your email and WhatsApp after a successful purchase. You can also find it in your order confirmation.',
                            },
                            {
                                q: 'What is an AWB number?',
                                a: 'AWB (Air Waybill) is a tracking number assigned by the courier partner. It\'s shared with you via SMS/email once your order is shipped.',
                            },
                            {
                                q: 'How long does delivery take?',
                                a: 'We typically deliver within 5-7 business days across India. Metro cities may receive orders in 3-5 days.',
                            },
                            {
                                q: 'Can I change my delivery address?',
                                a: 'Please contact us via WhatsApp or email within 24 hours of placing your order to update the address.',
                            },
                        ].map((faq, i) => (
                            <div key={i} style={{
                                background: 'var(--color-bg-alt, #FDFBF7)',
                                padding: '20px 24px',
                                borderRadius: '8px',
                                border: '1px solid var(--color-border, #E8E0D4)',
                                marginBottom: '12px',
                            }}>
                                <div style={{
                                    fontWeight: 500,
                                    fontSize: '0.88rem',
                                    color: 'var(--color-text)',
                                    marginBottom: '8px',
                                }}>{faq.q}</div>
                                <div style={{
                                    fontSize: '0.82rem',
                                    color: 'var(--color-text-light)',
                                    lineHeight: '1.6',
                                }}>{faq.a}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

export default function TrackOrder() {
    return (
        <AuthProvider>
            <CartProvider>
                <TrackOrderPage />
            </CartProvider>
        </AuthProvider>
    );
}
