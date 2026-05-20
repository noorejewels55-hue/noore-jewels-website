'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import CartDrawer from '@/components/CartDrawer';
import ProductCard from '@/components/ProductCard';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroSlide, setHeroSlide] = useState(0);

  const heroSlides = [
    {
      badge: 'The Solitaire Collection',
      title: <>Find Your <em>Forever</em><br />Diamond Ring</>,
      text: 'Handcrafted solitaire engagement rings featuring certified Lab Grown Diamonds set in 9kt, 14kt & 18kt gold.',
      image: '/hero-solitaire.png',
    },
    {
      badge: 'Certified Lab Grown Diamonds',
      title: <>Brilliance That<br />Lasts <em>Forever</em></>,
      text: 'Every diamond is IGI certified, ethically created, and indistinguishable from mined diamonds. Real sparkle, responsible choice.',
      image: '/hero-solitaire.png',
    },
    {
      badge: 'Bespoke Creations',
      title: <>Design Your<br />Dream <em>Ring</em></>,
      text: 'Choose your diamond, pick your metal, and create a one-of-a-kind piece. Custom jewellery crafted just for you.',
      image: '/customization-cta.png',
    },
  ];

  // New category structure for the pivoted brand
  const newCategories = [
    { name: 'Engagement Rings', slug: 'engagement-rings', image: '/category-engagement-rings.png' },
    { name: 'Stackable Rings', slug: 'stackable-rings', image: '/category-stackable-rings.png' },
    { name: 'Rings', slug: 'ring', image: '/category-rings.png' },
    { name: 'Fine Jewellery', slug: 'fine-jewellery', image: '/category-fine-jewellery.png' },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
    setLoading(false);
  };

  // Partial tag matching
  const hasTag = (product, keyword) =>
    product.tags?.some(t => t.includes(keyword) || keyword.includes(t));

  const newArrivals = products.filter(p => hasTag(p, 'new')).slice(0, 4);
  const remainingForNew = products.filter(p => !newArrivals.includes(p));
  const displayNew = newArrivals.length > 0 ? newArrivals : remainingForNew.slice(0, 4);

  return (
    <>
      <Navbar />
      <AuthModal />
      <CartDrawer />

      {/* ── HERO WITH SOLITAIRE IMAGE ── */}
      <section className="hero" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="hero-slider">
          {heroSlides.map((slide, i) => (
            <div key={i} className={`hero-slide ${heroSlide === i ? 'active' : ''}`}>
              <div className="hero-overlay" style={{
                background: `linear-gradient(135deg, rgba(253,251,247,0.95) 0%, rgba(247,243,237,0.85) 35%, rgba(212,186,130,0.2) 100%)`
              }}></div>
              {/* Hero image on the right side */}
              <div style={{
                position: 'absolute',
                right: 0,
                top: 0,
                width: '55%',
                height: '100%',
                opacity: heroSlide === i ? 1 : 0,
                transition: 'opacity 1s ease',
                zIndex: 0,
              }}>
                <img
                  src={slide.image}
                  alt={typeof slide.title === 'string' ? slide.title : 'Lab Grown Diamond Jewellery'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    mask: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
                    WebkitMask: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
                  }}
                />
              </div>
              <div className="hero-content" style={{ position: 'relative', zIndex: 1 }}>
                <div className="hero-badge">{slide.badge}</div>
                <h1 className="hero-title">{slide.title}</h1>
                <p className="hero-text">{slide.text}</p>
                <div className="hero-actions">
                  <Link href="/shop" className="btn btn-primary btn-lg">Shop Collection</Link>
                  <Link href="/customize" className="btn btn-outline btn-lg">Customize Ring</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="hero-dots">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              className={`hero-dot ${heroSlide === i ? 'active' : ''}`}
              onClick={() => setHeroSlide(i)}
            />
          ))}
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-item">
              <div className="trust-icon">💎</div>
              <div className="trust-title">IGI Certified Diamonds</div>
              <div className="trust-text">Every stone comes with certification</div>
            </div>
            <div className="trust-item">
              <div className="trust-icon">🛡️</div>
              <div className="trust-title">Lifetime Warranty</div>
              <div className="trust-text">Free maintenance & resizing forever</div>
            </div>
            <div className="trust-item">
              <div className="trust-icon">📦</div>
              <div className="trust-title">Insured Shipping</div>
              <div className="trust-text">Fully insured, trackable delivery</div>
            </div>
            <div className="trust-item">
              <div className="trust-icon">🔄</div>
              <div className="trust-title">7-Day Returns</div>
              <div className="trust-text">Returns accepted with quality deduction</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SHOP BY CATEGORY (NEW NICHE) ── */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="section-divider"></div>
          <p className="section-subtitle">Explore Our Collections</p>

          <div className="categories-grid">
            {newCategories.map((cat) => (
              <Link key={cat.slug} href={cat.slug === 'polished-diamonds' ? '/shop?category=polished-diamonds' : `/shop?category=${cat.slug}`}>
                <div className="category-card">
                  <div
                    className="category-card-bg"
                    style={{
                      backgroundImage: `url(${cat.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      width: '100%',
                      height: '100%',
                    }}
                  />
                  <div className="category-card-overlay">
                    <div className="category-card-name">{cat.name}</div>
                    <div className="category-card-count">Explore</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESIGN YOUR JEWELS (CUSTOMIZATION CTA) ── */}
      <section className="products-section" style={{ background: 'var(--color-bg-dark)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <div className="story-grid" style={{ alignItems: 'center' }}>
            <div className="story-content" style={{ color: '#fff' }}>
              <div style={{
                fontSize: '0.7rem',
                fontWeight: 500,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'var(--color-gold-light, #D4BA82)',
                marginBottom: '20px'
              }}>
                Bespoke Creations
              </div>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                fontWeight: 300,
                lineHeight: 1.2,
                marginBottom: '24px',
                letterSpacing: '0.04em',
                color: '#fff',
              }}>
                Let&apos;s Design Your <em style={{ color: 'var(--color-gold-light, #D4BA82)', fontStyle: 'italic' }}>Dream Jewellery</em>
              </h2>
              <p style={{
                fontSize: '0.92rem',
                fontWeight: 300,
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.9,
                marginBottom: '16px',
              }}>
                Choose your diamond shape, select the metal purity, pick your favourite
                setting — and watch your dream ring come to life. From solitaire engagement rings
                to custom pendants, we craft it all.
              </p>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: '0 0 32px 0',
              }}>
                {[
                  'Choose from 8+ diamond shapes',
                  '9kt, 14kt, 18kt Gold & 925 Silver',
                  'IGI Certified Lab Grown Diamonds',
                  'Delivered in 3 weeks (made-to-order)',
                ].map((item, i) => (
                  <li key={i} style={{
                    fontSize: '0.85rem',
                    fontWeight: 400,
                    color: 'rgba(255,255,255,0.8)',
                    padding: '6px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}>
                    <span style={{ color: 'var(--color-gold-light, #D4BA82)' }}>✦</span> {item}
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <Link href="/customize" className="btn btn-gold btn-lg">
                  Start Designing
                </Link>
                <a
                  href="https://wa.me/918076735450?text=Hi! I want to customize a diamond ring"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-lg"
                  style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}
                >
                  💬 Chat With Us
                </a>
              </div>
            </div>
            <div className="story-image" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <img
                src="/customization-cta.png"
                alt="Custom diamond jewellery creation at Noore Jewels"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── LOOSE / POLISHED DIAMONDS ── */}
      <section className="products-section alt-bg">
        <div className="container">
          <div className="story-grid" style={{ direction: 'rtl' }}>
            <div className="story-image" style={{ direction: 'ltr', borderRadius: '16px', overflow: 'hidden' }}>
              <img
                src="/loose-diamonds.png"
                alt="Polished Lab Grown Diamonds — Buy loose diamonds online"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
            <div className="story-content" style={{ direction: 'ltr' }}>
              <div className="story-label">Polished Diamonds</div>
              <h2 className="story-title">Buy Certified Loose Diamonds</h2>
              <p className="story-text">
                Want to create your own jewellery? We also sell IGI certified polished Lab Grown
                Diamonds in all popular shapes — Round, Oval, Emerald, Pear, Cushion, Princess &amp; more.
                Buy the perfect stone and craft your dream piece with your local jeweller.
              </p>
              <p className="story-text">
                Every diamond comes with an IGI certificate, laser inscription, and detailed
                grading report. Available from 0.30ct to 3ct+ in DEF colour and VVS-VS clarity.
              </p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '8px' }}>
                <Link href="/shop?category=polished-diamonds" className="btn btn-primary">
                  View Diamonds
                </Link>
                <a
                  href="https://wa.me/918076735450?text=Hi! I want to buy a loose lab grown diamond"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  Enquire on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR STORY TEASER ── */}
      <section className="story-section">
        <div className="container">
          <div className="story-grid">
            <div className="story-image">
              <img
                src="/founder-kriti.png"
                alt="Kriti — Founder of Noore Jewels, India's premium Lab Grown Diamond brand"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
            <div className="story-content">
              <div className="story-label">Our Story</div>
              <h2 className="story-title">India&apos;s Finest Lab Grown Diamond Jewellery</h2>
              <p className="story-text">
                Noore Jewels is founded by Kriti — a one-woman force with a passion for creating
                the most beautiful diamond jewellery for the modern Indian woman. Every design is
                handpicked, every diamond is IGI certified, and every piece is crafted to perfection.
              </p>
              <p className="story-text">
                From elegant solitaire engagement rings to dazzling diamond pendants, each piece is designed
                to make you feel extraordinary. Because we believe ethical luxury should be accessible to all.
              </p>
              <Link href="/our-story" className="btn btn-outline">Read Our Story</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      {displayNew.length > 0 && (
        <section className="products-section alt-bg">
          <div className="container">
            <h2 className="section-title">New Arrivals</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">Fresh Off The Bench</p>

            <div className="products-grid">
              {displayNew.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <Link href="/shop?tag=new" className="btn btn-gold">Shop New Arrivals</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── WHATSAPP CTA ── */}
      <section style={{ padding: '80px 0', textAlign: 'center', background: 'var(--color-bg)' }}>
        <div className="container">
          <h2 className="section-title">Need Help Choosing?</h2>
          <div className="section-divider"></div>
          <p style={{ fontSize: '0.9rem', fontWeight: 300, color: 'var(--color-text-light)', maxWidth: '500px', margin: '0 auto 36px', lineHeight: '1.8' }}>
            Chat with our WhatsApp assistant for personalised diamond jewellery recommendations, customization enquiries, and instant support.
          </p>
          <a
            href="https://wa.me/918076735450?text=Hi! I'm looking for a lab grown diamond ring"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-lg"
            style={{ background: '#25D366', borderColor: '#25D366' }}
          >
            💬&nbsp;&nbsp;Chat on WhatsApp
          </a>
        </div>
      </section>

      {/* ── WHATSAPP FLOATING BUTTON ── */}
      <a
        href="https://wa.me/918076735450"
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
    </>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <CartProvider>
        <HomePage />
      </CartProvider>
    </AuthProvider>
  );
}
