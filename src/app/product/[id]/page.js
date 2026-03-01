'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import CartDrawer from '@/components/CartDrawer';
import ProductCard from '@/components/ProductCard';
import { CartProvider, useCart } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';

function ProductDetail({ params }) {
    const { id } = use(params);
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const { addItem } = useCart();

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            if (data.success) {
                const found = data.products.find(p => p.id === id);
                setProduct(found || null);
                setSelectedImage(0);

                // Get related products in same category
                if (found) {
                    const relatedProducts = data.products
                        .filter(p => p.category === found.category && p.id !== found.id)
                        .slice(0, 4);
                    setRelated(relatedProducts);
                }
            }
        } catch (err) {
            console.error('Error:', err);
        }
        setLoading(false);
    };

    const effectivePrice = product?.discount > 0
        ? product.price * (1 - product.discount / 100)
        : product?.price || 0;

    const productImages = product?.images || (product?.image ? [product.image] : []);

    const handleAddToCart = () => {
        if (product && product.stock) {
            addItem(product, quantity);
        }
    };

    const handleBuyNow = () => {
        if (product && product.stock) {
            addItem(product, quantity);
            window.location.href = '/checkout';
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="container" style={{ padding: '80px 24px' }}>
                    <div className="product-detail-grid">
                        <div className="skeleton" style={{ aspectRatio: '3/4', width: '100%' }} />
                        <div>
                            <div className="skeleton" style={{ height: '16px', width: '30%', marginBottom: '16px' }} />
                            <div className="skeleton" style={{ height: '32px', width: '80%', marginBottom: '16px' }} />
                            <div className="skeleton" style={{ height: '24px', width: '20%', marginBottom: '24px' }} />
                            <div className="skeleton" style={{ height: '100px', width: '100%', marginBottom: '24px' }} />
                            <div className="skeleton" style={{ height: '50px', width: '100%' }} />
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (!product) {
        return (
            <>
                <Navbar />
                <div style={{ textAlign: 'center', padding: '120px 24px' }}>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '16px' }}>Product Not Found</h1>
                    <p style={{ color: 'var(--color-text-light)', marginBottom: '24px' }}>The product you&apos;re looking for doesn&apos;t exist.</p>
                    <Link href="/shop" className="btn btn-primary">Browse Collection</Link>
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

            {/* Breadcrumb */}
            <div className="container" style={{ padding: '16px 24px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', letterSpacing: '0.08em' }}>
                    <Link href="/" style={{ color: 'var(--color-text-muted)' }}>Home</Link>
                    <span style={{ margin: '0 8px' }}>/</span>
                    <Link href="/shop" style={{ color: 'var(--color-text-muted)' }}>Shop</Link>
                    <span style={{ margin: '0 8px' }}>/</span>
                    <Link href={`/shop?category=${product.category.toLowerCase().replace(/\s+/g, '-')}`} style={{ color: 'var(--color-text-muted)' }}>
                        {product.category}
                    </Link>
                    <span style={{ margin: '0 8px' }}>/</span>
                    <span style={{ color: 'var(--color-text)' }}>{product.name}</span>
                </div>
            </div>

            {/* Product Detail */}
            <section className="product-detail">
                <div className="container">
                    <div className="product-detail-grid">
                        {/* Gallery */}
                        <div className="product-gallery">
                            <div className="product-gallery-main">
                                <img src={productImages[selectedImage] || product.image} alt={product.name} />
                            </div>
                            {productImages.length > 1 && (
                                <div style={{
                                    display: 'flex',
                                    gap: '8px',
                                    marginTop: '12px',
                                    overflowX: 'auto',
                                    paddingBottom: '4px',
                                }}>
                                    {productImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            style={{
                                                width: '64px',
                                                height: '64px',
                                                borderRadius: '6px',
                                                overflow: 'hidden',
                                                border: selectedImage === idx
                                                    ? '2px solid var(--color-rose-gold, #C5A467)'
                                                    : '1px solid var(--color-border, #E8E0D4)',
                                                cursor: 'pointer',
                                                padding: 0,
                                                background: 'var(--color-bg)',
                                                opacity: selectedImage === idx ? 1 : 0.6,
                                                transition: 'all 0.2s ease',
                                                flexShrink: 0,
                                            }}
                                        >
                                            <img
                                                src={img}
                                                alt={`${product.name} - view ${idx + 1}`}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="product-info">
                            <div className="product-info-category">{product.category}</div>
                            <h1 className="product-info-name">{product.name}</h1>

                            <div className="product-info-price">
                                {product.discount > 0 ? (
                                    <>
                                        <span style={{ textDecoration: 'line-through', color: 'var(--color-text-muted)', marginRight: '12px', fontSize: '1rem' }}>
                                            ₹{product.price.toLocaleString('en-IN')}
                                        </span>
                                        <span style={{ color: 'var(--color-rose-gold)', fontWeight: 500 }}>
                                            ₹{Math.round(effectivePrice).toLocaleString('en-IN')}
                                        </span>
                                        <span style={{ fontSize: '0.75rem', background: 'var(--color-rose-gold)', color: '#fff', padding: '2px 8px', marginLeft: '12px', fontWeight: 500 }}>
                                            {product.discount}% OFF
                                        </span>
                                    </>
                                ) : (
                                    <>₹{product.price.toLocaleString('en-IN')}</>
                                )}
                            </div>

                            <p className="product-info-desc">{product.description}</p>

                            {/* Quantity */}
                            {product.stock && (
                                <div className="product-qty">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                                    <span>{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="product-actions">
                                {product.stock ? (
                                    <>
                                        <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={handleAddToCart}>
                                            Add to Bag
                                        </button>
                                        <button className="btn btn-gold btn-lg" style={{ flex: 1 }} onClick={handleBuyNow}>
                                            Buy Now
                                        </button>
                                    </>
                                ) : (
                                    <button className="btn btn-outline btn-lg" disabled style={{ flex: 1, opacity: 0.5, cursor: 'not-allowed' }}>
                                        Sold Out
                                    </button>
                                )}
                            </div>

                            {/* WhatsApp */}
                            <a
                                href={`https://wa.me/919217945235?text=Hi! I'm interested in ${product.name} (${product.id})`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    padding: '12px', border: '1px solid #25D366', color: '#25D366',
                                    fontSize: '0.78rem', fontWeight: 500, letterSpacing: '0.1em',
                                    textTransform: 'uppercase', transition: 'all 0.3s ease', marginBottom: '24px'
                                }}
                            >
                                💬 Ask About This Product on WhatsApp
                            </a>

                            {/* Meta */}
                            <div className="product-meta">
                                <div className="product-meta-item">
                                    <strong>Product ID:</strong> <span>{product.id}</span>
                                </div>
                                <div className="product-meta-item">
                                    <strong>Category:</strong> <span>{product.category}</span>
                                </div>
                                <div className="product-meta-item">
                                    <strong>Availability:</strong> <span style={{ color: product.stock ? 'var(--color-success)' : 'var(--color-error)' }}>{product.stock ? 'In Stock' : 'Out of Stock'}</span>
                                </div>
                                <div className="product-meta-item">
                                    <strong>Shipping:</strong> <span>Free above ₹999</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Products */}
            {related.length > 0 && (
                <section className="products-section alt-bg">
                    <div className="container">
                        <h2 className="section-title">You May Also Like</h2>
                        <div className="section-divider"></div>
                        <div className="products-grid">
                            {related.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <Footer />
        </>
    );
}

export default function ProductPage({ params }) {
    return (
        <AuthProvider>
            <CartProvider>
                <ProductDetail params={params} />
            </CartProvider>
        </AuthProvider>
    );
}
