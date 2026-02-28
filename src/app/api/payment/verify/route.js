import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { saveOrder } from '@/lib/sheets';
import nodemailer from 'nodemailer';

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

        // Send Email confirmation to customer and owner
        try {
            if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD && customer.email) {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.GMAIL_USER,
                        pass: process.env.GMAIL_APP_PASSWORD,
                    },
                });

                const itemsListHtml = items.map(i => `
                    <li style="margin-bottom: 8px;">
                        <strong>${i.name}</strong> (Qty: ${i.quantity})
                    </li>
                `).join('');

                const totalAmount = items.reduce((sum, i) => {
                    const price = i.discount > 0 ? i.price * (1 - i.discount / 100) : i.price;
                    return sum + price * i.quantity;
                }, 0);

                await transporter.sendMail({
                    from: `"Noore Jewels" <${process.env.GMAIL_USER}>`,
                    to: customer.email,
                    bcc: process.env.GMAIL_USER, // Send a copy to the owner
                    subject: `Order Confirmed! #${orderId} - Noore Jewels`,
                    html: `
                        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #FDFBF7; color: #333;">
                            <div style="text-align: center; padding-bottom: 24px; border-bottom: 1px solid #E8E0D4;">
                                <h1 style="font-size: 20px; color: #2C2420; margin: 0; letter-spacing: 0.1em;">NOORE <span style="color: #C5A467;">JEWELS</span></h1>
                            </div>
                            
                            <h2 style="color: #2C2420;">Thank you for your order, ${customer.name}!</h2>
                            <p>We've received your order <strong>#${orderId}</strong> and are getting it ready for shipment.</p>
                            
                            <div style="background: #fff; padding: 20px; border-radius: 8px; margin: 24px 0; border: 1px solid #E8E0D4;">
                                <h3 style="margin-top: 0; color: #C5A467;">Delivery Details</h3>
                                <p style="margin: 0; line-height: 1.6;">
                                    ${customer.name}<br>
                                    ${customer.phone}<br>
                                    ${customer.address}<br>
                                    ${customer.city} - ${customer.pincode}
                                </p>
                            </div>

                            <div style="background: #fff; padding: 20px; border-radius: 8px; border: 1px solid #E8E0D4;">
                                <h3 style="margin-top: 0; color: #C5A467;">Order Summary</h3>
                                <ul style="list-style-type: none; padding: 0;">
                                    ${itemsListHtml}
                                </ul>
                                <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #E8E0D4;">
                                    <strong>Total Paid:</strong> ₹${Math.round(totalAmount).toLocaleString('en-IN')}
                                </div>
                            </div>
                            
                            <p style="margin-top: 32px; font-size: 0.9em; color: #777; text-align: center;">
                                If you have any questions, reply to this email or chat with us on WhatsApp!
                            </p>
                        </div>
                    `
                });
            }
        } catch (emailError) {
            console.error('Email notification error:', emailError);
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
