import Link from 'next/link';
import NewsletterForm from './NewsletterForm';

export default function Footer() {
    return (
        <footer className="footer-v2">
            {/* ── TOP TRUST BAR ── */}
            <div className="footer-trust-bar">
                <div className="container">
                    <div className="footer-trust-row">
                        {[
                            { icon: '💎', text: 'IGI Certified Diamonds' },
                            { icon: '🛡️', text: 'Lifetime Warranty' },
                            { icon: '📦', text: 'Insured Shipping' },
                            { icon: '🔄', text: '7-Day Returns' },
                            { icon: '🔒', text: 'Secure Payments' },
                            { icon: '🇮🇳', text: 'Pan India Delivery' },
                        ].map((item, i) => (
                            <div key={i} className="footer-trust-item">
                                <span className="footer-trust-icon">{item.icon}</span>
                                <span className="footer-trust-text">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── NEWSLETTER ── */}
            <div className="footer-newsletter">
                <div className="container">
                    <div className="footer-newsletter-inner">
                        <div className="footer-newsletter-copy">
                            <div className="footer-newsletter-label">The Inner Circle</div>
                            <h3 className="footer-newsletter-title">Join Noore Jewels</h3>
                            <p className="footer-newsletter-sub">Get early access to new collections, exclusive offers & styling inspiration.</p>
                        </div>
                        <NewsletterForm />
                    </div>
                </div>
            </div>

            {/* ── MAIN FOOTER ── */}
            <div className="footer-main">
                <div className="container">
                    <div className="footer-v2-grid">

                        {/* Brand */}
                        <div className="footer-v2-brand-col">
                            <div className="footer-v2-logo">Nooré Jewels</div>
                            <p className="footer-v2-desc">
                                Handcrafted Lab Grown Diamond jewellery in 9kt, 14kt &amp; 18kt gold. IGI certified stones, ethically made, delivered across India.
                            </p>
                            <div className="footer-v2-socials">
                                <a href="https://www.instagram.com/noore.jewels/" target="_blank" rel="noopener noreferrer" className="footer-v2-social" title="Instagram">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                                    </svg>
                                </a>
                                <a href="https://wa.me/918076735450" target="_blank" rel="noopener noreferrer" className="footer-v2-social" title="WhatsApp">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                    </svg>
                                </a>
                                <a href="mailto:noore.jewels55@gmail.com" className="footer-v2-social" title="Email">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                        <polyline points="22,6 12,13 2,6"/>
                                    </svg>
                                </a>
                                <a href="https://www.reddit.com/user/NooreJewels/" target="_blank" rel="noopener noreferrer" className="footer-v2-social" title="Reddit">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 01-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 01.042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 014.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 01.14-.197.35.35 0 01.238-.042l2.906.617a1.214 1.214 0 011.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.249-.561 1.249-1.249 0-.688-.562-1.249-1.25-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 00-.231.094.33.33 0 000 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 000-.462.342.342 0 00-.462 0c-.545.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 00-.205-.095z"/>
                                    </svg>
                                </a>
                            </div>

                            {/* Payment badges */}
                            <div className="footer-payment-badges">
                                <span className="footer-payment-badge">Razorpay</span>
                                <span className="footer-payment-badge">UPI</span>
                                <span className="footer-payment-badge">Visa</span>
                                <span className="footer-payment-badge">Mastercard</span>
                                <span className="footer-payment-badge">NetBanking</span>
                            </div>
                        </div>

                        {/* Shop */}
                        <div>
                            <h4 className="footer-v2-heading">Collections</h4>
                            <ul className="footer-v2-links">
                                <li><Link href="/shop">All Jewellery</Link></li>
                                <li><Link href="/shop?category=engagement-rings">Engagement Rings</Link></li>
                                <li><Link href="/shop?category=stackable-rings">Stackable Rings</Link></li>
                                <li><Link href="/shop?category=fine-jewellery">Fine Jewellery</Link></li>
                                <li><Link href="/shop?category=polished-diamonds">Loose Diamonds</Link></li>
                                <li><Link href="/customize">✨ Customize Your Ring</Link></li>
                                <li><Link href="/shop?tag=new">New Arrivals</Link></li>
                                <li><Link href="/shop?tag=bestseller">Best Sellers</Link></li>
                            </ul>
                        </div>

                        {/* Help */}
                        <div>
                            <h4 className="footer-v2-heading">Customer Care</h4>
                            <ul className="footer-v2-links">
                                <li><Link href="/our-story">Our Story</Link></li>
                                <li><Link href="/blog">Blog</Link></li>
                                <li><Link href="/contact">Contact Us</Link></li>
                                <li><Link href="/my-orders">My Orders</Link></li>
                                <li><Link href="/track-order">Track Order</Link></li>
                                <li>
                                    <a href="https://wa.me/918076735450?text=Hi! I need help" target="_blank" rel="noopener noreferrer">
                                        💬 WhatsApp Support
                                    </a>
                                </li>
                                <li><Link href="/return-policy">Return &amp; Warranty</Link></li>
                                <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                                <li><Link href="/terms">Terms &amp; Conditions</Link></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="footer-v2-heading">Get In Touch</h4>
                            <div className="footer-v2-contact">
                                <div className="footer-v2-contact-item">
                                    <span className="footer-v2-contact-icon">📍</span>
                                    <span>India — Pan India Delivery</span>
                                </div>
                                <div className="footer-v2-contact-item">
                                    <span className="footer-v2-contact-icon">📱</span>
                                    <a href="https://wa.me/918076735450">+91 80767 35450</a>
                                </div>
                                <div className="footer-v2-contact-item">
                                    <span className="footer-v2-contact-icon">✉️</span>
                                    <a href="mailto:noore.jewels55@gmail.com">noore.jewels55@gmail.com</a>
                                </div>
                                <div className="footer-v2-contact-item">
                                    <span className="footer-v2-contact-icon">⏰</span>
                                    <span>Mon–Sat, 10am – 7pm IST</span>
                                </div>
                            </div>

                            <div className="footer-v2-certifications">
                                <div className="footer-v2-cert">
                                    <span className="footer-v2-cert-icon">🏅</span>
                                    <div>
                                        <div className="footer-v2-cert-title">IGI Certified</div>
                                        <div className="footer-v2-cert-sub">Every diamond</div>
                                    </div>
                                </div>
                                <div className="footer-v2-cert">
                                    <span className="footer-v2-cert-icon">🏆</span>
                                    <div>
                                        <div className="footer-v2-cert-title">BIS Hallmarked</div>
                                        <div className="footer-v2-cert-sub">All gold jewellery</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ── BOTTOM BAR ── */}
            <div className="footer-v2-bottom">
                <div className="container">
                    <div className="footer-v2-bottom-inner">
                        <span>© {new Date().getFullYear()} Nooré Jewels. All rights reserved.</span>
                        <span className="footer-v2-bottom-divider">|</span>
                        <span>Lab Grown Diamond Jewellery — Crafted with love in India 🇮🇳</span>
                        <span className="footer-v2-bottom-divider">|</span>
                        <span style={{ color: 'rgba(255,255,255,0.2)' }}>Made with ❤️ by the Noore team</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
