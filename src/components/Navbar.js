'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [shopDropdown, setShopDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const { totalItems, setIsCartOpen } = useCart();
    const { user, openAuth, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShopDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            {/* Announcement Bar */}
            <div className="announcement-bar">
                <div className="announcement-bar-inner">
                    IGI Certified <span>&nbsp;Lab Grown Diamonds&nbsp;</span> ✦ BIS Hallmarked <span>&nbsp;Gold Jewellery</span> ✦ <span>&nbsp;Fully Insured Shipping</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    IGI Certified <span>&nbsp;Lab Grown Diamonds&nbsp;</span> ✦ BIS Hallmarked <span>&nbsp;Gold Jewellery</span> ✦ <span>&nbsp;Fully Insured Shipping</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </div>
            </div>

            {/* Navigation */}
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="nav-container">
                    {/* Logo */}
                    <Link href="/" className="nav-logo" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0' }}>
                        <div>Noore<span className="logo-accent">&nbsp;Jewels</span></div>
                        <span style={{ fontSize: '0.35em', letterSpacing: '0.25em', fontWeight: '400', color: 'var(--color-text-muted)', marginTop: '-2px', fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap' }}>Modern Rings. Timeless Glow.</span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="nav-links">
                        <div
                            ref={dropdownRef}
                            style={{ position: 'relative' }}
                            onMouseEnter={() => setShopDropdown(true)}
                            onMouseLeave={() => setShopDropdown(false)}
                        >
                            <Link href="/shop" className="nav-link">Shop All</Link>
                            {shopDropdown && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: '#fff',
                                    border: '1px solid rgba(0,0,0,0.06)',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                                    padding: '16px 20px',
                                    minWidth: '200px',
                                    zIndex: 200,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px',
                                }}>
                                    <Link href="/shop?category=engagement-rings" className="nav-link" onClick={() => setShopDropdown(false)} style={{ padding: '8px 0', fontSize: '0.78rem' }}>Engagement Rings</Link>
                                    <Link href="/shop?category=stack-rings" className="nav-link" onClick={() => setShopDropdown(false)} style={{ padding: '8px 0', fontSize: '0.78rem' }}>Stackable Rings</Link>
                                    <Link href="/shop?category=fine-jewellery" className="nav-link" onClick={() => setShopDropdown(false)} style={{ padding: '8px 0', fontSize: '0.78rem' }}>Fine Jewellery</Link>
                                    <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', margin: '4px 0' }} />
                                    <Link href="/shop?category=polished-diamonds" className="nav-link" onClick={() => setShopDropdown(false)} style={{ padding: '8px 0', fontSize: '0.78rem', color: 'var(--color-gold, #C5A467)' }}>💎 Loose Diamonds</Link>
                                </div>
                            )}
                        </div>
                        <Link href="/shop?category=engagement-rings" className="nav-link">Engagement Rings</Link>
                        <Link href="/shop?category=stack-rings" className="nav-link">Stackable Rings</Link>
                        <Link href="/shop?category=fine-jewellery" className="nav-link">Fine Jewellery</Link>
                        <Link href="/customize" className="nav-link" style={{ color: 'var(--color-gold, #C5A467)' }}>Customize</Link>
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
                                        <Link
                                            href="/my-orders"
                                            onClick={() => setUserMenuOpen(false)}
                                            style={{
                                                display: 'block', width: '100%', padding: '8px 12px', fontSize: '0.75rem',
                                                fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase',
                                                border: '1px solid var(--color-gold, #C5A467)', background: 'transparent',
                                                color: 'var(--color-gold, #C5A467)', cursor: 'pointer',
                                                transition: 'all 0.3s ease', textAlign: 'center', textDecoration: 'none',
                                                marginBottom: '8px',
                                            }}
                                        >
                                            My Orders
                                        </Link>
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
                    <Link href="/shop?category=engagement-rings" className="nav-link" onClick={() => setMobileOpen(false)}>Engagement Rings</Link>
                    <Link href="/shop?category=stack-rings" className="nav-link" onClick={() => setMobileOpen(false)}>Stackable Rings</Link>
                    <Link href="/shop?category=fine-jewellery" className="nav-link" onClick={() => setMobileOpen(false)}>Fine Jewellery</Link>
                    <Link href="/shop?category=polished-diamonds" className="nav-link" onClick={() => setMobileOpen(false)} style={{ color: 'var(--color-gold, #C5A467)' }}>💎 Loose Diamonds</Link>
                    <Link href="/customize" className="nav-link" onClick={() => setMobileOpen(false)} style={{ color: 'var(--color-gold, #C5A467)' }}>✨ Customize</Link>
                    <Link href="/our-story" className="nav-link" onClick={() => setMobileOpen(false)}>Our Story</Link>
                    <div style={{ marginTop: '24px' }}>
                        {user ? (
                            <div>
                                <p style={{ fontSize: '0.85rem', marginBottom: '12px' }}>Welcome, <strong>{user.name}</strong></p>
                                <Link href="/my-orders" className="btn btn-outline btn-sm" onClick={() => setMobileOpen(false)} style={{ display: 'block', marginBottom: '8px', textAlign: 'center' }}>My Orders</Link>
                                <button onClick={() => { logout(); setMobileOpen(false); }} className="btn btn-outline btn-sm" style={{ width: '100%' }}>Sign Out</button>
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
