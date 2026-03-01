import { NextResponse } from 'next/server';
import { getCoupons } from '@/lib/sheets';

export async function POST(request) {
    try {
        const { code, orderAmount } = await request.json();

        if (!code || !code.trim()) {
            return NextResponse.json(
                { success: false, message: 'Please enter a coupon code.' },
                { status: 400 }
            );
        }

        const coupons = await getCoupons();
        const coupon = coupons.find(c => c.code === code.toUpperCase().trim());

        if (!coupon) {
            return NextResponse.json(
                { success: false, message: 'Invalid coupon code. Please check and try again.' },
                { status: 404 }
            );
        }

        if (coupon.minOrder > 0 && orderAmount < coupon.minOrder) {
            return NextResponse.json(
                { success: false, message: `Minimum order of ₹${coupon.minOrder} required for this coupon.` },
                { status: 400 }
            );
        }

        let discountAmount = 0;
        if (coupon.type === 'percent') {
            discountAmount = Math.round((orderAmount * coupon.value) / 100);
        } else {
            // flat discount
            discountAmount = Math.round(coupon.value);
        }

        // Don't let discount exceed order amount
        discountAmount = Math.min(discountAmount, orderAmount);

        return NextResponse.json({
            success: true,
            coupon: {
                code: coupon.code,
                type: coupon.type,
                value: coupon.value,
                discountAmount,
            },
            message: coupon.type === 'percent'
                ? `${coupon.value}% discount applied! You save ₹${discountAmount}.`
                : `₹${discountAmount} discount applied!`,
        });

    } catch (error) {
        console.error('Coupon validation error:', error);
        return NextResponse.json(
            { success: false, message: 'Could not validate coupon. Please try again.' },
            { status: 500 }
        );
    }
}
