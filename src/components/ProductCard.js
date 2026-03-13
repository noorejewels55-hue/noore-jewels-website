'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';

// Wishlist helpers
function getWishlist() {
    if (typeof window === 'undefined') return [];
    try {
        return JSON.parse(localStorage.getItem('noore_wishlist') || '[]');
    } catch { return []; }
}

function toggleWishlist(productId) {
    const list = getWishlist();
    const idx = list.indexOf(productId);
    if (idx > -1) {
        list.splice(idx, 1);
    } else {
        list.push(productId);
    }
    localStorage.setItem('noore_wishlist', JSON.stringify(list));
    // Dispatch event so other cards update
    window.dispatchEvent(new Event('wishlistChange'));
    return list.includes(productId);
}

// Compact star display for product cards
function MiniStarRating({ rating, count }) {
    if (!rating || count === 0) return null;

    return (
        <div className="product-card-rating">
            <span style={{
                display: 'inline-flex',
                gap: '1px',
                fontSize: '12px',
                lineHeight: 1,
            }}>
                {[1, 2, 3, 4, 5].map(star => (
                    <span
                        key={star}
                        style={{
                            color: star <= Math.round(rating) ? '#C5A467' : '#DDD5C8',
                        }}
                    >
                        ★
                    </span>
                ))}
            </span>
            <span className="product-card-rating-count">({count})</span>
        </div>
    );
}

export default function ProductCard({ product, reviewSummary }) {
    const { addItem } = useCart();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [wishlisted, setWishlisted] = useState(false);
    const [addedToBag, setAddedToBag] = useState(false);

    useEffect(() => {
        setWishlisted(getWishlist().includes(product.id));
        const handler = () => setWishlisted(getWishlist().includes(product.id));
        window.addEventListener('wishlistChange', handler);
        return () => window.removeEventListener('wishlistChange', handler);
    }, [product.id]);

    const effectivePrice = product.discount > 0
        ? product.price * (1 - product.discount / 100)
        : product.price;

    const review = reviewSummary?.[product.id];

    const handleAddToBag = (e) => {
        e.stopPropagation();
        e.preventDefault();
        addItem(product);
        setAddedToBag(true);
        setTimeout(() => setAddedToBag(false), 1500);
    };

    const handleWishlist = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const isNowWishlisted = toggleWishlist(product.id);
        setWishlisted(isNowWishlisted);
    };

    return (
        <div className="product-card">
            <Link href={`/product/${product.id}`}>
                <div className="product-card-image">
                    {!imageLoaded && (
                        <div className="skeleton" style={{ width: '100%', height: '100%', position: 'absolute' }} />
                    )}
                    <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        onLoad={() => setImageLoaded(true)}
                        style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
                    />

                    {/* Badges */}
                    <div className="product-card-badges">
                        {product.tags?.includes('new') && <span className="badge badge-new">New</span>}
                        {product.discount > 0 && <span className="badge badge-sale">{product.discount}% Off</span>}
                        {!product.stock && <span className="badge badge-out-of-stock">Sold Out</span>}
                    </div>
                </div>
            </Link>

            {/* Quick Add — desktop hover only */}
            {product.stock && (
                <div className="product-card-quick">
                    <button onClick={handleAddToBag}>
                        {addedToBag ? '✓ Added!' : 'Add to Bag'}
                    </button>
                </div>
            )}

            {/* Wishlist heart — always visible on mobile */}
            <button
                className={`product-card-wishlist ${wishlisted ? 'wishlisted' : ''}`}
                title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                onClick={handleWishlist}
            >
                {wishlisted ? '♥' : '♡'}
            </button>

            {/* Info */}
            <Link href={`/product/${product.id}`}>
                <div className="product-card-info">
                    <div className="product-card-name">{product.name}</div>
                    <div className="product-card-price">
                        {product.discount > 0 ? (
                            <>
                                <span className="original-price">₹{product.price.toLocaleString('en-IN')}</span>
                                <span className="sale-price">₹{Math.round(effectivePrice).toLocaleString('en-IN')}</span>
                            </>
                        ) : (
                            <>₹{product.price.toLocaleString('en-IN')}</>
                        )}
                    </div>
                    {/* Star Rating */}
                    <MiniStarRating
                        rating={review?.averageRating || 0}
                        count={review?.totalReviews || 0}
                    />
                </div>
            </Link>

            {/* Mobile Add to Bag — OUTSIDE the Link so taps work */}
            {product.stock && (
                <button 
                    className="mobile-add-to-bag"
                    onClick={handleAddToBag}
                >
                    {addedToBag ? '✓ Added' : '+ Add to Bag'}
                </button>
            )}
        </div>
    );
}
