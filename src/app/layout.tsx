import type {Metadata} from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from "@/components/ui/toaster";
import { APP_NAME } from '@/lib/constants';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: `Your go-to marketplace for car sharing and rentals. Connect with rental agencies and find the perfect vehicle for your needs.`,
  keywords: ['car sharing', 'car rental', 'vehicle marketplace', 'rent a car', 'AutoPool'],
  authors: [{ name: 'AutoPool Team' }],
  openGraph: {
    title: APP_NAME,
    description: 'Airbnb for cars - find and book rental vehicles easily.',
    type: 'website',
    locale: 'en_US',
    // url: 'YOUR_APP_URL', // Replace with your deployed app URL
    // siteName: APP_NAME,
    // images: [ // Add a default OG image
    //   {
    //     url: 'YOUR_OG_IMAGE_URL', // Replace with your OG image URL
    //     width: 1200,
    //     height: 630,
    //     alt: `${APP_NAME} Logo`,
    //   },
    // ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
