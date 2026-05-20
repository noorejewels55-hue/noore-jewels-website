'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import CartDrawer from '@/components/CartDrawer';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';

function TermsContent() {
    const sectionStyle = { marginBottom: '48px' };

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

    const highlightBoxStyle = {
        background: 'linear-gradient(135deg, rgba(212,186,130,0.08) 0%, rgba(212,186,130,0.15) 100%)',
        border: '1px solid rgba(212,186,130,0.25)',
        borderRadius: '12px',
        padding: '24px 28px',
        marginBottom: '20px',
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
                        Legal
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 300, lineHeight: 1.2, marginBottom: '24px', letterSpacing: '0.04em' }}>
                        Terms &amp; <em style={{ color: 'var(--color-gold)' }}>Conditions</em>
                    </h1>
                    <p style={{ fontSize: '0.9rem', fontWeight: 300, color: 'var(--color-text-light)', lineHeight: 1.9, maxWidth: '550px', margin: '0 auto' }}>
                        Please read these terms and conditions carefully before using the Noore Jewels website
                        or making a purchase.
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '16px' }}>
                        Last updated: April 3, 2026
                    </p>
                </div>
            </section>

            {/* Content */}
            <section style={{ padding: '80px 0' }}>
                <div className="container" style={{ maxWidth: '780px' }}>

                    {/* Acceptance */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>📜</div>
                        <h2 style={headingStyle}>Acceptance of Terms</h2>
                        <div style={highlightBoxStyle}>
                            <p style={{ ...textStyle, marginBottom: 0, fontWeight: 400, color: 'var(--color-text)' }}>
                                By accessing or using the Noore Jewels website (<strong>noorejewels.in</strong>),
                                you agree to be bound by these Terms &amp; Conditions. If you do not agree
                                with any part of these terms, please do not use our website.
                            </p>
                        </div>
                        <p style={textStyle}>
                            These terms apply to all visitors, users, and customers of the website.
                            We reserve the right to update or modify these terms at any time without prior notice.
                        </p>
                    </div>

                    {/* About Us */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>💎</div>
                        <h2 style={headingStyle}>About Noore Jewels</h2>
                        <p style={textStyle}>
                            Noore Jewels is an online fine jewellery brand specialising in IGI certified Lab 
                            Grown Diamond engagement rings, solitaire rings, and fine jewellery. Our products feature <strong>authentic IGI certified Lab Grown
                            Diamonds</strong> set in 9kt, 14kt, 18kt gold and 925 silver. We also sell polished loose Lab Grown Diamonds.
                        </p>
                        <p style={textStyle}>
                            All product descriptions, images, and materials mentioned on the website represent
                            our Lab Grown Diamond fine jewellery. By purchasing from us, you acknowledge that you are
                            buying ethically created Lab Grown Diamond jewellery with IGI certification.
                        </p>
                    </div>

                    {/* Products */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>🛍️</div>
                        <h2 style={headingStyle}>Products &amp; Pricing</h2>
                        <ul style={listStyle}>
                            <li>All prices are listed in <strong>Indian Rupees (INR)</strong> and are inclusive of applicable taxes</li>
                            <li>Product colours may vary slightly from images due to screen display settings — this is common for all online purchases</li>
                            <li>We reserve the right to change product prices at any time without prior notice</li>
                            <li>Product availability is subject to stock. If a product is sold out, it will be marked accordingly on the website</li>
                            <li>We take every effort to ensure product descriptions are accurate, but minor variations may occur as our products are handcrafted</li>
                        </ul>
                    </div>

                    {/* Orders */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>📦</div>
                        <h2 style={headingStyle}>Orders &amp; Payments</h2>
                        <p style={textStyle}>
                            When you place an order on our website:
                        </p>
                        <ul style={listStyle}>
                            <li>All payments are processed securely through <strong>Razorpay</strong>, a RBI-authorised payment gateway</li>
                            <li>We accept UPI, credit cards, debit cards, net banking, and digital wallets</li>
                            <li>An order is confirmed only after successful payment verification</li>
                            <li>You will receive an order confirmation via email after successful payment</li>
                            <li>We reserve the right to cancel any order due to stock unavailability, pricing errors, or suspected fraudulent activity</li>
                        </ul>
                        <div style={highlightBoxStyle}>
                            <p style={{ ...textStyle, marginBottom: 0, fontWeight: 400, color: 'var(--color-text)' }}>
                                <strong>Important:</strong> We do not store your card or bank details. All payment
                                data is handled directly by Razorpay in a PCI-DSS compliant environment.
                            </p>
                        </div>
                    </div>

                    {/* Shipping */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>🚚</div>
                        <h2 style={headingStyle}>Shipping &amp; Delivery</h2>
                        <ul style={listStyle}>
                            <li><strong>Free insured shipping</strong> on all orders — pan India</li>
                            <li>All shipments are <strong>fully insured</strong> against loss, theft, and transit damage</li>
                            <li>Orders are typically dispatched within <strong>3-5 business days</strong> (custom orders: 10-15 days)</li>
                            <li>Delivery takes approximately <strong>3 weeks (15–21 business days)</strong> depending on your location</li>
                            <li>We ship across India through trusted insured courier partners</li>
                            <li>You will receive a tracking ID via email and WhatsApp once your order is shipped</li>
                            <li>Every package includes tamper-proof security seal</li>
                            <li>In case of transit damage, we provide a full replacement at no cost</li>
                            <li>Delivery timelines may vary during festivals or unforeseen circumstances</li>
                        </ul>
                    </div>

                    {/* Returns */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>🔄</div>
                        <h2 style={headingStyle}>Returns &amp; Exchanges</h2>
                        <p style={textStyle}>
                            Our detailed return and exchange policy can be found on the{' '}
                            <Link href="/return-policy" style={{ color: 'var(--color-gold)', textDecoration: 'underline' }}>
                                Return Policy
                            </Link>{' '}
                            page. Key points:
                        </p>
                        <ul style={listStyle}>
                            <li>We offer a <strong>7-day return policy</strong> from the date of delivery. A <strong>15% quality & handling deduction</strong> applies on standard returns</li>
                            <li>Items must be in original, unworn condition with all packaging and certification</li>
                            <li>Custom / bespoke jewellery and loose diamonds are <strong>non-returnable</strong></li>
                            <li>Refunds are processed within <strong>5-7 business days</strong> to the original payment method</li>
                            <li>All jewellery comes with a <strong>lifetime warranty</strong> covering manufacturing defects, resizing, and maintenance</li>
                            <li>Full details available on our{' '}
                                <Link href="/return-policy" style={{ color: 'var(--color-gold)', textDecoration: 'underline' }}>Returns, Warranty & Shipping Policy</Link>{' '}page</li>
                        </ul>
                    </div>

                    {/* User Account */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>👤</div>
                        <h2 style={headingStyle}>User Accounts</h2>
                        <p style={textStyle}>
                            To place an order, you need to verify your phone number via OTP (One-Time Password).
                            By creating an account:
                        </p>
                        <ul style={listStyle}>
                            <li>You are responsible for maintaining the confidentiality of your account</li>
                            <li>You agree to provide accurate and complete information</li>
                            <li>You are responsible for all activities that occur under your account</li>
                            <li>You must notify us immediately of any unauthorised use of your account</li>
                        </ul>
                    </div>

                    {/* Intellectual Property */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>©️</div>
                        <h2 style={headingStyle}>Intellectual Property</h2>
                        <p style={textStyle}>
                            All content on the Noore Jewels website — including but not limited to text, images,
                            logos, product photos, graphics, and design — is the property of Noore Jewels or
                            its content creators and is protected by copyright laws.
                        </p>
                        <ul style={listStyle}>
                            <li>You may not copy, reproduce, distribute, or use any content from our website without written permission</li>
                            <li>Our brand name &quot;Noore Jewels&quot; and logo are our intellectual property</li>
                            <li>Product images are original and may not be used for commercial purposes</li>
                        </ul>
                    </div>

                    {/* Limitation of Liability */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>⚖️</div>
                        <h2 style={headingStyle}>Limitation of Liability</h2>
                        <p style={textStyle}>
                            Noore Jewels shall not be liable for any indirect, incidental, or consequential
                            damages arising from:
                        </p>
                        <ul style={listStyle}>
                            <li>Use or inability to use our website</li>
                            <li>Any errors or inaccuracies in product descriptions</li>
                            <li>Delivery delays caused by shipping partners</li>
                            <li>Allergic reactions to jewellery materials (please check product descriptions for material details)</li>
                            <li>Loss of data or unauthorised access due to factors beyond our control</li>
                        </ul>
                        <p style={textStyle}>
                            Our total liability for any claim shall not exceed the amount you paid for the product in question.
                        </p>
                    </div>

                    {/* Prohibited */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>🚫</div>
                        <h2 style={headingStyle}>Prohibited Activities</h2>
                        <p style={textStyle}>You agree not to:</p>
                        <ul style={listStyle}>
                            <li>Use the website for any unlawful purpose</li>
                            <li>Attempt to hack, disrupt, or damage the website</li>
                            <li>Place fraudulent orders or use stolen payment methods</li>
                            <li>Resell our products commercially without written consent</li>
                            <li>Use automated bots or scrapers on the website</li>
                            <li>Harass, abuse, or threaten our staff or other customers</li>
                        </ul>
                    </div>

                    {/* Governing Law */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>🏛️</div>
                        <h2 style={headingStyle}>Governing Law &amp; Jurisdiction</h2>
                        <p style={textStyle}>
                            These Terms &amp; Conditions are governed by the laws of <strong>India</strong>.
                            Any disputes arising from these terms or your use of the website shall be subject
                            to the exclusive jurisdiction of the courts in <strong>India</strong>.
                        </p>
                    </div>

                    {/* Coupons */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>🏷️</div>
                        <h2 style={headingStyle}>Coupons &amp; Discounts</h2>
                        <ul style={listStyle}>
                            <li>Coupon codes are subject to specific terms and validity periods</li>
                            <li>Only one coupon code can be used per order</li>
                            <li>Coupons cannot be combined with other offers unless explicitly stated</li>
                            <li>We reserve the right to cancel or modify coupon codes at any time</li>
                            <li>Coupon codes are non-transferable and cannot be exchanged for cash</li>
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
                            Have <em style={{ color: 'var(--color-gold-light)' }}>Questions?</em>
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
                            If you have any questions about these Terms &amp; Conditions, please contact us.
                        </p>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <a
                                href="mailto:noore.jewels55@gmail.com?subject=Terms & Conditions Query"
                                className="btn btn-gold"
                                style={{ fontSize: '0.8rem' }}
                            >
                                Email Us
                            </a>
                            <a
                                href="https://wa.me/918076735450?text=Hi! I have a question about your terms"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline"
                                style={{ fontSize: '0.8rem', borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
                            >
                                WhatsApp Us
                            </a>
                        </div>
                    </div>

                </div>
            </section>

            <Footer />
        </>
    );
}

export default function TermsPage() {
    return (
        <AuthProvider>
            <CartProvider>
                <TermsContent />
            </CartProvider>
        </AuthProvider>
    );
}
