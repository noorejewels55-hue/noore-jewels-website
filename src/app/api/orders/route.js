import { NextResponse } from 'next/server';
import { getOrdersByPhone } from '@/lib/sheets';

// Simple request validation — verify phone matches session
// In a full production app, you'd use JWT or server-side sessions
export async function POST(request) {
    try {
        const { phone } = await request.json();

        if (!phone) {
            return NextResponse.json(
                { success: false, message: 'Phone number is required' },
                { status: 400 }
            );
        }

        // Basic validation: phone must be a valid format
        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length < 10 || cleanPhone.length > 12) {
            return NextResponse.json(
                { success: false, message: 'Invalid phone number' },
                { status: 400 }
            );
        }

        // Rate limiting: max 10 requests per phone per minute
        if (!global.__orderRateLimit) global.__orderRateLimit = new Map();
        const rateKey = cleanPhone;
        const now = Date.now();
        const rateData = global.__orderRateLimit.get(rateKey);

        if (rateData && rateData.count >= 10 && now - rateData.firstRequest < 60000) {
            return NextResponse.json(
                { success: false, message: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        if (!rateData || now - rateData.firstRequest >= 60000) {
            global.__orderRateLimit.set(rateKey, { count: 1, firstRequest: now });
        } else {
            rateData.count++;
            global.__orderRateLimit.set(rateKey, rateData);
        }

        const orders = await getOrdersByPhone(cleanPhone);

        return NextResponse.json({
            success: true,
            orders,
            count: orders.length,
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}
