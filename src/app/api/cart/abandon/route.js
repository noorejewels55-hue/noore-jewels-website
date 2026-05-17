import { NextResponse } from 'next/server';
import { google } from 'googleapis';

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

function sanitize(value) {
    if (typeof value !== 'string') return value;
    const dangerous = ['=', '+', '-', '@', '\t', '\r', '\n'];
    let cleaned = value.trim();
    if (dangerous.some(ch => cleaned.startsWith(ch))) {
        cleaned = "'" + cleaned;
    }
    return cleaned;
}

// Save an abandoned cart
export async function POST(request) {
    try {
        const body = await request.json();
        const { phone, name, email, items, cartValue } = body;

        if (!phone || !items || items.length === 0) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        const auth = getAuth();
        const sheets = google.sheets({ version: 'v4', auth });

        // Check if this phone already has an active abandoned cart (avoid duplicates)
        try {
            const existing = await sheets.spreadsheets.values.get({
                spreadsheetId: process.env.GOOGLE_SHEET_ID,
                range: 'Abandoned-Carts!A:H',
            });

            const rows = existing.data.values || [];
            const normalizePhone = (p) => (p || '').replace(/\D/g, '').slice(-10);
            const searchPhone = normalizePhone(phone);

            // Find existing abandoned cart for this phone that's still "pending"
            for (let i = 0; i < rows.length; i++) {
                if (normalizePhone(rows[i][0]) === searchPhone && rows[i][4] === 'pending') {
                    // Update existing row instead of creating new
                    const sheetRow = i + 1;
                    await sheets.spreadsheets.values.update({
                        spreadsheetId: process.env.GOOGLE_SHEET_ID,
                        range: `Abandoned-Carts!A${sheetRow}:H${sheetRow}`,
                        valueInputOption: 'RAW',
                        resource: {
                            values: [[
                                sanitize(phone),
                                sanitize(name || ''),
                                sanitize(email || ''),
                                JSON.stringify(items.map(i => ({ name: i.name, price: i.price, qty: i.quantity }))),
                                'pending',
                                Math.round(cartValue || 0),
                                new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
                                rows[i][7] || '0', // Keep existing reminder count
                            ]],
                        },
                    });

                    return NextResponse.json({ success: true, updated: true });
                }
            }
        } catch (e) {
            // Sheet might not exist yet, create it below
            if (e.message?.includes('Unable to parse range') || e.code === 400) {
                try {
                    await sheets.spreadsheets.batchUpdate({
                        spreadsheetId: process.env.GOOGLE_SHEET_ID,
                        resource: {
                            requests: [{
                                addSheet: { properties: { title: 'Abandoned-Carts' } }
                            }]
                        }
                    });
                    // Add header row
                    await sheets.spreadsheets.values.append({
                        spreadsheetId: process.env.GOOGLE_SHEET_ID,
                        range: 'Abandoned-Carts!A:H',
                        valueInputOption: 'RAW',
                        resource: {
                            values: [['Phone', 'Name', 'Email', 'Items', 'Status', 'Cart Value', 'Created At', 'Reminders Sent']],
                        },
                    });
                } catch { /* sheet might already exist */ }
            }
        }

        // Save new abandoned cart
        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Abandoned-Carts!A:H',
            valueInputOption: 'RAW',
            resource: {
                values: [[
                    sanitize(phone),
                    sanitize(name || ''),
                    sanitize(email || ''),
                    JSON.stringify(items.map(i => ({ name: i.name, price: i.price, qty: i.quantity }))),
                    'pending',
                    Math.round(cartValue || 0),
                    new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
                    '0',
                ]],
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving abandoned cart:', error);
        return NextResponse.json({ success: false, message: 'Failed to save cart' }, { status: 500 });
    }
}
