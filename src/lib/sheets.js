import { google } from 'googleapis';

// ─── SINGLETON CACHE WITH STAMPEDE PROTECTION ───
// This ensures that even if 500 users hit the site at the exact same moment
// the cache expires, only ONE request goes to Google Sheets.
// Everyone else gets the old cached data gracefully.

let cachedProducts = null;
let cacheTimestamp = 0;
let fetchPromise = null; // Prevents cache stampede
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

async function fetchFromSheets() {
    const auth = getAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Products!A2:K',
    });

    const rows = response.data.values || [];

    return rows
        .filter(row => row[0]) // filter empty rows
        .map(row => {
            // Fixed column layout:
            // A=Product Id, B=Name, C=Category, D=Price,
            // E=Image URL, F=Description, G=In Stock,
            // H=Discount, I=Tags, J=Image 2, K=Image 3
            const imageUrl = row[4] || '';
            const description = row[5] || '';

            // Build images array: main image (E) + Image 2 (J) + Image 3 (K)
            const allImageUrls = [imageUrl, row[9] || '', row[10] || '']
                .map(u => u.trim())
                .filter(Boolean)
                .map(u => convertDriveUrl(u));

            return {
                id: row[0] || '',
                name: row[1] || '',
                category: row[2] || '',
                price: parseFloat(row[3]) || 0,
                description: description,
                image: allImageUrls[0] || '/placeholder-product.jpg',
                images: allImageUrls.length > 0 ? allImageUrls : ['/placeholder-product.jpg'],
                stock: (row[6] || '').toLowerCase() === 'yes',
                discount: parseFloat(row[7]) || 0,
                tags: (row[8] || '').split(',').map(t => t.trim().toLowerCase()).filter(Boolean),
            };
        });
}

export async function getProducts() {
    const now = Date.now();

    // Cache is still fresh — return immediately
    if (cachedProducts && now - cacheTimestamp < CACHE_DURATION) {
        return cachedProducts;
    }

    // Cache expired — but another request is already fetching
    // Return stale data instead of making a duplicate request
    if (fetchPromise) {
        if (cachedProducts) return cachedProducts;
        return fetchPromise;
    }

    // This is the FIRST request after cache expired
    // Lock the fetch so no other request duplicates it
    fetchPromise = fetchFromSheets()
        .then(products => {
            cachedProducts = products;
            cacheTimestamp = Date.now();
            fetchPromise = null;
            return products;
        })
        .catch(error => {
            console.error('Error fetching products from Google Sheets:', error);
            fetchPromise = null;
            return cachedProducts || [];
        });

    // If we have old data, serve it immediately while refresh happens in background
    if (cachedProducts) {
        // Fire and forget — the fetchPromise will update the cache
        return cachedProducts;
    }

    // First ever load — must wait for data
    return fetchPromise;
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
            range: 'Order-Website!A:P',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [[
                    orderData.orderId,
                    orderData.phone,
                    orderData.name,
                    orderData.email || '',
                    orderData.productId,
                    orderData.productName,
                    orderData.quantity,
                    orderData.price,
                    orderData.discount || 0,
                    orderData.finalAmount,
                    orderData.paymentStatus,
                    orderData.address || '',
                    orderData.city || '',
                    orderData.state || '',
                    orderData.pincode || '',
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

// Save website customers to a separate 'Customer-Website' tab
export async function saveWebsiteCustomer(customerData) {
    try {
        const auth = getAuth();
        const sheets = google.sheets({ version: 'v4', auth });

        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Customer-Website!A:F',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [[
                    customerData.phone,
                    customerData.name,
                    customerData.email || '',
                    customerData.city || '',
                    'Website',
                    new Date().toISOString(),
                ]]
            }
        });

        return true;
    } catch (error) {
        console.error('Error saving website customer:', error);
        return false;
    }
}

// Read coupons from the 'Coupons' tab
export async function getCoupons() {
    try {
        const auth = getAuth();
        const sheets = google.sheets({ version: 'v4', auth });

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Coupons!A2:E',
        });

        const rows = response.data.values || [];

        return rows
            .filter(row => row[0])
            .map(row => ({
                code: (row[0] || '').toUpperCase().trim(),
                type: (row[1] || 'percent').toLowerCase().trim(),   // 'percent' or 'flat'
                value: parseFloat(row[2]) || 0,                     // e.g. 10 for 10% or 100 for ₹100
                minOrder: parseFloat(row[3]) || 0,                  // Minimum order amount
                active: (row[4] || 'yes').toLowerCase() === 'yes',  // Active?
            }))
            .filter(c => c.active);
    } catch (error) {
        console.error('Error reading coupons:', error);
        return [];
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
    fetchPromise = null;
}
