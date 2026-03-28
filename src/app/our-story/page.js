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
                        One Woman, One <em style={{ color: 'var(--color-gold)' }}>Sparkling Dream</em>
                    </h1>
                    <p style={{ fontSize: '0.9rem', fontWeight: 300, color: 'var(--color-text-light)', lineHeight: 1.9, maxWidth: '550px', margin: '0 auto' }}>
                        Noore Jewels was born from the creative passion of one woman who believes every woman
                        deserves to sparkle — without breaking the bank.
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
                                alt="Founders of Noore Jewels — Kriti Kala"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <div className="story-content">
                            <div className="story-label">Meet the Founder</div>
                            <h2 className="story-title">The Face Behind Noore Jewels</h2>
                            <p className="story-text">
                                Hi, I&apos;m <strong>Kriti</strong> — and my name &quot;Kala&quot; means <em>Kalakar</em> (कलाकार) — an artist.
                                That&apos;s exactly what drives me every day — the inner passion to create the most
                                beautiful, high-quality jewellery for women across India.
                            </p>
                            <p className="story-text">
                                I started Noore Jewels with a simple belief — that gorgeous jewellery
                                shouldn&apos;t come with a hefty price tag. As a woman myself, I understand the joy
                                of finding that perfect piece — the one that makes you feel confident, beautiful,
                                and ready to conquer the world. Every design at Noore Jewels is handpicked by me
                                with love and care.
                            </p>
                            <p className="story-text">
                                I specialize in premium <strong>Lab Grown Diamond</strong> fine jewellery —
                                pieces that are authentic, luxurious, and last forever, all at accessible prices.
                                From my hands to your doorstep, every order is packed with care and shipped with love.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why AD Jewelry */}
            <section style={{ padding: '80px 0', background: 'var(--color-bg-alt)' }}>
                <div className="container">
                    <h2 className="section-title">Why Lab Grown Diamond?</h2>
                    <div className="section-divider"></div>
                    <p className="section-subtitle">Real Diamonds, Ethical Choice</p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', marginTop: '20px' }}>
                        {[
                            {
                                icon: '💎',
                                title: 'Real Diamond Brilliance',
                                text: 'Lab Grown Diamonds have the exact same physical, chemical, and optical properties as mined diamonds. The sparkle is brilliant and authentic!'
                            },
                            {
                                icon: '🛡️',
                                title: 'Enduring Craftsmanship',
                                text: 'Our fine pieces are crafted with premium metals to keep them shining forever. Wear them daily without worry — they\'re built to last a lifetime.'
                            },
                            {
                                icon: '🎯',
                                title: 'Accessible Luxury',
                                text: 'Experience sustainable luxury that aligns with your values. Premium Lab Grown Diamond jewellery starting at just ₹199.'
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
                                alt="Noore Jewels Collection — Lab Grown Diamond Jewelry"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <div className="story-content" style={{ direction: 'ltr' }}>
                            <div className="story-label">The Journey</div>
                            <h2 className="story-title">Growing Together with You</h2>
                            <p className="story-text">
                                What started as a small dream has grown into a community of hundreds of happy
                                customers across India. Every order, every review, every &quot;I love it!&quot; message
                                from you pushes us to do better.
                            </p>
                            <p className="story-text">
                                Kriti personally oversees every new design that enters our collection. If it
                                doesn&apos;t make her go &quot;wow,&quot; it doesn&apos;t make it to the website. That&apos;s our
                                quality promise — if we won&apos;t wear it ourselves, we won&apos;t sell it to you.
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
                                payment gateway used by lakhs of businesses. Your card details are never stored
                                with us. Pay via UPI, Credit/Debit Cards, Net Banking, or Wallets — 100% safe and encrypted.
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

                        {/* Fast Delivery */}
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
                            }}>Automatic Shipping</h3>
                            <p style={{
                                fontSize: '0.85rem',
                                fontWeight: 300,
                                color: 'var(--color-text-light)',
                                lineHeight: 1.8,
                                marginBottom: '16px',
                            }}>
                                The moment you order, our courier partner <strong>NimbusPost</strong> automatically
                                picks it up! No delays, no manual processing. Your order is packed with love
                                and shipped the same or next business day. Track your order anytime from our website.
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
                                📦 Delivered by NimbusPost
                            </div>
                        </div>

                        {/* Quality Guarantee */}
                        <div style={{
                            background: '#fff',
                            padding: '36px 28px',
                            borderRadius: '12px',
                            border: '1px solid var(--color-border-light, #E8E0D4)',
                            textAlign: 'center',
                        }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>✅</div>
                            <h3 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '1.2rem',
                                fontWeight: 500,
                                marginBottom: '12px',
                                letterSpacing: '0.04em',
                            }}>You Will Receive Your Order</h3>
                            <p style={{
                                fontSize: '0.85rem',
                                fontWeight: 300,
                                color: 'var(--color-text-light)',
                                lineHeight: 1.8,
                                marginBottom: '16px',
                            }}>
                                We understand online shopping can feel scary. But at Noore Jewels, <strong>every
                                    single order is delivered</strong>. We&apos;re real people — two women running a business
                                we&apos;re proud of. Check our Instagram reviews, our WhatsApp support, and our happy
                                customers. You can reach us anytime!
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
                                ⭐ 500+ Happy Customers
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
                            { icon: '🔄', text: 'Exchange Policy Available' },
                            { icon: '🆓', text: 'Free Shipping above ₹999' },
                            { icon: '📦', text: 'Track Your Order Anytime' },
                            { icon: '🏷️', text: 'Prices Starting at ₹199' },
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
                        You deserve to <em style={{ fontStyle: 'italic', color: 'var(--color-gold-light)' }}>sparkle</em> — and we&apos;re here to make it happen
                    </h2>
                    <p style={{ fontSize: '0.88rem', fontWeight: 300, color: 'rgba(255,255,255,0.6)', lineHeight: 1.9, marginBottom: '36px' }}>
                        From Kriti&apos;s heart to your doorstep — every piece is chosen with love, packed with care,
                        and shipped with a smile. My satisfaction comes from your happiness.
                        Shop with confidence, sparkle with pride.
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
