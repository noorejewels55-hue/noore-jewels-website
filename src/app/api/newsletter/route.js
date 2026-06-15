import { NextResponse } from 'next/server';
import { saveLead } from '@/lib/sheets';

const COUPON_CODE = 'WELCOME10';

export async function POST(request) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { success: false, message: 'Valid email address is required.' },
                { status: 400 }
            );
        }

        // Save as a lead in Google Sheets
        await saveLead({
            timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            name: 'Newsletter Subscriber',
            phone: email.trim(), // Storing email in the phone column
            coupon: COUPON_CODE,
        });

        return NextResponse.json({
            success: true,
            couponCode: COUPON_CODE,
            message: 'Subscribed successfully!',
        });
    } catch (error) {
        console.error('Error saving newsletter subscription:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to subscribe. Please try again.' },
            { status: 500 }
        );
    }
}
