'use client';

import { useEffect } from 'react';

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

    useEffect(() => {
        // Only track ONCE per browser session — not on every page navigation
        const alreadyTracked = sessionStorage.getItem('nj_tracked');
        if (alreadyTracked) return;

        // Fire-and-forget — never block the page
        const track = async () => {
            try {
                const ua = navigator.userAgent;

                // Try to get the visitor's name if they are logged in
                // The auth system stores user info in localStorage
                let visitorName = '';
                try {
                    const authUser = localStorage.getItem('nj_user');
                    if (authUser) {
                        const parsed = JSON.parse(authUser);
                        visitorName = parsed.name || parsed.phone || '';
                    }
                } catch { /* ignore */ }

                await fetch('/api/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        page: document.title.split('—')[0].trim() || window.location.pathname,
                        device: getDevice(),
                        browser: getBrowser(ua),
                        os: getOS(ua),
                        referrer: document.referrer || '',
                        screenSize: `${window.screen.width}x${window.screen.height}`,
                        visitorName,
                    }),
                    keepalive: true,
                });

                // Mark as tracked for this browser session
                sessionStorage.setItem('nj_tracked', '1');
            } catch {
                // Silently ignore all errors
            }
        };

        // Small delay so it runs after the page is painted (non-blocking)
        const timer = setTimeout(track, 2000);
        return () => clearTimeout(timer);
    }, []); // Empty deps — only runs ONCE on first load

    // Renders nothing — purely functional component
    return null;
}
