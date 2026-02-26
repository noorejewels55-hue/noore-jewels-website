import { NextResponse } from 'next/server';
import { findCustomer } from '@/lib/sheets';

// Share the same otpStore (import from send-otp isn't possible with route handlers,
// so we use a global store approach)
const getOtpStore = () => {
    if (!global.__otpStore) {
        global.__otpStore = new Map();
    }
    return global.__otpStore;
};

export async function POST(request) {
    try {
        const { phone, otp } = await request.json();

        if (!phone || !otp) {
            return NextResponse.json(
                { success: false, message: 'Phone and OTP are required' },
                { status: 400 }
            );
        }

        const cleanPhone = phone.replace(/\D/g, '');
        const otpStore = getOtpStore();
        const stored = otpStore.get(cleanPhone);

        if (!stored) {
            return NextResponse.json(
                { success: false, message: 'OTP expired. Please request a new one.' },
                { status: 400 }
            );
        }

        // Check expiry
        if (Date.now() > stored.expiresAt) {
            otpStore.delete(cleanPhone);
            return NextResponse.json(
                { success: false, message: 'OTP expired. Please request a new one.' },
                { status: 400 }
            );
        }

        // Max 5 verify attempts
        if (stored.verifyAttempts >= 5) {
            otpStore.delete(cleanPhone);
            return NextResponse.json(
                { success: false, message: 'Too many attempts. Please request a new OTP.' },
                { status: 429 }
            );
        }

        // Update verify attempts
        stored.verifyAttempts = (stored.verifyAttempts || 0) + 1;
        otpStore.set(cleanPhone, stored);

        // Verify OTP
        if (stored.otp !== otp.trim()) {
            return NextResponse.json(
                { success: false, message: 'Incorrect OTP. Please try again.' },
                { status: 400 }
            );
        }

        // OTP correct — remove it
        otpStore.delete(cleanPhone);

        // Check if customer exists in Google Sheets
        let customer = null;
        try {
            customer = await findCustomer(cleanPhone);
        } catch (e) {
            console.error('Error finding customer:', e);
        }

        if (customer) {
            return NextResponse.json({
                success: true,
                user: {
                    phone: customer.phone,
                    name: customer.name,
                    city: customer.city,
                },
            });
        } else {
            // New user — need registration
            return NextResponse.json({
                success: true,
                user: null, // signals need for registration
            });
        }

    } catch (error) {
        console.error('Verify OTP error:', error);
        return NextResponse.json(
            { success: false, message: 'Server error. Please try again.' },
            { status: 500 }
        );
    }
}
