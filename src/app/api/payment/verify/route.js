import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { saveOrder } from '@/lib/sheets';

export async function POST(request) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            items,
            customer
        } = await request.json();

        // Verify signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json(
                { success: false, message: 'Payment verification failed — invalid signature' },
                { status: 400 }
            );
        }

        // Payment verified — save orders to Google Sheets
        const orderId = `NJ-${Date.now().toString(36).toUpperCase()}`;

        for (const item of items) {
            const effectivePrice = item.discount > 0
                ? item.price * (1 - item.discount / 100)
                : item.price;

            try {
                await saveOrder({
                    orderId,
                    phone: customer.phone,
                    name: customer.name,
                    productId: item.id,
                    productName: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    discount: item.discount || 0,
                    finalAmount: Math.round(effectivePrice * item.quantity),
                    paymentStatus: 'Paid',
                });
            } catch (e) {
                console.error('Error saving order line:', e);
            }
        }

        // Send WhatsApp notification to owner (if configured)
        try {
            if (process.env.WHATSAPP_TOKEN && process.env.PHONE_NUMBER_ID && process.env.OWNER_PHONE) {
                const itemsList = items.map(i => `• ${i.name} x${i.quantity}`).join('\n');
                const totalAmount = items.reduce((sum, i) => {
                    const price = i.discount > 0 ? i.price * (1 - i.discount / 100) : i.price;
                    return sum + price * i.quantity;
                }, 0);

                await fetch(
                    `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            messaging_product: 'whatsapp',
                            to: process.env.OWNER_PHONE,
                            type: 'text',
                            text: {
                                body: `🎉 *New Website Order!*\n\n📦 Order: ${orderId}\n👤 ${customer.name}\n📞 ${customer.phone}\n📍 ${customer.address}, ${customer.city} - ${customer.pincode}\n\n🛍️ Items:\n${itemsList}\n\n💰 Total: ₹${Math.round(totalAmount).toLocaleString('en-IN')}\n✅ Payment: Confirmed\n💳 Razorpay ID: ${razorpay_payment_id}`
                            }
                        }),
                    }
                );
            }
        } catch (whatsappError) {
            console.error('WhatsApp notification error:', whatsappError);
        }

        return NextResponse.json({
            success: true,
            orderId,
            paymentId: razorpay_payment_id,
        });

    } catch (error) {
        console.error('Payment verify error:', error);
        return NextResponse.json(
            { success: false, message: 'Payment verification error' },
            { status: 500 }
        );
    }
}
