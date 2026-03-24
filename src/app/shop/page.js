'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import CartDrawer from '@/components/CartDrawer';
import ProductCard from '@/components/ProductCard';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';

const PRODUCTS_PER_PAGE = 20;

function ShopContent() {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get('category') || 'all';
    const tagParam = searchParams.get('tag') || '';
    const searchParam = searchParams.get('search') || '';

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [reviewSummary, setReviewSummary] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState(categoryParam);
    const [activeCollection, setActiveCollection] = useState('');
    const [sort, setSort] = useState('default');
    const [searchQuery, setSearchQuery] = useState(searchParam);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setActiveCategory(categoryParam);
        setCurrentPage(1);
    }, [categoryParam]);

    // Fetch review summaries once on mount (they don't change with filters)
    useEffect(() => {
        fetch('/api/reviews/summary')
            .then(res => res.json())
            .then(data => {
                if (data.success) setReviewSummary(data.summary);
            })
            .catch(err => console.error('Reviews summary error:', err));
    }, []);

    useEffect(() => {
        fetchProducts();
        setCurrentPage(1);
    }, [activeCategory, activeCollection, sort, tagParam]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (activeCategory !== 'all') params.set('category', activeCategory);
            if (sort !== 'default' && sort !== 'top-rated' && sort !== 'most-reviewed') params.set('sort', sort);
            if (activeCollection) params.set('tag', activeCollection);
            else if (tagParam) params.set('tag', tagParam);
            if (searchQuery) params.set('search', searchQuery);

            const res = await fetch(`/api/products?${params.toString()}`);
            const data = await res.json();
            if (data.success) {
                setProducts(data.products);
                setCategories(data.categories);
            }
        } catch (err) {
            console.error('Error:', err);
        }
        setLoading(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchProducts();
    };

    const getPageTitle = () => {
        if (activeCollection === 'wedding') return '💍 Wedding Collection';
        if (activeCollection === 'daily') return '✨ Daily Wear';
        if (activeCollection === 'gift') return '🎁 Gift Collection';
        if (tagParam === 'new') return 'New Arrivals';
        if (tagParam === 'bestseller') return 'Best Sellers';
        if (activeCategory !== 'all') {
            return activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1).replace(/-/g, ' ');
        }
        return 'All Jewellery';
    };

    // Sort products (client-side for review-based sorts)
    const sortedProducts = (sort === 'top-rated' || sort === 'most-reviewed')
        ? [...products].sort((a, b) => {
            const ra = reviewSummary?.[a.id] || { averageRating: 0, totalReviews: 0 };
            const rb = reviewSummary?.[b.id] || { averageRating: 0, totalReviews: 0 };
            if (sort === 'top-rated') return rb.averageRating - ra.averageRating || rb.totalReviews - ra.totalReviews;
            return rb.totalReviews - ra.totalReviews || rb.averageRating - ra.averageRating;
        })
        : products;

    // Pagination
    const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const paginatedProducts = sortedProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goToPage = (page) => {
        setCurrentPage(page);
        scrollToTop();
    };

    // Generate page numbers to show (with ellipsis)
    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('...');
            for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                pages.push(i);
            }
            if (currentPage < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <>
            <Navbar />
            <AuthModal />
            <CartDrawer />

            {/* Page Header */}
            <div className="shop-header">
                <h1>{getPageTitle()}</h1>
            </div>

            <div className="container" style={{ paddingTop: '24px', paddingBottom: '80px' }}>
                {/* Search Bar */}
                <form onSubmit={handleSearch} style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', gap: '8px', maxWidth: '500px', margin: '0 auto' }}>
                        <input
                            type="text"
                            className="auth-input"
                            placeholder="Search diamond jewellery..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{ flex: 1 }}
                        />
                        <button type="submit" className="btn btn-primary btn-sm">Search</button>
                    </div>
                </form>

                {/* Category Filters */}
                <div className="shop-filters-container" style={{ marginBottom: '16px' }}>
                    <div className="shop-filters-scroll">
                        <button
                            className={`btn btn-sm ${activeCategory === 'all' && !activeCollection ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => { setActiveCategory('all'); setActiveCollection(''); }}
                        >
                            All
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.slug}
                                className={`btn btn-sm ${activeCategory === cat.slug && !activeCollection ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => { setActiveCategory(cat.slug); setActiveCollection(''); }}
                            >
                                {cat.name} ({cat.count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Collection Filters */}
                <div className="shop-filters-container" style={{ marginBottom: '32px' }}>
                    <div className="shop-filters-scroll">
                        {[
                            { key: 'wedding', label: '💍 Wedding', emoji: '' },
                            { key: 'daily', label: '✨ Daily Wear', emoji: '' },
                            { key: 'gift', label: '🎁 Gifting', emoji: '' },
                            { key: 'bestseller', label: '🏆 Best Sellers', emoji: '' },
                            { key: 'new', label: '🆕 New Arrivals', emoji: '' },
                        ].map(col => (
                            <button
                                key={col.key}
                                className={`btn btn-sm ${activeCollection === col.key ? 'btn-gold' : 'btn-outline'}`}
                                onClick={() => {
                                    setActiveCollection(activeCollection === col.key ? '' : col.key);
                                    setActiveCategory('all');
                                }}
                                style={{
                                    borderRadius: '20px',
                                    fontSize: '0.75rem',
                                    padding: '6px 16px',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {col.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Toolbar */}
                <div className="shop-toolbar">
                    <span className="shop-count">
                        {products.length} products
                        {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
                    </span>
                    <div className="shop-sort">
                        <select value={sort} onChange={e => setSort(e.target.value)}>
                            <option value="default">Sort by: Featured</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="top-rated">Top Rated</option>
                            <option value="most-reviewed">Most Reviewed</option>
                            <option value="name-asc">Name: A to Z</option>
                            <option value="newest">Newest First</option>
                        </select>
                    </div>
                </div>

                {/* Products */}
                {loading ? (
                    <div className="products-grid">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="product-card">
                                <div className="product-card-image"><div className="skeleton" style={{ width: '100%', height: '100%' }} /></div>
                                <div className="product-card-info">
                                    <div className="skeleton" style={{ height: '16px', width: '80%', margin: '0 auto 8px' }} />
                                    <div className="skeleton" style={{ height: '14px', width: '40%', margin: '0 auto' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>
                            No products found
                        </p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', marginBottom: '24px' }}>
                            Try a different category or search term
                        </p>
                        <button className="btn btn-outline" onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}>
                            View All
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="products-grid">
                            {paginatedProducts.map(product => (
                                <ProductCard key={product.id} product={product} reviewSummary={reviewSummary} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '6px',
                                marginTop: '48px',
                                flexWrap: 'wrap',
                            }}>
                                {/* Prev */}
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    style={{
                                        padding: '10px 16px',
                                        border: '1px solid var(--color-border, #E8E0D4)',
                                        borderRadius: '8px',
                                        background: currentPage === 1 ? 'transparent' : 'var(--color-bg, #fff)',
                                        color: currentPage === 1 ? 'var(--color-text-muted)' : 'var(--color-text)',
                                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                        fontSize: '0.82rem',
                                        fontWeight: 500,
                                        transition: 'all 0.2s ease',
                                        opacity: currentPage === 1 ? 0.4 : 1,
                                    }}
                                >
                                    ← Prev
                                </button>

                                {/* Page Numbers */}
                                {getPageNumbers().map((page, idx) => (
                                    page === '...' ? (
                                        <span key={`ellipsis-${idx}`} style={{
                                            padding: '10px 6px',
                                            fontSize: '0.82rem',
                                            color: 'var(--color-text-muted)',
                                        }}>
                                            …
                                        </span>
                                    ) : (
                                        <button
                                            key={page}
                                            onClick={() => goToPage(page)}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                border: currentPage === page
                                                    ? '1.5px solid var(--color-gold, #C5A467)'
                                                    : '1px solid var(--color-border, #E8E0D4)',
                                                borderRadius: '8px',
                                                background: currentPage === page
                                                    ? 'var(--color-gold, #C5A467)'
                                                    : 'var(--color-bg, #fff)',
                                                color: currentPage === page ? '#fff' : 'var(--color-text)',
                                                cursor: 'pointer',
                                                fontSize: '0.82rem',
                                                fontWeight: currentPage === page ? 600 : 400,
                                                transition: 'all 0.2s ease',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {page}
                                        </button>
                                    )
                                ))}

                                {/* Next */}
                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    style={{
                                        padding: '10px 16px',
                                        border: '1px solid var(--color-border, #E8E0D4)',
                                        borderRadius: '8px',
                                        background: currentPage === totalPages ? 'transparent' : 'var(--color-bg, #fff)',
                                        color: currentPage === totalPages ? 'var(--color-text-muted)' : 'var(--color-text)',
                                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                        fontSize: '0.82rem',
                                        fontWeight: 500,
                                        transition: 'all 0.2s ease',
                                        opacity: currentPage === totalPages ? 0.4 : 1,
                                    }}
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <Footer />
        </>
    );
}

export default function ShopPage() {
    return (
        <AuthProvider>
            <CartProvider>
                <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
                    <ShopContent />
                </Suspense>
            </CartProvider>
        </AuthProvider>
    );
}
