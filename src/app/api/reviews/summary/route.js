import { NextResponse } from 'next/server';
import { getAllReviewsSummary } from '@/lib/sheets';

// Revalidate every 5 minutes
export const revalidate = 300;

// GET /api/reviews/summary — returns rating summary for all products
export async function GET() {
    try {
        const summary = await getAllReviewsSummary();

        const response = NextResponse.json({
            success: true,
            summary,
        });

        response.headers.set(
            'Cache-Control',
            'public, s-maxage=300, stale-while-revalidate=600'
        );

        return response;

    } catch (error) {
        console.error('Reviews summary API error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch review summaries' },
            { status: 500 }
        );
    }
}
