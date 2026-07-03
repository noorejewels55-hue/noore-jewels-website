import { NextResponse } from 'next/server';

export function middleware(request) {
    const response = NextResponse.next();

    // ── Security Headers ──
    // Prevent clickjacking
    response.headers.set('X-Frame-Options', 'DENY');
    // Prevent MIME type sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff');
    // XSS Protection (legacy browsers)
    response.headers.set('X-XSS-Protection', '1; mode=block');
    // Referrer Policy
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    // Permissions Policy — restrict dangerous browser APIs
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(self)');
    // Strict Transport Security (force HTTPS)
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    // Content Security Policy
    response.headers.set('Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://checkout.razorpay.com https://api.razorpay.com; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "img-src 'self' data: blob: https://lh3.googleusercontent.com https://*.googleusercontent.com https://res.cloudinary.com https://*.cloudinary.com; " +
        "media-src 'self' https://res.cloudinary.com https://*.cloudinary.com https://drive.google.com blob: data:; " +
        "connect-src 'self' https://api.razorpay.com https://lumberjack-cx.razorpay.com https://raw.githack.com https://*.githack.com https://cdn.jsdelivr.net https://*.jsdelivr.net https://dl.polyhaven.org https://*.polyhaven.org https://*.polyhaven.net https://*.githubusercontent.com; " +
        "frame-src https://api.razorpay.com https://checkout.razorpay.com https://drive.google.com; " +
        "worker-src 'self' blob:; " +
        "child-src blob:; " +
        "object-src 'none'; " +
        "base-uri 'self';"
    );

    return response;
}

// Apply to all routes except static files
export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.png|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)',
    ],
};
