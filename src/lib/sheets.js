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
        range: 'Products!A2:T',
    });

    const rows = response.data.values || [];

    return rows
        .filter(row => row[0]) // filter empty rows
        .map(row => {
            // Fixed column layout:
            // A=Product Id, B=Name, C=Category, D=Price,
            // E=Image URL, F=Description, G=In Stock,
            // H=Discount, I=Tags, J=Image 2, K=Image 3, L=Quantity, M=Video URL
            // N=Gold Weight (g), O=Diamond Carat (total), P=Diamond Quality,
            // Q=Diamond Shape, R=(unused - customer selects ring size),
            // S=(unused), T=Num Diamonds
            const imageUrl = row[4] || '';
            const description = row[5] || '';
            const quantity = parseInt(row[11]) || 0; // Column L = Quantity
            const videoUrl = row[12] || ''; // Column M = Video URL

            // Build images array: main image (E) + Image 2 (J) + Image 3 (K)
            const allImageUrls = [imageUrl, row[9] || '', row[10] || '']
                .map(u => u.trim())
                .filter(Boolean)
                .map(u => convertDriveUrl(u));

            // Product is in stock only if "In Stock" is Yes AND quantity > 0
            const inStock = (row[6] || '').toLowerCase() === 'yes';
            const isAvailable = inStock && quantity > 0;

            return {
                id: row[0] || '',
                name: row[1] || '',
                category: row[2] || '',
                price: parseFloat(row[3]) || 0,
                description: description,
                image: allImageUrls[0] || '/placeholder-product.jpg',
                images: allImageUrls.length > 0 ? allImageUrls : ['/placeholder-product.jpg'],
                stock: isAvailable,
                availableQty: quantity,
                discount: parseFloat(row[7]) || 0,
                tags: (row[8] || '').split(',').map(t => t.trim().toLowerCase()).filter(Boolean),
                video: convertDriveVideoUrl(videoUrl),
                // Pricing detail columns
                goldWeight: parseFloat(row[13]) || 0,
                diamondCarat: parseFloat(row[14]) || 0,  // Total carat weight of all diamonds
                diamondQuality: row[15] || '',
                diamondShape: row[16] || '',  // Column Q = Diamond Shape (set by seller)
                numDiamonds: parseInt(row[19]) || 0,  // Number of individual stones
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

// Sanitize input to prevent Google Sheets formula injection
// Strings starting with =, +, -, @, tab, or carriage return can execute formulas
function sanitizeForSheets(value) {
    if (typeof value !== 'string') return value;
    const dangerous = ['=', '+', '-', '@', '\t', '\r', '\n'];
    let cleaned = value.trim();
    if (dangerous.some(ch => cleaned.startsWith(ch))) {
        cleaned = "'" + cleaned; // Prefix with apostrophe to prevent formula execution
    }
    return cleaned;
}

export async function saveOrder(orderData) {
    try {
        const auth = getAuth();
        const sheets = google.sheets({ version: 'v4', auth });

        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Order-Website!A:R',
            valueInputOption: 'RAW', // Use RAW instead of USER_ENTERED for safety
            resource: {
                values: [[
                    orderData.orderId,
                    sanitizeForSheets(orderData.phone),
                    sanitizeForSheets(orderData.name),
                    sanitizeForSheets(orderData.email || ''),
                    orderData.productId,
                    sanitizeForSheets(orderData.productName),
                    orderData.quantity,
                    orderData.price,
                    orderData.discount || 0,
                    orderData.finalAmount,
                    orderData.paymentStatus,
                    sanitizeForSheets(orderData.address || ''),
                    sanitizeForSheets(orderData.city || ''),
                    sanitizeForSheets(orderData.state || ''),
                    sanitizeForSheets(orderData.pincode || ''),
                    new Date().toISOString(),
                    sanitizeForSheets(orderData.customization || ''),
                    sanitizeForSheets(orderData.couponCode || ''),
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

// Convert Google Drive sharing URL to a direct video preview URL
function convertDriveVideoUrl(url) {
    if (!url || !url.trim()) return '';

    url = url.trim();

    // Already a direct video link (YouTube, mp4, etc.)
    if (!url.includes('drive.google.com')) return url;

    // Format: https://drive.google.com/file/d/FILE_ID/view
    const fileIdMatch = url.match(/\/file\/d\/([\w-]+)/);
    if (fileIdMatch) {
        return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }

    // Format: https://drive.google.com/open?id=FILE_ID
    const openIdMatch = url.match(/[?&]id=([\w-]+)/);
    if (openIdMatch) {
        return `https://drive.google.com/file/d/${openIdMatch[1]}/preview`;
    }

    return url;
}

// Get orders for a specific customer by phone number
export async function getOrdersByPhone(phone) {
    try {
        const auth = getAuth();
        const sheets = google.sheets({ version: 'v4', auth });

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Order-Website!A:P',
        });

        const rows = response.data.values || [];
        // Skip header row - detect header by checking if first row looks like a header (not an order ID)
        const firstRow = rows[0] || [];
        const isHeader = firstRow.length > 0 && !firstRow[0]?.startsWith?.('NJ-');
        const dataRows = isHeader ? rows.slice(1) : rows;

        // Normalize phone for comparison - compare last 10 digits
        const normalizePhone = (p) => {
            const digits = (p || '').replace(/\D/g, '');
            return digits.length >= 10 ? digits.slice(-10) : digits;
        };

        const searchPhone = normalizePhone(phone);

        // Filter rows matching the customer's phone number (flexible matching)
        const customerRows = dataRows.filter(row => normalizePhone(row[1]) === searchPhone);

        // Group by order ID
        const ordersMap = {};
        for (const row of customerRows) {
            const orderId = row[0];
            if (!ordersMap[orderId]) {
                ordersMap[orderId] = {
                    orderId,
                    phone: row[1],
                    name: row[2],
                    email: row[3] || '',
                    items: [],
                    paymentStatus: row[10] || 'Paid',
                    address: row[11] || '',
                    city: row[12] || '',
                    state: row[13] || '',
                    pincode: row[14] || '',
                    date: row[15] || '',
                    totalAmount: 0,
                };
            }
            const item = {
                productId: row[4],
                productName: row[5],
                quantity: parseInt(row[6]) || 1,
                price: parseFloat(row[7]) || 0,
                discount: parseFloat(row[8]) || 0,
                finalAmount: parseFloat(row[9]) || 0,
            };
            ordersMap[orderId].items.push(item);
            ordersMap[orderId].totalAmount += item.finalAmount;
        }

        // Convert to array and sort by date (newest first)
        const orders = Object.values(ordersMap).sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });

        return orders;
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}

export function clearCache() {
    cachedProducts = null;
    cacheTimestamp = 0;
    fetchPromise = null;
}

// ─── PRICING SYSTEM ───

let cachedPricing = null;
let pricingCacheTimestamp = 0;
const PRICING_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Fetch master pricing data from 'Pricing' tab
export async function getPricingData() {
    const now = Date.now();
    if (cachedPricing && now - pricingCacheTimestamp < PRICING_CACHE_DURATION) {
        return cachedPricing;
    }

    try {
        const auth = getAuth();
        const sheets = google.sheets({ version: 'v4', auth });

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Pricing!A2:D',
        });

        const rows = response.data.values || [];
        const pricing = {};

        for (const row of rows) {
            if (row[0]) {
                pricing[row[0].trim()] = {
                    rate: parseFloat(row[1]) || 0,
                    lastUpdated: row[2] || '',
                    source: row[3] || '',
                };
            }
        }

        cachedPricing = pricing;
        pricingCacheTimestamp = now;
        return pricing;
    } catch (error) {
        console.error('Error fetching pricing data:', error);
        return cachedPricing || {};
    }
}

let cachedDiamondPricing = null;
let diamondPricingCacheTimestamp = 0;

// Fetch diamond pricing from 'Diamond-Pricing' tab
export async function getDiamondPricing() {
    const now = Date.now();
    if (cachedDiamondPricing && now - diamondPricingCacheTimestamp < PRICING_CACHE_DURATION) {
        return cachedDiamondPricing;
    }

    try {
        const auth = getAuth();
        const sheets = google.sheets({ version: 'v4', auth });

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Diamond-Pricing!A2:F',
        });

        const rows = response.data.values || [];
        const diamonds = rows
            .filter(row => row[0])
            .map(row => ({
                qualityGrade: row[0] || '',
                clarity: row[1] || '',
                colour: row[2] || '',
                tag: row[3] || '',
                pricePerCarat: parseFloat(row[4]) || 0,
                discount: parseFloat(row[5]) || 0,
            }));

        cachedDiamondPricing = diamonds;
        diamondPricingCacheTimestamp = now;
        return diamonds;
    } catch (error) {
        console.error('Error fetching diamond pricing:', error);
        return cachedDiamondPricing || [];
    }
}

// Get pricing tables for client-side calculation
// Client passes customer selections (metal type, shape etc.) and calculates live
export async function getProductPricingInfo(product) {
    if (!product.goldWeight && !product.diamondCarat) return null;

    try {
        const [pricing, diamondPricing] = await Promise.all([
            getPricingData(),
            getDiamondPricing(),
        ]);

        // Return product data + pricing tables so client can calculate
        return {
            // Product-level attributes (from sheet)
            goldWeight: product.goldWeight,
            diamondCarat: product.diamondCarat,
            diamondQuality: product.diamondQuality,
            diamondShape: product.diamondShape,
            numDiamonds: product.numDiamonds || 1,
            // Pricing tables for client-side calculation
            goldRates: {
                '24K Gold': pricing['Gold 24K per gram']?.rate || 0,
                '22K Gold': pricing['Gold 22K per gram']?.rate || 0,
                '18K Gold': pricing['Gold 18K per gram']?.rate || 0,
                '14K Gold': pricing['Gold 14K per gram']?.rate || 0,
                '9K Gold': pricing['Gold 9K per gram']?.rate || 0,
                '925 Silver': pricing['Silver 925 per gram']?.rate || 0,
            },
            makingRatePerGram: pricing['Making Charges (%)']?.rate || 0,
            shipping: pricing['Insured Shipping']?.rate || 0,
            certification: pricing['Certification Fee']?.rate || 0,
            gstPercent: pricing['GST (%)']?.rate || 3,
            // Diamond quality options
            diamondOptions: diamondPricing,
        };
    } catch (error) {
        console.error('Error fetching pricing info:', error);
        return null;
    }
}

// Calculate the default 9kt gold price for a product (server-side)
// Uses same formula as the client-side price breakdown
function calc9ktPrice(product, pricing, diamondPricing) {
    if (!product.goldWeight && !product.diamondCarat) return null;

    const goldRate = pricing['Gold 9K per gram']?.rate || 0;
    const goldPrice = Math.round(goldRate * (product.goldWeight || 0));

    // Diamond price
    const diamondInfo = diamondPricing?.find(d => d.qualityGrade === product.diamondQuality);
    const diamondPricePerCarat = diamondInfo?.pricePerCarat || 0;
    const diamondDiscount = diamondInfo?.discount || 0;
    const diamondBasePrice = Math.round(diamondPricePerCarat * (product.diamondCarat || 0));
    const diamondDiscountAmount = Math.round(diamondBasePrice * diamondDiscount / 100);
    const diamondFinalPrice = diamondBasePrice - diamondDiscountAmount;

    const makingRatePerGram = pricing['Making Charges (%)']?.rate || 0;
    const makingCharges = Math.round((product.goldWeight || 0) * makingRatePerGram);
    const certFee = pricing['Certification Fee']?.rate || 0;
    const gstPercent = pricing['GST (%)']?.rate || 3;

    // GST applies on gold + diamond + making charges only (not certification)
    const gstBase = goldPrice + diamondFinalPrice + makingCharges;
    const gst = Math.round(gstBase * gstPercent / 100);
    const total = gstBase + gst + certFee;

    return total;
}

// Enrich all products with their default 9kt price
// Called from the products API so shop/cards show the 9kt price by default
export async function enrichProductsWithDefaultPricing(products) {
    try {
        const [pricing, diamondPricing] = await Promise.all([
            getPricingData(),
            getDiamondPricing(),
        ]);

        return products.map(p => {
            const default9ktPrice = calc9ktPrice(p, pricing, diamondPricing);
            return {
                ...p,
                // If we can calculate a 9kt price, use it; otherwise keep the sheet price
                defaultPrice: default9ktPrice || (p.discount > 0 ? Math.round(p.price * (1 - p.discount / 100)) : p.price),
                hasLivePrice: !!default9ktPrice,
            };
        });
    } catch (error) {
        console.error('Error enriching products with pricing:', error);
        // Fallback: return products with effectivePrice as defaultPrice
        return products.map(p => ({
            ...p,
            defaultPrice: p.discount > 0 ? Math.round(p.price * (1 - p.discount / 100)) : p.price,
            hasLivePrice: false,
        }));
    }
}

// Save visitor data to the 'Visitors' tab in Google Sheets
export async function saveVisitor(visitorData) {
    try {
        const auth = getAuth();
        const sheets = google.sheets({ version: 'v4', auth });

        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Visitors!A:L',
            valueInputOption: 'RAW',
            resource: {
                values: [[
                    visitorData.timestamp,
                    sanitizeForSheets(visitorData.page),
                    sanitizeForSheets(visitorData.city),
                    sanitizeForSheets(visitorData.region),
                    sanitizeForSheets(visitorData.country),
                    visitorData.device,
                    visitorData.browser,
                    visitorData.os,
                    sanitizeForSheets(visitorData.referrer),
                    visitorData.screenSize,
                    visitorData.ip,
                    sanitizeForSheets(visitorData.visitorName || 'Guest'),
                ]]
            }
        });

        return true;
    } catch (error) {
        console.error('Error saving visitor:', error);
        return false;
    }
}

// Update visitor name retroactively — finds the most recent "Guest" row
// matching the given IP and replaces "Guest" with the actual name
export async function updateVisitorName(ip, name) {
    try {
        if (!ip || !name || ip === 'Unknown') return false;

        const auth = getAuth();
        const sheets = google.sheets({ version: 'v4', auth });

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Visitors!A:L',
        });

        const rows = response.data.values || [];
        
        // Find the LAST row where IP matches (column K = index 10)
        // and name is still "Guest" (column L = index 11)
        let targetRowIndex = -1;
        for (let i = rows.length - 1; i >= 0; i--) {
            if (rows[i][10] === ip && (rows[i][11] || '').toLowerCase() === 'guest') {
                targetRowIndex = i;
                break;
            }
        }

        if (targetRowIndex === -1) return false;

        // Update column L (name) for that row — sheet rows are 1-indexed
        const sheetRow = targetRowIndex + 1;
        await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: `Visitors!L${sheetRow}`,
            valueInputOption: 'RAW',
            resource: {
                values: [[sanitizeForSheets(name)]],
            },
        });

        return true;
    } catch (error) {
        console.error('Error updating visitor name:', error);
        return false;
    }
}

// Save lead (visitor who gave phone for welcome coupon) to 'Leads' tab
export async function saveLead(leadData) {
    try {
        const auth = getAuth();
        const sheets = google.sheets({ version: 'v4', auth });

        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Leads!A:D',
            valueInputOption: 'RAW',
            resource: {
                values: [[
                    leadData.timestamp,
                    sanitizeForSheets(leadData.name),
                    sanitizeForSheets(leadData.phone),
                    leadData.coupon,
                ]]
            }
        });

        return true;
    } catch (error) {
        console.error('Error saving lead:', error);
        return false;
    }
}

// ─── REVIEWS SYSTEM ───

// Cache for reviews to avoid hitting Google Sheets on every request
let cachedReviews = null;
let reviewsCacheTimestamp = 0;
let reviewsFetchPromise = null;
const REVIEWS_CACHE_DURATION = 3 * 60 * 1000; // 3 minutes

async function fetchAllReviews() {
    const auth = getAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Reviews!A2:I',
        });

        const rows = response.data.values || [];

        return rows
            .filter(row => row[0])
            .map(row => ({
                productId: row[0] || '',
                productName: row[1] || '',
                customerName: row[2] || '',
                customerPhone: row[3] || '',
                rating: parseInt(row[4]) || 5,
                title: row[5] || '',
                reviewText: row[6] || '',
                date: row[7] || '',
                verified: (row[8] || '').toLowerCase() === 'yes',
            }));
    } catch (error) {
        // If the Reviews sheet doesn't exist yet, return empty array
        if (error.message?.includes('Unable to parse range') || error.code === 400) {
            console.log('Reviews sheet not found — creating it...');
            try {
                // Try to create the Reviews sheet
                await sheets.spreadsheets.batchUpdate({
                    spreadsheetId: process.env.GOOGLE_SHEET_ID,
                    resource: {
                        requests: [{
                            addSheet: {
                                properties: { title: 'Reviews' }
                            }
                        }]
                    }
                });
                // Add header row
                await sheets.spreadsheets.values.update({
                    spreadsheetId: process.env.GOOGLE_SHEET_ID,
                    range: 'Reviews!A1:I1',
                    valueInputOption: 'RAW',
                    resource: {
                        values: [['Product ID', 'Product Name', 'Customer Name', 'Customer Phone', 'Rating', 'Title', 'Review', 'Date', 'Verified']]
                    }
                });
                console.log('Reviews sheet created successfully');
            } catch (createError) {
                console.error('Error creating Reviews sheet:', createError);
            }
            return [];
        }
        throw error;
    }
}

// Get reviews with caching (similar pattern to products)
async function getCachedReviews() {
    const now = Date.now();

    if (cachedReviews && now - reviewsCacheTimestamp < REVIEWS_CACHE_DURATION) {
        return cachedReviews;
    }

    if (reviewsFetchPromise) {
        if (cachedReviews) return cachedReviews;
        return reviewsFetchPromise;
    }

    reviewsFetchPromise = fetchAllReviews()
        .then(reviews => {
            cachedReviews = reviews;
            reviewsCacheTimestamp = Date.now();
            reviewsFetchPromise = null;
            return reviews;
        })
        .catch(error => {
            console.error('Error fetching reviews:', error);
            reviewsFetchPromise = null;
            return cachedReviews || [];
        });

    if (cachedReviews) {
        return cachedReviews;
    }

    return reviewsFetchPromise;
}

// Get reviews for a specific product
export async function getReviews(productId) {
    const allReviews = await getCachedReviews();
    return allReviews
        .filter(r => r.productId === productId)
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // newest first
}

// Get review summary for ALL products (for product cards)
export async function getAllReviewsSummary() {
    const allReviews = await getCachedReviews();

    const summaryMap = {};
    for (const review of allReviews) {
        if (!summaryMap[review.productId]) {
            summaryMap[review.productId] = { totalRating: 0, count: 0 };
        }
        summaryMap[review.productId].totalRating += review.rating;
        summaryMap[review.productId].count++;
    }

    // Convert to { productId: { averageRating, totalReviews } }
    const result = {};
    for (const [productId, data] of Object.entries(summaryMap)) {
        result[productId] = {
            averageRating: parseFloat((data.totalRating / data.count).toFixed(1)),
            totalReviews: data.count,
        };
    }
    return result;
}

// Save a new review to Google Sheets
export async function saveReview(reviewData) {
    try {
        const auth = getAuth();
        const sheets = google.sheets({ version: 'v4', auth });

        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Reviews!A:I',
            valueInputOption: 'RAW',
            resource: {
                values: [[
                    reviewData.productId,
                    sanitizeForSheets(reviewData.productName),
                    sanitizeForSheets(reviewData.customerName),
                    sanitizeForSheets(reviewData.customerPhone),
                    reviewData.rating,
                    sanitizeForSheets(reviewData.title),
                    sanitizeForSheets(reviewData.reviewText),
                    reviewData.date,
                    reviewData.verified || 'Yes',
                ]]
            }
        });

        // Clear reviews cache so new review appears immediately
        cachedReviews = null;
        reviewsCacheTimestamp = 0;
        reviewsFetchPromise = null;

        return true;
    } catch (error) {
        console.error('Error saving review:', error);
        return false;
    }
}

// Decrease product quantity in Google Sheets after a successful order
// Also auto-marks product as "No" (out of stock) when quantity reaches 0
export async function decreaseProductQuantity(productId, orderedQty = 1) {
    try {
        const auth = getAuth();
        const sheets = google.sheets({ version: 'v4', auth });

        // Get all products to find the row number
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Products!A:L',
        });

        const rows = response.data.values || [];

        // Find the row with matching Product ID (column A)
        // Row 0 is the header, data starts from row 1 (which is row 2 in sheets)
        let rowIndex = -1;
        for (let i = 1; i < rows.length; i++) {
            if (rows[i][0] === productId) {
                rowIndex = i;
                break;
            }
        }

        if (rowIndex === -1) {
            console.error(`Product ${productId} not found in sheet`);
            return false;
        }

        const currentQty = parseInt(rows[rowIndex][11]) || 0;
        const newQty = Math.max(0, currentQty - orderedQty);

        // Update quantity (column L = column 12) — sheet row is rowIndex + 1 (1-indexed)
        const sheetRow = rowIndex + 1;

        if (newQty <= 0) {
            // Quantity is 0 — update both "In Stock" (G) to "No" AND Quantity (L) to 0
            await sheets.spreadsheets.values.batchUpdate({
                spreadsheetId: process.env.GOOGLE_SHEET_ID,
                resource: {
                    valueInputOption: 'RAW',
                    data: [
                        {
                            range: `Products!G${sheetRow}`,
                            values: [['No']],
                        },
                        {
                            range: `Products!L${sheetRow}`,
                            values: [[0]],
                        },
                    ],
                },
            });
            console.log(`Product ${productId}: SOLD OUT (qty 0), marked as out of stock`);
        } else {
            // Just decrease the quantity
            await sheets.spreadsheets.values.update({
                spreadsheetId: process.env.GOOGLE_SHEET_ID,
                range: `Products!L${sheetRow}`,
                valueInputOption: 'RAW',
                resource: {
                    values: [[newQty]],
                },
            });
            console.log(`Product ${productId}: qty ${currentQty} → ${newQty}`);
        }

        // Clear cache so the website reflects the change immediately
        clearCache();

        return true;
    } catch (error) {
        console.error('Error decreasing product quantity:', error);
        return false;
    }
}
