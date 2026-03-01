import { NextResponse } from 'next/server';
import { getNimbusPostToken } from '@/lib/nimbuspost';

async function trackShipment(awb, token) {
    const response = await fetch(`https://api.nimbuspost.com/v1/shipments/track/${awb}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return response.json();
}

export async function POST(request) {
    try {
        const { orderId, phone, awb } = await request.json();

        // Standard Tracking is typically via AWB in Nimbuspost
        if (!awb) {
            return NextResponse.json(
                { success: false, message: 'Please provide your AWB tracking number sent to your email.' },
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

        const token = await getNimbusPostToken();
        const trackingData = await trackShipment(awb, token);

        if (trackingData && trackingData.status && trackingData.data) {
            const data = trackingData.data;
            const history = data.history || [];

            return NextResponse.json({
                success: true,
                tracking: {
                    status: data.status || 'Unknown',
                    courier: data.courier_name || 'NimbusPost',
                    awb: awb,
                    etd: data.edd || 'N/A', // Estimated Delivery Date
                    activities: history.map(h => ({
                        date: h.event_time,
                        activity: h.message || h.status,
                        location: h.location || ''
                    }))
                }
            });
        }

        return NextResponse.json({
            success: false,
            message: 'No tracking information found for this AWB. Please check your details and try again.',
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
