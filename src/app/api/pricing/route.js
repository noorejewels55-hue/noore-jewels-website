import { NextResponse } from 'next/server';
import { getProducts, getPricingData, getDiamondPricing, getProductPricingInfo } from '@/lib/sheets';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        // If a specific product ID is given, return its pricing info + tables
        if (productId) {
            const products = await getProducts();
            const product = products.find(p => p.id === productId);

            if (!product) {
                return NextResponse.json(
                    { success: false, message: 'Product not found' },
                    { status: 404 }
                );
            }

            const pricingInfo = await getProductPricingInfo(product);
            return NextResponse.json({
                success: true,
                pricingInfo,
            });
        }

        // Otherwise return the full pricing tables
        const [pricing, diamondPricing] = await Promise.all([
            getPricingData(),
            getDiamondPricing(),
        ]);

        return NextResponse.json({
            success: true,
            pricing,
            diamondPricing,
        });
    } catch (error) {
        console.error('Pricing API error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch pricing data' },
            { status: 500 }
        );
    }
}
