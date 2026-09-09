import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'ShopSense AI - Achetez malin, vivez mieux',
    template: '%s | ShopSense AI',
  },
  description:
    'Plateforme intelligente qui simplifie les achats internationaux au Sénégal et en Afrique de l\'Ouest.',
  keywords: [
    'e-commerce',
    'achats',
    'Sénégal',
    'Afrique',
    'intelligence artificielle',
    'shopping',
    'livraison',
  ],
  authors: [{ name: 'ShopSense AI' }],
  creator: 'ShopSense AI',
  publisher: 'ShopSense AI',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://shopsense-ai.com',
    siteName: 'ShopSense AI',
    title: 'ShopSense AI - Achetez malin, vivez mieux',
    description:
      'Plateforme intelligente qui simplifie les achats internationaux au Sénégal et en Afrique de l\'Ouest.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ShopSense AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShopSense AI - Achetez malin, vivez mieux',
    description:
      'Plateforme intelligente qui simplifie les achats internationaux au Sénégal et en Afrique de l\'Ouest.',
    images: ['/twitter-image.jpg'],
  },
  alternates: {
    canonical: 'https://shopsense-ai.com',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shopsense-ai.com'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}