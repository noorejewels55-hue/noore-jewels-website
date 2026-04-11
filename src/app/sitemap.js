import { getProducts, getCategories } from '@/lib/sheets';

export default async function sitemap() {
    const baseUrl = 'https://noorejewels.in';

    // Static pages
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/shop`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/our-story`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/return-policy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacy-policy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.4,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.4,
        },
        {
            url: `${baseUrl}/track-order`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/my-orders`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/customize`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.85,
        },
    ];

    // New niche category pages for SEO
    const nichePages = [
        {
            url: `${baseUrl}/9kt-diamond`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.95,
        },
        {
            url: `${baseUrl}/customize`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/shop?category=engagement-rings`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/shop?category=stack-rings`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/shop?category=ring`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/shop?category=fine-jewellery`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.85,
        },
        {
            url: `${baseUrl}/shop?category=polished-diamonds`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.85,
        },
    ];

    // Dynamic product pages
    let productPages = [];
    try {
        const products = await getProducts();
        productPages = products.map(product => ({
            url: `${baseUrl}/product/${product.id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        }));
    } catch (e) {
        console.error('Sitemap: Error fetching products', e);
    }

    // Category pages from data
    let categoryPages = [];
    try {
        const categories = await getCategories();
        categoryPages = categories.map(cat => ({
            url: `${baseUrl}/shop?category=${cat.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        }));
    } catch (e) {
        console.error('Sitemap: Error fetching categories', e);
    }

    return [...staticPages, ...nichePages, ...productPages, ...categoryPages];
}
