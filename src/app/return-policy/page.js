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
        { step: '01', title: 'Contact Us', desc: 'Reach out via WhatsApp or email within 15 days of delivery to initiate your return.' },
        { step: '02', title: 'Return Approved', desc: 'Our team will review your request and send a return shipping label within 24 hours.' },
        { step: '03', title: 'Ship It Back', desc: 'Pack the item securely in its original packaging and ship it using our prepaid label.' },
        { step: '04', title: 'Refund Processed', desc: 'Once we receive and inspect the item, your refund is processed within 5-7 business days.' },
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
                        Policy
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 300, lineHeight: 1.2, marginBottom: '24px', letterSpacing: '0.04em' }}>
                        Return, Exchange &amp; <em style={{ color: 'var(--color-gold)' }}>Refund Policy</em>
                    </h1>
                    <p style={{ fontSize: '0.9rem', fontWeight: 300, color: 'var(--color-text-light)', lineHeight: 1.9, maxWidth: '550px', margin: '0 auto' }}>
                        At Noore Jewels, your satisfaction is our top priority. We offer a hassle-free
                        return and exchange policy on all our lab grown diamond jewellery.
                    </p>
                </div>
            </section>

            {/* Policy Content */}
            <section style={{ padding: '80px 0' }}>
                <div className="container" style={{ maxWidth: '780px' }}>

                    {/* 15-Day Return Policy */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>&#128203;</div>
                        <h2 style={headingStyle}>15-Day Easy Return Policy</h2>
                        <div style={highlightBoxStyle}>
                            <p style={{ ...textStyle, marginBottom: 0, fontWeight: 400, color: 'var(--color-text)' }}>
                                We offer a <strong>15-day return window</strong> from the date of delivery on all
                                our lab grown diamond jewellery. If you&apos;re not completely satisfied with your
                                purchase, you can return it for a <strong>full refund</strong> or <strong>exchange</strong> — no questions asked.
                            </p>
                        </div>
                        <p style={textStyle}>
                            We want you to love every piece you buy from Noore Jewels. If for any reason
                            you&apos;re not happy — whether it doesn&apos;t match your expectations, doesn&apos;t suit your
                            style, or simply isn&apos;t what you imagined — we&apos;ll gladly accept the return.
                        </p>
                    </div>

                    {/* What You Can Return */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>✅</div>
                        <h2 style={headingStyle}>What You Can Return</h2>
                        <ul style={listStyle}>
                            <li><strong>Any product</strong> within 15 days of delivery</li>
                            <li><strong>Change of mind</strong> — we understand; it happens!</li>
                            <li><strong>Defective or damaged</strong> items — we&apos;ll replace or refund immediately</li>
                            <li><strong>Wrong product</strong> received — we&apos;ll ship the correct one right away</li>
                            <li><strong>Size doesn&apos;t fit</strong> — exchange for a different size, free of charge</li>
                        </ul>
                    </div>

                    {/* Return Conditions */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>📋</div>
                        <h2 style={headingStyle}>Return Conditions</h2>
                        <p style={textStyle}>
                            To ensure a smooth return process, please make sure:
                        </p>
                        <ul style={listStyle}>
                            <li>The item is in its <strong>original, unworn condition</strong></li>
                            <li>All original tags, certificates (IGI), and packaging are intact</li>
                            <li>The return is initiated within <strong>15 days</strong> of delivery</li>
                            <li>The item has not been resized, altered, or engraved after delivery</li>
                        </ul>
                        <div style={highlightBoxStyle}>
                            <p style={{ ...textStyle, marginBottom: 0, fontWeight: 400, color: 'var(--color-text)' }}>
                                💡 <strong>Pro Tip:</strong> We recommend recording an unboxing video for every order.
                                This helps speed up the return/exchange process, especially for damage claims.
                            </p>
                        </div>
                    </div>

                    {/* How to Return */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>&#128222;</div>
                        <h2 style={headingStyle}>How to Return — 4 Simple Steps</h2>
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

                    {/* Exchange */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>🔄</div>
                        <h2 style={headingStyle}>Exchange Policy</h2>
                        <p style={textStyle}>
                            Don&apos;t want a refund? No problem! You can <strong>exchange</strong> your piece for:
                        </p>
                        <ul style={listStyle}>
                            <li>A <strong>different size</strong> of the same product</li>
                            <li>A <strong>different design</strong> of equal or higher value</li>
                            <li>A <strong>different metal</strong> (e.g., swap 9kt gold for 14kt gold — pay the difference)</li>
                        </ul>
                        <p style={textStyle}>
                            Exchange shipping is <strong>completely free</strong>. We&apos;ll arrange pickup of the original
                            item and send the new one at no extra cost.
                        </p>
                    </div>

                    {/* Refund */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>&#128176;</div>
                        <h2 style={headingStyle}>Refund Information</h2>
                        <div style={highlightBoxStyle}>
                            <p style={{ ...textStyle, marginBottom: 0, fontWeight: 400, color: 'var(--color-text)' }}>
                                <strong>Full refund</strong> to your original payment method within <strong>5-7 business
                                days</strong> after we receive and inspect the returned item.
                            </p>
                        </div>
                        <ul style={listStyle}>
                            <li>Refunds are processed to the <strong>original payment method</strong> (UPI, card, bank account)</li>
                            <li>Return shipping is <strong>free</strong> — we provide a prepaid shipping label</li>
                            <li>If you paid via credit card, the refund may take an additional 5-10 days to reflect in your statement</li>
                            <li>For exchanges, no refund is needed — we simply send the replacement</li>
                        </ul>
                    </div>

                    {/* Lifetime Warranty */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>🛡️</div>
                        <h2 style={headingStyle}>Lifetime Manufacturing Warranty</h2>
                        <p style={textStyle}>
                            All Noore Jewels lab grown diamond jewellery comes with a <strong>lifetime warranty</strong> against
                            manufacturing defects. If your piece has a structural issue (loose stone setting, clasp failure,
                            etc.) at any time after purchase, we will repair or replace it <strong>free of charge</strong>.
                        </p>
                        <p style={textStyle}>
                            This warranty does not cover normal wear and tear, accidental damage, or damage caused by
                            improper care or exposure to chemicals.
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
                            Need Help? <em style={{ color: 'var(--color-gold-light)' }}>We Are Here for You</em>
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
                            For any queries about returns, exchanges, or refunds — reach out anytime. We respond within 2 hours during business hours.
                        </p>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <a
                                href="https://wa.me/919217945235?text=Hi! I'd like to initiate a return/exchange"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-gold"
                                style={{ fontSize: '0.8rem' }}
                            >
                                WhatsApp Us
                            </a>
                            <a
                                href="mailto:noore.jewels55@gmail.com?subject=Return/Exchange Request"
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
