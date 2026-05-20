'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import ConfigPanel from './ConfigPanel';
import './atelier.css';

// Dynamically import RingCanvas with SSR disabled so it loads entirely on the client,
// preventing large Three.js packages from inflating the initial server bundle.
const RingCanvas = dynamic(() => import('./RingCanvas'), {
    ssr: false,
    loading: () => (
        <div className="canvas-loading-overlay">
            <div className="spinner"></div>
            <p className="loading-text">ENTERING THE ATELIER...</p>
        </div>
    )
});

export default function RingAtelierPage() {
    // Configurator state variables
    const [style, setStyle] = useState('Classic Solitaire');
    const [metalType, setMetalType] = useState('18KT Yellow Gold');
    const [stoneShape, setStoneShape] = useState('Round');
    const [stoneSize, setStoneSize] = useState(1.0);
    const [ringSize, setRingSize] = useState('7');
    const [engraving, setEngraving] = useState('');

    // Pricing tables fetched from API
    const [pricingData, setPricingData] = useState(null);
    const [loadingPricing, setLoadingPricing] = useState(true);

    // Reset configurator back to standard solitaire setup
    const handleReset = () => {
        setStyle('Classic Solitaire');
        setMetalType('18KT Yellow Gold');
        setStoneShape('Round');
        setStoneSize(1.0);
        setRingSize('7');
        setEngraving('');
    };

    // Load master pricing details from Google Sheets via the API on page mount
    useEffect(() => {
        const fetchPricing = async () => {
            try {
                const response = await fetch('/api/pricing');
                const data = await response.json();
                if (data.success) {
                    setPricingData(data);
                } else {
                    console.error('Pricing data could not be fetched:', data.message);
                }
            } catch (err) {
                console.error('Error fetching pricing:', err);
            } finally {
                setLoadingPricing(false);
            }
        };

        fetchPricing();
    }, []);

    return (
        <main className="atelier-container">
            {/* Atelier Full-width Header */}
            <header className="atelier-header">
                <Link href="/" className="btn-atelier-back">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>
                    Back to Home
                </Link>

                <Link href="/" className="atelier-logo">
                    <div className="atelier-logo-title">Noore<span>Jewels</span></div>
                    <span className="atelier-logo-subtitle">Ring Atelier</span>
                </Link>

                <button className="btn-atelier-reset" onClick={handleReset}>
                    ✕ Reset
                </button>
            </header>

            {/* Configurator Split Grid Workspace */}
            <div className="atelier-workspace">
                {/* Left Panel - 3D Ring WebGL Scene */}
                <section className="atelier-viewer">
                    <RingCanvas
                        style={style}
                        metalType={metalType}
                        stoneShape={stoneShape}
                        stoneSize={stoneSize}
                        ringSize={ringSize}
                    />
                    
                    <div className="viewer-hint">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                        </svg>
                        Drag to rotate 360° • Pinch to zoom
                    </div>
                </section>

                {/* Right Panel - Configuration Controller Options */}
                <ConfigPanel
                    style={style}
                    setStyle={setStyle}
                    metalType={metalType}
                    setMetalType={setMetalType}
                    stoneShape={stoneShape}
                    setStoneShape={setStoneShape}
                    stoneSize={stoneSize}
                    setStoneSize={setStoneSize}
                    ringSize={ringSize}
                    setRingSize={setRingSize}
                    engraving={engraving}
                    setEngraving={setEngraving}
                    pricingData={pricingData}
                    loadingPricing={loadingPricing}
                />
            </div>
        </main>
    );
}
