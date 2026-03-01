// src/lib/nimbuspost.js

let cachedToken = null;
let tokenExpiresAt = 0;

export async function getNimbusPostToken() {
    if (cachedToken && Date.now() < tokenExpiresAt) {
        return cachedToken;
    }

    const email = process.env.NIMBUSPOST_EMAIL;
    const password = process.env.NIMBUSPOST_PASSWORD;

    if (!email || !password) {
        throw new Error('NimbusPost credentials not configured');
    }

    console.log('[NimbusPost] Attempting login with email:', email);

    const response = await fetch('https://api.nimbuspost.com/v1/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log('[NimbusPost] Login response status:', response.status);
    console.log('[NimbusPost] Login response:', JSON.stringify(data).substring(0, 500));

    if (!data.status) {
        throw new Error(`NimbusPost auth failed: ${JSON.stringify(data)}`);
    }

    // Extract token - NimbusPost returns it in data field
    if (typeof data.data === 'string') {
        cachedToken = data.data;
    } else if (typeof data.data === 'object' && data.data?.token) {
        cachedToken = data.data.token;
    } else if (data.token) {
        cachedToken = data.token;
    } else {
        cachedToken = data.data;
    }

    console.log('[NimbusPost] Token obtained successfully, type:', typeof cachedToken);

    // Cache for 23 hours
    tokenExpiresAt = Date.now() + 23 * 60 * 60 * 1000;
    return cachedToken;
}

export async function createNimbusPostOrder({ orderId, customer, items, totalAmount }) {
    try {
        const token = await getNimbusPostToken();
        const effectiveTotal = Math.round(totalAmount);

        // Map items to NimbusPost format
        const orderItems = items.map((item, index) => {
            const effectivePrice = item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;
            return {
                name: item.name,
                qty: item.quantity,
                price: Math.round(effectivePrice),
                sku: item.id || `SKU-${index}`
            };
        });

        const orderPayload = {
            order_number: orderId,
            payment_type: "prepaid",
            order_amount: effectiveTotal,
            package_weight: 0.5,
            package_length: 10,
            package_breadth: 10,
            package_height: 5,
            request_auto_pickup: "yes",
            consignee: {
                name: customer.name?.trim() || 'Customer',
                address: customer.address || 'N/A',
                address_2: '',
                city: customer.city || 'N/A',
                state: customer.state || 'N/A',
                pincode: String(customer.pincode || '').replace(/\D/g, '') || '000000',
                phone: String(customer.phone || '').replace(/\D/g, '') || '0000000000',
                email: customer.email || ''
            },
            pickup: {
                warehouse_name: "Noore Jewels",
            },
            order_items: orderItems
        };

        console.log('[NimbusPost] Creating order with payload:', JSON.stringify(orderPayload, null, 2));

        const response = await fetch('https://api.nimbuspost.com/v1/shipments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderPayload)
        });

        const data = await response.json();
        console.log('[NimbusPost] Create order response status:', response.status);
        console.log('[NimbusPost] Create order response:', JSON.stringify(data));

        if (!data.status) {
            console.error('[NimbusPost] ORDER CREATION FAILED:', JSON.stringify(data));
        } else {
            console.log('[NimbusPost] ORDER CREATED SUCCESSFULLY!');
        }

        return data;
    } catch (e) {
        console.error('[NimbusPost] Error in createNimbusPostOrder:', e.message || e);
        return null;
    }
}

