'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import CartDrawer from '@/components/CartDrawer';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';

function PrivacyPolicyContent() {
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
                        Privacy <em style={{ color: 'var(--color-gold)' }}>Policy</em>
                    </h1>
                    <p style={{ fontSize: '0.9rem', fontWeight: 300, color: 'var(--color-text-light)', lineHeight: 1.9, maxWidth: '550px', margin: '0 auto' }}>
                        Your privacy is important to us. This policy explains how Noore Jewels collects,
                        uses, and protects your personal information.
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '16px' }}>
                        Last updated: March 24, 2026
                    </p>
                </div>
            </section>

            {/* Content */}
            <section style={{ padding: '80px 0' }}>
                <div className="container" style={{ maxWidth: '780px' }}>

                    {/* Information We Collect */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>📋</div>
                        <h2 style={headingStyle}>Information We Collect</h2>
                        <p style={textStyle}>
                            When you visit our website or place an order, we may collect the following personal information:
                        </p>
                        <ul style={listStyle}>
                            <li><strong>Contact Information:</strong> Name, email address, phone number</li>
                            <li><strong>Shipping Address:</strong> Street address, city, state, pincode</li>
                            <li><strong>Order Details:</strong> Products purchased, order history, payment status</li>
                            <li><strong>Device Information:</strong> Browser type, IP address (collected automatically for security)</li>
                            <li><strong>Communication Data:</strong> Messages sent via contact form or WhatsApp</li>
                        </ul>
                        <div style={highlightBoxStyle}>
                            <p style={{ ...textStyle, marginBottom: 0, fontWeight: 400, color: 'var(--color-text)' }}>
                                We do <strong>NOT</strong> collect or store your payment card details. All payments are processed
                                securely through <strong>Razorpay</strong>, a PCI-DSS compliant payment gateway.
                            </p>
                        </div>
                    </div>

                    {/* How We Use */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>⚙️</div>
                        <h2 style={headingStyle}>How We Use Your Information</h2>
                        <p style={textStyle}>We use your personal information for the following purposes:</p>
                        <ul style={listStyle}>
                            <li><strong>Order Processing:</strong> To fulfill and deliver your orders</li>
                            <li><strong>Communication:</strong> To send order confirmations, shipping updates, and respond to your queries</li>
                            <li><strong>Customer Support:</strong> To assist you with any issues or concerns</li>
                            <li><strong>Account Management:</strong> To verify your identity via OTP during sign-in</li>
                            <li><strong>Website Improvement:</strong> To understand how customers use our website and improve our services</li>
                            <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations in India</li>
                        </ul>
                        <p style={textStyle}>
                            We will <strong>never</strong> sell, rent, or share your personal information with third parties
                            for marketing purposes.
                        </p>
                    </div>

                    {/* Data Sharing */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>🤝</div>
                        <h2 style={headingStyle}>Information Sharing</h2>
                        <p style={textStyle}>
                            We may share your information only with the following trusted service providers who
                            assist us in operating our business:
                        </p>
                        <ul style={listStyle}>
                            <li><strong>Razorpay:</strong> For secure payment processing</li>
                            <li><strong>NimbusPost:</strong> For shipping and delivery of your orders</li>
                            <li><strong>Google:</strong> For data storage (Google Sheets) and email services</li>
                            <li><strong>Vercel:</strong> For website hosting</li>
                        </ul>
                        <p style={textStyle}>
                            These providers are required to protect your data and use it only for the purposes
                            we specify. We do not share your data with any other third party.
                        </p>
                    </div>

                    {/* Data Security */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>🔒</div>
                        <h2 style={headingStyle}>Data Security</h2>
                        <p style={textStyle}>
                            We take the security of your personal information seriously. We implement appropriate
                            technical and organisational measures to protect your data, including:
                        </p>
                        <ul style={listStyle}>
                            <li><strong>HTTPS Encryption:</strong> All data transmitted between your browser and our servers is encrypted</li>
                            <li><strong>Secure Payments:</strong> Payment information is handled entirely by Razorpay (PCI-DSS Level 1 compliant)</li>
                            <li><strong>OTP Verification:</strong> Phone number verification to prevent unauthorised access</li>
                            <li><strong>Input Sanitisation:</strong> All user inputs are sanitised to prevent injection attacks</li>
                            <li><strong>Security Headers:</strong> Industry-standard HTTP security headers are implemented</li>
                        </ul>
                    </div>

                    {/* Cookies */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>🍪</div>
                        <h2 style={headingStyle}>Cookies</h2>
                        <p style={textStyle}>
                            Our website uses minimal cookies and local storage to enhance your browsing experience:
                        </p>
                        <ul style={listStyle}>
                            <li><strong>Session Data:</strong> To keep you logged in during your visit</li>
                            <li><strong>Cart Data:</strong> To remember items in your shopping bag</li>
                        </ul>
                        <p style={textStyle}>
                            We do not use tracking cookies or share cookie data with third parties. You can clear
                            your cookies at any time through your browser settings.
                        </p>
                    </div>

                    {/* Your Rights */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>✅</div>
                        <h2 style={headingStyle}>Your Rights</h2>
                        <p style={textStyle}>
                            Under Indian data protection laws, you have the following rights regarding your personal data:
                        </p>
                        <ul style={listStyle}>
                            <li><strong>Right to Access:</strong> You can request a copy of your personal data we hold</li>
                            <li><strong>Right to Correction:</strong> You can ask us to correct any inaccurate information</li>
                            <li><strong>Right to Deletion:</strong> You can request us to delete your personal data</li>
                            <li><strong>Right to Withdraw Consent:</strong> You can withdraw your consent for data processing at any time</li>
                        </ul>
                        <p style={textStyle}>
                            To exercise any of these rights, please contact us at{' '}
                            <a href="mailto:noore.jewels55@gmail.com" style={{ color: 'var(--color-gold)' }}>
                                noore.jewels55@gmail.com
                            </a>
                        </p>
                    </div>

                    {/* Children */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>👶</div>
                        <h2 style={headingStyle}>Children&apos;s Privacy</h2>
                        <p style={textStyle}>
                            Our website and services are not intended for children under the age of 18.
                            We do not knowingly collect personal information from children. If you are a parent
                            or guardian and believe your child has provided us with personal information,
                            please contact us so we can take appropriate action.
                        </p>
                    </div>

                    {/* Changes */}
                    <div style={sectionStyle}>
                        <div style={iconBadgeStyle}>📝</div>
                        <h2 style={headingStyle}>Changes to This Policy</h2>
                        <p style={textStyle}>
                            We may update this Privacy Policy from time to time. Any changes will be posted on this
                            page with an updated &quot;Last Updated&quot; date. We encourage you to review this policy
                            periodically to stay informed about how we protect your information.
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
                            Questions About Your <em style={{ color: 'var(--color-gold-light)' }}>Privacy?</em>
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
                            If you have any questions or concerns about this Privacy Policy, please don&apos;t hesitate to reach out.
                        </p>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <a
                                href="mailto:noore.jewels55@gmail.com?subject=Privacy Policy Query"
                                className="btn btn-gold"
                                style={{ fontSize: '0.8rem' }}
                            >
                                Email Us
                            </a>
                            <a
                                href="https://wa.me/919217945235?text=Hi! I have a question about my data privacy"
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

export default function PrivacyPolicyPage() {
    return (
        <AuthProvider>
            <CartProvider>
                <PrivacyPolicyContent />
            </CartProvider>
        </AuthProvider>
    );
}
