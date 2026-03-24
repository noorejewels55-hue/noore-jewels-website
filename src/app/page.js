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
      badge: 'The New Standard of Luxury',
      title: <>Certified <em>Lab Grown Diamond</em><br />Jewellery</>,
      text: 'Discover our exquisite collection of IGI-certified lab grown diamonds set in 9kt, 14kt, 18kt gold and 925 sterling silver — real diamonds, ethically made.',
    },
    {
      badge: 'Solitaire Collection',
      title: <>Brilliance That<br />Lasts <em>Forever</em></>,
      text: 'From stunning solitaire engagement rings to elegant diamond pendants — every piece is crafted with precision and certified for authenticity.',
    },
    {
      badge: 'Ethical & Sustainable',
      title: <>Real Diamonds,<br /><em>Reimagined</em></>,
      text: 'Lab grown diamonds are chemically, physically, and optically identical to mined diamonds — at a fraction of the cost. Luxury you can feel good about.',
    },
  ];

  // Category images
  const categoryImages = {
    'Rings': '/category-chains.png',
    'Solitaire Rings': '/category-chains.png',
    'Necklaces': '/category-necklaces.png',
    'Necklace': '/category-necklaces.png',
    'Pendants': '/category-necklaces.png',
    'Earrings': '/category-earrings.png',
    'Earings': '/category-earrings.png',
    'Bracelets': '/category-bracelets.png',
    'Bracelet': '/category-bracelets.png',
    'Bangles': '/category-bracelets.png',
    'Chain': '/category-chains.png',
    'Chains': '/category-chains.png',
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

  // Partial tag matching — 'new arrivals' includes 'new', 'bestseller' includes 'bestseller'
  const hasTag = (product, keyword) =>
    product.tags?.some(t => t.includes(keyword) || keyword.includes(t));

  const featured = products.filter(p => hasTag(p, 'featured') || hasTag(p, 'bestseller')).slice(0, 8);
  const newArrivals = products.filter(p => hasTag(p, 'new')).slice(0, 4);

  // If no tagged products, Best Sellers = first 4, New Arrivals = last 4 (no overlap)
  const displayProducts = featured.length > 0 ? featured : products.slice(0, 4);
  const remainingForNew = products.filter(p => !displayProducts.includes(p));
  const displayNew = newArrivals.length > 0 ? newArrivals : remainingForNew.slice(0, 4);

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
              <div className="hero-bg-image" style={{
                backgroundImage: 'url(/hero-jewellery.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'absolute',
                inset: 0,
                zIndex: 0,
              }} />
              <div className="hero-overlay" style={{ background: `linear-gradient(135deg, rgba(253,251,247,0.88) 0%, rgba(247,243,237,0.75) 40%, rgba(212,186,130,0.25) 100%)` }}></div>
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
              <div className="trust-icon">💎</div>
              <div className="trust-title">Certified Lab Grown Diamonds</div>
              <div className="trust-text">IGI-certified lab diamonds — real, ethical, and brilliant</div>
            </div>
            <div className="trust-item">
              <div className="trust-icon">✦</div>
              <div className="trust-title">9kt / 14kt / 18kt Gold</div>
              <div className="trust-text">Hallmarked gold & 925 sterling silver settings</div>
            </div>
            <div className="trust-item">
              <div className="trust-icon">🔒</div>
              <div className="trust-title">Secure Payments</div>
              <div className="trust-text">Protected by Razorpay — UPI, cards, net banking</div>
            </div>
            <div className="trust-item">
              <div className="trust-icon">🚚</div>
              <div className="trust-title">Free Insured Shipping</div>
              <div className="trust-text">Pan-India delivery with full insurance</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SHOP BY CATEGORY ── */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="section-divider"></div>
          <p className="section-subtitle">Lab Grown Diamond Jewellery for Every Occasion</p>

          <div className="categories-grid">
            {(categories.length > 0 ? categories : [
              { name: 'Rings', slug: 'rings', count: 0 },
              { name: 'Necklaces', slug: 'necklaces', count: 0 },
              { name: 'Earrings', slug: 'earrings', count: 0 },
              { name: 'Bracelets', slug: 'bracelets', count: 0 },
              { name: 'Pendants', slug: 'pendants', count: 0 },
            ]).slice(0, 5).map((cat) => (
              <Link key={cat.slug} href={`/shop?category=${cat.slug}`}>
                <div className="category-card">
                  <div
                    className="category-card-bg"
                    style={{
                      backgroundImage: categoryImages[cat.name]
                        ? `url(${categoryImages[cat.name]})`
                        : 'linear-gradient(135deg, #C5A467, #8B7355)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
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
              <img
                src="/story-image.png"
                alt="Noore Jewels — Lab Grown Diamond Jewellery"
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
                Noore Jewels brings you certified lab grown diamonds — real diamonds that are
                chemically, physically, and optically identical to mined diamonds. Set in
                hallmarked 9kt, 14kt, 18kt gold and 925 sterling silver, every piece is a
                masterwork of modern luxury.
              </p>
              <p className="story-text">
                From brilliant solitaire engagement rings to breathtaking diamond necklace sets,
                each piece is crafted to make you feel extraordinary. Because real luxury should
                be ethical and accessible to all.
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
            <p className="section-subtitle">Fresh From The Workshop</p>

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

      {/* ── WHY LAB GROWN DIAMONDS ── */}
      <section className="products-section">
        <div className="container">
          <h2 className="section-title">Why Lab Grown Diamonds?</h2>
          <div className="section-divider"></div>
          <p className="section-subtitle">The Smart Choice for Modern Luxury</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px', marginTop: '20px' }}>
            {[
              { icon: '💎', title: '100% Real Diamonds', text: 'Lab grown diamonds are chemically, physically, and optically identical to mined diamonds. Same hardness (10 on Mohs scale), same brilliance, same fire.' },
              { icon: '🌿', title: 'Ethical & Sustainable', text: 'No mining, no environmental damage, no conflict. Our diamonds are grown in controlled labs using advanced CVD/HPHT technology — guilt-free luxury.' },
              { icon: '📜', title: 'IGI Certified', text: 'Every diamond comes with an internationally recognized IGI certificate verifying cut, clarity, colour, and carat — complete transparency.' },
              { icon: '💰', title: '40-70% More Affordable', text: 'Lab grown diamonds cost 40-70% less than mined diamonds of the same quality. Get a bigger, better diamond for your budget.' },
            ].map((val, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '32px 20px', background: 'rgba(212,186,130,0.06)', borderRadius: '16px', border: '1px solid rgba(212,186,130,0.15)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '16px' }}>{val.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 400, marginBottom: '12px', letterSpacing: '0.04em' }}>
                  {val.title}
                </h3>
                <p style={{ fontSize: '0.83rem', fontWeight: 300, color: 'var(--color-text-light)', lineHeight: 1.8 }}>
                  {val.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHATSAPP CTA ── */}
      <section className="whatsapp-cta-section">
        <div className="container">
          <h2 className="section-title">Need Help Choosing?</h2>
          <div className="section-divider"></div>
          <p className="whatsapp-cta-text">
            Chat with our AI-powered WhatsApp assistant for personalised diamond recommendations, custom orders, and instant support.
          </p>
          <a
            href="https://wa.me/919217945235?text=Hi! I'm looking for lab grown diamond jewellery"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-lg whatsapp-cta-btn"
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
