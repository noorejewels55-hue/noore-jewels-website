import { NextResponse } from 'next/server';
import { saveLead } from '@/lib/sheets';

const COUPON_CODE = 'WELCOME10'; // 10% off — must exist in Coupons sheet

export async function POST(request) {
    try {
        const { phone, name } = await request.json();

        if (!phone || phone.replace(/\D/g, '').length < 10) {
            return NextResponse.json(
                { success: false, message: 'Valid phone number is required' },
                { status: 400 }
            );
        }

        const cleanPhone = phone.replace(/\D/g, '').slice(-10);

        await saveLead({
            phone: cleanPhone,
            name: name?.trim() || 'Guest',
            coupon: COUPON_CODE,
            timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        });

        return NextResponse.json({
            success: true,
            couponCode: COUPON_CODE,
            message: 'Lead saved successfully',
        });
    } catch (error) {
        console.error('Error saving lead:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to save. Please try again.' },
            { status: 500 }
        );
    }
}
