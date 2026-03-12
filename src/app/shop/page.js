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

    useEffect(() => {
        setActiveCategory(categoryParam);
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
    }, [activeCategory, activeCollection, sort, tagParam]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (activeCategory !== 'all') params.set('category', activeCategory);
            if (sort !== 'default') params.set('sort', sort);
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
                            placeholder="Search jewellery..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{ flex: 1 }}
                        />
                        <button type="submit" className="btn btn-primary btn-sm">Search</button>
                    </div>
                </form>

                {/* Category Filters */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '16px' }}>
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

                {/* Collection Filters */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '32px' }}>
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
                            }}
                        >
                            {col.label}
                        </button>
                    ))}
                </div>

                {/* Toolbar */}
                <div className="shop-toolbar">
                    <span className="shop-count">{products.length} products</span>
                    <div className="shop-sort">
                        <select value={sort} onChange={e => setSort(e.target.value)}>
                            <option value="default">Sort by: Featured</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
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
                    <div className="products-grid">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} reviewSummary={reviewSummary} />
                        ))}
                    </div>
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
