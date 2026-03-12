'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

// Star display component
function StarRating({ rating, size = 16, interactive = false, onRate = null }) {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="star-rating" style={{ display: 'inline-flex', gap: '2px' }}>
            {[1, 2, 3, 4, 5].map((star) => {
                const filled = interactive
                    ? star <= (hoverRating || rating)
                    : star <= rating;
                const halfFilled = !interactive && !filled && star - 0.5 <= rating;

                return (
                    <span
                        key={star}
                        onClick={() => interactive && onRate?.(star)}
                        onMouseEnter={() => interactive && setHoverRating(star)}
                        onMouseLeave={() => interactive && setHoverRating(0)}
                        style={{
                            cursor: interactive ? 'pointer' : 'default',
                            fontSize: `${size}px`,
                            lineHeight: 1,
                            color: filled
                                ? '#C5A467'
                                : halfFilled
                                    ? '#C5A467'
                                    : '#DDD5C8',
                            transition: 'color 0.15s ease, transform 0.15s ease',
                            transform: interactive && (hoverRating >= star) ? 'scale(1.15)' : 'scale(1)',
                            display: 'inline-block',
                            userSelect: 'none',
                        }}
                    >
                        {filled ? '★' : halfFilled ? '★' : '☆'}
                    </span>
                );
            })}
        </div>
    );
}

// Rating bar for distribution
function RatingBar({ stars, count, total }) {
    const percentage = total > 0 ? (count / total) * 100 : 0;

    return (
        <div className="review-rating-bar">
            <span className="review-rating-bar-label">{stars} ★</span>
            <div className="review-rating-bar-track">
                <div
                    className="review-rating-bar-fill"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <span className="review-rating-bar-count">{count}</span>
        </div>
    );
}

// Format relative date
function formatReviewDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Get initials from name
function getInitials(name) {
    if (!name) return '?';
    return name
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

// Color hash for avatar
function getAvatarColor(name) {
    const colors = [
        '#C5A467', '#B76E79', '#7B8FA1', '#A68B4B',
        '#6B8E7B', '#8B7355', '#7A6FA0', '#A06B5F',
    ];
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

export default function ReviewSection({ productId, productName }) {
    const { user, openAuth } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
    const [visibleCount, setVisibleCount] = useState(3);

    // Form states
    const [formRating, setFormRating] = useState(0);
    const [formTitle, setFormTitle] = useState('');
    const [formText, setFormText] = useState('');

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`/api/reviews?productId=${productId}`);
            const data = await res.json();
            if (data.success) {
                setReviews(data.reviews);
                setSummary(data.summary);
            }
        } catch (err) {
            console.error('Error fetching reviews:', err);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            openAuth();
            return;
        }

        if (formRating === 0) {
            setSubmitMessage({ type: 'error', text: 'Please select a star rating' });
            return;
        }

        setSubmitting(true);
        setSubmitMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId,
                    productName,
                    customerName: user.name,
                    customerPhone: user.phone,
                    rating: formRating,
                    title: formTitle,
                    reviewText: formText,
                }),
            });

            const data = await res.json();

            if (data.success) {
                setSubmitMessage({ type: 'success', text: '✨ Thank you for your review!' });
                setFormRating(0);
                setFormTitle('');
                setFormText('');
                setShowForm(false);
                // Refresh reviews
                fetchReviews();
            } else {
                setSubmitMessage({ type: 'error', text: data.message || 'Failed to submit review' });
            }
        } catch (err) {
            setSubmitMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
        }

        setSubmitting(false);
    };

    const visibleReviews = reviews.slice(0, visibleCount);
    const hasMore = reviews.length > visibleCount;

    return (
        <section className="review-section" id="reviews">
            <div className="container">
                <h2 className="section-title" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
                    Customer Reviews
                </h2>
                <div className="section-divider" />

                {loading ? (
                    <div className="review-loading">
                        <div className="skeleton" style={{ height: '120px', width: '100%', borderRadius: '12px', marginBottom: '16px' }} />
                        <div className="skeleton" style={{ height: '80px', width: '100%', borderRadius: '12px' }} />
                    </div>
                ) : (
                    <>
                        {/* Summary Section */}
                        <div className="review-summary">
                            <div className="review-summary-left">
                                <div className="review-summary-rating">
                                    {summary?.averageRating || '0.0'}
                                </div>
                                <StarRating rating={summary?.averageRating || 0} size={22} />
                                <div className="review-summary-count">
                                    {summary?.totalReviews || 0} {summary?.totalReviews === 1 ? 'Review' : 'Reviews'}
                                </div>
                            </div>
                            <div className="review-summary-right">
                                {[5, 4, 3, 2, 1].map(stars => (
                                    <RatingBar
                                        key={stars}
                                        stars={stars}
                                        count={summary?.distribution?.[stars] || 0}
                                        total={summary?.totalReviews || 0}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Write Review Button */}
                        <div className="review-actions">
                            {!showForm && (
                                <button
                                    className="btn btn-primary review-write-btn"
                                    onClick={() => {
                                        if (!user) {
                                            openAuth();
                                        } else {
                                            setShowForm(true);
                                        }
                                    }}
                                >
                                    ✍️ Write a Review
                                </button>
                            )}
                        </div>

                        {/* Submit Message */}
                        {submitMessage.text && (
                            <div className={`review-message review-message-${submitMessage.type}`}>
                                {submitMessage.text}
                            </div>
                        )}

                        {/* Review Form */}
                        {showForm && (
                            <form className="review-form" onSubmit={handleSubmit}>
                                <div className="review-form-header">
                                    <h3>Share Your Experience</h3>
                                    <button
                                        type="button"
                                        className="review-form-close"
                                        onClick={() => setShowForm(false)}
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="review-form-stars">
                                    <label>Your Rating</label>
                                    <StarRating
                                        rating={formRating}
                                        size={32}
                                        interactive={true}
                                        onRate={setFormRating}
                                    />
                                    {formRating > 0 && (
                                        <span className="review-form-rating-text">
                                            {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][formRating]}
                                        </span>
                                    )}
                                </div>

                                <div className="review-form-field">
                                    <label>Review Title (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="Sum up your experience in a few words"
                                        value={formTitle}
                                        onChange={(e) => setFormTitle(e.target.value)}
                                        maxLength={100}
                                    />
                                </div>

                                <div className="review-form-field">
                                    <label>Your Review (Optional)</label>
                                    <textarea
                                        placeholder="Tell others what you think about this product. Was it as expected? Quality? How does it look?"
                                        value={formText}
                                        onChange={(e) => setFormText(e.target.value)}
                                        rows={4}
                                        maxLength={500}
                                    />
                                    <div className="review-form-char-count">
                                        {formText.length}/500
                                    </div>
                                </div>

                                <div className="review-form-submit-row">
                                    <button
                                        type="button"
                                        className="btn btn-outline"
                                        onClick={() => setShowForm(false)}
                                        style={{ padding: '12px 24px' }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-gold"
                                        disabled={submitting || formRating === 0}
                                        style={{ padding: '12px 32px' }}
                                    >
                                        {submitting ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Reviews List */}
                        <div className="review-list">
                            {reviews.length === 0 ? (
                                <div className="review-empty">
                                    <span className="review-empty-icon">💬</span>
                                    <p className="review-empty-title">No reviews yet</p>
                                    <p className="review-empty-text">Be the first to share your experience with this product!</p>
                                </div>
                            ) : (
                                <>
                                    {visibleReviews.map((review, idx) => (
                                        <div
                                            key={idx}
                                            className="review-card"
                                            style={{ animationDelay: `${idx * 0.08}s` }}
                                        >
                                            <div className="review-card-header">
                                                <div
                                                    className="review-card-avatar"
                                                    style={{ background: getAvatarColor(review.customerName) }}
                                                >
                                                    {getInitials(review.customerName)}
                                                </div>
                                                <div className="review-card-meta">
                                                    <div className="review-card-name">
                                                        {review.customerName}
                                                        {review.verified && (
                                                            <span className="review-verified-badge" title="Verified Purchase">
                                                                ✓ Verified
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="review-card-date">
                                                        {formatReviewDate(review.date)}
                                                    </div>
                                                </div>
                                                <div className="review-card-stars">
                                                    <StarRating rating={review.rating} size={14} />
                                                </div>
                                            </div>

                                            {review.title && (
                                                <h4 className="review-card-title">{review.title}</h4>
                                            )}

                                            {review.reviewText && (
                                                <p className="review-card-text">{review.reviewText}</p>
                                            )}
                                        </div>
                                    ))}

                                    {hasMore && (
                                        <button
                                            className="review-load-more"
                                            onClick={() => setVisibleCount(prev => prev + 5)}
                                        >
                                            Show More Reviews ({reviews.length - visibleCount} remaining)
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}

// Export StarRating for use in ProductCard
export { StarRating };
