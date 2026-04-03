'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import CartDrawer from '@/components/CartDrawer';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';

function ReturnPolicyContent() {
    const sectionStyle = {
        marginBottom: '48px',
    };

    const headingStyle = {
        fontFamily: 'var(--font-heading)',
        fontSize: '1.3rem',
        fontWeight: 400,
        letterSpacing: '0.04em',
        marginBottom: '16px',
        color: 'var(--color-text)',
    };

    const textStyle = {
        fontSize: '0.88rem',
        fontWeight: 300,
        color: 'var(--color-text-light)',
        lineHeight: 1.9,
        marginBottom: '14px',
    };

    const listStyle = {
        fontSize: '0.88rem',
        fontWeight: 300,
        color: 'var(--color-text-light)',
        lineHeight: 2.0,
        paddingLeft: '24px',
        marginBottom: '14px',
    };

    const highlightBoxStyle = {
        background: 'linear-gradient(135deg, rgba(212,186,130,0.08) 0%, rgba(212,186,130,0.15) 100%)',
        border: '1px solid rgba(212,186,130,0.25)',
        borderRadius: '12px',
        padding: '24px 28px',
        marginBottom: '20px',
    };

    const iconBadgeStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'rgba(212,186,130,0.15)',
        fontSize: '1.2rem',
        marginBottom: '12px',
    };

    const steps = [
        { step: '01', title: 'Initiate Return', desc: 'Contact us via WhatsApp or email within 7 days of delivery with your order number.' },
        { step: '02', title: 'Share Evidence', desc: 'Send clear photos/video of the product and the reason for return.' },
        { step: '03', title: 'We Arrange Pickup', desc: 'Once approved, we arrange insured reverse pickup from your doorstep at no cost.' },
        { step: '04', title: 'Refund / Exchange', desc: 'After quality inspection, we process your refund within 5-7 business days or send a replacement.' },
    ];

    return (
        <>
            <Navbar />
            <AuthModal />
            <CartDrawer />

            {/* Hero */}
            <section style={{
                padding: '100px 0 60px',
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(253,251,247,1) 0%, rgba(212,186,130,0.15) 100%)'
            }}>
                <div className="container" style={{ maxWidth: '700px' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '20px' }}>
                        Our Promise
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 300, lineHeight: 1.2, marginBottom: '24px', letterSpacing: '0.04em' }}>
                        Returns, Warranty &amp; <em style={{ color: 'var(--color-gold)' }}>Shipping Policy</em>
                    </h1>
                    <p style={{ fontSize: '0.9rem', fontWeight: 300, color: 'var(--color-text-light)', lineHeight: 1.9, maxWidth: '550px', margin: '0 auto' }}>
                        We stand behind every piece we create. Your satisfaction is our top priority — backed by a 7-day return policy, lifetime warranty, and fully insured shipping.
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '16px' }}>
                        Last updated: April 3, 2026
                    </p>
                </div>
            </section>

            {/* Policy Content */}
            <section style={{ padding: '80px 0' }}>
                <div className="container" style={{ maxWidth: '780px' }}>

                    {/* 7-Day Return Policy */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>🔄</div>
                        <h2 style={headingStyle}>7-Day Return Policy</h2>
                        <div style={highlightBoxStyle}>
                            <p style={{ ...textStyle, marginBottom: 0, fontWeight: 400, color: 'var(--color-text)' }}>
                                We offer a <strong>7-day return window</strong> from the date of delivery. If you&apos;re not completely satisfied with your purchase, you may return it for a full refund or exchange — no questions asked.
                            </p>
                        </div>
                        <p style={textStyle}>
                            To be eligible for a return, the item must be in its original, unworn condition with all tags, packaging, and certification intact. Simply reach out to us within 7 days of receiving your order.
                        </p>
                        <p style={textStyle}>
                            <strong>Eligible for return:</strong>
                        </p>
                        <ul style={listStyle}>
                            <li>All standard jewellery pieces (rings, pendants, earrings, bracelets)</li>
                            <li>Items that don&apos;t match the product description or images</li>
                            <li>Defective or damaged items received</li>
                            <li>Wrong product or size delivered</li>
                        </ul>
                    </div>

                    {/* Non-Returnable Items */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>🚫</div>
                        <h2 style={headingStyle}>Non-Returnable Items</h2>
                        <p style={textStyle}>
                            The following items are <strong>not eligible</strong> for return:
                        </p>
                        <ul style={listStyle}>
                            <li><strong>Custom / Bespoke Jewellery:</strong> Any piece made to your specific customization (ring size, diamond shape, engraving, etc.)</li>
                            <li><strong>Loose / Polished Diamonds:</strong> Due to the nature of loose stones, they cannot be returned once delivered</li>
                            <li><strong>Items showing signs of wear, alteration, or damage by the customer</strong></li>
                            <li><strong>Items returned after 7 days</strong> from the date of delivery</li>
                            <li><strong>Items without original packaging</strong> and IGI certification</li>
                        </ul>
                    </div>

                    {/* How to Return */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>📦</div>
                        <h2 style={headingStyle}>How to Initiate a Return</h2>
                        <p style={textStyle}>
                            Returning a product is simple and hassle-free. Follow these steps:
                        </p>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '20px',
                            margin: '24px 0',
                        }}>
                            {steps.map((item, i) => (
                                <div key={i} style={{
                                    padding: '24px 20px',
                                    border: '1px solid rgba(0,0,0,0.06)',
                                    borderRadius: '12px',
                                    textAlign: 'center',
                                    transition: 'all 0.3s ease',
                                }}>
                                    <div style={{
                                        fontSize: '1.6rem',
                                        fontWeight: 200,
                                        color: 'var(--color-gold)',
                                        fontFamily: 'var(--font-heading)',
                                        marginBottom: '8px',
                                    }}>{item.step}</div>
                                    <h4 style={{
                                        fontSize: '0.85rem',
                                        fontWeight: 500,
                                        marginBottom: '8px',
                                        letterSpacing: '0.02em',
                                    }}>{item.title}</h4>
                                    <p style={{
                                        fontSize: '0.78rem',
                                        fontWeight: 300,
                                        color: 'var(--color-text-light)',
                                        lineHeight: 1.7,
                                    }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Refund Information */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>💳</div>
                        <h2 style={headingStyle}>Refund Process</h2>
                        <p style={textStyle}>
                            Once we receive and inspect your return, we will process your refund within <strong>5-7 business days</strong>. Refunds are credited to the original payment method used during checkout.
                        </p>
                        <ul style={listStyle}>
                            <li>UPI / Wallet refunds: 1-3 business days</li>
                            <li>Credit / Debit card refunds: 5-7 business days</li>
                            <li>Net banking refunds: 5-10 business days</li>
                        </ul>
                        <p style={textStyle}>
                            You may also opt for a store credit (valid for 12 months) or an exchange for another product of equal or higher value.
                        </p>
                    </div>

                    {/* Lifetime Warranty */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>🛡️</div>
                        <h2 style={headingStyle}>Lifetime Warranty</h2>
                        <div style={highlightBoxStyle}>
                            <p style={{ ...textStyle, marginBottom: 0, fontWeight: 400, color: 'var(--color-text)' }}>
                                Every Noore Jewels piece comes with a <strong>lifetime warranty</strong> that covers manufacturing defects, prong repair, rhodium re-plating, and complimentary resizing.
                            </p>
                        </div>
                        <p style={textStyle}>
                            <strong>What&apos;s covered:</strong>
                        </p>
                        <ul style={listStyle}>
                            <li>Manufacturing defects (stone fall-out due to faulty prongs, clasp failure, etc.)</li>
                            <li>Free ring resizing (up to 2 sizes, once per year)</li>
                            <li>Rhodium re-plating for white gold pieces</li>
                            <li>Professional cleaning and polishing</li>
                            <li>Prong tightening and maintenance</li>
                        </ul>
                        <p style={textStyle}>
                            <strong>What&apos;s not covered:</strong>
                        </p>
                        <ul style={listStyle}>
                            <li>Damage caused by misuse, accidents, or rough handling</li>
                            <li>Normal wear and tear over extended periods</li>
                            <li>Loss or theft of the jewellery</li>
                            <li>Damage caused by exposure to chemicals, perfume, or saltwater</li>
                            <li>Third-party repairs or modifications</li>
                        </ul>
                    </div>

                    {/* Insured Shipping */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>📦</div>
                        <h2 style={headingStyle}>Insured Shipping</h2>
                        <div style={highlightBoxStyle}>
                            <p style={{ ...textStyle, marginBottom: 0, fontWeight: 400, color: 'var(--color-text)' }}>
                                All orders are shipped with <strong>full insurance coverage</strong>. Your jewellery is protected from the moment it leaves our workshop until it reaches your doorstep.
                            </p>
                        </div>
                        <ul style={listStyle}>
                            <li><strong>Free insured shipping</strong> on all orders — pan India</li>
                            <li>Orders are dispatched within <strong>1-3 business days</strong> (custom orders: 7-10 days)</li>
                            <li>Delivery takes approximately <strong>5-7 business days</strong> depending on location</li>
                            <li>Every package is tamper-proof with security seal</li>
                            <li>Real-time tracking provided via email and WhatsApp</li>
                            <li>In case of transit damage, we provide a <strong>full replacement at no cost</strong></li>
                        </ul>
                        <p style={textStyle}>
                            We ship via trusted insured courier partners. Every shipment is fully covered against loss, theft, and damage during transit.
                        </p>
                    </div>

                    {/* Contact */}
                    <div style={{
                        background: 'var(--color-bg-dark)',
                        color: 'var(--color-text-on-dark)',
                        borderRadius: '16px',
                        padding: '40px',
                        textAlign: 'center',
                    }}>
                        <h2 style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '1.4rem',
                            fontWeight: 300,
                            marginBottom: '16px',
                            letterSpacing: '0.04em',
                        }}>
                            Need Help? <em style={{ color: 'var(--color-gold-light)' }}>We&apos;re Here for You</em>
                        </h2>
                        <p style={{
                            fontSize: '0.85rem',
                            fontWeight: 300,
                            color: 'rgba(255,255,255,0.6)',
                            lineHeight: 1.8,
                            marginBottom: '24px',
                            maxWidth: '480px',
                            margin: '0 auto 24px',
                        }}>
                            For any return, warranty, or shipping queries — we&apos;re just a message away. Reach out anytime and we&apos;ll take care of you.
                        </p>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <a
                                href="https://wa.me/919217945235?text=Hi! I have a query about returns/warranty"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-gold"
                                style={{ fontSize: '0.8rem' }}
                            >
                                WhatsApp Us
                            </a>
                            <a
                                href="mailto:noore.jewels55@gmail.com?subject=Return/Warranty Query"
                                className="btn btn-outline"
                                style={{ fontSize: '0.8rem', borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
                            >
                                Email Us
                            </a>
                        </div>
                    </div>

                </div>
            </section>

            <Footer />
        </>
    );
}

export default function ReturnPolicyPage() {
    return (
        <AuthProvider>
            <CartProvider>
                <ReturnPolicyContent />
            </CartProvider>
        </AuthProvider>
    );
}
