import "./globals.css";

export const metadata = {
  title: "Noore Jewels — Trendy Jewellery That Shines Forever",
  description: "Discover stunning, affordable jewellery at Noore Jewels. Shop rings, necklaces, bracelets, earrings and more. Starting at ₹199 with free shipping above ₹999.",
  keywords: "jewellery, rings, necklaces, bracelets, earrings, affordable jewellery, Noore Jewels, Indian jewellery, AD jewellery, American Diamond",
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: "Noore Jewels — Trendy Jewellery That Shines Forever",
    description: "Discover stunning, affordable jewellery at Noore Jewels. Shop rings, necklaces, bracelets, earrings and more.",
    type: "website",
    url: "https://noorejewels.in",
    siteName: "Noore Jewels",
    images: [
      {
        url: '/favicon.png',
        width: 512,
        height: 512,
        alt: 'Noore Jewels',
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
