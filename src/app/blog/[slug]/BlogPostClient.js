'use client';

import { use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import CartDrawer from '@/components/CartDrawer';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { blogPosts } from '@/lib/blogData';

function BlogPostContent({ params }) {
  const { slug } = use(params);
  const post = blogPosts.find(p => p.slug === slug);
  const relatedPosts = blogPosts.filter(p => p.slug !== slug && p.category === post?.category).slice(0, 3);

  if (!post) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '120px 20px' }}>
          <h1>Post Not Found</h1>
          <Link href="/blog" className="btn btn-primary" style={{ marginTop: '24px', display: 'inline-block' }}>Back to Blog</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <AuthModal />
      <CartDrawer />

      {/* Article Header */}
      <article className="blog-article">
        <div className="blog-article-header">
          <div className="container">
            <div className="blog-back-link-wrap">
              <Link href="/blog" className="blog-back-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Back to Journal
              </Link>
            </div>
            <span className="blog-article-category">{post.category}</span>
            <h1 className="blog-article-title">{post.title}</h1>
            <div className="blog-article-meta">
              <span>By Noore Jewels</span>
              <span className="blog-card-dot">•</span>
              <span>{post.date}</span>
              <span className="blog-card-dot">•</span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="blog-article-body">
          <div className="container blog-article-container">
            {post.image && (
              <div className="blog-article-featured-image-wrap">
                <img src={post.image} alt={post.title} className="blog-article-featured-image" />
              </div>
            )}
            <div className="blog-article-content" dangerouslySetInnerHTML={{ __html: post.content }} />

            {/* Share & CTA */}
            <div className="blog-article-cta">
              <div className="blog-cta-inner">
                <h3>Ready to Find Your Perfect Ring?</h3>
                <p>Browse our collection of IGI certified lab-grown diamond rings in 9kt, 14kt &amp; 18kt BIS hallmarked gold.</p>
                <div className="blog-cta-actions">
                  <Link href="/shop" className="btn btn-primary">Shop Collection</Link>
                  <a href="https://wa.me/918076735450?text=Hi! I just read your blog and I'm interested in your rings" target="_blank" rel="noopener noreferrer" className="btn btn-outline">💬 Chat on WhatsApp</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="blog-related">
          <div className="container">
            <h2 className="blog-related-title">More from {post.category}</h2>
            <div className="blog-related-grid">
              {relatedPosts.map(rp => (
                <Link href={`/blog/${rp.slug}`} key={rp.slug} className="blog-card">
                  <div className="blog-card-image-wrap">
                    <div 
                      className="blog-card-image" 
                      style={{ 
                        backgroundImage: rp.image ? `url(${rp.image})` : 'none',
                        background: rp.image ? undefined : rp.gradient,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      {!rp.image && <span className="blog-card-emoji">{rp.emoji}</span>}
                    </div>
                  </div>
                  <div className="blog-card-body">
                    <h3 className="blog-card-title" style={{ fontSize: '1rem' }}>{rp.title}</h3>
                    <div className="blog-card-read">
                      Read Article
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}

export default function BlogPostPage({ params }) {
  return (
    <AuthProvider>
      <CartProvider>
        <BlogPostContent params={params} />
      </CartProvider>
    </AuthProvider>
  );
}
