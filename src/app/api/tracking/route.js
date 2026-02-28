import { NextResponse } from 'next/server';

// Cache Shiprocket auth token (valid for 10 days)
let cachedToken = null;
let tokenExpiresAt = 0;

async function getShiprocketToken() {
    // Return cached token if still valid (refresh 1 day early)
    if (cachedToken && Date.now() < tokenExpiresAt) {
        return cachedToken;
    }

    const email = process.env.SHIPROCKET_EMAIL;
    const password = process.env.SHIPROCKET_PASSWORD;

    if (!email || !password) {
        throw new Error('Shiprocket credentials not configured');
    }

    const response = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok || !data.token) {
        throw new Error(`Shiprocket auth failed: ${JSON.stringify(data)}`);
    }

    cachedToken = data.token;
    // Token valid for 10 days, we refresh after 9
    tokenExpiresAt = Date.now() + 9 * 24 * 60 * 60 * 1000;

    return cachedToken;
}

// Track by order ID (Shiprocket order ID)
async function trackByOrderId(orderId, token) {
    const response = await fetch(
        `https://apiv2.shiprocket.in/v1/external/courier/track?order_id=${orderId}`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
    );
    return response.json();
}

// Track by AWB (waybill number)
async function trackByAWB(awb, token) {
    const response = await fetch(
        `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awb}`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
    );
    return response.json();
}

// Get orders by phone number
async function getOrdersByPhone(phone, token) {
    // Search orders — Shiprocket doesn't have a direct phone search,
    // so we fetch recent orders and filter
    const response = await fetch(
        `https://apiv2.shiprocket.in/v1/external/orders?search=${phone}&per_page=10`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
    );
    return response.json();
}

export async function POST(request) {
    try {
        const { orderId, phone, awb } = await request.json();

        if (!orderId && !phone && !awb) {
            return NextResponse.json(
                { success: false, message: 'Please provide an Order ID, AWB number, or phone number.' },
                { status: 400 }
            );
        }

        // Check if Shiprocket is configured
        if (!process.env.SHIPROCKET_EMAIL || !process.env.SHIPROCKET_PASSWORD) {
            return NextResponse.json({
                success: false,
                message: 'Order tracking is being set up. Please contact us on WhatsApp or email for order updates.',
                configured: false,
            });
        }

        const token = await getShiprocketToken();

        let trackingData = null;
        let orders = null;

        if (awb) {
            // Track by AWB number
            trackingData = await trackByAWB(awb, token);
        } else if (orderId) {
            // Track by order ID
            trackingData = await trackByOrderId(orderId, token);
        } else if (phone) {
            // Search orders by phone
            const cleanPhone = phone.replace(/\D/g, '');
            const searchPhone = cleanPhone.length > 10 ? cleanPhone.slice(-10) : cleanPhone;
            orders = await getOrdersByPhone(searchPhone, token);
        }

        // Format tracking response
        if (trackingData) {
            const tracking = trackingData.tracking_data || trackingData;

            return NextResponse.json({
                success: true,
                tracking: {
                    status: tracking.shipment_status || tracking.current_status || 'Unknown',
                    statusId: tracking.shipment_status_id,
                    courier: tracking.courier_name || 'N/A',
                    awb: tracking.awb_code || awb || 'N/A',
                    etd: tracking.etd || 'N/A',
                    activities: (tracking.shipment_track_activities || tracking.track_activities || []).map(a => ({
                        date: a.date,
                        activity: a.activity || a.status,
                        location: a.location || a['sr-status-label'] || '',
                    })),
                },
            });
        }

        if (orders && orders.data) {
            const orderList = (Array.isArray(orders.data) ? orders.data : [orders.data])
                .map(o => ({
                    id: o.id,
                    orderId: o.channel_order_id || o.id,
                    status: o.status,
                    createdAt: o.created_at,
                    products: o.products?.map(p => p.name).join(', ') || 'N/A',
                    awb: o.shipments?.[0]?.awb || null,
                }));

            return NextResponse.json({
                success: true,
                orders: orderList,
            });
        }

        return NextResponse.json({
            success: false,
            message: 'No tracking information found. Please check your details and try again.',
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
