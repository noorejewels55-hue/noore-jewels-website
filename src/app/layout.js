import "./globals.css";
import VisitorTracker from '@/components/VisitorTracker';
import ExitIntentPopup from '@/components/ExitIntentPopup';

export const metadata = {
  title: "Noore Jewels — Trendy American Diamond (AD) Jewellery Online | CZ Imitation Jewelry India",
  description: "Buy trendy American Diamond (AD) jewellery online at Noore Jewels. Premium CZ necklaces, rings, bracelets & earrings. Anti-tarnish, diamond-look jewellery starting ₹199. Free shipping above ₹999. Best AD jewelry store in India.",
  keywords: "American Diamond jewellery, AD jewellery, CZ jewellery, trendy diamond jewellery, imitation jewellery, American Diamond necklace, AD necklace set, CZ earrings, trendy jewellery online India, affordable diamond jewellery, anti-tarnish jewellery, cubic zirconia jewelry, American Diamond rings, AD bracelet, fashion jewellery India, Noore Jewels, best AD jewellery online, trendy CZ jewelry, diamond look jewellery, premium imitation jewelry",
  metadataBase: new URL('https://noorejewels.in'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: "Noore Jewels — Trendy American Diamond (AD) Jewellery Online India",
    description: "Shop premium American Diamond (AD/CZ) imitation jewellery at Noore Jewels. Trendy diamond-look necklaces, rings, earrings & bracelets. Anti-tarnish quality starting ₹199.",
    type: "website",
    url: "https://noorejewels.in",
    siteName: "Noore Jewels",
    locale: "en_IN",
    images: [
      {
        url: '/favicon.png',
        width: 512,
        height: 512,
        alt: 'Noore Jewels - Trendy American Diamond Jewellery',
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Noore Jewels — Trendy American Diamond Jewellery Online",
    description: "Buy trendy AD jewellery online. Premium CZ necklaces, rings & earrings starting ₹199. Free shipping above ₹999.",
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
      "description": "Premium American Diamond (AD) imitation jewellery brand founded by Kriti. Trendy CZ jewelry at affordable prices.",
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
      "description": "Buy trendy American Diamond (AD/CZ) imitation jewellery online. Premium anti-tarnish necklaces, rings, earrings & bracelets starting at ₹199.",
      "currenciesAccepted": "INR",
      "paymentAccepted": "UPI, Credit Card, Debit Card, Net Banking, Wallets",
      "priceRange": "₹199 - ₹5000",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "American Diamond Jewellery",
        "itemListElement": [
          { "@type": "OfferCatalog", "name": "AD Necklaces" },
          { "@type": "OfferCatalog", "name": "AD Earrings" },
          { "@type": "OfferCatalog", "name": "AD Rings" },
          { "@type": "OfferCatalog", "name": "AD Bracelets" }
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

        {/* ── Google Analytics 4 (GA4) ── */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `,
          }}
        />

        {/* ── Meta Pixel (Facebook/Instagram Ads) ── */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', 'XXXXXXXXXXXXXXXX');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img height="1" width="1" style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=XXXXXXXXXXXXXXXX&ev=PageView&noscript=1"
          />
        </noscript>
      </head>
      <body>
        <VisitorTracker />
        <ExitIntentPopup />
        {children}
      </body>
    </html>
  );
}
