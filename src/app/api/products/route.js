import { NextResponse } from 'next/server';
import { getProducts, getCategories } from '@/lib/sheets';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const sort = searchParams.get('sort') || 'default';
        const search = searchParams.get('search');
        const tag = searchParams.get('tag');

        let products = await getProducts();

        // Filter by category
        if (category && category !== 'all') {
            products = products.filter(p =>
                p.category.toLowerCase().replace(/\s+/g, '-') === category.toLowerCase()
            );
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

        return NextResponse.json({
            success: true,
            products,
            categories,
            total: products.length,
        });

    } catch (error) {
        console.error('Products API error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}
