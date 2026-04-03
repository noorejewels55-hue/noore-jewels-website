import "./globals.css";
import VisitorTracker from '@/components/VisitorTracker';
import ExitIntentPopup from '@/components/ExitIntentPopup';

export const metadata = {
  title: "Noore Jewels — Lab Grown Diamond Engagement Rings & Fine Jewellery Online India",
  description: "Buy IGI certified Lab Grown Diamond engagement rings, solitaire rings & fine jewellery online at Noore Jewels. Premium LGD rings in 9kt, 14kt, 18kt gold. Lifetime warranty, 7-day returns, insured shipping. Best Lab Grown Diamond jewelry store in India.",
  keywords: "lab grown diamond engagement rings, lab grown diamond rings, solitaire engagement ring, LGD engagement ring, lab grown diamond jewellery, lab created diamond rings, engagement ring India, lab grown diamond solitaire, IGI certified diamond ring, lab diamond ring online, buy lab grown diamond, fine jewellery India, polished diamonds, loose lab grown diamonds, ethical diamond jewellery, Noore Jewels, custom engagement ring, diamond ring online India, lab grown diamond price, best lab grown diamond jewellery",
  metadataBase: new URL('https://noorejewels.in'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: "Noore Jewels — Lab Grown Diamond Engagement Rings & Fine Jewellery India",
    description: "Shop IGI certified Lab Grown Diamond engagement rings & fine jewellery at Noore Jewels. Solitaire rings, custom designs in 9kt–18kt gold. Lifetime warranty & 7-day returns.",
    type: "website",
    url: "https://noorejewels.in",
    siteName: "Noore Jewels",
    locale: "en_IN",
    images: [
      {
        url: '/hero-solitaire.png',
        width: 1200,
        height: 630,
        alt: 'Noore Jewels - Lab Grown Diamond Engagement Rings & Solitaire Jewellery',
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Noore Jewels — Lab Grown Diamond Engagement Rings Online India",
    description: "IGI certified Lab Grown Diamond engagement rings & fine jewellery. Solitaire rings in 9kt–18kt gold. Lifetime warranty, 7-day returns.",
    images: ['/hero-solitaire.png'],
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
      "description": "Premium Lab Grown Diamond fine jewellery brand specialising in engagement rings, solitaire rings, and custom diamond jewellery. IGI certified diamonds with lifetime warranty.",
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
      "description": "Buy IGI certified Lab Grown Diamond engagement rings, solitaire rings, and fine jewellery online. Custom designs in 9kt, 14kt, 18kt gold with lifetime warranty.",
      "currenciesAccepted": "INR",
      "paymentAccepted": "UPI, Credit Card, Debit Card, Net Banking, Wallets",
      "priceRange": "₹15,000 - ₹5,00,000",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Lab Grown Diamond Jewellery",
        "itemListElement": [
          { "@type": "OfferCatalog", "name": "Engagement Rings" },
          { "@type": "OfferCatalog", "name": "Stackable Rings" },
          { "@type": "OfferCatalog", "name": "Fine Jewellery" },
          { "@type": "OfferCatalog", "name": "Polished Lab Grown Diamonds" }
        ]
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "merchantReturnDays": 7,
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/FreeReturn"
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "INR"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "IN"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 3,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 5,
            "maxValue": 10,
            "unitCode": "DAY"
          }
        }
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is a Lab Grown Diamond?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Lab Grown Diamonds are real diamonds created in a laboratory using advanced technology. They have the exact same physical, chemical, and optical properties as mined diamonds. They are IGI certified and indistinguishable from natural diamonds."
          }
        },
        {
          "@type": "Question",
          "name": "Are your diamonds IGI certified?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, every Lab Grown Diamond at Noore Jewels comes with an IGI (International Gemological Institute) certificate that verifies the diamond's quality, cut, colour, clarity, and carat weight."
          }
        },
        {
          "@type": "Question",
          "name": "What is your return policy?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We offer a 7-day return policy from the date of delivery. Items must be returned in their original condition with all packaging and certification. Customized pieces and loose diamonds are non-returnable."
          }
        },
        {
          "@type": "Question",
          "name": "Do you offer lifetime warranty?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, all Noore Jewels jewellery comes with a lifetime warranty covering manufacturing defects, free resizing, and maintenance polishing. Normal wear and tear is not covered."
          }
        }
      ]
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
