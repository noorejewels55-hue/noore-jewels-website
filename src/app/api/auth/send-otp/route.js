import { NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Global OTP store (shared across routes in same process)
if (!global.__otpStore) {
    global.__otpStore = new Map();
}
const otpStore = global.__otpStore;

// Create Gmail transporter (reusable)
function getEmailTransporter() {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER || 'noore.jewels55@gmail.com',
            pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password (not regular password)
        },
    });
}

// Send OTP via email
async function sendEmailOTP(email, otp) {
    const transporter = getEmailTransporter();
    await transporter.sendMail({
        from: `"Noore Jewels" <${process.env.GMAIL_USER || 'noore.jewels55@gmail.com'}>`,
        to: email,
        subject: `🔐 Your Noore Jewels Verification Code: ${otp}`,
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #FDFBF7;">
                <div style="text-align: center; padding-bottom: 24px; border-bottom: 1px solid #E8E0D4;">
                    <h1 style="font-size: 20px; color: #2C2420; margin: 0; letter-spacing: 0.1em;">NOORE <span style="color: #C5A467;">JEWELS</span></h1>
                    <p style="font-size: 12px; color: #8B7355; margin-top: 4px; letter-spacing: 0.15em;">FASHION JEWELLERY</p>
                </div>
                <div style="text-align: center; padding: 32px 0;">
                    <p style="font-size: 14px; color: #555; margin-bottom: 20px;">Your verification code is:</p>
                    <div style="background: linear-gradient(135deg, #2C2420, #3D3430); color: #C5A467; font-size: 32px; font-weight: 700; letter-spacing: 0.4em; padding: 20px 24px; border-radius: 8px; display: inline-block;">
                        ${otp}
                    </div>
                    <p style="font-size: 12px; color: #999; margin-top: 20px;">This code expires in <strong>5 minutes</strong>.</p>
                    <p style="font-size: 12px; color: #999;">Do not share this code with anyone.</p>
                </div>
                <div style="text-align: center; padding-top: 24px; border-top: 1px solid #E8E0D4;">
                    <p style="font-size: 11px; color: #AAA;">© 2026 Noore Jewels • noorejewels.in</p>
                </div>
            </div>
        `,
    });
}

export async function POST(request) {
    try {
        const { phone, email } = await request.json();

        if (!phone || phone.length < 10) {
            return NextResponse.json(
                { success: false, message: 'Please enter a valid phone number' },
                { status: 400 }
            );
        }

        // Clean phone number
        const cleanPhone = phone.replace(/\D/g, '');

        // Rate limiting: max 3 OTPs per phone per 10 min
        const existing = otpStore.get(cleanPhone);
        if (existing && existing.attempts >= 3 && Date.now() - existing.firstAttempt < 10 * 60 * 1000) {
            return NextResponse.json(
                { success: false, message: 'Too many requests. Please try again in 10 minutes.' },
                { status: 429 }
            );
        }

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Ensure phone has country code (India = 91)
        let formattedPhone = cleanPhone;
        if (formattedPhone.length === 10) {
            formattedPhone = '91' + formattedPhone;
        }

        // Store OTP with 5-minute expiry
        otpStore.set(cleanPhone, {
            otp,
            expiresAt: Date.now() + 5 * 60 * 1000,
            attempts: (existing?.attempts || 0) + 1,
            firstAttempt: existing?.firstAttempt || Date.now(),
            verifyAttempts: 0,
        });

        // Step 1: Try Email first (primary method)
        let emailSent = false;
        if (email && process.env.GMAIL_APP_PASSWORD) {
            try {
                await sendEmailOTP(email, otp);
                emailSent = true;
            } catch (emailError) {
                console.error('Email OTP send error:', emailError);
            }
        }

        // Step 2: If email failed or not provided, try SMS via Fast2SMS
        let smsSent = false;
        if (!emailSent && process.env.FAST2SMS_API_KEY) {
            try {
                // Fast2SMS OTP route (no DLT registration needed)
                const smsResponse = await fetch(
                    `https://www.fast2sms.com/dev/bulkV2?authorization=${process.env.FAST2SMS_API_KEY}&variables_values=${otp}&route=otp&numbers=${cleanPhone.length > 10 ? cleanPhone.slice(-10) : cleanPhone}`,
                    { method: 'GET' }
                );
                const smsResult = await smsResponse.json();
                if (smsResult.return === true) {
                    smsSent = true;
                } else {
                    console.error('Fast2SMS error:', JSON.stringify(smsResult));
                }
            } catch (smsError) {
                console.error('SMS OTP send error:', smsError);
            }
        }

        // Step 3: If both failed, try WhatsApp as last fallback
        let whatsappSent = false;
        if (!emailSent && !smsSent) {
            try {
                if (process.env.WHATSAPP_TOKEN && process.env.PHONE_NUMBER_ID) {
                    const waResponse = await fetch(
                        `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
                        {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                messaging_product: 'whatsapp',
                                to: formattedPhone,
                                type: 'text',
                                text: {
                                    body: `🔐 Your Noore Jewels verification code is: *${otp}*\n\nThis code expires in 5 minutes. Do not share it with anyone.`
                                }
                            }),
                        }
                    );
                    const waResult = await waResponse.json();
                    if (waResponse.ok && waResult.messages && waResult.messages.length > 0) {
                        whatsappSent = true;
                    } else {
                        console.error('WhatsApp API error:', JSON.stringify(waResult));
                    }
                }
            } catch (whatsappError) {
                console.error('WhatsApp OTP send error:', whatsappError);
            }
        }

        // Determine response message
        let message = '';
        let sentVia = 'none';
        if (emailSent) {
            message = `OTP sent to your email (${email})! 📧`;
            sentVia = 'email';
        } else if (smsSent) {
            message = 'OTP sent to your mobile via SMS! 📱';
            sentVia = 'sms';
        } else if (whatsappSent) {
            message = 'OTP sent to your WhatsApp! 💬';
            sentVia = 'whatsapp';
        } else {
            message = 'Could not send OTP. Please provide your email address and try again.';
        }

        // In development, log OTP for testing
        if (process.env.NODE_ENV !== 'production') {
            console.log(`[DEV] OTP for ${cleanPhone}: ${otp}`);
        }

        return NextResponse.json({
            success: emailSent || smsSent || whatsappSent,
            message,
            sentVia,
            // Only in dev mode for testing
            ...(process.env.NODE_ENV !== 'production' && { devOtp: otp }),
        });

    } catch (error) {
        console.error('Send OTP error:', error);
        return NextResponse.json(
            { success: false, message: 'Server error. Please try again.' },
            { status: 500 }
        );
    }
}

// Cleanup expired OTPs every 10 minutes
setInterval(() => {
    const now = Date.now();
    for (const [phone, data] of otpStore.entries()) {
        if (now > data.expiresAt) {
            otpStore.delete(phone);
        }
    }
}, 10 * 60 * 1000);
