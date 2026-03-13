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
                     <p style="font-size: 12px; color: #999; margin-top: 20px;">This code expires in <strong>10 minutes</strong>.</p>
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

        // Rate limiting: max 5 OTPs per phone per 5 min
        const existing = otpStore.get(cleanPhone);
        if (existing && existing.attempts >= 5 && Date.now() - existing.firstAttempt < 5 * 60 * 1000) {
            return NextResponse.json(
                { success: false, message: 'Too many requests. Please try again in 5 minutes.' },
                { status: 429 }
            );
        }

        // Reset attempt counter if cooldown has passed
        const attempts = (existing && Date.now() - existing.firstAttempt < 5 * 60 * 1000)
            ? (existing.attempts || 0) + 1
            : 1;
        const firstAttempt = (existing && Date.now() - existing.firstAttempt < 5 * 60 * 1000)
            ? existing.firstAttempt
            : Date.now();

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Ensure phone has country code (India = 91)
        let formattedPhone = cleanPhone;
        if (formattedPhone.length === 10) {
            formattedPhone = '91' + formattedPhone;
        }

        // Store OTP with 10-minute expiry (longer window for slow email delivery)
        otpStore.set(cleanPhone, {
            otp,
            expiresAt: Date.now() + 10 * 60 * 1000,
            attempts,
            firstAttempt,
            verifyAttempts: 0,
        });

        // Step 1: Send OTP via Email (Primary and only method now)
        let emailSent = false;

        if (!email) {
            return NextResponse.json(
                { success: false, message: 'Please provide a valid email address' },
                { status: 400 }
            );
        }

        if (process.env.GMAIL_APP_PASSWORD) {
            try {
                await sendEmailOTP(email, otp);
                emailSent = true;
            } catch (emailError) {
                console.error('Email OTP send error:', emailError);
            }
        }

        // Determine response message
        let message = '';
        let sentVia = 'none';

        if (emailSent) {
            message = `OTP sent to ${email}. Please check your inbox & spam folder 📧`;
            sentVia = 'email';
        } else {
            console.error('OTP EMAIL DELIVERY FAILED — GMAIL_APP_PASSWORD set:', !!process.env.GMAIL_APP_PASSWORD);
            message = 'Could not send OTP. Please check your email address and try again.';
        }

        // In development, log OTP for testing
        if (process.env.NODE_ENV !== 'production') {
            console.log(`[DEV] OTP for ${cleanPhone}: ${otp}`);
        }

        return NextResponse.json({
            success: emailSent,
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
