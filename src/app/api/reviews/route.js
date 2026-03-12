import { NextResponse } from 'next/server';
import { getReviews, saveReview } from '@/lib/sheets';

// GET /api/reviews?productId=NJ-001
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        if (!productId) {
            return NextResponse.json(
                { success: false, message: 'Product ID is required' },
                { status: 400 }
            );
        }

        const reviews = await getReviews(productId);

        // Calculate summary stats
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
            : 0;

        // Rating distribution (1-5 stars count)
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(r => {
            if (distribution[r.rating] !== undefined) {
                distribution[r.rating]++;
            }
        });

        return NextResponse.json({
            success: true,
            reviews,
            summary: {
                totalReviews,
                averageRating: parseFloat(averageRating),
                distribution,
            },
        });

    } catch (error) {
        console.error('Reviews API error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch reviews' },
            { status: 500 }
        );
    }
}

// POST /api/reviews — submit a new review
export async function POST(request) {
    try {
        const body = await request.json();
        const { productId, productName, customerName, customerPhone, rating, title, reviewText } = body;

        // Validation
        if (!productId || !customerName || !customerPhone || !rating) {
            return NextResponse.json(
                { success: false, message: 'Product ID, name, phone, and rating are required' },
                { status: 400 }
            );
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json(
                { success: false, message: 'Rating must be between 1 and 5' },
                { status: 400 }
            );
        }

        // Check if customer already reviewed this product
        const existingReviews = await getReviews(productId);
        const normalizePhone = (p) => {
            const digits = (p || '').replace(/\D/g, '');
            return digits.length >= 10 ? digits.slice(-10) : digits;
        };
        const alreadyReviewed = existingReviews.some(
            r => normalizePhone(r.customerPhone) === normalizePhone(customerPhone)
        );

        if (alreadyReviewed) {
            return NextResponse.json(
                { success: false, message: 'You have already reviewed this product' },
                { status: 400 }
            );
        }

        const reviewData = {
            productId,
            productName: productName || '',
            customerName,
            customerPhone,
            rating: parseInt(rating),
            title: title || '',
            reviewText: reviewText || '',
            date: new Date().toISOString(),
            verified: 'Yes', // Verified since they're logged in
        };

        const saved = await saveReview(reviewData);

        if (saved) {
            return NextResponse.json({
                success: true,
                message: 'Review submitted successfully!',
            });
        } else {
            return NextResponse.json(
                { success: false, message: 'Failed to save review' },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('Review submit error:', error);
        return NextResponse.json(
            { success: false, message: 'Something went wrong' },
            { status: 500 }
        );
    }
}
