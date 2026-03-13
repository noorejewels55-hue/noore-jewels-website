import { NextResponse } from 'next/server';

// Temporary debug endpoint to check OTP configuration
// DELETE THIS FILE after debugging!
export async function GET() {
    return NextResponse.json({
        GMAIL_USER_SET: !!process.env.GMAIL_USER,
        GMAIL_USER_VALUE: process.env.GMAIL_USER
            ? process.env.GMAIL_USER.substring(0, 5) + '***'
            : 'NOT SET',
        GMAIL_APP_PASSWORD_SET: !!process.env.GMAIL_APP_PASSWORD,
        GMAIL_APP_PASSWORD_LENGTH: process.env.GMAIL_APP_PASSWORD
            ? process.env.GMAIL_APP_PASSWORD.length
            : 0,
        NODE_ENV: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
        message: 'If GMAIL_APP_PASSWORD_SET is false, OTP emails will NOT be sent. Add it in Vercel Dashboard → Settings → Environment Variables.',
    });
}
