'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function ProductCard({ product }) {
    const { addItem } = useCart();
    const [imageLoaded, setImageLoaded] = useState(false);

    const effectivePrice = product.discount > 0
        ? product.price * (1 - product.discount / 100)
        : product.price;

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

            {/* Quick Add */}
            {product.stock && (
                <div className="product-card-quick">
                    <button onClick={(e) => { e.stopPropagation(); addItem(product); }}>
                        Add to Bag
                    </button>
                </div>
            )}

            {/* Wishlist */}
            <button className="product-card-wishlist" title="Add to wishlist">♡</button>

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
                </div>
            </Link>
        </div>
    );
}
