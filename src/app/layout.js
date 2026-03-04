import "./globals.css";

export const metadata = {
  title: "Noore Jewels — Trendy American Diamond (AD) Jewellery Online | CZ Imitation Jewelry India",
  description: "Buy trendy American Diamond (AD) jewellery online at Noore Jewels. Premium CZ necklaces, rings, bracelets & earrings. Anti-tarnish, diamond-look jewellery starting ₹199. Free shipping above ₹999. Best AD jewelry store in India.",
  keywords: "American Diamond jewellery, AD jewellery, CZ jewellery, trendy diamond jewellery, imitation jewellery, American Diamond necklace, AD necklace set, CZ earrings, trendy jewellery online India, affordable diamond jewellery, anti-tarnish jewellery, cubic zirconia jewelry, American Diamond rings, AD bracelet, fashion jewellery India, Noore Jewels, best AD jewellery online, trendy CZ jewelry, diamond look jewellery, premium imitation jewelry",
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
    images: [
      {
        url: '/favicon.png',
        width: 512,
        height: 512,
        alt: 'Noore Jewels - Trendy American Diamond Jewellery',
      }
    ],
  },
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
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
