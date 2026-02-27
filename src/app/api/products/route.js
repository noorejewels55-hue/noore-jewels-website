import { NextResponse } from 'next/server';
import { getProducts, getCategories } from '@/lib/sheets';

// Tell Vercel to cache this API response and revalidate every 5 minutes
// This means Vercel serves a cached response to ALL users instantly,
// and refreshes the data from Google Sheets in the background every 300 seconds.
export const revalidate = 300;

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const sort = searchParams.get('sort') || 'default';
        const search = searchParams.get('search');
        const tag = searchParams.get('tag');

        let products = await getProducts();

        // Filter by category (handles singular/plural mismatch: navbar uses "necklaces", sheet uses "Necklace")
        if (category && category !== 'all') {
            const normalizeCategory = (cat) => {
                let c = cat.toLowerCase().replace(/\s+/g, '-');
                // Remove trailing 's' for comparison (necklaces -> necklace)
                if (c.endsWith('s')) c = c.slice(0, -1);
                // Fix common typos (earings -> earing)
                c = c.replace('earring', 'earing');
                return c;
            };
            const normalizedFilter = normalizeCategory(category);
            products = products.filter(p => {
                const normalizedCat = normalizeCategory(p.category);
                return normalizedCat === normalizedFilter;
            });
        }

        // Filter by search
        if (search) {
            const q = search.toLowerCase();
            products = products.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q) ||
                p.id.toLowerCase().includes(q)
            );
        }

        // Filter by tag
        if (tag) {
            products = products.filter(p => p.tags.includes(tag.toLowerCase()));
        }

        // Sort
        switch (sort) {
            case 'price-asc':
                products.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                products.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                products.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'newest':
                products.sort((a, b) => {
                    const aNew = a.tags.includes('new') ? 1 : 0;
                    const bNew = b.tags.includes('new') ? 1 : 0;
                    return bNew - aNew;
                });
                break;
        }

        // Get categories
        const categories = await getCategories();

        const response = NextResponse.json({
            success: true,
            products,
            categories,
            total: products.length,
        });

        // Add cache headers for CDN/browser caching
        // s-maxage=300: Vercel's CDN caches for 5 minutes
        // stale-while-revalidate=600: Serve stale for up to 10 min while refreshing
        response.headers.set(
            'Cache-Control',
            'public, s-maxage=300, stale-while-revalidate=600'
        );

        return response;

    } catch (error) {
        console.error('Products API error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}
