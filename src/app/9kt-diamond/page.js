'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import CartDrawer from '@/components/CartDrawer';
import ProductCard from '@/components/ProductCard';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';

function DiamondPageContent() {
    const [products, setProducts] = useState([]);
    const [reviewSummary, setReviewSummary] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        // Fetch 9kt tagged products
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products?tag=9kt');
                const data = await res.json();
                if (data.success) {
                    setProducts(data.products);
                }
            } catch (err) {
                console.error('Error fetching 9KT products:', err);
            }
            setLoading(false);
        };

        fetchProducts();

        // Fetch review summaries
        fetch('/api/reviews/summary')
            .then(res => res.json())
            .then(data => {
                if (data.success) setReviewSummary(data.summary);
            })
            .catch(() => {});
    }, []);

    // Filter products by category
    const filteredProducts = activeFilter === 'all'
        ? products
        : products.filter(p => p.category.toLowerCase().includes(activeFilter));

    // Get unique categories from 9kt products
    const categories = [...new Set(products.map(p => p.category))].filter(Boolean);

    return (
        <>
            <Navbar />
            <AuthModal />
            <CartDrawer />

            {/* ── PREMIUM HERO SECTION ── */}
            <section style={{
                position: 'relative',
                padding: '120px 0 100px',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1208 30%, #2d1f0a 60%, #1a1208 100%)',
                overflow: 'hidden',
            }}>
                {/* Decorative diamond sparkle elements */}
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    left: '10%',
                    width: '6px',
                    height: '6px',
                    background: '#F0D690',
                    borderRadius: '50%',
                    boxShadow: '0 0 20px 8px rgba(240,214,144,0.3)',
                    animation: 'pulse 3s ease-in-out infinite',
                }} />
                <div style={{
                    position: 'absolute',
                    top: '40%',
                    right: '15%',
                    width: '4px',
                    height: '4px',
                    background: '#fff',
                    borderRadius: '50%',
                    boxShadow: '0 0 15px 6px rgba(255,255,255,0.2)',
                    animation: 'pulse 4s ease-in-out infinite 1s',
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '25%',
                    left: '20%',
                    width: '3px',
                    height: '3px',
                    background: '#C5A467',
                    borderRadius: '50%',
                    boxShadow: '0 0 12px 5px rgba(197,164,103,0.2)',
                    animation: 'pulse 3.5s ease-in-out infinite 0.5s',
                }} />
                <div style={{
                    position: 'absolute',
                    top: '60%',
                    right: '8%',
                    width: '5px',
                    height: '5px',
                    background: '#F0D690',
                    borderRadius: '50%',
                    boxShadow: '0 0 18px 7px rgba(240,214,144,0.25)',
                    animation: 'pulse 2.8s ease-in-out infinite 1.5s',
                }} />

                <div className="container" style={{ maxWidth: '800px', position: 'relative', zIndex: 1 }}>
                    {/* Premium badge */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 24px',
                        background: 'linear-gradient(135deg, rgba(197,164,103,0.15), rgba(240,214,144,0.1))',
                        border: '1px solid rgba(197,164,103,0.3)',
                        borderRadius: '30px',
                        marginBottom: '28px',
                    }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C5A467' }}>
                            ✦ Premium Collection ✦
                        </span>
                    </div>

                    <h1 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                        fontWeight: 300,
                        lineHeight: 1.15,
                        marginBottom: '24px',
                        letterSpacing: '0.06em',
                        color: '#fff',
                    }}>
                        9KT Gold with{' '}
                        <em style={{
                            fontStyle: 'italic',
                            background: 'linear-gradient(135deg, #C5A467, #F0D690, #C5A467)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Lab Grown Diamonds
                        </em>
                    </h1>

                    <p style={{
                        fontSize: '1rem',
                        fontWeight: 300,
                        color: 'rgba(255,255,255,0.6)',
                        lineHeight: 1.9,
                        maxWidth: '600px',
                        margin: '0 auto 36px',
                    }}>
                        Discover our exclusive collection of 9KT solid gold jewellery adorned with
                        <strong style={{ color: '#C5A467' }}> IGI Certified Lab Grown Diamonds</strong> — where real luxury meets affordable elegance.
                    </p>

                    {/* Gold divider line */}
                    <div style={{
                        width: '80px',
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, #C5A467, transparent)',
                        margin: '0 auto 36px',
                    }} />

                    {/* Key highlights */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '32px',
                        flexWrap: 'wrap',
                    }}>
                        {[
                            { icon: '💎', label: 'IGI Certified LGD' },
                            { icon: '🏅', label: '9KT Solid Gold' },
                            { icon: '📜', label: 'Certificate Included' },
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 20px',
                                background: 'rgba(197,164,103,0.08)',
                                border: '1px solid rgba(197,164,103,0.15)',
                                borderRadius: '8px',
                            }}>
                                <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                    letterSpacing: '0.12em',
                                    textTransform: 'uppercase',
                                    color: 'rgba(255,255,255,0.8)',
                                }}>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── WHY 9KT GOLD + DIAMOND ── */}
            <section style={{ padding: '80px 0', background: 'var(--color-bg-alt)' }}>
                <div className="container">
                    <h2 className="section-title">Why 9KT Gold with Lab Grown Diamonds?</h2>
                    <div className="section-divider"></div>
                    <p className="section-subtitle" style={{ maxWidth: '600px', margin: '0 auto 48px' }}>
                        The perfect balance of luxury, durability, and value
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: '32px',
                    }}>
                        {[
                            {
                                icon: '💰',
                                title: 'Affordable Real Gold',
                                text: '9KT gold gives you the prestige and beauty of real gold jewellery at a fraction of the price of 22KT or 18KT. Perfect for everyday luxury without the heavy investment.',
                            },
                            {
                                icon: '💪',
                                title: 'Superior Durability',
                                text: '9KT gold is actually stronger and more scratch-resistant than higher karat gold because of its alloy composition. Ideal for jewellery you want to wear every single day.',
                            },
                            {
                                icon: '💎',
                                title: 'IGI Certified Lab Grown Diamonds',
                                text: 'Each piece is set with IGI certified Lab Grown Diamonds — identical in chemical, optical and physical properties to mined diamonds. Same brilliance, same fire, ethically created.',
                            },
                            {
                                icon: '📜',
                                title: 'Certified & Hallmarked',
                                text: 'Every piece comes with a certificate of authenticity verifying the gold purity and diamond quality. Shop with complete confidence and transparency.',
                            },
                        ].map((val, i) => (
                            <div key={i} style={{
                                background: '#fff',
                                padding: '36px 28px',
                                borderRadius: '12px',
                                border: '1px solid var(--color-border-light, #E8E0D4)',
                                textAlign: 'center',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                <div style={{ fontSize: '2.2rem', marginBottom: '16px' }}>{val.icon}</div>
                                <h3 style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: '1.2rem',
                                    fontWeight: 500,
                                    marginBottom: '12px',
                                    letterSpacing: '0.04em',
                                }}>{val.title}</h3>
                                <p style={{
                                    fontSize: '0.85rem',
                                    fontWeight: 300,
                                    color: 'var(--color-text-light)',
                                    lineHeight: 1.8,
                                }}>{val.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PRODUCTS SECTION ── */}
            <section style={{ padding: '80px 0' }}>
                <div className="container">
                    <h2 className="section-title">9KT Lab Grown Diamond Collection</h2>
                    <div className="section-divider"></div>
                    <p className="section-subtitle">IGI Certified Lab Grown Diamonds in 9KT Gold</p>

                    {/* Category filters */}
                    {categories.length > 1 && (
                        <div className="shop-filters-container" style={{ marginTop: '32px', marginBottom: '32px' }}>
                            <div className="shop-filters-scroll">
                                <button
                                    className={`btn btn-sm ${activeFilter === 'all' ? 'btn-primary' : 'btn-outline'}`}
                                    onClick={() => setActiveFilter('all')}
                                >
                                    All
                                </button>
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        className={`btn btn-sm ${activeFilter === cat.toLowerCase() ? 'btn-primary' : 'btn-outline'}`}
                                        onClick={() => setActiveFilter(cat.toLowerCase())}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Product grid */}
                    {loading ? (
                        <div className="products-grid">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="product-card">
                                    <div className="product-card-image"><div className="skeleton" style={{ width: '100%', height: '100%' }} /></div>
                                    <div className="product-card-info">
                                        <div className="skeleton" style={{ height: '16px', width: '80%', margin: '0 auto 8px' }} />
                                        <div className="skeleton" style={{ height: '14px', width: '40%', margin: '0 auto' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💎</div>
                            <p style={{
                                fontSize: '1.2rem',
                                color: 'var(--color-text-muted)',
                                fontFamily: 'var(--font-heading)',
                                marginBottom: '12px',
                            }}>
                                Coming Soon
                            </p>
                            <p style={{
                                fontSize: '0.85rem',
                                color: 'var(--color-text-light)',
                                marginBottom: '24px',
                                maxWidth: '400px',
                                margin: '0 auto 24px',
                                lineHeight: 1.8,
                            }}>
                                Our exclusive 9KT gold and original diamond collection is being curated.
                                Please check back soon or contact us on WhatsApp for availability!
                            </p>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <a
                                    href="https://wa.me/919217945235?text=Hi! I'm interested in the 9KT Gold Diamond jewellery collection"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary"
                                >
                                    💬 Enquire on WhatsApp
                                </a>
                                <Link href="/shop" className="btn btn-outline">
                                    Browse All Jewellery
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} reviewSummary={reviewSummary} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── COMPARISON: 9KT vs OTHERS ── */}
            <section style={{ padding: '80px 0', background: 'var(--color-bg-alt)' }}>
                <div className="container">
                    <h2 className="section-title">9KT Gold vs Other Karats</h2>
                    <div className="section-divider"></div>
                    <p className="section-subtitle" style={{ maxWidth: '550px', margin: '0 auto 48px' }}>
                        Understand why 9KT is the smartest choice for diamond jewellery
                    </p>

                    <div style={{
                        maxWidth: '800px',
                        margin: '0 auto',
                        overflowX: 'auto',
                    }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontSize: '0.85rem',
                            fontWeight: 300,
                        }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--color-gold, #C5A467)' }}>
                                    <th style={{ padding: '16px 20px', textAlign: 'left', fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: '0.9rem', letterSpacing: '0.04em' }}>Feature</th>
                                    <th style={{ padding: '16px 20px', textAlign: 'center', fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: '0.9rem', letterSpacing: '0.04em', background: 'rgba(197,164,103,0.08)', color: 'var(--color-gold, #C5A467)' }}>9KT Gold ✦</th>
                                    <th style={{ padding: '16px 20px', textAlign: 'center', fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: '0.9rem', letterSpacing: '0.04em' }}>14KT Gold</th>
                                    <th style={{ padding: '16px 20px', textAlign: 'center', fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: '0.9rem', letterSpacing: '0.04em' }}>22KT Gold</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { feature: 'Gold Purity', kt9: '37.5%', kt14: '58.3%', kt22: '91.6%' },
                                    { feature: 'Price Range', kt9: '₹₹', kt14: '₹₹₹', kt22: '₹₹₹₹₹' },
                                    { feature: 'Durability', kt9: '⭐⭐⭐⭐⭐', kt14: '⭐⭐⭐⭐', kt22: '⭐⭐' },
                                    { feature: 'Scratch Resistance', kt9: 'Excellent', kt14: 'Good', kt22: 'Poor' },
                                    { feature: 'Daily Wear', kt9: '✅ Perfect', kt14: '✅ Good', kt22: '⚠️ Risky' },
                                    { feature: 'With Diamonds', kt9: '✅ Ideal', kt14: '✅ Good', kt22: '❌ Too Soft' },
                                ].map((row, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid var(--color-border-light, #E8E0D4)' }}>
                                        <td style={{ padding: '14px 20px', fontWeight: 400, color: 'var(--color-text)' }}>{row.feature}</td>
                                        <td style={{ padding: '14px 20px', textAlign: 'center', background: 'rgba(197,164,103,0.05)', fontWeight: 400 }}>{row.kt9}</td>
                                        <td style={{ padding: '14px 20px', textAlign: 'center', color: 'var(--color-text-light)' }}>{row.kt14}</td>
                                        <td style={{ padding: '14px 20px', textAlign: 'center', color: 'var(--color-text-light)' }}>{row.kt22}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* ── CARE GUIDE ── */}
            <section style={{ padding: '80px 0' }}>
                <div className="container">
                    <h2 className="section-title">Diamond Care Guide</h2>
                    <div className="section-divider"></div>
                    <p className="section-subtitle" style={{ maxWidth: '550px', margin: '0 auto 48px' }}>
                        Keep your 9KT Lab Grown Diamond jewellery sparkling for years
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '24px',
                        maxWidth: '900px',
                        margin: '0 auto',
                    }}>
                        {[
                            { icon: '🧼', title: 'Gentle Cleaning', text: 'Clean with mild soap and warm water. Use a soft toothbrush to gently reach under the diamonds.' },
                            { icon: '📦', title: 'Store Separately', text: 'Keep each piece in a separate soft pouch or box to prevent scratching between items.' },
                            { icon: '🚿', title: 'Remove Before Bathing', text: 'Take off your jewellery before swimming, showering, or applying lotions and perfumes.' },
                            { icon: '🔍', title: 'Regular Checks', text: 'Inspect the diamond settings periodically. If a stone feels loose, contact us immediately for a free check.' },
                        ].map((item, i) => (
                            <div key={i} style={{
                                padding: '28px 24px',
                                border: '1px solid var(--color-border-light, #E8E0D4)',
                                borderRadius: '12px',
                                textAlign: 'center',
                            }}>
                                <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>{item.icon}</div>
                                <h3 style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: '1.05rem',
                                    fontWeight: 500,
                                    marginBottom: '8px',
                                    letterSpacing: '0.04em',
                                }}>{item.title}</h3>
                                <p style={{
                                    fontSize: '0.82rem',
                                    fontWeight: 300,
                                    color: 'var(--color-text-light)',
                                    lineHeight: 1.7,
                                }}>{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA SECTION ── */}
            <section style={{
                padding: '100px 0',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1208 50%, #0a0a0a 100%)',
                color: '#fff',
            }}>
                <div className="container" style={{ maxWidth: '600px' }}>
                    <div style={{
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                        color: '#C5A467',
                        marginBottom: '20px',
                    }}>
                        Exclusive Collection
                    </div>
                    <h2 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                        fontWeight: 300,
                        lineHeight: 1.3,
                        marginBottom: '24px',
                        letterSpacing: '0.04em',
                    }}>
                        Ready to Own{' '}
                        <em style={{ fontStyle: 'italic', color: '#F0D690' }}>Lab Grown Diamonds</em>?
                    </h2>
                    <p style={{
                        fontSize: '0.88rem',
                        fontWeight: 300,
                        color: 'rgba(255,255,255,0.6)',
                        lineHeight: 1.9,
                        marginBottom: '36px',
                    }}>
                        Have questions about our 9KT gold diamond collection? Want to know about a specific piece?
                        Chat with us directly on WhatsApp — we&apos;re always happy to help you find the perfect diamond jewellery.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a
                            href="https://wa.me/919217945235?text=Hi! I'm interested in the 9KT Gold Diamond jewellery collection"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-gold btn-lg"
                        >
                            💬 Chat on WhatsApp
                        </a>
                        <Link
                            href="/shop"
                            className="btn btn-outline btn-lg"
                            style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}
                        >
                            Explore All Jewellery
                        </Link>
                    </div>
                </div>
            </section>

            {/* WhatsApp floating button */}
            <a
                href="https://wa.me/919217945235"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-float"
                title="Chat on WhatsApp"
            >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            </a>

            <Footer />

            {/* Sparkle animation */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.5); }
                }
            `}</style>
        </>
    );
}

export default function DiamondPage() {
    return (
        <AuthProvider>
            <CartProvider>
                <DiamondPageContent />
            </CartProvider>
        </AuthProvider>
    );
}
