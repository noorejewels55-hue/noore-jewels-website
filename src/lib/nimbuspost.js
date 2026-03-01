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

    const response = await fetch('https://api.nimbuspost.com/v1/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!data.status || !data.data) {
        throw new Error(`NimbusPost auth failed: ${JSON.stringify(data)}`);
    }

    cachedToken = data.data; // token is returned in data.data according to standard nimbuspost jwt response (or we assume data.data is the token string if it's a direct API token)

    // Fallback: Sometimes token is in data.token
    if (typeof data.data === 'object' && data.data.token) {
        cachedToken = data.data.token;
    } else if (data.token) {
        cachedToken = data.token;
    } else if (typeof data.data === 'string') {
        cachedToken = data.data; // fallback
    }

    // Cache for 23 hours (usually JWTs are valid for 24h)
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
                qty: String(item.quantity),
                price: String(Math.round(effectivePrice)),
                sku: item.id || `SKU-${Date.now()}-${index}`
            };
        });

        // Use standard dimensions for jewelry
        const orderPayload = {
            order_number: orderId,
            payment_type: "prepaid",
            order_amount: effectiveTotal,
            package_weight: 500, // 500 grams minimum standard
            package_length: 10,
            package_breadth: 10,
            package_height: 10,
            request_auto_pickup: "yes",
            courier_id: "autoship", // Automatically assign best courier
            is_insurance: "0",
            consignee: {
                name: customer.name.trim() || 'Valued Customer',
                address: customer.address || 'N/A',
                city: customer.city || 'N/A',
                state: customer.state || 'N/A',
                pincode: String(customer.pincode).replace(/\D/g, '') || '000000',
                phone: String(customer.phone).replace(/\D/g, '') || '9999999999',
                email: customer.email || 'noore.jewels55@gmail.com'
            },
            pickup: {
                // It typically falls back to default if minimal data is provided, but we pass warehouse name explicitly if required.
                warehouse_name: "warehouse",
            },
            order_items: orderItems
        };

        const response = await fetch('https://api.nimbuspost.com/v1/shipments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderPayload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('NimbusPost order creation error:', data);
        }

        return data;
    } catch (e) {
        console.error('Error in createNimbusPostOrder:', e);
        return null;
    }
}
