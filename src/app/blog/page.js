'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import CartDrawer from '@/components/CartDrawer';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { blogPosts } from '@/lib/blogData';

function BlogListing() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', ...new Set(blogPosts.map(p => p.category))];

  const filtered = selectedCategory === 'All'
    ? blogPosts
    : blogPosts.filter(p => p.category === selectedCategory);

  return (
    <>
      <Navbar />
      <AuthModal />
      <CartDrawer />

      {/* Hero */}
      <section className="blog-hero">
        <div className="container">
          <div className="blog-hero-badge">The Noore Journal</div>
          <h1 className="blog-hero-title">Diamond Knowledge &amp; Style Guides</h1>
          <p className="blog-hero-subtitle">Expert insights on lab-grown diamonds, ring styling, gold purity, and everything you need to make the perfect jewellery choice.</p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="blog-filters">
        <div className="container">
          <div className="blog-filter-row">
            {categories.map(cat => (
              <button
                key={cat}
                className={`blog-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="blog-grid-section">
        <div className="container">
          <div className="blog-grid">
            {filtered.map((post, i) => (
              <Link href={`/blog/${post.slug}`} key={post.slug} className="blog-card">
                <div className="blog-card-image-wrap">
                  <div className="blog-card-image" style={{ background: post.gradient }}>
                    <span className="blog-card-emoji">{post.emoji}</span>
                  </div>
                  <span className="blog-card-category">{post.category}</span>
                </div>
                <div className="blog-card-body">
                  <div className="blog-card-meta">
                    <span>{post.date}</span>
                    <span className="blog-card-dot">•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="blog-card-title">{post.title}</h2>
                  <p className="blog-card-excerpt">{post.excerpt}</p>
                  <div className="blog-card-read">
                    Read Article
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default function BlogPage() {
  return (
    <AuthProvider>
      <CartProvider>
        <BlogListing />
      </CartProvider>
    </AuthProvider>
  );
}
