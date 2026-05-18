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

// Get date string in IST for a given Date object
function getISTDateStr(date) {
    return date.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
}

// Get ISO date string (YYYY-MM-DD) in IST
function getISODateIST(date) {
    const d = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Parse a date from various formats
function parseDate(dateStr) {
    if (!dateStr) return null;
    try {
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? null : d;
    } catch { return null; }
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
        const now = new Date();
        const today = getISTDateStr(now);
        const todayISO = getISODateIST(now);

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

        // ── ENHANCED STATS ──

        // Today's orders
        const todayOrders = groupedOrders.filter(o => {
            if (!o.date) return false;
            try {
                const d = new Date(o.date);
                return d.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }) === today;
            } catch { return false; }
        });
        const todayRevenue = todayOrders.reduce((s, o) => s + o.totalAmount, 0);

        // Yesterday's stats (for comparison)
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = getISTDateStr(yesterday);
        const yesterdayOrders = groupedOrders.filter(o => {
            if (!o.date) return false;
            try {
                return new Date(o.date).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }) === yesterdayStr;
            } catch { return false; }
        });
        const yesterdayRevenue = yesterdayOrders.reduce((s, o) => s + o.totalAmount, 0);

        // This month's stats
        const thisMonthOrders = groupedOrders.filter(o => {
            if (!o.date) return false;
            try {
                const d = new Date(o.date);
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            } catch { return false; }
        });
        const monthRevenue = thisMonthOrders.reduce((s, o) => s + o.totalAmount, 0);

        // Last month's stats (for comparison)
        const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthOrders = groupedOrders.filter(o => {
            if (!o.date) return false;
            try {
                const d = new Date(o.date);
                return d.getMonth() === lastMonthDate.getMonth() && d.getFullYear() === lastMonthDate.getFullYear();
            } catch { return false; }
        });
        const lastMonthRevenue = lastMonthOrders.reduce((s, o) => s + o.totalAmount, 0);

        // This week's stats (last 7 days)
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const weekOrders = groupedOrders.filter(o => {
            const d = parseDate(o.date);
            return d && d >= sevenDaysAgo;
        });
        const weekRevenue = weekOrders.reduce((s, o) => s + o.totalAmount, 0);

        // Total revenue
        const totalRevenue = groupedOrders.reduce((s, o) => s + o.totalAmount, 0);

        // Average order value
        const avgOrderValue = groupedOrders.length > 0 ? Math.round(totalRevenue / groupedOrders.length) : 0;

        // ── DAILY TRENDS (last 30 days) ──
        const dailyRevenue = {};
        const dailyOrders = {};
        const dailyVisitors = {};
        for (let i = 29; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const key = getISODateIST(d);
            const label = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', timeZone: 'Asia/Kolkata' });
            dailyRevenue[key] = { label, value: 0 };
            dailyOrders[key] = { label, value: 0 };
            dailyVisitors[key] = { label, value: 0 };
        }

        for (const o of groupedOrders) {
            const d = parseDate(o.date);
            if (d) {
                const key = getISODateIST(d);
                if (dailyRevenue[key]) {
                    dailyRevenue[key].value += o.totalAmount;
                    dailyOrders[key].value += 1;
                }
            }
        }

        for (const v of visitors) {
            const d = parseDate(v.timestamp);
            if (d) {
                const key = getISODateIST(d);
                if (dailyVisitors[key]) {
                    dailyVisitors[key].value += 1;
                }
            }
        }

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

        // Browser breakdown
        const browserCounts = {};
        for (const v of visitors) {
            if (v.browser) browserCounts[v.browser] = (browserCounts[v.browser] || 0) + 1;
        }

        // OS breakdown
        const osCounts = {};
        for (const v of visitors) {
            if (v.os) osCounts[v.os] = (osCounts[v.os] || 0) + 1;
        }

        // Top pages
        const pageCounts = {};
        for (const v of visitors) {
            if (v.page) pageCounts[v.page] = (pageCounts[v.page] || 0) + 1;
        }

        // Top products sold
        const productSales = {};
        for (const o of orders) {
            const key = o.productName || o.productId;
            if (!productSales[key]) productSales[key] = { name: key, qty: 0, revenue: 0 };
            productSales[key].qty += o.quantity;
            productSales[key].revenue += o.finalAmount;
        }

        // Top order cities
        const orderCities = {};
        for (const o of groupedOrders) {
            if (o.city) orderCities[o.city] = (orderCities[o.city] || 0) + 1;
        }

        // Pending abandoned carts
        const pendingAbandoned = abandoned.filter(a => a.status === 'pending');
        const recoveredAbandoned = abandoned.filter(a => a.status === 'recovered');

        // Conversion rate: orders / unique visitor sessions (approximate)
        const uniqueIPs = new Set(visitors.map(v => v.ip).filter(Boolean));
        const conversionRate = uniqueIPs.size > 0 ? ((groupedOrders.length / uniqueIPs.size) * 100).toFixed(2) : 0;

        // Coupon usage
        const couponUsage = {};
        for (const o of orders) {
            if (o.couponCode) {
                couponUsage[o.couponCode] = (couponUsage[o.couponCode] || 0) + 1;
            }
        }

        return NextResponse.json({
            success: true,
            stats: {
                todayVisitors: todayVisitors.length,
                todayOrders: todayOrders.length,
                todayRevenue,
                yesterdayOrders: yesterdayOrders.length,
                yesterdayRevenue,
                totalOrders: groupedOrders.length,
                totalRevenue,
                monthOrders: thisMonthOrders.length,
                monthRevenue,
                lastMonthOrders: lastMonthOrders.length,
                lastMonthRevenue,
                weekOrders: weekOrders.length,
                weekRevenue,
                avgOrderValue,
                totalCustomers: customersRows.length,
                totalLeads: leadsRows.length,
                totalVisitors: visitors.length,
                uniqueVisitors: uniqueIPs.size,
                conversionRate: parseFloat(conversionRate),
                pendingAbandonedCarts: pendingAbandoned.length,
                recoveredCarts: recoveredAbandoned.length,
                abandonedCartValue: pendingAbandoned.reduce((s, a) => s + a.cartValue, 0),
                recoveredCartValue: recoveredAbandoned.reduce((s, a) => s + a.cartValue, 0),
            },
            orders: groupedOrders.slice(0, 100),
            visitors: visitors.slice(-300).reverse(),
            abandonedCarts: abandoned.filter(a => a.status === 'pending').slice(0, 50),
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
                browsers: Object.entries(browserCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([browser, count]) => ({ browser, count })),
                osSplit: Object.entries(osCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([os, count]) => ({ os, count })),
                topPages: Object.entries(pageCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10)
                    .map(([page, count]) => ({ page, count })),
                topProducts: Object.values(productSales)
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 10),
                orderCities: Object.entries(orderCities)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10)
                    .map(([city, count]) => ({ city, count })),
                couponUsage: Object.entries(couponUsage)
                    .sort((a, b) => b[1] - a[1])
                    .map(([code, count]) => ({ code, count })),
            },
            trends: {
                dailyRevenue: Object.values(dailyRevenue),
                dailyOrders: Object.values(dailyOrders),
                dailyVisitors: Object.values(dailyVisitors),
            },
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch stats' }, { status: 500 });
    }
}
