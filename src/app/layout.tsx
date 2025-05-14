
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
  description: `Votre marché de référence pour le covoiturage et la location de voitures. Connectez-vous avec les agences de location et trouvez le véhicule parfait pour vos besoins.`,
  keywords: ['covoiturage', 'location de voiture', 'marché de véhicules', 'louer une voiture', 'AutoPool'],
  authors: [{ name: 'L\'équipe AutoPool' }],
  openGraph: {
    title: APP_NAME,
    description: 'Airbnb pour les voitures - trouvez et réservez facilement des véhicules de location.',
    type: 'website',
    locale: 'fr_FR',
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
    <html lang="fr" suppressHydrationWarning>
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
