import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Global OTP store (shared across routes in same process)
if (!global.__otpStore) {
    global.__otpStore = new Map();
}
const otpStore = global.__otpStore;

export async function POST(request) {
    try {
        const { phone } = await request.json();

        if (!phone || phone.length < 10) {
            return NextResponse.json(
                { success: false, message: 'Please enter a valid phone number' },
                { status: 400 }
            );
        }

        // Clean phone number
        const cleanPhone = phone.replace(/\D/g, '');

        // Rate limiting: max 3 OTPs per phone per 10 min
        const existing = otpStore.get(cleanPhone);
        if (existing && existing.attempts >= 3 && Date.now() - existing.firstAttempt < 10 * 60 * 1000) {
            return NextResponse.json(
                { success: false, message: 'Too many requests. Please try again in 10 minutes.' },
                { status: 429 }
            );
        }

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Ensure phone has country code (India = 91)
        let formattedPhone = cleanPhone;
        if (formattedPhone.length === 10) {
            formattedPhone = '91' + formattedPhone;
        }

        // Store OTP with 5-minute expiry
        otpStore.set(cleanPhone, {
            otp,
            expiresAt: Date.now() + 5 * 60 * 1000,
            attempts: (existing?.attempts || 0) + 1,
            firstAttempt: existing?.firstAttempt || Date.now(),
            verifyAttempts: 0,
        });

        // Send OTP via WhatsApp Bot API
        let whatsappSent = false;
        try {
            if (process.env.WHATSAPP_TOKEN && process.env.PHONE_NUMBER_ID) {
                const waResponse = await fetch(
                    `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            messaging_product: 'whatsapp',
                            to: formattedPhone,
                            type: 'text',
                            text: {
                                body: `🔐 Your Noore Jewels verification code is: *${otp}*\n\nThis code expires in 5 minutes. Do not share it with anyone.`
                            }
                        }),
                    }
                );
                const waResult = await waResponse.json();
                if (waResponse.ok && waResult.messages && waResult.messages.length > 0) {
                    whatsappSent = true;
                } else {
                    console.error('WhatsApp API error:', JSON.stringify(waResult));
                }
            }
        } catch (whatsappError) {
            console.error('WhatsApp OTP send error:', whatsappError);
        }

        // In development, log OTP for testing
        if (process.env.NODE_ENV !== 'production') {
            console.log(`[DEV] OTP for ${cleanPhone}: ${otp}`);
        }

        return NextResponse.json({
            success: true,
            message: whatsappSent
                ? 'OTP sent to your WhatsApp!'
                : 'We could not send OTP to your WhatsApp. Please use this code to verify.',
            whatsappSent,
            // If WhatsApp fails, show OTP directly so user can still sign in
            ...(!whatsappSent && { fallbackOtp: otp }),
            // Only in dev mode for testing
            ...(process.env.NODE_ENV !== 'production' && { devOtp: otp }),
        });

    } catch (error) {
        console.error('Send OTP error:', error);
        return NextResponse.json(
            { success: false, message: 'Server error. Please try again.' },
            { status: 500 }
        );
    }
}

// Cleanup expired OTPs every 10 minutes
setInterval(() => {
    const now = Date.now();
    for (const [phone, data] of otpStore.entries()) {
        if (now > data.expiresAt) {
            otpStore.delete(phone);
        }
    }
}, 10 * 60 * 1000);
