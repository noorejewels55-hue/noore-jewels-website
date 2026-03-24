import "./globals.css";
import { Cormorant_Garamond, Montserrat } from 'next/font/google';
import VisitorTracker from '@/components/VisitorTracker';
import ExitIntentPopup from '@/components/ExitIntentPopup';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata = {
  title: "Noore Jewels — Lab Grown Diamond Jewellery in 9kt, 14kt, 18kt Gold & 925 Silver | India",
  description: "Buy certified lab grown diamond jewellery at Noore Jewels. Solitaire rings, diamond earrings, necklaces & bracelets in 9kt, 14kt, 18kt gold and 925 sterling silver. Ethical, sustainable, and affordable real diamonds. Free shipping across India.",
  keywords: "lab grown diamond jewellery, lab grown diamond ring, solitaire ring, lab grown diamond necklace, lab grown diamond earrings, 9kt gold jewellery, 14kt gold jewellery, 18kt gold jewellery, 925 silver jewellery, CVD diamond, HPHT diamond, certified lab diamond India, ethical diamond jewellery, Noore Jewels, real diamond affordable, solitaire engagement ring, diamond bracelet, lab diamond India online",
  metadataBase: new URL('https://noorejewels.in'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: "Noore Jewels — Lab Grown Diamond Jewellery in Gold & Silver",
    description: "Certified lab grown diamond jewellery in 9kt, 14kt, 18kt gold and 925 silver. Solitaire rings, earrings, necklaces & bracelets. Real diamonds, ethical & affordable.",
    type: "website",
    url: "https://noorejewels.in",
    siteName: "Noore Jewels",
    locale: "en_IN",
    images: [
      {
        url: '/og-banner.png',
        width: 1200,
        height: 630,
        alt: 'Noore Jewels - Lab Grown Diamond Jewellery',
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Noore Jewels — Lab Grown Diamond Jewellery in Gold & Silver",
    description: "Certified lab grown diamonds in 9kt, 14kt, 18kt gold & 925 silver. Solitaire rings, necklaces & earrings. Real diamonds, ethically made.",
    images: ['/og-banner.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'theme-color': '#C5A467',
  },
};

// JSON-LD Structured Data for Google Rich Results
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://noorejewels.in/#organization",
      "name": "Noore Jewels",
      "url": "https://noorejewels.in",
      "logo": "https://noorejewels.in/favicon.png",
      "description": "Premium lab grown diamond jewellery brand. Certified diamonds in 9kt, 14kt, 18kt gold and 925 sterling silver. Ethical, sustainable, and affordable luxury.",
      "foundingDate": "2024",
      "founder": {
        "@type": "Person",
        "name": "Kriti"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "telephone": "+91-9217945235",
        "email": "noore.jewels55@gmail.com",
        "availableLanguage": ["English", "Hindi"]
      },
      "sameAs": [
        "https://www.instagram.com/noore_jewels"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://noorejewels.in/#website",
      "url": "https://noorejewels.in",
      "name": "Noore Jewels",
      "publisher": { "@id": "https://noorejewels.in/#organization" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://noorejewels.in/shop?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "OnlineStore",
      "@id": "https://noorejewels.in/#store",
      "name": "Noore Jewels",
      "url": "https://noorejewels.in",
      "description": "Buy certified lab grown diamond jewellery online. Solitaire rings, necklaces, earrings & bracelets in 9kt, 14kt, 18kt gold and 925 sterling silver.",
      "currenciesAccepted": "INR",
      "paymentAccepted": "UPI, Credit Card, Debit Card, Net Banking, Wallets",
      "priceRange": "₹5,000 - ₹2,00,000",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Lab Grown Diamond Jewellery",
        "itemListElement": [
          { "@type": "OfferCatalog", "name": "Diamond Solitaire Rings" },
          { "@type": "OfferCatalog", "name": "Diamond Earrings" },
          { "@type": "OfferCatalog", "name": "Diamond Necklaces" },
          { "@type": "OfferCatalog", "name": "Diamond Bracelets" }
        ]
      }
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${montserrat.variable}`}>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#C5A467" />
        <link rel="canonical" href="https://noorejewels.in" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <VisitorTracker />
        <ExitIntentPopup />
        {children}
      </body>
    </html>
  );
}
