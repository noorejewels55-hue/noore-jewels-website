/**
 * NOORE JEWELS — Bulk Product Upload Tool
 * ========================================
 * 
 * This script:
 * 1. Reads product data from products.csv
 * 2. Uploads images & videos to Cloudinary
 * 3. Writes everything to your Google Sheet
 * 
 * SETUP:
 * 1. npm install cloudinary googleapis csv-parse
 * 2. Create a .env file with your credentials (see below)
 * 3. Organize your images in a folder (see structure below)
 * 4. Fill in products.csv with your product details
 * 5. Run: node bulk-upload.js
 * 
 * FOLDER STRUCTURE:
 * product-media/
 *   NJ-D001/
 *     1.jpg      (main image)
 *     2.jpg      (image 2)
 *     3.jpg      (image 3)
 *     video.mp4  (product video, optional)
 *   NJ-D002/
 *     1.jpg
 *     2.jpg
 *     video.mp4
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const cloudinary = require('cloudinary').v2;

// ─── CONFIG ────────────────────────────────────────────────────────────────────

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const MEDIA_FOLDER = path.join(__dirname, 'product-media'); // folder with product images
const CSV_FILE = path.join(__dirname, 'products.csv');

// ─── GOOGLE SHEETS AUTH ────────────────────────────────────────────────────────

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

// ─── UPLOAD TO CLOUDINARY ──────────────────────────────────────────────────────

async function uploadFile(filePath, productId, type = 'image') {
    const resourceType = type === 'video' ? 'video' : 'image';
    const folder = `noore-jewels/${productId}`;

    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: resourceType,
            folder: folder,
            quality: 'auto',
            fetch_format: 'auto',
        });
        console.log(`  ✅ Uploaded: ${path.basename(filePath)} → ${result.secure_url}`);
        return result.secure_url;
    } catch (err) {
        console.error(`  ❌ Failed: ${path.basename(filePath)} — ${err.message}`);
        return '';
    }
}

// ─── PARSE CSV ─────────────────────────────────────────────────────────────────

function parseCSV(csvPath) {
    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

    return lines.slice(1).map(line => {
        // Handle commas inside quoted fields
        const values = [];
        let current = '';
        let inQuotes = false;
        for (const char of line) {
            if (char === '"') { inQuotes = !inQuotes; continue; }
            if (char === ',' && !inQuotes) { values.push(current.trim()); current = ''; continue; }
            current += char;
        }
        values.push(current.trim());

        const obj = {};
        headers.forEach((h, i) => obj[h] = values[i] || '');
        return obj;
    });
}

// ─── MAIN ──────────────────────────────────────────────────────────────────────

async function main() {
    console.log('');
    console.log('💎 NOORE JEWELS — Bulk Product Upload');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

    // 1. Check CSV exists
    if (!fs.existsSync(CSV_FILE)) {
        console.log('❌ products.csv not found!');
        console.log('');
        console.log('Create a products.csv file with these columns:');
        console.log('id,name,category,price,description,instock,discount,tags,quantity');
        console.log('');
        console.log('Example:');
        console.log('NJ-D001,0.5ct Solitaire Ring,Rings,28999,"IGI certified 0.5ct round brilliant lab grown diamond in 14kt gold",Yes,10,"bestseller,new",5');
        process.exit(1);
    }

    // 2. Parse CSV
    const products = parseCSV(CSV_FILE);
    console.log(`📋 Found ${products.length} products in CSV`);
    console.log('');

    // 3. Upload media & build sheet rows
    const sheetRows = [];

    for (const product of products) {
        const productId = product.id;
        console.log(`\n📦 Processing: ${productId} — ${product.name}`);

        let imageUrl1 = '';
        let imageUrl2 = '';
        let imageUrl3 = '';
        let videoUrl = '';

        // Check if media folder exists for this product
        const mediaDir = path.join(MEDIA_FOLDER, productId);
        if (fs.existsSync(mediaDir)) {
            const files = fs.readdirSync(mediaDir).sort();

            for (const file of files) {
                const filePath = path.join(mediaDir, file);
                const ext = path.extname(file).toLowerCase();
                const name = path.basename(file, ext).toLowerCase();

                if (['.mp4', '.mov', '.webm', '.avi'].includes(ext)) {
                    // Video file
                    videoUrl = await uploadFile(filePath, productId, 'video');
                } else if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
                    // Image file — assign by order (1, 2, 3)
                    if (!imageUrl1 || name === '1' || name === 'main') {
                        imageUrl1 = await uploadFile(filePath, productId, 'image');
                    } else if (!imageUrl2 || name === '2') {
                        imageUrl2 = await uploadFile(filePath, productId, 'image');
                    } else if (!imageUrl3 || name === '3') {
                        imageUrl3 = await uploadFile(filePath, productId, 'image');
                    }
                }
            }
        } else {
            console.log(`  ⚠️ No media folder found for ${productId} — skipping images`);
        }

        // Build row: A=ID, B=Name, C=Category, D=Price, E=Image1, F=Description,
        //            G=InStock, H=Discount, I=Tags, J=Image2, K=Image3, L=Quantity, M=Video
        sheetRows.push([
            productId,
            product.name || '',
            product.category || '',
            product.price || '',
            imageUrl1,
            product.description || '',
            product.instock || 'Yes',
            product.discount || '0',
            product.tags || '',
            imageUrl2,
            imageUrl3,
            product.quantity || '5',
            videoUrl,
        ]);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Uploaded media for ${sheetRows.length} products`);

    // 4. Write to Google Sheet
    console.log('\n📊 Writing to Google Sheet...');

    try {
        const auth = getAuth();
        const sheets = google.sheets({ version: 'v4', auth });

        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: 'Products!A2:M',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: sheetRows,
            },
        });

        console.log(`✅ Successfully added ${sheetRows.length} products to Google Sheet!`);
    } catch (err) {
        console.error('❌ Google Sheets error:', err.message);
        console.log('\n💡 Saving as CSV instead...');

        // Fallback: save as CSV that can be copy-pasted into sheet
        const csvOutput = sheetRows.map(row =>
            row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
        ).join('\n');

        const outputPath = path.join(__dirname, 'output-for-sheet.csv');
        fs.writeFileSync(outputPath, 'Product ID,Name,Category,Price,Image URL,Description,In Stock,Discount,Tags,Image 2,Image 3,Quantity,Video URL\n' + csvOutput);
        console.log(`✅ Saved to: ${outputPath}`);
        console.log('   Copy-paste this into your Google Sheet Products tab');
    }

    console.log('\n🎉 Done! Your products will appear on the website within 5 minutes.');
    console.log('');
}

main().catch(console.error);
