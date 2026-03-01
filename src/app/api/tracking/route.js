import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { orderId, phone, awb } = await request.json();

        if (!orderId && !phone && !awb) {
            return NextResponse.json(
                { success: false, message: 'Please provide an Order ID, AWB number, or phone number.' },
                { status: 400 }
            );
        }

        // Check if NimbusPost is configured
        if (!process.env.NIMBUSPOST_EMAIL || !process.env.NIMBUSPOST_PASSWORD) {
            return NextResponse.json({
                success: false,
                message: 'Order tracking is currently being updated to a new courier partner (NimbusPost). Please contact us on WhatsApp or email for immediate order updates.',
                configured: false,
            });
        }

        // Tracking Logic Pending Nimbuspost API Keys
        return NextResponse.json({
            success: false,
            message: 'Tracking information is temporarily unavailable as we upgrade our systems. Please check back later or contact us.',
        });

    } catch (error) {
        console.error('Tracking API error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Unable to fetch tracking info. Please try again later or contact us.',
            },
            { status: 500 }
        );
    }
}
