'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Maps pathname to a readable page name
function getPageName(pathname) {
    if (pathname === '/') return 'Home';
    if (pathname.startsWith('/shop')) return 'Shop';
    if (pathname.startsWith('/product/')) {
        const parts = pathname.split('/');
        return `Product: ${parts[2] || 'Unknown'}`;
    }
    if (pathname.startsWith('/checkout')) return 'Checkout';
    if (pathname.startsWith('/our-story')) return 'Our Story';
    if (pathname.startsWith('/contact')) return 'Contact';
    if (pathname.startsWith('/my-orders')) return 'My Orders';
    if (pathname.startsWith('/track-order')) return 'Track Order';
    if (pathname.startsWith('/return-policy')) return 'Return Policy';
    if (pathname.startsWith('/privacy-policy')) return 'Privacy Policy';
    if (pathname.startsWith('/terms')) return 'Terms';
    return pathname;
}

// Detect device type from screen width
function getDevice() {
    const w = window.innerWidth;
    if (w < 768) return 'Mobile';
    if (w < 1024) return 'Tablet';
    return 'Desktop';
}

// Parse browser from user agent
function getBrowser(ua) {
    if (!ua) return 'Unknown';
    if (ua.includes('Edg/')) return 'Edge';
    if (ua.includes('OPR/') || ua.includes('Opera')) return 'Opera';
    if (ua.includes('Chrome/')) return 'Chrome';
    if (ua.includes('Safari/') && !ua.includes('Chrome')) return 'Safari';
    if (ua.includes('Firefox/')) return 'Firefox';
    if (ua.includes('MSIE') || ua.includes('Trident/')) return 'IE';
    return 'Other';
}

// Parse OS from user agent
function getOS(ua) {
    if (!ua) return 'Unknown';
    if (ua.includes('Windows NT')) return 'Windows';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
    if (ua.includes('Mac OS X')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    return 'Other';
}

export default function VisitorTracker() {
    const pathname = usePathname();

    useEffect(() => {
        // Fire-and-forget — never block the page
        const track = async () => {
            try {
                const ua = navigator.userAgent;

                await fetch('/api/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        page: getPageName(pathname),
                        device: getDevice(),
                        browser: getBrowser(ua),
                        os: getOS(ua),
                        referrer: document.referrer || '',
                        screenSize: `${window.screen.width}x${window.screen.height}`,
                    }),
                    // Don't wait for response — page load must not be affected
                    keepalive: true,
                });
            } catch {
                // Silently ignore all errors
            }
        };

        // Small delay so it runs after the page is painted (non-blocking)
        const timer = setTimeout(track, 1500);
        return () => clearTimeout(timer);
    }, [pathname]);

    // Renders nothing — purely functional component
    return null;
}
