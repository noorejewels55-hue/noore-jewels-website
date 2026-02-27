'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { totalItems, setIsCartOpen } = useCart();
    const { user, openAuth, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/* Announcement Bar */}
            <div className="announcement-bar">
                Free Shipping on orders above <span>&nbsp;₹999&nbsp;</span> • Starting at <span>&nbsp;₹199</span>
            </div>

            {/* Navigation */}
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="nav-container">
                    {/* Logo */}
                    <Link href="/" className="nav-logo">
                        Noore<span className="logo-accent">&nbsp;Jewels</span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="nav-links">
                        <Link href="/shop" className="nav-link">Shop All</Link>
                        <Link href="/shop?category=rings" className="nav-link">Rings</Link>
                        <Link href="/shop?category=necklaces" className="nav-link">Necklaces</Link>
                        <Link href="/shop?category=earrings" className="nav-link">Earrings</Link>
                        <Link href="/shop?category=bracelets" className="nav-link">Bracelets</Link>
                        <Link href="/our-story" className="nav-link">Our Story</Link>
                    </div>

                    {/* Actions */}
                    <div className="nav-actions">
                        {/* Search */}
                        <Link href="/shop" className="nav-action-btn" title="Search">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="11" cy="11" r="8" />
                                <path d="M21 21l-4.35-4.35" />
                            </svg>
                        </Link>

                        {/* Account */}
                        {user ? (
                            <div className="nav-action-btn" style={{ position: 'relative' }}>
                                <button onClick={() => setUserMenuOpen(!userMenuOpen)} title={`Hi, ${user.name}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text)' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                    {user.name.split(' ')[0]}
                                </button>
                                {userMenuOpen && (
                                    <div style={{
                                        position: 'absolute', top: '100%', right: 0, marginTop: '8px',
                                        background: '#fff', border: '1px solid #eee', boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                        padding: '12px 16px', minWidth: '160px', zIndex: 100,
                                    }}>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '4px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Welcome</p>
                                        <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px', color: 'var(--color-text)' }}>{user.name}</p>
                                        <button
                                            onClick={() => { logout(); setUserMenuOpen(false); }}
                                            style={{
                                                width: '100%', padding: '8px 12px', fontSize: '0.75rem',
                                                fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase',
                                                border: '1px solid var(--color-text)', background: 'transparent',
                                                color: 'var(--color-text)', cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                            }}
                                            onMouseOver={(e) => { e.target.style.background = 'var(--color-text)'; e.target.style.color = '#fff'; }}
                                            onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--color-text)'; }}
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button onClick={openAuth} className="nav-action-btn" title="Sign In">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </button>
                        )}

                        {/* Cart */}
                        <button onClick={() => setIsCartOpen(true)} className="nav-action-btn" title="Cart">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 01-8 0" />
                            </svg>
                            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
                        </button>

                        {/* Mobile Menu Button */}
                        <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="mobile-menu open">
                    <button className="mobile-menu-close" onClick={() => setMobileOpen(false)}>✕</button>
                    <Link href="/shop" className="nav-link" onClick={() => setMobileOpen(false)}>Shop All</Link>
                    <Link href="/shop?category=rings" className="nav-link" onClick={() => setMobileOpen(false)}>Rings</Link>
                    <Link href="/shop?category=necklaces" className="nav-link" onClick={() => setMobileOpen(false)}>Necklaces</Link>
                    <Link href="/shop?category=earrings" className="nav-link" onClick={() => setMobileOpen(false)}>Earrings</Link>
                    <Link href="/shop?category=bracelets" className="nav-link" onClick={() => setMobileOpen(false)}>Bracelets</Link>
                    <Link href="/our-story" className="nav-link" onClick={() => setMobileOpen(false)}>Our Story</Link>
                    <div style={{ marginTop: '24px' }}>
                        {user ? (
                            <div>
                                <p style={{ fontSize: '0.85rem', marginBottom: '12px' }}>Welcome, <strong>{user.name}</strong></p>
                                <button onClick={() => { logout(); setMobileOpen(false); }} className="btn btn-outline btn-sm">Sign Out</button>
                            </div>
                        ) : (
                            <button onClick={() => { openAuth(); setMobileOpen(false); }} className="btn btn-primary btn-full">Sign In</button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
