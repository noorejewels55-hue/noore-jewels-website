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
                        Return &amp; <em style={{ color: 'var(--color-gold)' }}>Refund Policy</em>
                    </h1>
                    <p style={{ fontSize: '0.9rem', fontWeight: 300, color: 'var(--color-text-light)', lineHeight: 1.9, maxWidth: '550px', margin: '0 auto' }}>
                        We want every Noore Jewels customer to have a delightful experience. Please read our return
                        and refund policy carefully before placing your order.
                    </p>
                </div>
            </section>

            {/* Policy Content */}
            <section style={{ padding: '80px 0' }}>
                <div className="container" style={{ maxWidth: '780px' }}>

                    {/* General Policy */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>📋</div>
                        <h2 style={headingStyle}>General Policy</h2>
                        <div style={highlightBoxStyle}>
                            <p style={{ ...textStyle, marginBottom: 0, fontWeight: 400, color: 'var(--color-text)' }}>
                                At Noore Jewels, all sales are considered <strong>final</strong>. We generally <strong>do not
                                    accept returns or offer refunds</strong> once an order has been delivered. We encourage you
                                to review product details, images, and descriptions carefully before making a purchase.
                            </p>
                        </div>
                        <p style={textStyle}>
                            Since our jewellery is imitation / fashion jewellery at affordable prices, we maintain a
                            strict no-return policy to keep our costs low and prices fair for all customers.
                        </p>
                    </div>

                    {/* Exceptions */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>🔄</div>
                        <h2 style={headingStyle}>Exceptions — When We May Accept Returns</h2>
                        <p style={textStyle}>
                            While we generally do not process returns, we understand that certain situations are beyond
                            your control. Returns or replacements may be considered <strong>on a case-by-case basis</strong> under
                            the following circumstances:
                        </p>
                        <ul style={listStyle}>
                            <li><strong>Defective Product:</strong> If the item you received is broken, damaged, or defective upon arrival.</li>
                            <li><strong>Missing Items:</strong> If any item from your order is missing from the delivered package.</li>
                            <li><strong>Wrong Product:</strong> If you received a completely different product than what you ordered.</li>
                            <li><strong>Courier Mishandling:</strong> If the product was visibly damaged due to rough handling during shipping.</li>
                        </ul>
                        <p style={textStyle}>
                            In all such cases, the decision to approve a return or replacement is at the <strong>sole
                                discretion of Noore Jewels</strong> and will be evaluated individually.
                        </p>
                    </div>

                    {/* Mandatory Evidence */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>🎥</div>
                        <h2 style={headingStyle}>Mandatory: Unboxing Video Required</h2>
                        <div style={highlightBoxStyle}>
                            <p style={{ ...textStyle, marginBottom: 0, fontWeight: 400, color: 'var(--color-text)' }}>
                                <strong>Important:</strong> To process any return or replacement request, you <strong>must</strong> provide
                                a clear, unedited <strong>unboxing video</strong> of the package as proof. The video must show
                                the sealed package being opened for the first time and clearly display the issue.
                            </p>
                        </div>
                        <p style={textStyle}>
                            Without a proper unboxing video, we will not be able to verify or process your claim.
                            This policy protects both you and us from any disputes. We highly recommend that you
                            <strong> always record a video while opening your package</strong>.
                        </p>
                        <p style={textStyle}>
                            The unboxing video must include:
                        </p>
                        <ul style={listStyle}>
                            <li>The sealed, unopened package with the shipping label visible</li>
                            <li>The full unboxing process without any cuts or edits</li>
                            <li>A clear view of the defect, damage, or wrong/missing item</li>
                            <li>The invoice slip (if included in the package)</li>
                        </ul>
                    </div>

                    {/* How to Request */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>📞</div>
                        <h2 style={headingStyle}>How to Request a Return</h2>
                        <p style={textStyle}>
                            If you believe your order qualifies for a return or replacement, please follow these steps:
                        </p>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '20px',
                            margin: '24px 0',
                        }}>
                            {[
                                { step: '01', title: 'Contact Us', desc: 'Reach out via WhatsApp or email within 48 hours of delivery.' },
                                { step: '02', title: 'Share Evidence', desc: 'Send the unboxing video and photos of the issue.' },
                                { step: '03', title: 'We Review', desc: 'Our team will review your case and respond within 2-3 business days.' },
                                { step: '04', title: 'Resolution', desc: 'If approved, we'll arrange a replacement or provide store credit.' },
                            ].map((item, i) => (
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

                    {/* Refund */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>💰</div>
                        <h2 style={headingStyle}>Refund Information</h2>
                        <p style={textStyle}>
                            If a return is approved, we primarily offer <strong>replacement of the product</strong> or
                            <strong> store credit</strong> for future purchases. Monetary refunds are only considered in
                            exceptional cases and are processed to the original payment method within 7-10 business days.
                        </p>
                        <p style={textStyle}>
                            Shipping charges (if any) are non-refundable. In the case of a replacement, we will bear
                            the shipping cost for sending the new product.
                        </p>
                    </div>

                    {/* Non-Returnable */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>🚫</div>
                        <h2 style={headingStyle}>Non-Returnable Cases</h2>
                        <p style={textStyle}>
                            Returns will <strong>not</strong> be accepted in the following situations:
                        </p>
                        <ul style={listStyle}>
                            <li>Change of mind after delivery</li>
                            <li>Slight colour variations due to screen settings (this is normal for all online products)</li>
                            <li>Normal wear and tear or tarnishing over time</li>
                            <li>Products without a valid unboxing video</li>
                            <li>Claims raised after 48 hours of delivery</li>
                            <li>Products that have been used, altered, or damaged by the customer</li>
                        </ul>
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
                            Need Help? <em style={{ color: 'var(--color-gold-light)' }}>We're Here for You</em>
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
                            For any queries or concerns about your order, feel free to reach out. We're always happy to help!
                        </p>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <a
                                href="https://wa.me/919217945235?text=Hi! I have a query about my order"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-gold"
                                style={{ fontSize: '0.8rem' }}
                            >
                                WhatsApp Us
                            </a>
                            <a
                                href="mailto:noore.jewels55@gmail.com?subject=Return/Refund Query"
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
