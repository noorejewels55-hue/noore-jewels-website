'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState, useEffect, useRef, useCallback } from 'react';

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
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef(null);
    const videoNodeRef = useRef(null);

    // IntersectionObserver: detect when this card enters/leaves viewport
    useEffect(() => {
        if (!product.video) return; // skip observer for image-only cards
        const el = cardRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                    // Pause and release video memory when off-screen
                    if (videoNodeRef.current) {
                        videoNodeRef.current.pause();
                    }
                }
            },
            { rootMargin: '200px' } // start loading 200px before card enters view
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [product.video]);

    // Ref callback to capture the DOM node
    const videoRefCallback = useCallback((node) => {
        videoNodeRef.current = node;
        if (node) {
            node.muted = true;
        }
    }, []);

    // Explicitly load and play/pause based on visibility
    useEffect(() => {
        if (!product.video) return;
        const video = videoNodeRef.current;
        if (!video) return;

        if (isVisible) {
            // Only set src and load if it's not already matching
            if (!video.src || !video.src.includes(product.video)) {
                video.src = product.video;
                video.load();
            }
            video.play().catch((err) => {
                console.log("Autoplay failed:", err);
            });
        } else {
            video.pause();
            // Clear source to release network and memory resources
            video.removeAttribute('src');
            try {
                video.load();
            } catch (e) {}
        }
    }, [isVisible, product.video]);

    useEffect(() => {
        setWishlisted(getWishlist().includes(product.id));
        const handler = () => setWishlisted(getWishlist().includes(product.id));
        window.addEventListener('wishlistChange', handler);
        return () => window.removeEventListener('wishlistChange', handler);
    }, [product.id]);

    // Use defaultPrice (9kt calculated price) if available, otherwise fallback
    const displayPrice = product.defaultPrice || (product.discount > 0
        ? Math.round(product.price * (1 - product.discount / 100))
        : product.price);

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
        <div className="product-card" ref={cardRef}>
            <Link href={`/product/${product.id}`}>
                <div className="product-card-image">
                    {product.video ? (
                        <>
                            {/* Show poster image as background while video loads */}
                            <img
                                src={product.image}
                                alt={product.name}
                                style={{
                                    width: '100%', height: '100%', objectFit: 'cover',
                                    position: 'absolute', top: 0, left: 0, zIndex: 0,
                                }}
                            />
                            {/* Video element is always in the DOM but loads src dynamically */}
                            <video
                                ref={videoRefCallback}
                                poster={product.image}
                                preload="auto"
                                playsInline
                                muted
                                defaultMuted={true}
                                loop
                                autoPlay
                                style={{
                                    width: '100%', height: '100%', objectFit: 'cover',
                                    position: 'relative', zIndex: 1,
                                    opacity: isVisible ? 1 : 0,
                                    transition: 'opacity 0.3s ease',
                                }}
                            />
                        </>
                    ) : (
                        <>
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
                        </>
                    )}

                    {/* Badges */}
                    <div className="product-card-badges">
                        {product.tags?.includes('new') && <span className="badge badge-new">New</span>}
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
                        {product.hasLivePrice ? (
                            <>
                                <span className="sale-price">₹{displayPrice.toLocaleString('en-IN')}</span>
                                <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginLeft: '4px' }}>(9kt)</span>
                            </>
                        ) : product.discount > 0 ? (
                            <>
                                <span className="original-price">₹{product.price.toLocaleString('en-IN')}</span>
                                <span className="sale-price">₹{displayPrice.toLocaleString('en-IN')}</span>
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
