import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
    try {
        const { name, email, message } = await request.json();

        // Validate inputs
        if (!name || !name.trim()) {
            return NextResponse.json(
                { success: false, message: 'Please enter your name' },
                { status: 400 }
            );
        }
        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { success: false, message: 'Please enter a valid email' },
                { status: 400 }
            );
        }
        if (!message || message.trim().length < 5) {
            return NextResponse.json(
                { success: false, message: 'Please enter a message (minimum 5 characters)' },
                { status: 400 }
            );
        }

        // Rate limiting
        if (!global.__contactRateLimit) global.__contactRateLimit = new Map();
        const rateKey = email.toLowerCase().trim();
        const now = Date.now();
        const rateData = global.__contactRateLimit.get(rateKey);

        if (rateData && rateData.count >= 3 && now - rateData.firstRequest < 10 * 60 * 1000) {
            return NextResponse.json(
                { success: false, message: 'Too many messages. Please try again in 10 minutes.' },
                { status: 429 }
            );
        }

        if (!rateData || now - rateData.firstRequest >= 10 * 60 * 1000) {
            global.__contactRateLimit.set(rateKey, { count: 1, firstRequest: now });
        } else {
            rateData.count++;
            global.__contactRateLimit.set(rateKey, rateData);
        }

        // Send email to owner
        const gmailUser = process.env.GMAIL_USER || 'noore.jewels55@gmail.com';

        if (!process.env.GMAIL_APP_PASSWORD) {
            return NextResponse.json(
                { success: false, message: 'Email service is not configured. Please contact us via WhatsApp.' },
                { status: 500 }
            );
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: gmailUser,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        // Send notification email to the business owner
        await transporter.sendMail({
            from: `"Noore Jewels Website" <${gmailUser}>`,
            to: gmailUser,
            replyTo: email,
            subject: `💬 New Contact Message from ${name.trim()}`,
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #FDFBF7; color: #333;">
                    <div style="text-align: center; padding-bottom: 24px; border-bottom: 1px solid #E8E0D4;">
                        <h1 style="font-size: 20px; color: #2C2420; margin: 0; letter-spacing: 0.1em;">NOORE <span style="color: #C5A467;">JEWELS</span></h1>
                        <p style="font-size: 12px; color: #8B7355; margin-top: 4px;">NEW CONTACT MESSAGE</p>
                    </div>
                    
                    <div style="padding: 24px 0;">
                        <div style="background: #fff; padding: 20px; border-radius: 8px; border: 1px solid #E8E0D4; margin-bottom: 16px;">
                            <h3 style="margin-top: 0; color: #C5A467; font-size: 14px;">From</h3>
                            <p style="margin: 0; line-height: 1.6;">
                                <strong>${name.trim()}</strong><br>
                                <a href="mailto:${email}" style="color: #C5A467;">${email}</a>
                            </p>
                        </div>
                        
                        <div style="background: #fff; padding: 20px; border-radius: 8px; border: 1px solid #E8E0D4;">
                            <h3 style="margin-top: 0; color: #C5A467; font-size: 14px;">Message</h3>
                            <p style="margin: 0; line-height: 1.8; white-space: pre-wrap;">${message.trim()}</p>
                        </div>
                    </div>
                    
                    <div style="text-align: center; padding-top: 16px; border-top: 1px solid #E8E0D4;">
                        <p style="font-size: 11px; color: #AAA;">Reply directly to this email to respond to the customer.</p>
                    </div>
                </div>
            `,
        });

        // Send confirmation email to the customer
        await transporter.sendMail({
            from: `"Noore Jewels" <${gmailUser}>`,
            to: email,
            subject: `Thank you for contacting Noore Jewels! ✨`,
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #FDFBF7; color: #333;">
                    <div style="text-align: center; padding-bottom: 24px; border-bottom: 1px solid #E8E0D4;">
                        <h1 style="font-size: 20px; color: #2C2420; margin: 0; letter-spacing: 0.1em;">NOORE <span style="color: #C5A467;">JEWELS</span></h1>
                    </div>
                    
                    <div style="padding: 24px 0; text-align: center;">
                        <h2 style="color: #2C2420; font-size: 18px;">Thank you, ${name.trim()}!</h2>
                        <p style="color: #555; line-height: 1.8;">We've received your message and will get back to you within 24 hours.</p>
                        <p style="color: #555; line-height: 1.8;">For faster support, feel free to chat with us on WhatsApp:</p>
                        <a href="https://wa.me/918076735450" style="display: inline-block; padding: 12px 24px; background: #25D366; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 12px;">💬 Chat on WhatsApp</a>
                    </div>
                    
                    <div style="text-align: center; padding-top: 16px; border-top: 1px solid #E8E0D4;">
                        <p style="font-size: 11px; color: #AAA;">© 2026 Noore Jewels • noorejewels.in</p>
                    </div>
                </div>
            `,
        });

        return NextResponse.json({
            success: true,
            message: 'Message sent successfully! We\'ll get back to you within 24 hours.',
        });

    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to send message. Please try again or contact us on WhatsApp.' },
            { status: 500 }
        );
    }
}
