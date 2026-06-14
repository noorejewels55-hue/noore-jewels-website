import ProductDetailClient from './ProductDetailClient';
import { getProducts } from '@/lib/sheets';

export async function generateMetadata({ params }) {
    try {
        const resolvedParams = await params;
        const { id } = resolvedParams;
        const products = await getProducts();
        const product = products.find(p => p.id === id);

        if (!product) {
            return {
                title: 'Product Not Found | Noore Jewels',
                description: 'The requested product could not be found on Noore Jewels.',
            };
        }

        // Create SEO optimized title and description using keywords
        const productTitle = `${product.name} — Buy Lab Grown Diamond Ring | Noore Jewels`;
        const categoryLabel = product.category ? product.category.replace(/-/g, ' ') : 'Diamond Jewellery';
        
        const rawDesc = product.description || '';
        const cleanDesc = rawDesc.replace(/[#*`_]/g, ''); // strip markdown
        const productDescription = cleanDesc 
            ? (cleanDesc.length > 155 ? `${cleanDesc.substring(0, 152)}...` : cleanDesc)
            : `Shop ${product.name} at Noore Jewels India. IGI certified lab grown diamond ring crafted in real gold. BIS hallmarked, lifetime warranty, free insured shipping.`;

        // Format tag keywords
        const tagsList = product.tags && product.tags.length > 0 
            ? `, ${product.tags.join(', ')}` 
            : '';

        return {
            title: productTitle,
            description: productDescription,
            keywords: `${product.name}, lab grown diamond ring, buy diamond ring online India, Noore Jewels, ${categoryLabel}${tagsList}`,
            openGraph: {
                title: productTitle,
                description: productDescription,
                url: `https://noorejewels.in/product/${product.id}`,
                siteName: 'Noore Jewels',
                images: [
                    {
                        url: product.image,
                        width: 800,
                        height: 800,
                        alt: product.name,
                    }
                ],
                locale: 'en_IN',
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title: productTitle,
                description: productDescription,
                images: [product.image],
            }
        };
    } catch (e) {
        console.error('Error generating metadata:', e);
        return {
            title: 'Noore Jewels — Lab Grown Diamond Rings',
            description: 'Buy IGI certified Lab Grown Diamond rings online at Noore Jewels India.',
        };
    }
}

export default async function ProductPage({ params }) {
    return <ProductDetailClient params={params} />;
}
