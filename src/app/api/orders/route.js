import { NextResponse } from 'next/server';
import { getOrdersByPhone } from '@/lib/sheets';

export async function POST(request) {
    try {
        const { phone } = await request.json();

        if (!phone) {
            return NextResponse.json(
                { success: false, message: 'Phone number is required' },
                { status: 400 }
            );
        }

        const orders = await getOrdersByPhone(phone);

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
