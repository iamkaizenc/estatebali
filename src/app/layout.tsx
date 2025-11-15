import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { AuthProviderWrapper } from "@/components/AuthProviderWrapper";

export const metadata: Metadata = {
  title: "Estate Bali - Bali's Premier Real Estate Platform",
  description: "Find your dream property in Bali. Luxury villas, modern apartments, and prime land for sale and rent.",
  keywords: "Bali real estate, Bali property, villa Bali, apartment Bali, land for sale Bali",
  openGraph: {
    title: "Estate Bali - Bali's Premier Real Estate Platform",
    description: "Find your dream property in Bali",
    url: "https://estatebali.app",
    siteName: "Estate Bali",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        <AuthProviderWrapper>
          {children}
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
