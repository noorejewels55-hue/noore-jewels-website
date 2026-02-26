import { google } from 'googleapis';

let cachedProducts = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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

export async function getProducts() {
    // Return cached if fresh
    if (cachedProducts && Date.now() - cacheTimestamp < CACHE_DURATION) {
        return cachedProducts;
    }

    try {
        const auth = getAuth();
        const sheets = google.sheets({ version: 'v4', auth });

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Products!A2:I',
        });

        const rows = response.data.values || [];

        const products = rows
            .filter(row => row[0]) // filter empty rows
            .map(row => ({
                id: row[0] || '',
                name: row[1] || '',
                category: row[2] || '',
                price: parseFloat(row[3]) || 0,
                description: row[4] || '',
                image: convertDriveUrl(row[5] || ''),
                stock: (row[6] || '').toLowerCase() === 'yes',
                discount: parseFloat(row[7]) || 0,
                tags: (row[8] || '').split(',').map(t => t.trim().toLowerCase()).filter(Boolean),
            }));

        cachedProducts = products;
        cacheTimestamp = Date.now();

        return products;
    } catch (error) {
        console.error('Error fetching products from Google Sheets:', error);
        return cachedProducts || [];
    }
}

export async function getProductById(productId) {
    const products = await getProducts();
    return products.find(p => p.id === productId) || null;
}

export async function getCategories() {
    const products = await getProducts();
    const categories = [...new Set(products.map(p => p.category))].filter(Boolean);
    return categories.map(cat => ({
        name: cat,
        count: products.filter(p => p.category === cat).length,
        slug: cat.toLowerCase().replace(/\s+/g, '-'),
    }));
}

export async function getProductsByCategory(category) {
    const products = await getProducts();
    return products.filter(p => p.category.toLowerCase() === category.toLowerCase());
}

export async function getFeaturedProducts() {
    const products = await getProducts();
    return products.filter(p => p.tags.includes('featured') || p.tags.includes('bestseller'));
}

export async function getNewArrivals() {
    const products = await getProducts();
    return products.filter(p => p.tags.includes('new'));
}

export async function saveOrder(orderData) {
    try {
        const auth = getAuth();
        const sheets = google.sheets({ version: 'v4', auth });

        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Orders!A:K',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [[
                    orderData.orderId,
                    orderData.phone,
                    orderData.name,
                    orderData.productId,
                    orderData.productName,
                    orderData.quantity,
                    orderData.price,
                    orderData.discount || 0,
                    orderData.finalAmount,
                    orderData.paymentStatus,
                    new Date().toISOString(),
                ]]
            }
        });

        return true;
    } catch (error) {
        console.error('Error saving order:', error);
        return false;
    }
}

export async function saveCustomer(customerData) {
    try {
        const auth = getAuth();
        const sheets = google.sheets({ version: 'v4', auth });

        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Customers!A:D',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [[
                    customerData.phone,
                    customerData.name,
                    customerData.city || '',
                    new Date().toISOString(),
                ]]
            }
        });

        return true;
    } catch (error) {
        console.error('Error saving customer:', error);
        return false;
    }
}

export async function findCustomer(phone) {
    try {
        const auth = getAuth();
        const sheets = google.sheets({ version: 'v4', auth });

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Customers!A:D',
        });

        const rows = response.data.values || [];
        const customer = rows.find(row => row[0] === phone);

        if (customer) {
            return {
                phone: customer[0],
                name: customer[1],
                city: customer[2],
                registeredDate: customer[3],
            };
        }
        return null;
    } catch (error) {
        console.error('Error finding customer:', error);
        return null;
    }
}

// Convert Google Drive sharing URL to direct image URL
function convertDriveUrl(url) {
    if (!url) return '/placeholder-product.jpg';

    // Already a direct link or non-drive URL
    if (!url.includes('drive.google.com')) return url;

    // Format: https://drive.google.com/file/d/FILE_ID/view?...
    const fileIdMatch = url.match(/\/file\/d\/([\w-]+)/);
    if (fileIdMatch) {
        return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}=w800`;
    }

    // Format: https://drive.google.com/open?id=FILE_ID
    const openIdMatch = url.match(/[?&]id=([\w-]+)/);
    if (openIdMatch) {
        return `https://lh3.googleusercontent.com/d/${openIdMatch[1]}=w800`;
    }

    return url;
}

export function clearCache() {
    cachedProducts = null;
    cacheTimestamp = 0;
}
