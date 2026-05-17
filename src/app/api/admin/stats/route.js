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

// Verify admin token
function verifyToken(request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return false;
    try {
        const token = authHeader.slice(7);
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const [prefix, expiry] = decoded.split(':');
        return prefix === 'admin' && parseInt(expiry) > Date.now();
    } catch { return false; }
}

export async function GET(request) {
    if (!verifyToken(request)) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const auth = getAuth();
        const sheets = google.sheets({ version: 'v4', auth });
        const sheetId = process.env.GOOGLE_SHEET_ID;

        // Fetch all data in parallel
        const [ordersRes, visitorsRes, leadsRes, customersRes, abandonedRes] = await Promise.all([
            sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: 'Order-Website!A:R' }).catch(() => ({ data: { values: [] } })),
            sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: 'Visitors!A:L' }).catch(() => ({ data: { values: [] } })),
            sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: 'Leads!A:D' }).catch(() => ({ data: { values: [] } })),
            sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: 'Customer-Website!A:F' }).catch(() => ({ data: { values: [] } })),
            sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: 'Abandoned-Carts!A:H' }).catch(() => ({ data: { values: [] } })),
        ]);

        const ordersRows = ordersRes.data.values || [];
        const visitorsRows = visitorsRes.data.values || [];
        const leadsRows = leadsRes.data.values || [];
        const customersRows = customersRes.data.values || [];
        const abandonedRows = abandonedRes.data.values || [];

        // Parse today's date (IST)
        const today = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
        const todayParts = today.split('/');

        // Process orders
        const orders = ordersRows
            .filter(r => r[0] && r[0].startsWith('NJ-'))
            .map(r => ({
                orderId: r[0],
                phone: r[1],
                name: r[2],
                email: r[3] || '',
                productId: r[4],
                productName: r[5],
                quantity: parseInt(r[6]) || 1,
                price: parseFloat(r[7]) || 0,
                discount: parseFloat(r[8]) || 0,
                finalAmount: parseFloat(r[9]) || 0,
                paymentStatus: r[10] || 'Paid',
                address: r[11] || '',
                city: r[12] || '',
                state: r[13] || '',
                pincode: r[14] || '',
                date: r[15] || '',
                customization: r[16] || '',
                couponCode: r[17] || '',
            }));

        // Group orders by orderId
        const orderMap = {};
        for (const o of orders) {
            if (!orderMap[o.orderId]) {
                orderMap[o.orderId] = {
                    ...o,
                    items: [],
                    totalAmount: 0,
                };
            }
            orderMap[o.orderId].items.push({
                productName: o.productName,
                quantity: o.quantity,
                price: o.price,
                finalAmount: o.finalAmount,
            });
            orderMap[o.orderId].totalAmount += o.finalAmount;
        }
        const groupedOrders = Object.values(orderMap).sort((a, b) => new Date(b.date) - new Date(a.date));

        // Process visitors
        const visitors = visitorsRows.map(r => ({
            timestamp: r[0],
            page: r[1],
            city: r[2],
            region: r[3],
            country: r[4],
            device: r[5],
            browser: r[6],
            os: r[7],
            referrer: r[8],
            screenSize: r[9],
            ip: r[10],
            name: r[11] || 'Guest',
        }));

        // Process abandoned carts
        const abandoned = abandonedRows
            .filter(r => r[0] && r[0] !== 'Phone')
            .map(r => ({
                phone: r[0],
                name: r[1] || '',
                email: r[2] || '',
                items: r[3] || '[]',
                status: r[4] || 'pending',
                cartValue: parseFloat(r[5]) || 0,
                createdAt: r[6] || '',
                remindersSent: parseInt(r[7]) || 0,
            }));

        // Calculate stats
        const totalRevenue = groupedOrders.reduce((s, o) => s + o.totalAmount, 0);
        
        // Today's stats — check date column (r[15]) for today
        const todayOrders = groupedOrders.filter(o => {
            if (!o.date) return false;
            try {
                const d = new Date(o.date);
                return d.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }) === today;
            } catch { return false; }
        });

        const todayRevenue = todayOrders.reduce((s, o) => s + o.totalAmount, 0);

        // This month's stats
        const now = new Date();
        const thisMonthOrders = groupedOrders.filter(o => {
            if (!o.date) return false;
            try {
                const d = new Date(o.date);
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            } catch { return false; }
        });
        const monthRevenue = thisMonthOrders.reduce((s, o) => s + o.totalAmount, 0);

        // Today's visitors
        const todayVisitors = visitors.filter(v => {
            if (!v.timestamp) return false;
            try {
                return v.timestamp.includes(today) || v.timestamp.split(',')[0]?.trim() === today;
            } catch { return false; }
        });

        // Traffic sources breakdown
        const trafficSources = {};
        for (const v of visitors) {
            const src = v.referrer || 'Direct';
            trafficSources[src] = (trafficSources[src] || 0) + 1;
        }

        // Top cities
        const cityCounts = {};
        for (const v of visitors) {
            if (v.city && v.city !== 'Unknown' && v.city !== 'Localhost') {
                cityCounts[v.city] = (cityCounts[v.city] || 0) + 1;
            }
        }

        // Device breakdown
        const deviceCounts = {};
        for (const v of visitors) {
            if (v.device) deviceCounts[v.device] = (deviceCounts[v.device] || 0) + 1;
        }

        // Top pages
        const pageCounts = {};
        for (const v of visitors) {
            if (v.page) pageCounts[v.page] = (pageCounts[v.page] || 0) + 1;
        }

        // Pending abandoned carts
        const pendingAbandoned = abandoned.filter(a => a.status === 'pending');

        return NextResponse.json({
            success: true,
            stats: {
                todayVisitors: todayVisitors.length,
                todayOrders: todayOrders.length,
                todayRevenue,
                totalOrders: groupedOrders.length,
                totalRevenue,
                monthOrders: thisMonthOrders.length,
                monthRevenue,
                totalCustomers: customersRows.length,
                totalLeads: leadsRows.length,
                pendingAbandonedCarts: pendingAbandoned.length,
                abandonedCartValue: pendingAbandoned.reduce((s, a) => s + a.cartValue, 0),
            },
            orders: groupedOrders.slice(0, 50), // Last 50 orders
            visitors: visitors.slice(-200).reverse(), // Last 200 visitors (newest first)
            abandonedCarts: abandoned.filter(a => a.status === 'pending').slice(0, 30),
            analytics: {
                trafficSources: Object.entries(trafficSources)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10)
                    .map(([source, count]) => ({ source, count })),
                topCities: Object.entries(cityCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10)
                    .map(([city, count]) => ({ city, count })),
                devices: Object.entries(deviceCounts)
                    .map(([device, count]) => ({ device, count })),
                topPages: Object.entries(pageCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10)
                    .map(([page, count]) => ({ page, count })),
            },
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch stats' }, { status: 500 });
    }
}
