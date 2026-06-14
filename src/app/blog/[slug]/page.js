import BlogPostClient from './BlogPostClient';
import { blogPosts } from '@/lib/blogData';

export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const post = blogPosts.find(p => p.slug === slug);

    if (!post) {
        return {
            title: 'Blog Post Not Found | Noore Jewels',
            description: 'The requested blog post could not be found.',
        };
    }

    return {
        title: `${post.title} | Noore Jewels Blog`,
        description: post.excerpt,
        keywords: post.keywords ? post.keywords.join(', ') : `${post.category}, lab grown diamonds, Noore Jewels`,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            url: `https://noorejewels.in/blog/${post.slug}`,
            siteName: 'Noore Jewels',
            locale: 'en_IN',
            type: 'article',
            publishedTime: post.dateISO,
            authors: ['Noore Jewels'],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
        }
    };
}

export default async function BlogPostPage({ params }) {
    return <BlogPostClient params={params} />;
}
