'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Global WhatsApp floating button.
 * - Hides on /admin pages
 * - Auto-hides when any element with [data-whatsapp-cta] is visible in the viewport,
 *   so the floating icon never overlaps the inline WhatsApp CTA sections.
 * - Shows a "Chat with us" tooltip on hover
 * - Supports product-specific pre-filled messages
 */
export default function WhatsAppFloat({ productName, productId }) {
    const [mounted, setMounted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [ctaVisible, setCtaVisible] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    // IntersectionObserver: hide when a WhatsApp CTA section is on screen
    useEffect(() => {
        if (!mounted) return;
        const targets = document.querySelectorAll('[data-whatsapp-cta]');
        if (targets.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const anyVisible = entries.some((e) => e.isIntersecting);
                setCtaVisible(anyVisible);
            },
            { threshold: 0 }
        );

        targets.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [mounted]);

    // Check if on admin page via Next.js pathname or window location
    const currentPath = pathname || (typeof window !== 'undefined' ? window.location.pathname : '');

    // Must NOT show on /admin pages
    if (!mounted || (currentPath && currentPath.startsWith('/admin'))) {
        return null;
    }

    // Build pre-filled WhatsApp message
    let message = "Hi! I'm interested in your jewellery collection. Can you help?";
    if (productName && productId) {
        message = `Hi! I'm interested in ${productName} (${productId}). Can you share more details?`;
    } else if (productName) {
        message = `Hi! I'm interested in ${productName}. Can you share more details?`;
    } else if (productId) {
        message = `Hi! I'm interested in (${productId}). Can you share more details?`;
    }

    const whatsappUrl = `https://wa.me/918076735450?text=${encodeURIComponent(message)}`;

    return (
        <>
            <style>{`
                @keyframes waPulse {
                    0% {
                        box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7);
                    }
                    70% {
                        box-shadow: 0 0 0 14px rgba(37, 211, 102, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
                    }
                }
            `}</style>
            <div
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    zIndex: 9990,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    opacity: ctaVisible ? 0 : 1,
                    pointerEvents: ctaVisible ? 'none' : 'auto',
                    transition: 'opacity 0.3s ease',
                }}
            >
                {/* Tooltip Label */}
                <div
                    style={{
                        marginBottom: '8px',
                        background: '#1a1a1a',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 500,
                        padding: '6px 12px',
                        borderRadius: '20px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                        pointerEvents: 'none',
                        whiteSpace: 'nowrap',
                        opacity: isHovered ? 1 : 0,
                        transform: isHovered ? 'translateY(0)' : 'translateY(6px)',
                        transition: 'opacity 0.2s ease, transform 0.2s ease',
                        letterSpacing: '0.3px',
                        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    }}
                >
                    Chat with us
                </div>

                {/* WhatsApp Floating Button */}
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat with us on WhatsApp"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{
                        width: '56px',
                        height: '56px',
                        backgroundColor: '#25D366',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease',
                        animation: 'waPulse 2.5s infinite',
                        border: 'none',
                        outline: 'none',
                    }}
                >
                    <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="#ffffff"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ display: 'block' }}
                    >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                </a>
            </div>
        </>
    );
}
