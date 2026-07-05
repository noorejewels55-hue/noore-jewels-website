import { getProducts, enrichProductsWithDefaultPricing } from '@/lib/sheets';

export const revalidate = 300; // Cache for 5 minutes

export async function GET() {
    try {
        const rawProducts = await getProducts();
        const products = await enrichProductsWithDefaultPricing(rawProducts);

        const xmlItems = products
            .filter(p => p.id && p.name) // Ensure valid products
            .map(p => {
                // Clean description for XML compatibility
                const cleanDesc = (p.description || '')
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&apos;');

                const cleanName = p.name
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');

                // Availability mapping
                const availability = p.stock ? 'in_stock' : 'out_of_stock';

                // Use the dynamically calculated defaultPrice
                const priceStr = `${p.defaultPrice} INR`;

                return `
        <item>
            <g:id>${p.id}</g:id>
            <g:title>${cleanName}</g:title>
            <g:description>${cleanDesc}</g:description>
            <g:link>https://www.noorejewels.in/product/${p.id}</g:link>
            <g:image_link>${p.image}</g:image_link>
            <g:price>${priceStr}</g:price>
            <g:availability>${availability}</g:availability>
            <g:condition>new</g:condition>
            <g:brand>Noore Jewels</g:brand>
        </item>`;
            })
            .join('');

        const xmlFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
    <channel>
        <title>Noore Jewels Product Feed</title>
        <link>https://www.noorejewels.in</link>
        <description>Handcrafted luxury jewellery and lab-grown diamonds</description>
        ${xmlItems}
    </channel>
</rss>`;

        return new Response(xmlFeed, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            },
        });
    } catch (error) {
        console.error('Error generating Google product feed:', error);
        return new Response('<error>Failed to generate feed</error>', {
            status: 500,
            headers: { 'Content-Type': 'application/xml' },
        });
    }
}
