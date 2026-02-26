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
      badge: 'New Collection 2026',
      title: <>Jewellery That<br />Tells <em>Your Story</em></>,
      text: 'Discover our handpicked collection of stunning, affordable jewellery designed to make every moment shine.',
    },
    {
      badge: 'Trending Now',
      title: <>Elegance in<br />Every <em>Detail</em></>,
      text: 'From delicate rings to statement necklaces, find the perfect piece that speaks to your style.',
    },
    {
      badge: 'Best Sellers',
      title: <>Shine <em>Forever</em><br />Starting ₹199</>,
      text: 'Premium quality jewellery at prices that make you smile. Free shipping on orders above ₹999.',
    },
  ];

  // Category images (placeholder gradients — will be replaced with real images)
  const categoryImages = {
    'Rings': 'linear-gradient(135deg, #D4BA82 0%, #A68B4B 100%)',
    'Necklaces': 'linear-gradient(135deg, #B76E79 0%, #8B4753 100%)',
    'Earrings': 'linear-gradient(135deg, #C5A467 0%, #96793E 100%)',
    'Bracelets': 'linear-gradient(135deg, #A0927C 0%, #7B6D5A 100%)',
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);
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

  const featured = products.filter(p => p.tags?.includes('featured') || p.tags?.includes('bestseller')).slice(0, 8);
  const newArrivals = products.filter(p => p.tags?.includes('new')).slice(0, 4);

  // If no tagged products, show first 8
  const displayProducts = featured.length > 0 ? featured : products.slice(0, 8);
  const displayNew = newArrivals.length > 0 ? newArrivals : products.slice(0, 4);

  return (
    <>
      <Navbar />
      <AuthModal />
      <CartDrawer />

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-slider">
          {heroSlides.map((slide, i) => (
            <div key={i} className={`hero-slide ${heroSlide === i ? 'active' : ''}`}>
              <div className="hero-overlay" style={{ background: `linear-gradient(135deg, rgba(253,251,247,0.92) 0%, rgba(247,243,237,0.7) 40%, rgba(212,186,130,0.15) 100%)` }}></div>
              <div className="hero-content">
                <div className="hero-badge">{slide.badge}</div>
                <h1 className="hero-title">{slide.title}</h1>
                <p className="hero-text">{slide.text}</p>
                <div className="hero-actions">
                  <Link href="/shop" className="btn btn-primary btn-lg">Shop Collection</Link>
                  <Link href="/our-story" className="btn btn-outline btn-lg">Our Story</Link>
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
              <div className="trust-icon">✦</div>
              <div className="trust-title">Premium Quality</div>
              <div className="trust-text">Every piece crafted with care & precision</div>
            </div>
            <div className="trust-item">
              <div className="trust-icon">🚚</div>
              <div className="trust-title">Free Shipping</div>
              <div className="trust-text">On all orders above ₹999</div>
            </div>
            <div className="trust-item">
              <div className="trust-icon">🔒</div>
              <div className="trust-title">Secure Payments</div>
              <div className="trust-text">Protected by Razorpay</div>
            </div>
            <div className="trust-item">
              <div className="trust-icon">💎</div>
              <div className="trust-title">500+ Happy Customers</div>
              <div className="trust-text">Trusted across India</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SHOP BY CATEGORY ── */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="section-divider"></div>
          <p className="section-subtitle">Find Your Perfect Piece</p>

          <div className="categories-grid">
            {(categories.length > 0 ? categories : [
              { name: 'Rings', slug: 'rings', count: 0 },
              { name: 'Necklaces', slug: 'necklaces', count: 0 },
              { name: 'Earrings', slug: 'earrings', count: 0 },
              { name: 'Bracelets', slug: 'bracelets', count: 0 },
            ]).slice(0, 4).map((cat) => (
              <Link key={cat.slug} href={`/shop?category=${cat.slug}`}>
                <div className="category-card">
                  <div
                    className="category-card-bg"
                    style={{
                      background: categoryImages[cat.name] || 'linear-gradient(135deg, #C5A467, #8B7355)',
                      width: '100%',
                      height: '100%',
                    }}
                  />
                  <div className="category-card-overlay">
                    <div className="category-card-name">{cat.name}</div>
                    <div className="category-card-count">{cat.count > 0 ? `${cat.count} pieces` : 'Explore'}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEST SELLERS ── */}
      <section className="products-section">
        <div className="container">
          <h2 className="section-title">Best Sellers</h2>
          <div className="section-divider"></div>
          <p className="section-subtitle">Our Most Loved Pieces</p>

          {loading ? (
            <div className="products-grid">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="product-card">
                  <div className="product-card-image"><div className="skeleton" style={{ width: '100%', height: '100%' }} /></div>
                  <div className="product-card-info">
                    <div className="skeleton" style={{ height: '16px', width: '80%', margin: '0 auto 8px' }} />
                    <div className="skeleton" style={{ height: '14px', width: '40%', margin: '0 auto' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="products-grid">
              {displayProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link href="/shop" className="btn btn-outline">View All Collection</Link>
          </div>
        </div>
      </section>

      {/* ── OUR STORY TEASER ── */}
      <section className="story-section">
        <div className="container">
          <div className="story-grid">
            <div className="story-image">
              <div style={{
                width: '100%', height: '100%',
                background: 'linear-gradient(135deg, #F7F3ED 0%, #D4BA82 50%, #B76E79 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-heading)', fontSize: '3rem', color: 'rgba(255,255,255,0.6)'
              }}>
                ✦
              </div>
            </div>
            <div className="story-content">
              <div className="story-label">Our Story</div>
              <h2 className="story-title">Born from a Love for Timeless Elegance</h2>
              <p className="story-text">
                Noore Jewels was born from a simple belief — that every woman deserves to feel extraordinary,
                without an extraordinary price tag. We curate pieces that blend traditional Indian artistry
                with contemporary design, creating jewellery that transitions seamlessly from morning meetings
                to moonlit dinners.
              </p>
              <p className="story-text">
                Each piece in our collection is carefully selected to ensure it meets our standards of beauty,
                quality, and affordability. Because we believe luxury should be accessible to all.
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
            Chat with our AI-powered WhatsApp assistant for personalised jewellery recommendations, order tracking, and instant support.
          </p>
          <a
            href="https://wa.me/919217945235?text=Hi! I'm looking for some jewellery recommendations"
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
