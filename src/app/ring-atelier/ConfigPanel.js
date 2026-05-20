'use client';

import { useState, useMemo } from 'react';

const STYLES = [
    { id: 'Classic Solitaire', name: 'Solitaire', icon: '💍', desc: 'Elegant, timeless single stone' },
    { id: 'Halo', name: 'Halo Setting', icon: '✨', desc: 'Center stone circled by light' },
    { id: 'Pavé Band', name: 'Pavé Band', icon: '💎', desc: 'Diamonds set along the band' },
    { id: 'Cathedral', name: 'Cathedral', icon: '⛪', desc: 'Arched band rising to stone' },
    { id: 'Three-Stone', name: 'Three-Stone', icon: '🌟', desc: 'Past, present, and future stones' },
    { id: 'Twisted Band', name: 'Twisted Band', icon: '➰', desc: 'Intertwined dynamic bands' }
];

const METALS = [
    { id: '18KT Yellow Gold', name: '18K Yellow Gold', swatch: '#F3DCA2' },
    { id: '14KT Yellow Gold', name: '14K Yellow Gold', swatch: '#EACD95' },
    { id: '9KT Yellow Gold', name: '9K Yellow Gold', swatch: '#E5C483' },
    { id: '18KT White Gold', name: '18K White Gold', swatch: '#F5F5F5' },
    { id: '14KT White Gold', name: '14K White Gold', swatch: '#F0F0F0' },
    { id: '9KT White Gold', name: '9K White Gold', swatch: '#EBEBEB' },
    { id: '18KT Rose Gold', name: '18K Rose Gold', swatch: '#E8BFB5' },
    { id: '14KT Rose Gold', name: '14K Rose Gold', swatch: '#E2B2A7' },
    { id: '9KT Rose Gold', name: '9K Rose Gold', swatch: '#D99F94' },
    { id: '925 Silver', name: '925 Silver', swatch: '#D5D5D5' }
];

const SHAPES = [
    { id: 'Round', name: 'Round', icon: '⚪' },
    { id: 'Princess', name: 'Princess', icon: '⬜' },
    { id: 'Oval', name: 'Oval', icon: '椭' },
    { id: 'Cushion', name: 'Cushion', icon: '⌗' },
    { id: 'Emerald', name: 'Emerald', icon: '▮' },
    { id: 'Pear', name: 'Pear', icon: '💧' },
    { id: 'Marquise', name: 'Marquise', icon: '👁️' }
];

const QUALITIES = [
    { id: 'EF-VVS', name: 'EF-VVS (Flawless Lab Grown)' },
    { id: 'GH-VS', name: 'GH-VS (Premium Lab Grown)' },
    { id: 'IJ-SI', name: 'IJ-SI (Affordable Lab Grown)' }
];

export default function ConfigPanel({
    style, setStyle,
    metalType, setMetalType,
    stoneShape, setStoneShape,
    stoneSize, setStoneSize,
    ringSize, setRingSize,
    engraving, setEngraving,
    pricingData,
    loadingPricing
}) {
    const [selectedQuality, setSelectedQuality] = useState('GH-VS');
    const [showSpecs, setShowSpecs] = useState(false);

    // Calculate Estimated Price
    const priceCalculation = useMemo(() => {
        if (!pricingData) return { total: 0, loading: true };

        const { pricing, diamondPricing } = pricingData;
        if (!pricing || !diamondPricing) return { total: 0 };

        // 1. Calculate Estimated Gold Weight (g) based on style and ring size
        let baseWeight = 3.5; // Classic Solitaire weight
        if (style === 'Halo') baseWeight = 4.2;
        if (style === 'Pavé Band') baseWeight = 3.8;
        if (style === 'Twisted Band') baseWeight = 4.0;
        if (style === 'Cathedral') baseWeight = 3.9;
        if (style === 'Three-Stone') baseWeight = 4.1;

        // Larger ring size = more gold weight
        const sizeNum = parseFloat(ringSize) || 7;
        const weight = baseWeight * (1 + (sizeNum - 7) * 0.025);

        // 2. Look up Metal Rate
        let metalRate = 0;
        const isSilver = metalType.toLowerCase().includes('silver');
        if (isSilver) {
            metalRate = pricing['Silver 925 per gram']?.rate || 450;
        } else if (metalType.toLowerCase().includes('9kt')) {
            metalRate = pricing['Gold 9K per gram']?.rate || 2700;
        } else if (metalType.toLowerCase().includes('14kt')) {
            metalRate = pricing['Gold 14K per gram']?.rate || 4200;
        } else if (metalType.toLowerCase().includes('18kt')) {
            metalRate = pricing['Gold 18K per gram']?.rate || 5400;
        }
        
        const goldCost = Math.round(metalRate * weight);

        // 3. Side Stones Carat Weight
        let sideStonesCarat = 0;
        if (style === 'Halo') sideStonesCarat = 0.42; // 14 x 0.03ct
        if (style === 'Pavé Band') sideStonesCarat = 0.20; // 10 x 0.02ct
        if (style === 'Three-Stone') sideStonesCarat = stoneSize * 0.65 * 2; // Two flanking stones

        const totalCarats = stoneSize + sideStonesCarat;

        // 4. Look up Diamond Rate based on selected quality
        // Default fallbacks in case sheet hasn't populated
        let ratePerCarat = 55000;
        let discount = 0;

        const matchingDiamond = diamondPricing.find(d => {
            const qStr = d.qualityGrade?.toUpperCase() || '';
            return qStr.includes(selectedQuality);
        });

        if (matchingDiamond) {
            ratePerCarat = matchingDiamond.pricePerCarat;
            discount = matchingDiamond.discount || 0;
        } else {
            // Standard backup rates
            if (selectedQuality === 'EF-VVS') ratePerCarat = 75000;
            if (selectedQuality === 'GH-VS') ratePerCarat = 55000;
            if (selectedQuality === 'IJ-SI') ratePerCarat = 40000;
        }

        const diamondBaseCost = totalCarats * ratePerCarat;
        const diamondDiscountAmount = diamondBaseCost * (discount / 100);
        const diamondCost = Math.round(diamondBaseCost - diamondDiscountAmount);

        // 5. Making Charges
        const makingRatePerGram = pricing['Making Charges (%)']?.rate || 800; // Flat charge per gram or fallback
        const makingCost = Math.round(weight * makingRatePerGram);

        // 6. Fees & Shipping
        const certFee = pricing['Certification Fee']?.rate || 1500;
        const shipping = pricing['Insured Shipping']?.rate || 0;

        // 7. GST Calculation
        const gstPercent = pricing['GST (%)']?.rate || 3;
        const gstBase = goldCost + diamondCost + makingCost;
        const gstCost = Math.round(gstBase * (gstPercent / 100));

        // 8. Grand Total
        const total = gstBase + gstCost + certFee + shipping;

        return {
            goldWeight: weight.toFixed(2),
            goldCost,
            totalCarats: totalCarats.toFixed(2),
            diamondCost,
            makingCost,
            certFee,
            shipping,
            gstCost,
            total: Math.round(total)
        };
    }, [style, metalType, stoneSize, ringSize, selectedQuality, pricingData]);

    // Format Indian Rupees currency
    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val);
    };

    // Trigger order checkout via WhatsApp
    const handleWhatsAppOrder = () => {
        const text = `Hi Noore Jewels! 💎
I have configured my dream ring using the *Ring Atelier 3D Builder*! Here are my custom design selections:

💍 *Style:* ${style}
✨ *Metal:* ${metalType}
💎 *Center Stone Shape:* ${stoneShape}
📏 *Center Stone Size:* ${stoneSize} carat
⭐ *Diamond Quality:* ${selectedQuality} (Lab Grown)
💍 *Ring Size:* US ${ringSize}
✍️ *Custom Engraving:* ${engraving || 'None'}
💰 *Estimated Price:* ${formatCurrency(priceCalculation.total)} (Approximate quote)

I would love to book a consultation or finalize my custom order. Can we discuss this?`;

        const encodedText = encodeURIComponent(text);
        const whatsappUrl = `https://wa.me/918076735450?text=${encodedText}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <aside className="atelier-sidebar">
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--color-gold)', letterSpacing: '0.05em', marginBottom: '8px' }}>Ring Atelier</h1>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Craft Your Forever Ring</p>
            </div>

            {/* 1. Ring Style Section */}
            <div className="config-section">
                <label className="config-label">
                    1. Setting Style
                    <span className="config-sublabel">{style}</span>
                </label>
                <div className="options-grid">
                    {STYLES.map((st) => (
                        <div
                            key={st.id}
                            className={`option-card ${style === st.id ? 'active' : ''}`}
                            onClick={() => setStyle(st.id)}
                            title={st.desc}
                        >
                            <div className="option-card-icon">{st.icon}</div>
                            <div className="option-card-name">{st.name}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Metal Color Section */}
            <div className="config-section">
                <label className="config-label">
                    2. Precious Metal
                    <span className="config-sublabel">{metalType}</span>
                </label>
                <div className="metal-options">
                    {METALS.map((metal) => (
                        <div
                            key={metal.id}
                            className={`metal-pill ${metalType === metal.id ? 'active' : ''}`}
                            onClick={() => setMetalType(metal.id)}
                        >
                            <div className="metal-swatch" style={{ backgroundColor: metal.swatch }} />
                            <div>{metal.name}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Center Stone Shape Section */}
            <div className="config-section">
                <label className="config-label">
                    3. Center Diamond Shape
                    <span className="config-sublabel">{stoneShape}</span>
                </label>
                <div className="shapes-grid">
                    {SHAPES.map((shape) => (
                        <div
                            key={shape.id}
                            className={`shape-card ${stoneShape === shape.id ? 'active' : ''}`}
                            onClick={() => setStoneShape(shape.id)}
                        >
                            <div className="shape-icon">{shape.icon}</div>
                            <div className="shape-name">{shape.name}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. Center Stone Size Section */}
            <div className="config-section">
                <label className="config-label">
                    4. Center Stone Carat
                    <span className="config-sublabel">{stoneSize} Carat</span>
                </label>
                <div className="slider-container">
                    <input
                        type="range"
                        min="0.25"
                        max="2.5"
                        step="0.05"
                        value={stoneSize}
                        onChange={(e) => setStoneSize(parseFloat(e.target.value))}
                        className="atelier-slider"
                    />
                    <div className="slider-labels">
                        <span>0.25 Carat (Delicate)</span>
                        <span>1.0 Carat</span>
                        <span>2.5 Carats (Grand)</span>
                    </div>
                </div>
            </div>

            {/* 5. Diamond Quality Grade Section */}
            <div className="config-section">
                <label className="config-label">
                    5. Diamond Quality
                </label>
                <select
                    value={selectedQuality}
                    onChange={(e) => setSelectedQuality(e.target.value)}
                    className="atelier-select"
                >
                    {QUALITIES.map((q) => (
                        <option key={q.id} value={q.id} style={{ backgroundColor: '#151515' }}>
                            {q.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* 6. Ring Size Section */}
            <div className="config-section">
                <label className="config-label">
                    6. Ring Size
                </label>
                <select
                    value={ringSize}
                    onChange={(e) => setRingSize(e.target.value)}
                    className="atelier-select"
                >
                    {Array.from({ length: 18 }).map((_, idx) => {
                        const size = 5 + idx; // Sizes US 5 to US 22
                        return (
                            <option key={`size-${size}`} value={size} style={{ backgroundColor: '#151515' }}>
                                Size US {size}
                            </option>
                        );
                    })}
                </select>
            </div>

            {/* 7. Engraving Section */}
            <div className="config-section">
                <label className="config-label">
                    7. Custom Engraving (Optional)
                </label>
                <input
                    type="text"
                    maxLength="20"
                    placeholder="Enter text (e.g. A & B Forever)"
                    value={engraving}
                    onChange={(e) => setEngraving(e.target.value)}
                    className="atelier-input"
                />
            </div>

            {/* 8. Pricing & Ordering Panel */}
            <div className="pricing-checkout-panel">
                {priceCalculation.total > 0 ? (
                    <>
                        <div className="price-row">
                            <span className="price-title">Estimated Cost</span>
                            <span className="price-amount">
                                {formatCurrency(priceCalculation.total)}
                            </span>
                        </div>

                        {/* Specs Breakdown Toggle */}
                        <button 
                            className="specs-toggle" 
                            onClick={() => setShowSpecs(!showSpecs)}
                        >
                            {showSpecs ? '▼ Hide Spec Details' : '▶ Show Weight & Spec Details'}
                        </button>

                        {showSpecs && (
                            <table className="specs-table">
                                <tbody>
                                    <tr>
                                        <td>Est. Gold Weight</td>
                                        <td>{priceCalculation.goldWeight} g</td>
                                    </tr>
                                    <tr>
                                        <td>Gold Metal Cost</td>
                                        <td>{formatCurrency(priceCalculation.goldCost)}</td>
                                    </tr>
                                    <tr>
                                        <td>Total Diamond Carat</td>
                                        <td>{priceCalculation.totalCarats} ct</td>
                                    </tr>
                                    <tr>
                                        <td>Diamond Gem Cost</td>
                                        <td>{formatCurrency(priceCalculation.diamondCost)}</td>
                                    </tr>
                                    <tr>
                                        <td>Crafting & Making</td>
                                        <td>{formatCurrency(priceCalculation.makingCost)}</td>
                                    </tr>
                                    <tr>
                                        <td>IGI Certification Fee</td>
                                        <td>{formatCurrency(priceCalculation.certFee)}</td>
                                    </tr>
                                    <tr>
                                        <td>Insured Shipping</td>
                                        <td>{priceCalculation.shipping > 0 ? formatCurrency(priceCalculation.shipping) : 'FREE'}</td>
                                    </tr>
                                    <tr>
                                        <td>GST Duty (3%)</td>
                                        <td>{formatCurrency(priceCalculation.gstCost)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        )}
                        
                        <p className="price-disclaimer">
                            *This is an approximate estimate based on current market rates. Final price will be finalized and confirmed once we discuss your custom order.
                        </p>
                    </>
                ) : (
                    <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        {loadingPricing ? 'Loading current pricing data...' : 'Quote not available. Let\'s discuss rates.'}
                    </div>
                )}

                <div className="checkout-actions">
                    <button 
                        className="btn-whatsapp-order" 
                        onClick={handleWhatsAppOrder}
                        disabled={loadingPricing || priceCalculation.total === 0}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
                            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.335 4.975L2 22l5.233-1.371a9.936 9.936 0 0 0 4.777 1.22h.005c5.505 0 9.99-4.478 9.99-9.985a9.983 9.983 0 0 0-2.927-7.067A9.923 9.923 0 0 0 12.012 2zm5.728 14.103c-.235.662-1.363 1.218-1.88 1.272-.472.049-.933.226-2.997-.584-2.64-1.036-4.307-3.73-4.439-3.905-.13-.175-1.066-1.417-1.066-2.703 0-1.287.674-1.92.915-2.179.241-.259.525-.324.7-.324.176 0 .35.001.503.008.159.007.373-.06.584.45.216.52.738 1.794.802 1.925.064.13.107.28.021.45-.085.17-.128.276-.256.425-.128.15-.269.333-.384.448-.128.127-.262.266-.113.523.149.256.662 1.092 1.418 1.764.975.867 1.796 1.137 2.052 1.265.256.128.405.106.554-.064.15-.17.639-.743.81-1.002.17-.258.34-.216.575-.128.236.088 1.492.702 1.748.83.256.128.427.192.49.301.064.109.064.63-.17 1.293z" />
                        </svg>
                        Request Quote on WhatsApp
                    </button>
                    
                    <button 
                        className="btn-save-design"
                        onClick={() => {
                            alert('Your custom design has been saved in your browser cookies!');
                        }}
                    >
                        Save Design Draft
                    </button>
                </div>
            </div>
        </aside>
    );
}
