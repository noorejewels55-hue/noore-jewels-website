'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import CartDrawer from '@/components/CartDrawer';
import { CartProvider, useCart } from '@/context/CartContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';

function CheckoutContent() {
    const { items, subtotal, shipping, total, clearCart } = useCart();
    const { user, openAuth } = useAuth();

    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        email: user?.email || '',
        address: '',
        city: '',
        state: '',
        pincode: '',
    });
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [coupon, setCoupon] = useState('');
    const [discount, setDiscount] = useState(0);
    const [couponApplied, setCouponApplied] = useState(false);
    const [couponMsg, setCouponMsg] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleApplyCoupon = async () => {
        if (!coupon.trim()) {
            setCouponMsg('Please enter a coupon code.');
            return;
        }
        setCouponLoading(true);
        setCouponMsg('');
        try {
            const res = await fetch('/api/coupon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: coupon.trim(), orderAmount: subtotal }),
            });
            const data = await res.json();
            if (data.success) {
                setDiscount(data.coupon.discountAmount);
                setCouponApplied(true);
                setCouponMsg(data.message);
            } else {
                setDiscount(0);
                setCouponApplied(false);
                setCouponMsg(data.message);
            }
        } catch (err) {
            setCouponMsg('Failed to validate coupon. Try again.');
        }
        setCouponLoading(false);
    };

    const handlePayment = async () => {
        // Validate
        if (!formData.name || !formData.phone || !formData.email || !formData.address || !formData.city || !formData.pincode) {
            setError('Please fill in all required fields, including email');
            return;
        }

        if (!user) {
            openAuth();
            return;
        }

        setProcessing(true);
        setError('');

        try {
            // Create Razorpay order
            const res = await fetch('/api/payment/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: Math.round((total - discount) * 100), // Razorpay expects paise
                    items: items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price })),
                    customer: formData,
                    coupon: coupon || undefined,
                }),
            });

            const data = await res.json();

            if (!data.success) {
                setError(data.message || 'Failed to create order');
                setProcessing(false);
                return;
            }

            // Open Razorpay checkout
            const options = {
                key: data.razorpayKeyId,
                amount: data.order.amount,
                currency: 'INR',
                name: 'Noore Jewels',
                description: `Order #${data.order.id}`,
                order_id: data.order.id,
                handler: async function (response) {
                    // Verify payment
                    try {
                        const verifyRes = await fetch('/api/payment/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                items,
                                customer: formData,
                            }),
                        });
                        const verifyData = await verifyRes.json();

                        if (verifyData.success) {
                            setOrderId(verifyData.orderId);
                            setOrderComplete(true);
                            clearCart();
                        } else {
                            setError('Payment verification failed. Please contact support.');
                        }
                    } catch (err) {
                        setError('Payment verification error. Please contact support.');
                    }
                    setProcessing(false);
                },
                prefill: {
                    name: formData.name,
                    contact: formData.phone,
                    email: formData.email || undefined,
                },
                theme: {
                    color: '#C5A467',
                },
                modal: {
                    ondismiss: () => {
                        setProcessing(false);
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (err) {
            console.error('Payment error:', err);
            setError('Something went wrong. Please try again.');
            setProcessing(false);
        }
    };

    // Order Complete View
    if (orderComplete) {
        return (
            <>
                <Navbar />
                <div style={{ textAlign: 'center', padding: '120px 24px', maxWidth: '500px', margin: '0 auto' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎉</div>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 400, marginBottom: '12px' }}>
                        Order Confirmed!
                    </h1>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginBottom: '8px', lineHeight: 1.8 }}>
                        Thank you for shopping with Noore Jewels.
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '32px' }}>
                        Order ID: <strong>{orderId}</strong>
                    </p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--color-text-light)', marginBottom: '32px', lineHeight: 1.8 }}>
                        You&apos;ll receive an order confirmation via email shortly.
                        For any questions, feel free to chat with us!
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/shop" className="btn btn-primary">Continue Shopping</Link>
                        <a
                            href={`https://wa.me/919217945235?text=Hi! I just placed order ${orderId}. Can you confirm?`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline"
                        >
                            💬 WhatsApp Support
                        </a>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    // Empty Cart View
    if (items.length === 0) {
        return (
            <>
                <Navbar />
                <div style={{ textAlign: 'center', padding: '120px 24px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🛍️</div>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 400, marginBottom: '16px' }}>
                        Your Bag is Empty
                    </h1>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginBottom: '32px' }}>
                        Add some beautiful pieces to get started!
                    </p>
                    <Link href="/shop" className="btn btn-primary btn-lg">Start Shopping</Link>
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

            {/* Load Razorpay Script */}
            <script src="https://checkout.razorpay.com/v1/checkout.js" async />

            <section className="checkout-page">
                <div className="container">
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 400, letterSpacing: '0.08em', textAlign: 'center', marginBottom: '32px', textTransform: 'uppercase' }}>
                        Checkout
                    </h1>

                    {!user && (
                        <div style={{ textAlign: 'center', marginBottom: '32px', padding: '24px', background: 'var(--color-bg-alt)', border: '1px solid var(--color-border-light)' }}>
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', marginBottom: '12px' }}>
                                Please sign in to continue with your order
                            </p>
                            <button onClick={openAuth} className="btn btn-primary">Sign In</button>
                        </div>
                    )}

                    <div className="checkout-grid">
                        {/* Form */}
                        <div>
                            <h2 className="checkout-section-title">Shipping Details</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                                <div className="auth-form-group">
                                    <label className="auth-label">Full Name *</label>
                                    <input className="auth-input" type="text" value={formData.name} onChange={e => handleChange('name', e.target.value)} placeholder="Your full name" />
                                </div>
                                <div className="auth-form-group">
                                    <label className="auth-label">Phone Number *</label>
                                    <input className="auth-input" type="tel" value={formData.phone} onChange={e => handleChange('phone', e.target.value)} placeholder="Your phone number" />
                                </div>
                            </div>

                            <div className="auth-form-group">
                                <label className="auth-label">Email *</label>
                                <input className="auth-input" type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} placeholder="Your email address" required />
                            </div>

                            <div className="auth-form-group">
                                <label className="auth-label">Delivery Address *</label>
                                <textarea className="auth-input" rows={3} value={formData.address} onChange={e => handleChange('address', e.target.value)} placeholder="House no, Street, Landmark" style={{ resize: 'vertical' }} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
                                <div className="auth-form-group">
                                    <label className="auth-label">City *</label>
                                    <input className="auth-input" type="text" value={formData.city} onChange={e => handleChange('city', e.target.value)} placeholder="City" />
                                </div>
                                <div className="auth-form-group">
                                    <label className="auth-label">State</label>
                                    <input className="auth-input" type="text" value={formData.state} onChange={e => handleChange('state', e.target.value)} placeholder="State" />
                                </div>
                                <div className="auth-form-group">
                                    <label className="auth-label">PIN Code *</label>
                                    <input className="auth-input" type="text" value={formData.pincode} onChange={e => handleChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="6-digit" maxLength={6} />
                                </div>
                            </div>

                            {/* Coupon */}
                            <div style={{ marginTop: '24px' }}>
                                <h2 className="checkout-section-title">Discount Code</h2>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        className="auth-input"
                                        type="text"
                                        value={coupon}
                                        onChange={e => { setCoupon(e.target.value.toUpperCase()); if (couponApplied) { setCouponApplied(false); setDiscount(0); setCouponMsg(''); } }}
                                        placeholder="Enter coupon code"
                                        style={{ flex: 1 }}
                                        disabled={couponApplied}
                                    />
                                    {couponApplied ? (
                                        <button className="btn btn-outline btn-sm" onClick={() => { setCoupon(''); setCouponApplied(false); setDiscount(0); setCouponMsg(''); }}>Remove</button>
                                    ) : (
                                        <button className="btn btn-outline btn-sm" onClick={handleApplyCoupon} disabled={couponLoading}>
                                            {couponLoading ? '...' : 'Apply'}
                                        </button>
                                    )}
                                </div>
                                {couponMsg && (
                                    <p style={{
                                        fontSize: '0.78rem',
                                        marginTop: '6px',
                                        color: couponApplied ? '#38A169' : '#E53E3E',
                                        fontWeight: 500,
                                    }}>{couponMsg}</p>
                                )}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="checkout-summary">
                            <h2 className="checkout-section-title">Order Summary</h2>

                            {items.map(item => {
                                const price = item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;
                                return (
                                    <div key={item.id} className="checkout-summary-item">
                                        <div className="checkout-summary-item-image">
                                            <img src={item.image} alt={item.name} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 500, marginBottom: '4px' }}>{item.name}</div>
                                            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-light)' }}>Qty: {item.quantity}</div>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>₹{Math.round(price * item.quantity).toLocaleString('en-IN')}</div>
                                    </div>
                                );
                            })}

                            <div style={{ marginTop: '24px' }}>
                                <div className="cart-total"><span>Subtotal</span><span>₹{Math.round(subtotal).toLocaleString('en-IN')}</span></div>
                                <div className="cart-total"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
                                {discount > 0 && <div className="cart-total"><span>Discount</span><span style={{ color: 'var(--color-success)' }}>-₹{discount}</span></div>}
                                <div className="cart-total grand"><span>Total</span><span>₹{Math.round(total - discount).toLocaleString('en-IN')}</span></div>
                            </div>

                            {error && <p className="auth-error" style={{ marginTop: '16px' }}>{error}</p>}

                            <button
                                className="btn btn-gold btn-full btn-lg"
                                style={{ marginTop: '24px' }}
                                onClick={handlePayment}
                                disabled={processing}
                            >
                                {processing ? 'Processing...' : `Pay ₹${Math.round(total - discount).toLocaleString('en-IN')}`}
                            </button>

                            <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '12px', lineHeight: 1.6 }}>
                                🔒 Secured by Razorpay. UPI, Cards, Net Banking & Wallets accepted.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

export default function CheckoutPage() {
    return (
        <AuthProvider>
            <CartProvider>
                <CheckoutContent />
            </CartProvider>
        </AuthProvider>
    );
}
