import { NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'NooreAdmin@2026';

export async function POST(request) {
    try {
        const { password } = await request.json();
        
        if (password === ADMIN_PASSWORD) {
            // Generate a simple session token (valid for 24 hours)
            const token = Buffer.from(`admin:${Date.now() + 24 * 60 * 60 * 1000}`).toString('base64');
            return NextResponse.json({ success: true, token });
        }

        return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Auth error' }, { status: 500 });
    }
}

// Verify token
export async function GET(request) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ valid: false }, { status: 401 });
        }

        const token = authHeader.slice(7);
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const [prefix, expiry] = decoded.split(':');
        
        if (prefix === 'admin' && parseInt(expiry) > Date.now()) {
            return NextResponse.json({ valid: true });
        }

        return NextResponse.json({ valid: false }, { status: 401 });
    } catch {
        return NextResponse.json({ valid: false }, { status: 401 });
    }
}
