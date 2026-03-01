// src/lib/shiprocket.js

let cachedToken = null;
let tokenExpiresAt = 0;

export async function getShiprocketToken() {
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

export async function createShiprocketOrder({ orderId, customer, items, totalAmount }) {
    try {
        const token = await getShiprocketToken();

        // Convert to Shiprocket items
        const orderItems = items.map(item => {
            const effectivePrice = item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;
            return {
                name: item.name,
                sku: item.id || `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                units: item.quantity,
                selling_price: Math.round(effectivePrice),
            };
        });

        // Split name accurately
        const nameParts = customer.name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '.';

        const orderPayload = {
            order_id: orderId,
            order_date: new Date().toISOString().split('T')[0],
            pickup_location: "", // Leaving blank forces Shiprocket to use your default Primary pickup location
            channel_id: "",
            comment: "Order directly from Website",
            billing_customer_name: firstName,
            billing_last_name: lastName,
            billing_address: customer.address,
            billing_city: customer.city,
            billing_pincode: customer.pincode,
            billing_state: customer.state || "Delhi", // Fallback required by API
            billing_country: "India",
            billing_email: customer.email || 'noore.jewels55@gmail.com',
            billing_phone: customer.phone,
            shipping_is_billing: true,
            order_items: orderItems,
            payment_method: "Prepaid",
            sub_total: totalAmount,
            length: 10,
            breadth: 10,
            height: 10,
            weight: 0.5 // Standard base minimum weight for jewelry (0.5kg)
        };

        const response = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderPayload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Shiprocket order creation error response:', data);
        }

        return data;
    } catch (e) {
        console.error('Error in createShiprocketOrder:', e);
        return null;
    }
}
