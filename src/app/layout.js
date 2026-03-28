import "./globals.css";
import VisitorTracker from '@/components/VisitorTracker';
import ExitIntentPopup from '@/components/ExitIntentPopup';

export const metadata = {
  title: "Noore Jewels — Exquisite Lab Grown Diamond Jewellery Online | Premium LGD Jewelry India",
  description: "Buy exquisite Lab Grown Diamond jewellery online at Noore Jewels. Premium LGD necklaces, rings, bracelets & earrings. Ethically sourced, fine jewellery starting from ₹199. Free shipping above ₹999. Best Lab Grown Diamond jewelry store in India.",
  keywords: "Lab Grown Diamond jewellery, LGD jewellery, lab diamond jewellery, exquisite diamond jewellery, fine jewellery, Lab Grown Diamond necklace, LGD necklace set, LGD earrings, exquisite jewellery online India, affordable diamond jewellery, ethical jewellery, lab created diamond jewelry, Lab Grown Diamond rings, LGD bracelet, luxury jewellery India, Noore Jewels, best LGD jewellery online, trendy lab diamond jewelry, sustainable diamond jewellery, premium fine jewelry",
  metadataBase: new URL('https://noorejewels.in'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: "Noore Jewels — Exquisite Lab Grown Diamond Jewellery Online India",
    description: "Shop premium Lab Grown Diamond fine jewellery at Noore Jewels. Exquisite necklaces, rings, earrings & bracelets. Superior quality starting ₹199.",
    type: "website",
    url: "https://noorejewels.in",
    siteName: "Noore Jewels",
    locale: "en_IN",
    images: [
      {
        url: '/favicon.png',
        width: 512,
        height: 512,
        alt: 'Noore Jewels - Exquisite Lab Grown Diamond Jewellery',
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Noore Jewels — Exquisite Lab Grown Diamond Jewellery Online",
    description: "Buy exquisite Lab Grown Diamond jewellery online. Premium LGD necklaces, rings & earrings starting ₹199. Free shipping above ₹999.",
    images: ['/favicon.png'],
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
      "description": "Premium Lab Grown Diamond fine jewellery brand founded by Kriti. Exquisite LGD jewelry at accessible prices.",
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
      "description": "Buy exquisite Lab Grown Diamond fine jewellery online. Premium LGD necklaces, rings, earrings & bracelets starting at ₹199.",
      "currenciesAccepted": "INR",
      "paymentAccepted": "UPI, Credit Card, Debit Card, Net Banking, Wallets",
      "priceRange": "₹199 - ₹5000",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Lab Grown Diamond Jewellery",
        "itemListElement": [
          { "@type": "OfferCatalog", "name": "LGD Necklaces" },
          { "@type": "OfferCatalog", "name": "LGD Earrings" },
          { "@type": "OfferCatalog", "name": "LGD Rings" },
          { "@type": "OfferCatalog", "name": "LGD Bracelets" }
        ]
      }
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
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
