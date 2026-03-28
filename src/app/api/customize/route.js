import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

// Sanitize input to prevent Google Sheets formula injection
function sanitizeForSheets(value) {
    if (typeof value !== 'string') return value;
    const dangerous = ['=', '+', '-', '@', '\t', '\r', '\n'];
    let cleaned = value.trim();
    if (dangerous.some(ch => cleaned.startsWith(ch))) {
        cleaned = "'" + cleaned;
    }
    return cleaned;
}

function getAuth() {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    return new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: privateKey,
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
}

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            name, phone, email, jewelleryType, metalPurity, diamondQuality,
            caratWeight, ringSize, budgetRange, specialRequirements,
        } = body;

        // Validate required fields
        if (!name || !name.trim()) {
            return NextResponse.json(
                { success: false, message: 'Please enter your name' },
                { status: 400 }
            );
        }
        if (!phone || phone.replace(/\D/g, '').length < 10) {
            return NextResponse.json(
                { success: false, message: 'Please enter a valid phone number' },
                { status: 400 }
            );
        }
        if (!jewelleryType) {
            return NextResponse.json(
                { success: false, message: 'Please select a jewellery type' },
                { status: 400 }
            );
        }

        // Rate limiting by phone number
        if (!global.__customizeRateLimit) global.__customizeRateLimit = new Map();
        const rateKey = phone.replace(/\D/g, '').slice(-10);
        const now = Date.now();
        const rateData = global.__customizeRateLimit.get(rateKey);

        if (rateData && rateData.count >= 5 && now - rateData.firstRequest < 30 * 60 * 1000) {
            return NextResponse.json(
                { success: false, message: 'Too many requests. Please try again in 30 minutes.' },
                { status: 429 }
            );
        }
        if (!rateData || now - rateData.firstRequest >= 30 * 60 * 1000) {
            global.__customizeRateLimit.set(rateKey, { count: 1, firstRequest: now });
        } else {
            rateData.count++;
            global.__customizeRateLimit.set(rateKey, rateData);
        }

        const timestamp = new Date().toISOString();

        // ── Save to Google Sheets ──
        try {
            const auth = getAuth();
            const sheets = google.sheets({ version: 'v4', auth });

            // Try to append to Customize-Requests sheet
            await sheets.spreadsheets.values.append({
                spreadsheetId: process.env.GOOGLE_SHEET_ID,
                range: 'Customize-Requests!A:K',
                valueInputOption: 'RAW',
                resource: {
                    values: [[
                        timestamp,
                        sanitizeForSheets(name.trim()),
                        sanitizeForSheets(phone.trim()),
                        sanitizeForSheets(email?.trim() || ''),
                        sanitizeForSheets(jewelleryType || ''),
                        sanitizeForSheets(metalPurity || ''),
                        sanitizeForSheets(diamondQuality || ''),
                        sanitizeForSheets(caratWeight || ''),
                        sanitizeForSheets(ringSize || ''),
                        sanitizeForSheets(budgetRange || ''),
                        sanitizeForSheets(specialRequirements || ''),
                    ]]
                }
            });
        } catch (sheetError) {
            console.error('Error saving to sheets (will still send email):', sheetError);
            // Don't fail — email might still work
        }

        // ── Send Email to Owner ──
        const gmailUser = process.env.GMAIL_USER || 'noore.jewels55@gmail.com';

        if (process.env.GMAIL_APP_PASSWORD) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: gmailUser,
                    pass: process.env.GMAIL_APP_PASSWORD,
                },
            });

            await transporter.sendMail({
                from: `"Noore Jewels Website" <${gmailUser}>`,
                to: 'noore.jewels55@gmail.com',
                replyTo: email || gmailUser,
                subject: `💎 New Custom Jewellery Request from ${name.trim()}`,
                html: `
                    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #FDFBF7; color: #333;">
                        <div style="text-align: center; padding-bottom: 24px; border-bottom: 1px solid #E8E0D4;">
                            <h1 style="font-size: 20px; color: #2C2420; margin: 0; letter-spacing: 0.1em;">NOORE <span style="color: #C5A467;">JEWELS</span></h1>
                            <p style="font-size: 12px; color: #8B7355; margin-top: 4px;">NEW CUSTOMIZATION REQUEST</p>
                        </div>
                        
                        <div style="padding: 24px 0;">
                            <div style="background: #fff; padding: 20px; border-radius: 8px; border: 1px solid #E8E0D4; margin-bottom: 16px;">
                                <h3 style="margin-top: 0; color: #C5A467; font-size: 14px;">Customer Details</h3>
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr><td style="padding: 8px 0; font-weight: 600; width: 40%;">Name</td><td>${name.trim()}</td></tr>
                                    <tr><td style="padding: 8px 0; font-weight: 600;">Phone</td><td><a href="tel:${phone}" style="color: #C5A467;">${phone}</a></td></tr>
                                    ${email ? `<tr><td style="padding: 8px 0; font-weight: 600;">Email</td><td><a href="mailto:${email}" style="color: #C5A467;">${email}</a></td></tr>` : ''}
                                </table>
                            </div>
                            
                            <div style="background: #fff; padding: 20px; border-radius: 8px; border: 1px solid #E8E0D4; margin-bottom: 16px;">
                                <h3 style="margin-top: 0; color: #C5A467; font-size: 14px;">Jewellery Specifications</h3>
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr><td style="padding: 8px 0; font-weight: 600; width: 40%;">Jewellery Type</td><td>${jewelleryType || 'Not specified'}</td></tr>
                                    <tr><td style="padding: 8px 0; font-weight: 600;">Metal Purity</td><td>${metalPurity || 'Not specified'}</td></tr>
                                    <tr><td style="padding: 8px 0; font-weight: 600;">Diamond Quality</td><td>${diamondQuality || 'Not specified'}</td></tr>
                                    <tr><td style="padding: 8px 0; font-weight: 600;">Carat Weight</td><td>${caratWeight || 'Not specified'}</td></tr>
                                    ${ringSize ? `<tr><td style="padding: 8px 0; font-weight: 600;">Ring Size</td><td>${ringSize}</td></tr>` : ''}
                                    <tr><td style="padding: 8px 0; font-weight: 600;">Budget Range</td><td>${budgetRange || 'Not specified'}</td></tr>
                                </table>
                            </div>

                            ${specialRequirements ? `
                            <div style="background: #fff; padding: 20px; border-radius: 8px; border: 1px solid #E8E0D4;">
                                <h3 style="margin-top: 0; color: #C5A467; font-size: 14px;">Special Requirements</h3>
                                <p style="margin: 0; line-height: 1.8; white-space: pre-wrap;">${specialRequirements}</p>
                            </div>
                            ` : ''}
                        </div>
                        
                        <div style="text-align: center; padding: 16px; background: #C5A467; border-radius: 8px;">
                            <a href="https://wa.me/91${phone.replace(/\D/g, '').slice(-10)}?text=Hi ${name.trim()}, thank you for your customization request at Noore Jewels! We'll prepare a quote for you shortly." style="color: #fff; text-decoration: none; font-weight: 600; font-size: 14px;">📱 Reply on WhatsApp</a>
                        </div>
                        
                        <div style="text-align: center; padding-top: 16px; border-top: 1px solid #E8E0D4; margin-top: 16px;">
                            <p style="font-size: 11px; color: #AAA;">This request was submitted via noorejewels.in/customize</p>
                        </div>
                    </div>
                `,
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Your customization request has been submitted! We\'ll contact you within 24 hours with a personalized quote.',
        });

    } catch (error) {
        console.error('Customize form error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to submit request. Please try again or contact us on WhatsApp.' },
            { status: 500 }
        );
    }
}
