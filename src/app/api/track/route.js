import { NextResponse } from 'next/server';
import { saveVisitor } from '@/lib/sheets';

// Simple in-memory deduplication: don't log the same IP on the same page more than once per 30 minutes
const recentVisits = new Map();

function getDedupeKey(ip, page) {
    return `${ip}__${page}`;
}

function isRecentVisit(ip, page) {
    const key = getDedupeKey(ip, page);
    const lastVisit = recentVisits.get(key);
    if (!lastVisit) return false;
    return Date.now() - lastVisit < 30 * 60 * 1000; // 30 minutes
}

function recordVisit(ip, page) {
    const key = getDedupeKey(ip, page);
    recentVisits.set(key, Date.now());

    // Clean up old entries every 1000 visits to prevent memory leak
    if (recentVisits.size > 1000) {
        const cutoff = Date.now() - 30 * 60 * 1000;
        for (const [k, t] of recentVisits.entries()) {
            if (t < cutoff) recentVisits.delete(k);
        }
    }
}

export async function POST(request) {
    try {
        const body = await request.json();

        // Get real IP from headers (works on Vercel)
        const forwarded = request.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0].trim() : 'Unknown';

        const { page, device, browser, os, referrer, screenSize, visitorName } = body;

        // Skip bots and empty pages
        if (!page) {
            return NextResponse.json({ ok: true });
        }

        // Deduplicate: same IP + same page within 30 min = don't log again
        if (isRecentVisit(ip, page)) {
            return NextResponse.json({ ok: true, skipped: true });
        }

        // Get location from IP using free ipapi.co service
        let city = 'Unknown';
        let country = 'Unknown';
        let region = 'Unknown';

        try {
            if (ip && ip !== 'Unknown' && ip !== '::1' && ip !== '127.0.0.1') {
                const geoRes = await fetch(`https://ipapi.co/${ip}/json/`, {
                    headers: { 'User-Agent': 'noore-jewels-tracker/1.0' },
                    signal: AbortSignal.timeout(3000), // 3 second timeout
                });
                if (geoRes.ok) {
                    const geo = await geoRes.json();
                    city = geo.city || 'Unknown';
                    region = geo.region || 'Unknown';
                    country = geo.country_name || 'Unknown';
                }
            } else {
                city = 'Localhost';
                country = 'Dev';
                region = 'Local';
            }
        } catch {
            // Geo lookup failed — still log the visit without location
        }

        // Determine referrer label
        let referrerLabel = 'Direct';
        if (referrer) {
            if (referrer.includes('google')) referrerLabel = 'Google';
            else if (referrer.includes('instagram')) referrerLabel = 'Instagram';
            else if (referrer.includes('facebook') || referrer.includes('fb.')) referrerLabel = 'Facebook';
            else if (referrer.includes('whatsapp')) referrerLabel = 'WhatsApp';
            else if (referrer.includes('twitter') || referrer.includes('t.co')) referrerLabel = 'Twitter';
            else referrerLabel = referrer.split('/')[2] || referrer; // domain only
        }

        await saveVisitor({
            timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            page: page || 'Unknown',
            city,
            region,
            country,
            device: device || 'Unknown',
            browser: browser || 'Unknown',
            os: os || 'Unknown',
            referrer: referrerLabel,
            screenSize: screenSize || 'Unknown',
            ip,
            visitorName: visitorName || 'Guest',
        });

        recordVisit(ip, page);

        return NextResponse.json({ ok: true });
    } catch (error) {
        // Never return errors to client — tracking should be silent
        console.error('Visitor track error:', error);
        return NextResponse.json({ ok: true });
    }
}
