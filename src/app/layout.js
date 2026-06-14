import "./globals.css";
import VisitorTracker from '@/components/VisitorTracker';
import ExitIntentPopup from '@/components/ExitIntentPopup';

export const metadata = {
  title: "Noore Jewels — Buy Lab Grown Diamond Rings Online India | IGI Certified | 9kt 14kt 18kt Gold",
  description: "Buy IGI certified Lab Grown Diamond rings online at Noore Jewels India. Engagement rings, solitaire rings, stackable rings & wedding bands in 9kt, 14kt, 18kt real gold. BIS hallmarked, lifetime warranty, free insured shipping. Starting ₹25,000. Shop now!",
  keywords: "lab grown diamond rings, lab grown diamond engagement rings, diamond rings online India, IGI certified diamond ring, solitaire ring, lab grown diamond ring price, buy diamond ring online, engagement ring India, 9kt gold diamond ring, 14kt gold diamond ring, 18kt gold diamond ring, stackable diamond ring, wedding band diamond, lab grown diamond jewellery India, real gold diamond ring, affordable diamond ring, LGD ring, lab created diamond ring, diamond ring for women, BIS hallmarked diamond ring, custom engagement ring, diamond solitaire ring price India, best lab grown diamond rings, Noore Jewels, fine jewellery online India, polished lab grown diamonds, loose diamonds India, diamond engagement ring under 50000, lab diamond ring near me, certified diamond engagement ring",
  metadataBase: new URL('https://noorejewels.in'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: "Noore Jewels — IGI Certified Lab Grown Diamond Rings | 9kt 14kt 18kt Gold | India",
    description: "Shop IGI certified Lab Grown Diamond engagement rings, solitaire rings & stackable rings in 9kt–18kt real gold. BIS hallmarked, lifetime warranty, 7-day returns. Starting ₹25,000.",
    type: "website",
    url: "https://noorejewels.in",
    siteName: "Noore Jewels",
    locale: "en_IN",
    images: [
      {
        url: '/og-banner.png',
        width: 1200,
        height: 630,
        alt: 'Noore Jewels - IGI Certified Lab Grown Diamond Rings in 9kt 14kt 18kt Gold',
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Buy Lab Grown Diamond Rings Online — Noore Jewels India",
    description: "IGI certified diamond engagement rings & solitaire rings in 9kt–18kt gold. Starting ₹25,000. BIS hallmarked, lifetime warranty.",
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
  verification: {
    google: 'your-google-site-verification-code',
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
      "description": "India's premium Lab Grown Diamond jewellery brand. Buy IGI certified diamond engagement rings, solitaire rings, stackable rings, and fine jewellery in 9kt, 14kt, 18kt BIS hallmarked gold. Free insured shipping, lifetime warranty.",
      "foundingDate": "2024",
      "founder": {
        "@type": "Person",
        "name": "Asha"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "telephone": "+91-8076735450",
        "email": "noore.jewels55@gmail.com",
        "availableLanguage": ["English", "Hindi"]
      },
      "sameAs": [
        "https://www.instagram.com/noore_jewels"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "150",
        "bestRating": "5"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://noorejewels.in/#website",
      "url": "https://noorejewels.in",
      "name": "Noore Jewels — Lab Grown Diamond Rings India",
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
      "name": "Noore Jewels — Lab Grown Diamond Engagement Rings & Fine Jewellery",
      "url": "https://noorejewels.in",
      "description": "Buy IGI certified Lab Grown Diamond rings online in India. Engagement rings, solitaire rings, stackable rings, wedding bands in 9kt, 14kt, 18kt BIS hallmarked gold. Starting ₹25,000. Lifetime warranty, 7-day returns, free insured shipping.",
      "currenciesAccepted": "INR",
      "paymentAccepted": "UPI, Credit Card, Debit Card, Net Banking, Wallets",
      "priceRange": "₹25,000 - ₹5,00,000",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Lab Grown Diamond Jewellery Collection",
        "itemListElement": [
          { "@type": "OfferCatalog", "name": "Lab Grown Diamond Engagement Rings" },
          { "@type": "OfferCatalog", "name": "Lab Grown Diamond Solitaire Rings" },
          { "@type": "OfferCatalog", "name": "Diamond Stackable Rings" },
          { "@type": "OfferCatalog", "name": "Diamond Wedding Bands" },
          { "@type": "OfferCatalog", "name": "Fine Diamond Jewellery" },
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
            "minValue": 15,
            "maxValue": 21,
            "unitCode": "DAY"
          }
        }
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://noorejewels.in" },
        { "@type": "ListItem", "position": 2, "name": "Shop Diamond Rings", "item": "https://noorejewels.in/shop" },
        { "@type": "ListItem", "position": 3, "name": "Engagement Rings", "item": "https://noorejewels.in/shop?category=engagement-rings" },
        { "@type": "ListItem", "position": 4, "name": "9KT Gold Diamond Rings", "item": "https://noorejewels.in/9kt-diamond" },
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is a Lab Grown Diamond?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Lab Grown Diamonds are real diamonds created in a laboratory using advanced HPHT or CVD technology. They have the exact same physical, chemical, and optical properties as mined diamonds. Each diamond at Noore Jewels is IGI certified and indistinguishable from natural diamonds. They are 100% real, ethical, and conflict-free."
          }
        },
        {
          "@type": "Question",
          "name": "Are your diamond rings IGI certified?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, every Lab Grown Diamond ring at Noore Jewels comes with an IGI (International Gemological Institute) certificate that verifies the diamond's cut, colour, clarity, and carat weight. Our gold is also BIS hallmarked for purity guarantee."
          }
        },
        {
          "@type": "Question",
          "name": "What gold options are available for diamond rings?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Noore Jewels offers Lab Grown Diamond rings in 9kt, 14kt, and 18kt real gold. All gold is BIS hallmarked. You can choose between Yellow Gold, Rose Gold, and White Gold for each piece. 9kt gold is durable and affordable, 14kt offers the best balance, and 18kt is for maximum luxury."
          }
        },
        {
          "@type": "Question",
          "name": "How much does a Lab Grown Diamond engagement ring cost?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Lab Grown Diamond engagement rings at Noore Jewels start from ₹25,000 for 9kt gold options. Prices vary based on the diamond carat weight, quality, and gold purity selected. Our dynamic pricing system automatically calculates the exact price based on your metal and diamond selection."
          }
        },
        {
          "@type": "Question",
          "name": "What is the difference between 9kt, 14kt, and 18kt gold?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "9kt gold contains 37.5% pure gold and is the most durable and affordable option, ideal for daily wear diamond rings. 14kt contains 58.3% gold and offers an excellent balance of durability and luxury. 18kt contains 75% pure gold and is the softest but most premium choice. All options at Noore Jewels are BIS hallmarked."
          }
        },
        {
          "@type": "Question",
          "name": "What is your return policy on diamond rings?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We offer a 7-day return policy from the date of delivery. Items must be returned in their original condition with all packaging and certification. Customized pieces and loose diamonds are non-returnable."
          }
        },
        {
          "@type": "Question",
          "name": "Do you offer lifetime warranty on diamond jewellery?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, all Noore Jewels diamond jewellery comes with a lifetime warranty covering manufacturing defects, free resizing, and maintenance polishing. Every purchase includes free insured shipping across India."
          }
        },
        {
          "@type": "Question",
          "name": "Can I customize my diamond engagement ring?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Noore Jewels offers full customization on every diamond ring. You can choose the metal purity (9kt, 14kt, 18kt), metal colour (Yellow, Rose, White Gold), diamond shape, and ring size. Our pricing updates in real-time based on your selections."
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
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#C5A467" />
        <link rel="canonical" href="https://noorejewels.in" />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --font-cormorant: 'Cormorant Garamond', Georgia, serif;
            --font-montserrat: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
          }
        `}} />
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
