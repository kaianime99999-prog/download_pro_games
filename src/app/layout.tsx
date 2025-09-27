import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'تحميل العاب برو - أفضل موقع لتحميل الألعاب مجاناً',
    template: '%s | تحميل العاب برو'
  },
  description: 'حمل أحدث وأفضل الألعاب مجاناً من تحميل العاب برو. ألعاب أكشن، حرب، سيارات، رياضة وأكثر. تحميل مباشر وآمن.',
  keywords: 'تحميل العاب, العاب مجانية, العاب اكشن, العاب حرب, العاب سيارات, العاب رياضة, العاب عربية',
  authors: [{ name: 'تحميل العاب برو' }],
  creator: 'تحميل العاب برو',
  publisher: 'تحميل العاب برو',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'تحميل العاب برو',
    title: 'تحميل العاب برو - أفضل موقع لتحميل الألعاب مجاناً',
    description: 'حمل أحدث وأفضل الألعاب مجاناً من تحميل العاب برو',
    images: [{
      url: '/icon.jpg',
      width: 1200,
      height: 630,
      alt: 'تحميل العاب برو'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'تحميل العاب برو',
    description: 'حمل أحدث وأفضل الألعاب مجاناً',
    images: ['/icon.jpg']
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://via.placeholder.com" />
        <link rel="dns-prefetch" href="https://www.wifi4games.com" />
        <link rel="icon" href="/icon.jpg" type="image/jpeg" />
        <link rel="shortcut icon" href="/icon.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/icon.jpg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon.jpg" />
        <link rel="icon" type="image/jpeg" sizes="32x32" href="/icon.jpg" />
        <link rel="icon" type="image/jpeg" sizes="16x16" href="/icon.jpg" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#1e40af" />
      </head>
      <body className="antialiased bg-gray-900 text-white">{children}</body>
    </html>
  );
}