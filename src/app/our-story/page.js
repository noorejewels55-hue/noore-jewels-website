'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import CartDrawer from '@/components/CartDrawer';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';

function StoryContent() {
    return (
        <>
            <Navbar />
            <AuthModal />
            <CartDrawer />

            {/* Hero */}
            <section style={{
                padding: '100px 0 80px',
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(253,251,247,1) 0%, rgba(212,186,130,0.15) 100%)'
            }}>
                <div className="container" style={{ maxWidth: '700px' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '20px' }}>
                        Our Story
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 300, lineHeight: 1.2, marginBottom: '24px', letterSpacing: '0.04em' }}>
                        One Woman, One <em style={{ color: 'var(--color-gold)' }}>Brilliant Vision</em>
                    </h1>
                    <p style={{ fontSize: '0.9rem', fontWeight: 300, color: 'var(--color-text-light)', lineHeight: 1.9, maxWidth: '550px', margin: '0 auto' }}>
                        Noore Jewels was born from the belief that every woman deserves to own
                        real diamonds — ethical, sustainable, and breathtakingly beautiful.
                    </p>
                </div>
            </section>

            {/* Meet the Founders */}
            <section style={{ padding: '80px 0' }}>
                <div className="container">
                    <div className="story-grid">
                        <div className="story-image">
                            <img
                                src="/founders.png"
                                alt="Founder of Noore Jewels — Kriti Kala"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <div className="story-content">
                            <div className="story-label">Meet the Founder</div>
                            <h2 className="story-title">The Vision Behind Noore Jewels</h2>
                            <p className="story-text">
                                Hi, I&apos;m <strong>Kriti</strong> — and my name &quot;Kala&quot; means <em>Kalakar</em> (कलाकार) — an artist.
                                That&apos;s exactly what drives me every day — the passion to bring the most
                                exquisite, real diamond jewellery to women across India, without the
                                astronomical price tags of mined diamonds.
                            </p>
                            <p className="story-text">
                                I started Noore Jewels with a revolutionary idea — that <strong>lab grown
                                diamonds</strong> are the future of luxury jewellery. They are real diamonds
                                in every sense — same chemical composition (pure carbon), same hardness
                                (10 on the Mohs scale), same breathtaking brilliance. The only difference?
                                They&apos;re grown in state-of-the-art labs instead of being mined from the earth.
                            </p>
                            <p className="story-text">
                                Every diamond at Noore Jewels is <strong>IGI certified</strong> and set in
                                hallmarked <strong>9kt, 14kt, or 18kt gold</strong> and <strong>925 sterling
                                silver</strong>. From my hands to your doorstep, every order is packed with
                                care and shipped with love and full insurance.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Lab Grown Diamonds */}
            <section style={{ padding: '80px 0', background: 'var(--color-bg-alt)' }}>
                <div className="container">
                    <h2 className="section-title">Why Lab Grown Diamonds?</h2>
                    <div className="section-divider"></div>
                    <p className="section-subtitle">The Smart, Ethical Choice</p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', marginTop: '20px' }}>
                        {[
                            {
                                icon: '💎',
                                title: '100% Real Diamonds',
                                text: 'Lab grown diamonds are chemically, physically, and optically identical to mined diamonds. They have the same hardness (10 Mohs), refractive index, and fire. Even expert gemologists need specialized equipment to tell them apart.'
                            },
                            {
                                icon: '🌿',
                                title: 'Ethical & Sustainable',
                                text: 'No mining, no habitat destruction, no conflict. Our diamonds are created using advanced CVD (Chemical Vapour Deposition) and HPHT (High Pressure High Temperature) technology in controlled laboratory environments.'
                            },
                            {
                                icon: '💰',
                                title: '40-70% More Affordable',
                                text: 'Because lab grown diamonds don\'t involve expensive mining operations, they cost significantly less than mined diamonds of equivalent quality. Get a bigger, better diamond for your budget — real luxury, accessible to all.'
                            },
                        ].map((val, i) => (
                            <div key={i} style={{ textAlign: 'center', padding: '32px 24px' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '16px' }}>{val.icon}</div>
                                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 400, marginBottom: '12px', letterSpacing: '0.04em' }}>
                                    {val.title}
                                </h3>
                                <p style={{ fontSize: '0.85rem', fontWeight: 300, color: 'var(--color-text-light)', lineHeight: 1.8 }}>
                                    {val.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Journey */}
            <section style={{ padding: '80px 0' }}>
                <div className="container">
                    <div className="story-grid" style={{ direction: 'rtl' }}>
                        <div className="story-image" style={{ direction: 'ltr' }}>
                            <img
                                src="/story-journey.png"
                                alt="Noore Jewels Collection — Lab Grown Diamond Jewellery"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <div className="story-content" style={{ direction: 'ltr' }}>
                            <div className="story-label">Our Metals</div>
                            <h2 className="story-title">Premium Settings, Hallmarked Quality</h2>
                            <p className="story-text">
                                Every Noore Jewels piece is set in the finest metals. Choose from <strong>9kt
                                gold</strong> for everyday elegance, <strong>14kt gold</strong> for the perfect
                                balance of durability and luxury, <strong>18kt gold</strong> for pure opulence,
                                or <strong>925 sterling silver</strong> for timeless sophistication.
                            </p>
                            <p className="story-text">
                                All our gold jewellery is BIS hallmarked, and every lab grown diamond comes
                                with an IGI certificate of authenticity. Kriti personally oversees every
                                design — if it doesn&apos;t take her breath away, it doesn&apos;t make it to the collection.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust & Safety Section */}
            <section style={{ padding: '80px 0', background: 'var(--color-bg-alt)' }}>
                <div className="container">
                    <h2 className="section-title">Shop with Confidence</h2>
                    <div className="section-divider"></div>
                    <p className="section-subtitle" style={{ maxWidth: '600px', margin: '0 auto 48px' }}>
                        Your trust means everything to us. Here&apos;s why you can order worry-free
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                        {/* Certified Diamonds */}
                        <div style={{
                            background: '#fff',
                            padding: '36px 28px',
                            borderRadius: '12px',
                            border: '1px solid var(--color-border-light, #E8E0D4)',
                            textAlign: 'center',
                        }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📜</div>
                            <h3 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '1.2rem',
                                fontWeight: 500,
                                marginBottom: '12px',
                                letterSpacing: '0.04em',
                            }}>IGI Certified Diamonds</h3>
                            <p style={{
                                fontSize: '0.85rem',
                                fontWeight: 300,
                                color: 'var(--color-text-light)',
                                lineHeight: 1.8,
                                marginBottom: '16px',
                            }}>
                                Every diamond comes with an <strong>IGI (International Gemological Institute)</strong> certificate
                                verifying the 4Cs — cut, clarity, colour, and carat weight. Complete
                                transparency and authenticity guaranteed.
                            </p>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 20px',
                                background: 'var(--color-bg-alt)',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                color: 'var(--color-text)',
                                letterSpacing: '0.05em',
                            }}>
                                💎 IGI Certified
                            </div>
                        </div>

                        {/* Secure Payments */}
                        <div style={{
                            background: '#fff',
                            padding: '36px 28px',
                            borderRadius: '12px',
                            border: '1px solid var(--color-border-light, #E8E0D4)',
                            textAlign: 'center',
                        }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🔒</div>
                            <h3 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '1.2rem',
                                fontWeight: 500,
                                marginBottom: '12px',
                                letterSpacing: '0.04em',
                            }}>100% Secure Payments</h3>
                            <p style={{
                                fontSize: '0.85rem',
                                fontWeight: 300,
                                color: 'var(--color-text-light)',
                                lineHeight: 1.8,
                                marginBottom: '16px',
                            }}>
                                All payments are processed through <strong>Razorpay</strong> — India&apos;s most trusted
                                payment gateway. Your card details are never stored with us. Pay via UPI,
                                Credit/Debit Cards, Net Banking, or Wallets — 100% safe and encrypted.
                            </p>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 20px',
                                background: 'var(--color-bg-alt)',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                color: 'var(--color-text)',
                                letterSpacing: '0.05em',
                            }}>
                                💳 Powered by Razorpay
                            </div>
                        </div>

                        {/* Insured Shipping */}
                        <div style={{
                            background: '#fff',
                            padding: '36px 28px',
                            borderRadius: '12px',
                            border: '1px solid var(--color-border-light, #E8E0D4)',
                            textAlign: 'center',
                        }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🚚</div>
                            <h3 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '1.2rem',
                                fontWeight: 500,
                                marginBottom: '12px',
                                letterSpacing: '0.04em',
                            }}>Free Insured Shipping</h3>
                            <p style={{
                                fontSize: '0.85rem',
                                fontWeight: 300,
                                color: 'var(--color-text-light)',
                                lineHeight: 1.8,
                                marginBottom: '16px',
                            }}>
                                Every order is shipped with <strong>full insurance</strong> through our trusted
                                courier partners. Your precious jewellery is fully protected during transit.
                                Track your order anytime from our website. Pan-India delivery in 5-7 business days.
                            </p>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 20px',
                                background: 'var(--color-bg-alt)',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                color: 'var(--color-text)',
                                letterSpacing: '0.05em',
                            }}>
                                📦 Fully Insured Delivery
                            </div>
                        </div>
                    </div>

                    {/* Additional trust points */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '24px',
                        marginTop: '48px',
                        padding: '32px 24px',
                        background: '#fff',
                        borderRadius: '12px',
                        border: '1px solid var(--color-border-light, #E8E0D4)',
                    }}>
                        {[
                            { icon: '📱', text: 'WhatsApp Support Available' },
                            { icon: '📜', text: 'IGI Certified Diamonds' },
                            { icon: '🏅', text: 'BIS Hallmarked Gold' },
                            { icon: '📦', text: 'Track Your Order Anytime' },
                            { icon: '🚚', text: 'Free Insured Shipping' },
                            { icon: '🇮🇳', text: 'Pan India Delivery' },
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '0.82rem',
                                fontWeight: 400,
                                color: 'var(--color-text)',
                                padding: '8px 16px',
                                background: 'var(--color-bg-alt)',
                                borderRadius: '20px',
                            }}>
                                <span>{item.icon}</span>
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Promise / CTA */}
            <section style={{ padding: '100px 0', textAlign: 'center', background: 'var(--color-bg-dark)', color: 'var(--color-text-on-dark)' }}>
                <div className="container" style={{ maxWidth: '600px' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--color-gold-light)', marginBottom: '20px' }}>
                        Our Promise to You
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 300, lineHeight: 1.3, marginBottom: '24px', letterSpacing: '0.04em' }}>
                        Real diamonds, <em style={{ fontStyle: 'italic', color: 'var(--color-gold-light)' }}>real brilliance</em> — ethically yours
                    </h2>
                    <p style={{ fontSize: '0.88rem', fontWeight: 300, color: 'rgba(255,255,255,0.6)', lineHeight: 1.9, marginBottom: '36px' }}>
                        From Kriti&apos;s vision to your doorstep — every diamond is certified, every setting
                        is hallmarked, and every order is insured. We believe luxury should be ethical,
                        transparent, and accessible. Shop with confidence, shine with pride.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/shop" className="btn btn-gold btn-lg">
                            Explore Collection
                        </Link>
                        <a
                            href="https://wa.me/919217945235?text=Hi Kriti! I have a question about Noore Jewels"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline btn-lg"
                            style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}
                        >
                            💬 Chat with Us
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

export default function OurStoryPage() {
    return (
        <AuthProvider>
            <CartProvider>
                <StoryContent />
            </CartProvider>
        </AuthProvider>
    );
}
