import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { AuthProviderWrapper } from "@/components/AuthProviderWrapper";
import { ToastProvider } from "@/contexts/ToastContext";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://estatebali.app'),
  title: "Estate Bali - Bali's Premier Real Estate Platform",
  description: "Find your dream property in Bali. Luxury villas, modern apartments, and prime land for sale and rent.",
  keywords: "Bali real estate, Bali property, villa Bali, apartment Bali, land for sale Bali",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: "Estate Bali - Bali's Premier Real Estate Platform",
    description: "Find your dream property in Bali",
    url: "https://estatebali.app",
    siteName: "Estate Bali",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
};

// Root layout - must include html and body tags
// CRITICAL: AuthProvider must be at root level to work on all pages
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <AuthProviderWrapper>
            {children}
          </AuthProviderWrapper>
        </ToastProvider>
      </body>
    </html>
  );
}
