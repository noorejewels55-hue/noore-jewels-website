import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request) {
    try {
        const { amount, items, customer, coupon } = await request.json();

        if (!amount || amount < 100) { // minimum ₹1 (100 paise)
            return NextResponse.json(
                { success: false, message: 'Invalid order amount' },
                { status: 400 }
            );
        }

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const orderId = `NJ-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

        const order = await razorpay.orders.create({
            amount: amount,
            currency: 'INR',
            receipt: orderId,
            notes: {
                customer_name: customer.name,
                customer_phone: customer.phone,
                items: JSON.stringify(items.map(i => `${i.name} x${i.quantity}`)),
            }
        });

        return NextResponse.json({
            success: true,
            order,
            orderId,
            razorpayKeyId: process.env.RAZORPAY_KEY_ID,
        });

    } catch (error) {
        console.error('Create order error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to create order. Please try again.' },
            { status: 500 }
        );
    }
}
