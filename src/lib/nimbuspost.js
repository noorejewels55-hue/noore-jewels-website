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

        const pickupPincode = '122011'; // Noore Jewels warehouse pincode
        const destPincode = String(customer.pincode || '').replace(/\D/g, '') || '110001';

        // Step 1: Find cheapest available courier
        console.log('[NimbusPost] Checking courier serviceability...');
        let courierId = 15; // Default: Ekart (cheapest fallback)
        try {
            const serviceRes = await fetch('https://api.nimbuspost.com/v1/courier/serviceability', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    origin: pickupPincode,
                    destination: destPincode,
                    payment_type: 'prepaid',
                    order_amount: effectiveTotal,
                    weight: 500,
                    length: 10,
                    breadth: 10,
                    height: 5
                })
            });
            const serviceData = await serviceRes.json();
            if (serviceData.status && serviceData.data && serviceData.data.length > 0) {
                // Pick the cheapest courier
                const cheapest = serviceData.data.reduce((a, b) =>
                    parseFloat(a.total_charges) < parseFloat(b.total_charges) ? a : b
                );
                courierId = parseInt(cheapest.id);
                console.log(`[NimbusPost] Selected courier: ${cheapest.name} (ID: ${courierId}) at ₹${cheapest.total_charges}`);
            }
        } catch (serviceErr) {
            console.error('[NimbusPost] Serviceability check failed, using default courier:', serviceErr.message);
        }

        // Step 2: Map items
        const orderItems = items.map((item, index) => {
            const effectivePrice = item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;
            return {
                name: item.name,
                qty: item.quantity,
                price: Math.round(effectivePrice),
                sku: item.id || `SKU-${index}`
            };
        });

        // Step 3: Create shipment
        const orderPayload = {
            order_number: orderId,
            payment_type: "prepaid",
            order_amount: effectiveTotal,
            package_weight: 500,
            package_length: 10,
            package_breadth: 10,
            package_height: 5,
            request_auto_pickup: "no",
            courier_id: courierId,
            consignee: {
                name: customer.name?.trim() || 'Customer',
                address: customer.address || 'N/A',
                address_2: '',
                city: customer.city || 'N/A',
                state: customer.state || 'N/A',
                pincode: destPincode,
                phone: String(customer.phone || '').replace(/\D/g, '') || '0000000000',
                email: customer.email || ''
            },
            pickup: {
                warehouse_name: "Noore Jewels",
                name: "Noore Jewels",
                address: "House No 505, Ganpati Apartment, Sector 56",
                address_2: "",
                city: "Gurugram",
                state: "Haryana",
                pincode: pickupPincode,
                phone: "9888145111"
            },
            order_items: orderItems
        };

        console.log('[NimbusPost] Creating order:', orderId);

        const response = await fetch('https://api.nimbuspost.com/v1/shipments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderPayload)
        });

        const data = await response.json();
        console.log('[NimbusPost] Response:', JSON.stringify(data));

        if (data.status) {
            console.log('[NimbusPost] ✅ ORDER CREATED! AWB:', data.data?.awb_number, 'Order ID:', data.data?.order_id);
        } else {
            console.error('[NimbusPost] ❌ FAILED:', data.message);
        }

        return data;
    } catch (e) {
        console.error('[NimbusPost] Error:', e.message || e);
        return null;
    }
}

