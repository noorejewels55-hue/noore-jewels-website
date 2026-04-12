'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import CartDrawer from '@/components/CartDrawer';
import ProductCard from '@/components/ProductCard';
import ReviewSection from '@/components/ReviewSection';
import { CartProvider, useCart } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';

// Calculate dispatch countdown — if before 4 PM, "dispatch today"
function getDispatchText() {
    const now = new Date();
    const hour = now.getHours();
    if (hour < 16) {
        const hoursLeft = 16 - hour;
        return `Order within ${hoursLeft}h for same-day dispatch`;
    }
    return 'Order now for next-day dispatch';
}

function ProductDetail({ params }) {
    const { id } = use(params);
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [zoomStyle, setZoomStyle] = useState({});
    const [isZooming, setIsZooming] = useState(false);
    const [priceBreakdown, setPriceBreakdown] = useState(null);
    const [pricingInfo, setPricingInfo] = useState(null);
    const [selectedMetal, setSelectedMetal] = useState('9K Gold');
    const [selectedColor, setSelectedColor] = useState('Yellow Gold');
    const [selectedRingSize, setSelectedRingSize] = useState('');
    const { addItem } = useCart();

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            // Fetch only this specific product (not all products)
            const res = await fetch(`/api/products?id=${id}`);
            const data = await res.json();
            if (data.success) {
                setProduct(data.product || null);
                setSelectedImage(0);
                setRelated(data.related || []);
            }
        } catch (err) {
            console.error('Error:', err);
        }
        setLoading(false);
    };

    // Fetch pricing tables when product loads
    useEffect(() => {
        if (product && (product.goldWeight || product.diamondCarat)) {
            fetch(`/api/pricing?productId=${product.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.pricingInfo) {
                        setPricingInfo(data.pricingInfo);
                    }
                })
                .catch(err => console.error('Pricing error:', err));
        }
    }, [product]);

    // Calculate price breakdown client-side whenever selections change
    useEffect(() => {
        if (!pricingInfo) { setPriceBreakdown(null); return; }

        const goldRate = pricingInfo.goldRates[selectedMetal] || 0;
        const goldPrice = Math.round(goldRate * (pricingInfo.goldWeight || 0));

        // Diamond price
        const diamondInfo = pricingInfo.diamondOptions?.find(d => d.qualityGrade === pricingInfo.diamondQuality);
        const diamondPricePerCarat = diamondInfo?.pricePerCarat || 0;
        const diamondDiscount = diamondInfo?.discount || 0;
        const diamondBasePrice = Math.round(diamondPricePerCarat * (pricingInfo.diamondCarat || 0));
        const diamondDiscountAmount = Math.round(diamondBasePrice * diamondDiscount / 100);
        const diamondFinalPrice = diamondBasePrice - diamondDiscountAmount;

        // Making charges = flat rate per gram × gold weight (e.g. ₹1200/g × 2.4g = ₹2,880)
        const makingCharges = Math.round((pricingInfo.goldWeight || 0) * (pricingInfo.makingRatePerGram || 0));
        // GST applies on gold + diamond + making charges only (not certification)
        const gstBase = goldPrice + diamondFinalPrice + makingCharges;
        const gst = Math.round(gstBase * (pricingInfo.gstPercent || 3) / 100);
        const total = gstBase + gst + (pricingInfo.certification || 0);

        setPriceBreakdown({
            goldWeight: pricingInfo.goldWeight,
            goldRate,
            goldPrice,
            diamondCarat: pricingInfo.diamondCarat,
            diamondQuality: pricingInfo.diamondQuality,
            diamondTag: diamondInfo?.tag || '',
            diamondBasePrice,
            diamondDiscountAmount,
            diamondFinalPrice,
            numDiamonds: pricingInfo.numDiamonds || 1,
            makingCharges,
            shipping: pricingInfo.shipping || 0,
            certification: pricingInfo.certification || 0,
            gstPercent: pricingInfo.gstPercent || 3,
            gst,
            total,
        });
    }, [pricingInfo, selectedMetal]);

    const effectivePrice = product?.discount > 0
        ? product.price * (1 - product.discount / 100)
        : product?.price || 0;

    const productImages = product?.images || (product?.image ? [product.image] : []);

    const handleAddToCart = () => {
        if (product && product.stock) {
            // Build a customized product with dynamic pricing if available
            const cartProduct = { ...product };
            if (priceBreakdown && priceBreakdown.total > 0) {
                // Override static price with the dynamically calculated total
                cartProduct.price = priceBreakdown.total;
                cartProduct.discount = 0; // discount already factored into priceBreakdown.total
                cartProduct.customization = {
                    metal: selectedMetal,
                    color: selectedColor,
                    ringSize: selectedRingSize || null,
                };
            }
            addItem(cartProduct, quantity);
            // Meta Pixel: Track AddToCart
            if (typeof fbq !== 'undefined') {
                fbq('track', 'AddToCart', {
                    content_name: product.name,
                    content_ids: [product.id],
                    content_type: 'product',
                    value: priceBreakdown ? priceBreakdown.total : effectivePrice,
                    currency: 'INR',
                });
            }
        }
    };

    const handleBuyNow = () => {
        if (product && product.stock) {
            // Build a customized product with dynamic pricing if available
            const cartProduct = { ...product };
            if (priceBreakdown && priceBreakdown.total > 0) {
                cartProduct.price = priceBreakdown.total;
                cartProduct.discount = 0;
                cartProduct.customization = {
                    metal: selectedMetal,
                    color: selectedColor,
                    ringSize: selectedRingSize || null,
                };
            }
            addItem(cartProduct, quantity);
            // Meta Pixel: Track InitiateCheckout
            if (typeof fbq !== 'undefined') {
                fbq('track', 'InitiateCheckout', {
                    content_name: product.name,
                    content_ids: [product.id],
                    value: priceBreakdown ? priceBreakdown.total : effectivePrice,
                    currency: 'INR',
                });
            }
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

            {/* Dynamic SEO title and meta for this product */}
            {product && (
                <head>
                    <title>{`${product.name} — IGI Certified Lab Grown Diamond | 9kt 14kt 18kt Gold | Noore Jewels`}</title>
                    <meta name="description" content={`Buy ${product.name} online at Noore Jewels. IGI certified Lab Grown Diamond ${product.category.toLowerCase()} in 9kt, 14kt, 18kt BIS hallmarked gold. ${product.description?.slice(0, 120) || 'Premium quality, lifetime warranty, free shipping.'}`} />
                    <meta property="og:title" content={`${product.name} — Noore Jewels`} />
                    <meta property="og:description" content={product.description?.slice(0, 150) || `IGI certified Lab Grown Diamond ${product.category}`} />
                    <meta property="og:image" content={product.image} />
                    <meta property="og:url" content={`https://noorejewels.in/product/${product.id}`} />
                    <link rel="canonical" href={`https://noorejewels.in/product/${product.id}`} />
                </head>
            )}

            {/* Product JSON-LD for Google Rich Results */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Product",
                        "name": `${product.name} — Lab Grown Diamond ${product.category}`,
                        "description": product.description || `${product.name} — IGI Certified Lab Grown Diamond ${product.category} by Noore Jewels. Available in 9kt, 14kt, 18kt BIS hallmarked gold.`,
                        "image": product.images || [product.image],
                        "sku": product.id,
                        "brand": {
                            "@type": "Brand",
                            "name": "Noore Jewels"
                        },
                        "category": `Lab Grown Diamond ${product.category}`,
                        "material": "9kt / 14kt / 18kt BIS Hallmarked Gold with IGI Certified Lab Grown Diamond",
                        "additionalProperty": [
                            {
                                "@type": "PropertyValue",
                                "name": "Diamond Certification",
                                "value": "IGI Certified"
                            },
                            {
                                "@type": "PropertyValue",
                                "name": "Gold Hallmark",
                                "value": "BIS Hallmarked"
                            },
                            ...(product.goldWeight ? [{
                                "@type": "PropertyValue",
                                "name": "Gold Weight",
                                "value": `${product.goldWeight}g`
                            }] : []),
                            ...(product.diamondCarat ? [{
                                "@type": "PropertyValue",
                                "name": "Diamond Carat",
                                "value": `${product.diamondCarat} ct`
                            }] : []),
                        ],
                        "offers": {
                            "@type": "AggregateOffer",
                            "url": `https://noorejewels.in/product/${product.id}`,
                            "priceCurrency": "INR",
                            "lowPrice": priceBreakdown?.total || product.defaultPrice || effectivePrice,
                            "highPrice": Math.round((priceBreakdown?.total || product.defaultPrice || effectivePrice) * 2.2),
                            "offerCount": 3,
                            "availability": product.stock
                                ? "https://schema.org/InStock"
                                : "https://schema.org/OutOfStock",
                            "seller": {
                                "@type": "Organization",
                                "name": "Noore Jewels"
                            },
                            "hasMerchantReturnPolicy": {
                                "@type": "MerchantReturnPolicy",
                                "merchantReturnDays": 7,
                                "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
                                "returnFees": "https://schema.org/FreeReturn"
                            },
                            "shippingDetails": {
                                "@type": "OfferShippingDetails",
                                "shippingRate": {
                                    "@type": "MonetaryAmount",
                                    "value": "0",
                                    "currency": "INR"
                                },
                                "shippingDestination": {
                                    "@type": "DefinedRegion",
                                    "addressCountry": "IN"
                                }
                            }
                        },
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.9",
                            "reviewCount": "50",
                            "bestRating": "5"
                        }
                    })
                }}
            />

            {/* Breadcrumb JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://noorejewels.in" },
                            { "@type": "ListItem", "position": 2, "name": "Shop Diamond Rings", "item": "https://noorejewels.in/shop" },
                            { "@type": "ListItem", "position": 3, "name": product.category, "item": `https://noorejewels.in/shop?category=${product.category.toLowerCase().replace(/\s+/g, '-')}` },
                            { "@type": "ListItem", "position": 4, "name": product.name, "item": `https://noorejewels.in/product/${product.id}` },
                        ]
                    })
                }}
            />

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
                            <div
                                className="product-gallery-main"
                                style={{ position: 'relative', overflow: 'hidden', cursor: isZooming ? 'zoom-in' : (productImages.length > 1 ? 'grab' : 'zoom-in'), userSelect: 'none' }}
                                onMouseMove={(e) => {
                                    // Desktop hover-zoom
                                    if (window.innerWidth < 768) return;
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                                    setZoomStyle({ transformOrigin: `${x}% ${y}%`, transform: 'scale(2.5)' });
                                    setIsZooming(true);
                                }}
                                onMouseLeave={(e) => {
                                    setZoomStyle({});
                                    setIsZooming(false);
                                    e.currentTarget._mouseStartX = null;
                                    e.currentTarget.style.cursor = productImages.length > 1 ? 'grab' : 'zoom-in';
                                }}
                                onTouchStart={(e) => {
                                    if (productImages.length <= 1) return;
                                    const touch = e.touches[0];
                                    e.currentTarget._touchStartX = touch.clientX;
                                    e.currentTarget._touchStartY = touch.clientY;
                                    e.currentTarget._isSwiping = false;
                                }}
                                onTouchMove={(e) => {
                                    if (productImages.length <= 1 || !e.currentTarget._touchStartX) return;
                                    const touch = e.touches[0];
                                    const diffX = Math.abs(touch.clientX - e.currentTarget._touchStartX);
                                    const diffY = Math.abs(touch.clientY - e.currentTarget._touchStartY);
                                    if (diffX > diffY && diffX > 10) {
                                        e.currentTarget._isSwiping = true;
                                    }
                                }}
                                onTouchEnd={(e) => {
                                    if (productImages.length <= 1 || !e.currentTarget._touchStartX) return;
                                    const touchEndX = e.changedTouches[0].clientX;
                                    const diff = e.currentTarget._touchStartX - touchEndX;
                                    if (e.currentTarget._isSwiping && Math.abs(diff) > 50) {
                                        if (diff > 0) {
                                            setSelectedImage(prev => Math.min(prev + 1, productImages.length - 1));
                                        } else {
                                            setSelectedImage(prev => Math.max(prev - 1, 0));
                                        }
                                    }
                                    e.currentTarget._touchStartX = null;
                                    e.currentTarget._isSwiping = false;
                                }}
                                onMouseDown={(e) => {
                                    if (productImages.length <= 1) return;
                                    e.currentTarget._mouseStartX = e.clientX;
                                    e.currentTarget.style.cursor = 'grabbing';
                                }}
                                onMouseUp={(e) => {
                                    if (productImages.length <= 1 || !e.currentTarget._mouseStartX) return;
                                    const diff = e.currentTarget._mouseStartX - e.clientX;
                                    if (Math.abs(diff) > 50) {
                                        if (diff > 0) {
                                            setSelectedImage(prev => Math.min(prev + 1, productImages.length - 1));
                                        } else {
                                            setSelectedImage(prev => Math.max(prev - 1, 0));
                                        }
                                    }
                                    e.currentTarget._mouseStartX = null;
                                    e.currentTarget.style.cursor = 'grab';
                                }}
                            >
                                <img
                                    src={productImages[selectedImage] || product.image}
                                    alt={product.name}
                                    draggable={false}
                                    style={{ pointerEvents: 'none', transition: isZooming ? 'none' : 'transform 0.3s ease', ...zoomStyle }}
                                />

                                {/* Arrow Buttons (desktop) */}
                                {productImages.length > 1 && (
                                    <>
                                        {selectedImage > 0 && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => prev - 1); }}
                                                aria-label="Previous image"
                                                style={{
                                                    position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                                                    width: '40px', height: '40px', borderRadius: '50%',
                                                    background: 'rgba(255,255,255,0.9)', border: '1px solid #E8E0D4',
                                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '1.1rem', color: '#333', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                    transition: 'all 0.2s ease', zIndex: 2,
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.background = '#fff'}
                                                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
                                            >
                                                ‹
                                            </button>
                                        )}
                                        {selectedImage < productImages.length - 1 && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => prev + 1); }}
                                                aria-label="Next image"
                                                style={{
                                                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                                                    width: '40px', height: '40px', borderRadius: '50%',
                                                    background: 'rgba(255,255,255,0.9)', border: '1px solid #E8E0D4',
                                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '1.1rem', color: '#333', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                    transition: 'all 0.2s ease', zIndex: 2,
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.background = '#fff'}
                                                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
                                            >
                                                ›
                                            </button>
                                        )}

                                        {/* Dot indicators */}
                                        <div style={{
                                            position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
                                            display: 'flex', gap: '8px', zIndex: 2,
                                        }}>
                                            {productImages.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={(e) => { e.stopPropagation(); setSelectedImage(idx); }}
                                                    aria-label={`View image ${idx + 1}`}
                                                    style={{
                                                        width: selectedImage === idx ? '20px' : '8px',
                                                        height: '8px',
                                                        borderRadius: '4px',
                                                        border: 'none',
                                                        background: selectedImage === idx ? 'var(--color-gold, #C5A467)' : 'rgba(255,255,255,0.7)',
                                                        cursor: 'pointer',
                                                        padding: 0,
                                                        transition: 'all 0.3s ease',
                                                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                                    }}
                                                />
                                            ))}
                                        </div>

                                        {/* Image counter */}
                                        <div style={{
                                            position: 'absolute', top: '12px', right: '12px',
                                            background: 'rgba(0,0,0,0.5)', color: '#fff',
                                            padding: '4px 10px', borderRadius: '12px',
                                            fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.05em',
                                            zIndex: 2,
                                        }}>
                                            {selectedImage + 1} / {productImages.length}
                                        </div>
                                    </>
                                )}
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

                            {/* Product Video */}
                            {product.video && (
                                <div style={{
                                    marginTop: '20px',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    border: '1px solid var(--color-border, #E8E0D4)',
                                }}>
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '12px 0 8px',
                                        fontSize: '0.72rem',
                                        fontWeight: 500,
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        color: 'var(--color-gold, #C5A467)',
                                    }}>
                                        ▶ Watch This Piece Come Alive
                                    </div>
                                    {product.video.includes('drive.google.com') ? (
                                        <iframe
                                            src={product.video}
                                            width="100%"
                                            height="300"
                                            allow="autoplay; encrypted-media"
                                            allowFullScreen
                                            style={{ border: 'none', display: 'block' }}
                                            title={`${product.name} video`}
                                        />
                                    ) : (
                                        <video
                                            controls
                                            playsInline
                                            preload="metadata"
                                            style={{ width: '100%', display: 'block', maxHeight: '400px', objectFit: 'contain', background: '#000' }}
                                        >
                                            <source src={product.video} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="product-info">
                            <div className="product-info-category">{product.category}</div>
                            <h1 className="product-info-name">{product.name}</h1>

                            <div className="product-info-price">
                                {priceBreakdown && priceBreakdown.total > 0 ? (
                                    <>
                                        {product.discount > 0 && (
                                            <span style={{ textDecoration: 'line-through', color: 'var(--color-text-muted)', marginRight: '12px', fontSize: '1rem' }}>
                                                ₹{product.price.toLocaleString('en-IN')}
                                            </span>
                                        )}
                                        <span style={{ color: 'var(--color-rose-gold)', fontWeight: 500 }}>
                                            ₹{priceBreakdown.total.toLocaleString('en-IN')}
                                        </span>
                                        <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginLeft: '8px', fontWeight: 400 }}>
                                            ({selectedMetal})
                                        </span>
                                    </>
                                ) : product.discount > 0 ? (
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

                            {/* ── CUSTOMER SELECTIONS & PRICE BREAKDOWN ── */}
                            {pricingInfo && (
                                <div style={{
                                    marginBottom: '24px',
                                    border: '1px solid rgba(197,164,103,0.25)',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                }}>
                                    {/* Metal Purity Selector */}
                                    {pricingInfo.goldWeight > 0 && (
                                        <div>
                                            <div style={{
                                                padding: '12px 16px',
                                                background: 'linear-gradient(135deg, rgba(197,164,103,0.08), rgba(240,214,144,0.04))',
                                                borderBottom: '1px solid rgba(197,164,103,0.15)',
                                                display: 'flex', alignItems: 'center', gap: '8px',
                                            }}>
                                                <span style={{ fontSize: '0.9rem' }}>🪙</span>
                                                <span style={{
                                                    fontSize: '0.72rem', fontWeight: 600,
                                                    letterSpacing: '0.12em', textTransform: 'uppercase',
                                                    color: '#C5A467',
                                                }}>Choose Metal</span>
                                            </div>
                                            <div style={{ padding: '12px 16px' }}>
                                                <div style={{ marginBottom: '10px' }}>
                                                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: 500 }}>PURITY</div>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                        {['9K Gold', '14K Gold', '18K Gold', '925 Silver'].map(metal => (
                                                            <button
                                                                key={metal}
                                                                type="button"
                                                                onClick={() => setSelectedMetal(metal)}
                                                                style={{
                                                                    padding: '6px 14px',
                                                                    borderRadius: '20px',
                                                                    border: selectedMetal === metal
                                                                        ? '2px solid #C5A467'
                                                                        : '1px solid rgba(197,164,103,0.2)',
                                                                    background: selectedMetal === metal
                                                                        ? 'linear-gradient(135deg, rgba(197,164,103,0.12), rgba(240,214,144,0.06))'
                                                                        : '#fff',
                                                                    color: selectedMetal === metal ? '#C5A467' : '#777',
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: selectedMetal === metal ? 600 : 400,
                                                                    cursor: 'pointer',
                                                                    transition: 'all 0.2s ease',
                                                                    fontFamily: 'inherit',
                                                                }}
                                                            >
                                                                {metal}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: 500 }}>COLOUR</div>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                        {[
                                                            { name: 'Yellow Gold', color: '#D4A843' },
                                                            { name: 'Rose Gold', color: '#E8A090' },
                                                            { name: 'White Gold', color: '#C0C0C0' },
                                                        ].map(c => (
                                                            <button
                                                                key={c.name}
                                                                type="button"
                                                                onClick={() => setSelectedColor(c.name)}
                                                                style={{
                                                                    padding: '6px 14px',
                                                                    borderRadius: '20px',
                                                                    border: selectedColor === c.name
                                                                        ? `2px solid ${c.color}`
                                                                        : '1px solid rgba(197,164,103,0.2)',
                                                                    background: selectedColor === c.name
                                                                        ? `linear-gradient(135deg, ${c.color}15, ${c.color}08)`
                                                                        : '#fff',
                                                                    color: selectedColor === c.name ? c.color : '#777',
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: selectedColor === c.name ? 600 : 400,
                                                                    cursor: 'pointer',
                                                                    transition: 'all 0.2s ease',
                                                                    fontFamily: 'inherit',
                                                                    display: 'flex', alignItems: 'center', gap: '6px',
                                                                }}
                                                            >
                                                                <span style={{
                                                                    width: '12px', height: '12px', borderRadius: '50%',
                                                                    background: c.color, display: 'inline-block',
                                                                    border: '1px solid rgba(0,0,0,0.1)',
                                                                }} />
                                                                {c.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div style={{
                                                    display: 'flex', justifyContent: 'space-between',
                                                    fontSize: '0.78rem', padding: '10px 0 0', marginTop: '10px',
                                                    borderTop: '1px dashed rgba(197,164,103,0.15)',
                                                    color: 'var(--color-text-light)',
                                                }}>
                                                    <span>Weight: {pricingInfo.goldWeight}g</span>
                                                    <span>Rate: ₹{priceBreakdown?.goldRate?.toLocaleString('en-IN')}/g</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Diamond Details */}
                                    {pricingInfo.diamondCarat > 0 && (
                                        <div>
                                            <div style={{
                                                padding: '12px 16px',
                                                background: 'linear-gradient(135deg, rgba(197,164,103,0.08), rgba(240,214,144,0.04))',
                                                borderTop: '1px solid rgba(197,164,103,0.15)',
                                                borderBottom: '1px solid rgba(197,164,103,0.15)',
                                                display: 'flex', alignItems: 'center', gap: '8px',
                                            }}>
                                                <span style={{ fontSize: '0.9rem' }}>💎</span>
                                                <span style={{
                                                    fontSize: '0.72rem', fontWeight: 600,
                                                    letterSpacing: '0.12em', textTransform: 'uppercase',
                                                    color: '#C5A467',
                                                }}>Diamond Details</span>
                                                {priceBreakdown?.diamondTag && (
                                                    <span style={{
                                                        fontSize: '0.6rem', fontWeight: 700,
                                                        letterSpacing: '0.08em', textTransform: 'uppercase',
                                                        color: '#fff',
                                                        background: priceBreakdown.diamondTag === 'PREMIUM' ? '#C5A467' : priceBreakdown.diamondTag === 'BEST' ? '#38A169' : '#8B7355',
                                                        padding: '2px 8px',
                                                        borderRadius: '4px',
                                                        marginLeft: 'auto',
                                                    }}>{priceBreakdown.diamondTag}</span>
                                                )}
                                            </div>
                                            <div style={{ padding: '12px 16px' }}>
                                                {pricingInfo.diamondShape && (
                                                    <div style={{
                                                        display: 'flex', justifyContent: 'space-between',
                                                        fontSize: '0.78rem', padding: '6px 0',
                                                        color: 'var(--color-text-light)',
                                                    }}>
                                                        <span>Shape</span>
                                                        <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>{pricingInfo.diamondShape}</span>
                                                    </div>
                                                )}
                                                <div style={{
                                                    display: 'flex', justifyContent: 'space-between',
                                                    fontSize: '0.78rem', padding: '6px 0',
                                                    color: 'var(--color-text-light)',
                                                }}>
                                                    <span>Quality</span>
                                                    <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>{pricingInfo.diamondQuality}</span>
                                                </div>
                                                <div style={{
                                                    display: 'flex', justifyContent: 'space-between',
                                                    fontSize: '0.78rem', padding: '6px 0',
                                                    color: 'var(--color-text-light)',
                                                }}>
                                                    <span>Total Carat</span>
                                                    <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>{pricingInfo.diamondCarat} ct</span>
                                                </div>
                                                {pricingInfo.numDiamonds > 1 && (
                                                    <div style={{
                                                        display: 'flex', justifyContent: 'space-between',
                                                        fontSize: '0.78rem', padding: '6px 0',
                                                        color: 'var(--color-text-light)',
                                                    }}>
                                                        <span>Stones</span>
                                                        <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>{pricingInfo.numDiamonds} pieces</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Price Breakdown (auto-calculated) */}
                                    {priceBreakdown && (
                                        <div>
                                            <div style={{
                                                padding: '12px 16px',
                                                background: 'linear-gradient(135deg, rgba(197,164,103,0.08), rgba(240,214,144,0.04))',
                                                borderTop: '1px solid rgba(197,164,103,0.15)',
                                                borderBottom: '1px solid rgba(197,164,103,0.15)',
                                                display: 'flex', alignItems: 'center', gap: '8px',
                                            }}>
                                                <span style={{ fontSize: '0.9rem' }}>💰</span>
                                                <span style={{
                                                    fontSize: '0.72rem', fontWeight: 600,
                                                    letterSpacing: '0.12em', textTransform: 'uppercase',
                                                    color: '#C5A467',
                                                }}>Price Breakdown</span>
                                            </div>
                                            <div style={{ padding: '12px 16px' }}>
                                                {priceBreakdown.goldPrice > 0 && (
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '6px 0', color: 'var(--color-text-light)' }}>
                                                        <span>{selectedMetal} ({priceBreakdown.goldWeight}g)</span>
                                                        <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>₹{priceBreakdown.goldPrice.toLocaleString('en-IN')}</span>
                                                    </div>
                                                )}
                                                {priceBreakdown.diamondFinalPrice > 0 && (
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '6px 0', color: 'var(--color-text-light)' }}>
                                                        <span>Diamond ({priceBreakdown.diamondCarat} ct • {priceBreakdown.diamondQuality})</span>
                                                        <div style={{ textAlign: 'right' }}>
                                                            {priceBreakdown.diamondDiscountAmount > 0 && (
                                                                <span style={{ fontSize: '0.72rem', color: '#38A169', marginRight: '6px' }}>-₹{priceBreakdown.diamondDiscountAmount.toLocaleString('en-IN')}</span>
                                                            )}
                                                            <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>₹{priceBreakdown.diamondFinalPrice.toLocaleString('en-IN')}</span>
                                                        </div>
                                                    </div>
                                                )}
                                                {priceBreakdown.goldPrice > 0 && (
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '6px 0', color: 'var(--color-text-light)' }}>
                                                        <span>Making Charges</span>
                                                        <span style={{ fontWeight: 500, color: priceBreakdown.makingCharges > 0 ? 'var(--color-text)' : '#38A169' }}>
                                                            {priceBreakdown.makingCharges > 0 ? `₹${priceBreakdown.makingCharges.toLocaleString('en-IN')}` : 'Included'}
                                                        </span>
                                                    </div>
                                                )}
                                                {priceBreakdown.certification > 0 && (
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '6px 0', color: 'var(--color-text-light)' }}>
                                                        <span>Certification (IGI)</span>
                                                        <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>₹{priceBreakdown.certification.toLocaleString('en-IN')}</span>
                                                    </div>
                                                )}
                                                {priceBreakdown.gst > 0 && (
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '6px 0', color: 'var(--color-text-light)' }}>
                                                        <span>GST ({priceBreakdown.gstPercent}%)</span>
                                                        <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>₹{priceBreakdown.gst.toLocaleString('en-IN')}</span>
                                                    </div>
                                                )}
                                                <div style={{
                                                    display: 'flex', justifyContent: 'space-between',
                                                    fontSize: '0.92rem', padding: '10px 0 4px',
                                                    borderTop: '1px solid rgba(197,164,103,0.2)',
                                                    marginTop: '8px',
                                                    fontWeight: 600,
                                                    color: 'var(--color-text)',
                                                }}>
                                                    <span>Total</span>
                                                    <span style={{ color: '#C5A467' }}>₹{priceBreakdown.total.toLocaleString('en-IN')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── RING SIZE PICKER (customer selects) ── */}
                            {product.category && (product.category.toLowerCase().includes('ring') || product.category.toLowerCase().includes('solitaire')) && (
                                <div style={{
                                    marginBottom: '20px',
                                    padding: '16px 20px',
                                    border: '1px solid rgba(197,164,103,0.2)',
                                    borderRadius: '10px',
                                    background: 'var(--color-bg-alt, #FAF8F5)',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <label style={{
                                            fontSize: '0.78rem', fontWeight: 600,
                                            letterSpacing: '0.1em', textTransform: 'uppercase',
                                            color: 'var(--color-text)',
                                        }}>💍 Select Ring Size</label>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {Array.from({ length: 18 }, (_, i) => i + 5).map(size => (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => setSelectedRingSize(size.toString())}
                                                style={{
                                                    width: '40px', height: '40px',
                                                    borderRadius: '50%',
                                                    border: selectedRingSize === size.toString()
                                                        ? '2px solid #C5A467'
                                                        : '1px solid rgba(197,164,103,0.2)',
                                                    background: selectedRingSize === size.toString()
                                                        ? 'linear-gradient(135deg, rgba(197,164,103,0.12), rgba(240,214,144,0.08))'
                                                        : '#fff',
                                                    color: selectedRingSize === size.toString() ? '#C5A467' : '#666',
                                                    fontSize: '0.8rem',
                                                    fontWeight: selectedRingSize === size.toString() ? 600 : 400,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    fontFamily: 'inherit',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    padding: 0,
                                                }}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                    <p style={{
                                        fontSize: '0.72rem', color: 'var(--color-text-muted)',
                                        marginTop: '10px', lineHeight: 1.5,
                                    }}>
                                        💡 Wrap a thread around your finger, measure the length and divide by 3.14 for diameter in mm.
                                    </p>
                                </div>
                            )}

                            {/* Quantity */}
                            {product.stock && (
                                <div>
                                    <div className="product-qty">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                                        <span>{quantity}</span>
                                        <button onClick={() => setQuantity(Math.min(quantity + 1, product.availableQty || 1))}>+</button>
                                    </div>
                                </div>
                            )}

                            {/* ── Urgency & Scarcity Indicators ── */}
                            {product.stock && (
                                <div style={{ marginBottom: '20px' }}>
                                    {/* Selling fast / limited stock — no exact quantity shown */}
                                    {product.availableQty && product.availableQty <= 5 && (
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '8px',
                                            padding: '10px 14px', borderRadius: '8px',
                                            background: 'linear-gradient(90deg, #FFF5F5, #FFF0F0)',
                                            border: '1px solid #FFD4D4',
                                            marginBottom: '10px',
                                        }}>
                                            <span style={{ fontSize: '1.1rem' }}>🔥</span>
                                            <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#C0392B' }}>
                                                Selling Fast — Limited Availability!
                                            </span>
                                        </div>
                                    )}
                                    {/* Dispatch countdown */}
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        padding: '10px 14px', borderRadius: '8px',
                                        background: 'linear-gradient(90deg, #F0FFF4, #E8FFF0)',
                                        border: '1px solid #C6F6D5',
                                    }}>
                                        <span style={{ fontSize: '1.1rem' }}>🚚</span>
                                        <span style={{ fontSize: '0.82rem', fontWeight: '500', color: '#276749' }}>
                                            {getDispatchText()}
                                        </span>
                                    </div>
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

                            {/* ── Trust Badges ── */}
                            <div style={{
                                display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px',
                                marginTop: '20px', marginBottom: '24px',
                            }}>
                                {[
                                    { icon: '💎', label: 'IGI Certified', sub: 'Authentic diamonds' },
                                    { icon: '🚚', label: 'Free Shipping', sub: 'Insured delivery' },
                                    { icon: '↩️', label: '7-Day Returns', sub: 'With quality deduction' },
                                    { icon: '🔒', label: 'Secure Checkout', sub: 'Razorpay protected' },
                                ].map((badge) => (
                                    <div key={badge.label} style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        padding: '12px', borderRadius: '10px',
                                        background: 'var(--color-bg-alt, #FAF8F5)',
                                        border: '1px solid var(--color-border, #E8E0D4)',
                                    }}>
                                        <span style={{ fontSize: '1.3rem' }}>{badge.icon}</span>
                                        <div>
                                            <div style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--color-text)' }}>{badge.label}</div>
                                            <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>{badge.sub}</div>
                                        </div>
                                    </div>
                                ))}
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
                                    <strong>Shipping:</strong> <span>Free Insured Shipping</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Customer Reviews */}
            <ReviewSection productId={product.id} productName={product.name} />

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
