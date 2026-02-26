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
                        Born from a Love for <em style={{ color: 'var(--color-gold)' }}>Timeless Beauty</em>
                    </h1>
                    <p style={{ fontSize: '0.9rem', fontWeight: 300, color: 'var(--color-text-light)', lineHeight: 1.9, maxWidth: '550px', margin: '0 auto' }}>
                        Every piece of jewellery has a story. Ours began with a simple dream — to make beautiful,
                        high-quality jewellery accessible to every woman in India.
                    </p>
                </div>
            </section>

            {/* The Beginning */}
            <section style={{ padding: '80px 0' }}>
                <div className="container">
                    <div className="story-grid">
                        <div className="story-image">
                            <div style={{
                                width: '100%', height: '100%',
                                background: 'linear-gradient(180deg, #F7F3ED 0%, rgba(197,164,103,0.3) 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontFamily: 'var(--font-heading)', fontSize: '4rem', color: 'var(--color-gold-light)'
                            }}>
                                ✦
                            </div>
                        </div>
                        <div className="story-content">
                            <div className="story-label">The Beginning</div>
                            <h2 className="story-title">Where It All Started</h2>
                            <p className="story-text">
                                Noore Jewels started out of a passion for bringing joy through beautiful accessories. We noticed
                                that gorgeous jewellery often came with prices that made people hesitate. We wanted to change that.
                            </p>
                            <p className="story-text">
                                Starting from a small workshop with a handful of designs, we began sharing our creations on
                                social media. The response was overwhelming — women from across India fell in love with our
                                pieces, not just for how they looked, but for how they made them feel.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section style={{ padding: '80px 0', background: 'var(--color-bg-alt)' }}>
                <div className="container">
                    <h2 className="section-title">What We Believe In</h2>
                    <div className="section-divider"></div>
                    <p className="section-subtitle">Our Core Values</p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', marginTop: '20px' }}>
                        {[
                            {
                                icon: '✦',
                                title: 'Beauty for Everyone',
                                text: 'Luxury jewellery shouldn\'t require a luxury budget. We make premium designs accessible, starting at just ₹199.'
                            },
                            {
                                icon: '♡',
                                title: 'Made with Love',
                                text: 'Every piece is carefully curated and quality-checked to ensure it meets our high standards of beauty and durability.'
                            },
                            {
                                icon: '✨',
                                title: 'Trendy Yet Timeless',
                                text: 'Our designs blend the latest trends with timeless elegance, so you can wear them today, tomorrow, and always.'
                            },
                        ].map((val, i) => (
                            <div key={i} style={{ textAlign: 'center', padding: '32px 24px' }}>
                                <div style={{ fontSize: '2rem', color: 'var(--color-gold)', marginBottom: '16px' }}>{val.icon}</div>
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

            {/* The Journey */}
            <section style={{ padding: '80px 0' }}>
                <div className="container">
                    <div className="story-grid" style={{ direction: 'rtl' }}>
                        <div className="story-image" style={{ direction: 'ltr' }}>
                            <div style={{
                                width: '100%', height: '100%',
                                background: 'linear-gradient(135deg, #B76E79 0%, rgba(183,110,121,0.4) 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontFamily: 'var(--font-heading)', fontSize: '4rem', color: 'rgba(255,255,255,0.5)'
                            }}>
                                💎
                            </div>
                        </div>
                        <div className="story-content" style={{ direction: 'ltr' }}>
                            <div className="story-label">The Journey</div>
                            <h2 className="story-title">Growing Together with You</h2>
                            <p className="story-text">
                                From our first 10 customers to over 500 happy customers across India, every step of our
                                journey has been fuelled by your love and trust. Your messages telling us how a simple
                                necklace brightened your day, or how our earrings were the perfect gift — those stories
                                keep us going.
                            </p>
                            <p className="story-text">
                                Today, we offer 200+ unique designs across rings, necklaces, earrings, bracelets, and
                                more. Each piece is a promise — of quality, of beauty, and of bringing a little sparkle
                                to your everyday.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Promise */}
            <section style={{ padding: '100px 0', textAlign: 'center', background: 'var(--color-bg-dark)', color: 'var(--color-text-on-dark)' }}>
                <div className="container" style={{ maxWidth: '600px' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--color-gold-light)', marginBottom: '20px' }}>
                        Our Promise
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 300, lineHeight: 1.3, marginBottom: '24px', letterSpacing: '0.04em' }}>
                        Every piece we create is a celebration of <em style={{ fontStyle: 'italic', color: 'var(--color-gold-light)' }}>you</em>
                    </h2>
                    <p style={{ fontSize: '0.88rem', fontWeight: 300, color: 'rgba(255,255,255,0.6)', lineHeight: 1.9, marginBottom: '36px' }}>
                        We promise to keep bringing you trendy, beautiful, and affordable jewellery that makes
                        you feel confident and radiant — because you deserve to shine, every single day.
                    </p>
                    <Link href="/shop" className="btn btn-gold btn-lg">
                        Explore Our Collection
                    </Link>
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
