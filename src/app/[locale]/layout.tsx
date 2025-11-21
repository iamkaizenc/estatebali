import type { Metadata } from "next";
import Script from "next/script";
import "../globals.css";
import "leaflet/dist/leaflet.css";
import { AuthProviderWrapper } from "@/components/AuthProviderWrapper";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { getLocale, isRTL, defaultLocale } from "@/i18n/config";

export const metadata: Metadata = {
  title: "Estate Bali - Bali's Premier Real Estate Platform",
  description: "Find your dream property in Bali. Luxury villas, modern apartments, and prime land for sale and rent.",
  keywords: "Bali real estate, Bali property, villa Bali, apartment Bali, land for sale Bali",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: "Estate Bali - Bali's Premier Real Estate Platform",
    description: "Find your dream property in Bali",
    url: "https://estatebali.app",
    siteName: "Estate Bali",
    type: "website",
  },
};

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = getLocale(params.locale);
  const rtl = isRTL(locale);
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang={locale} dir={rtl ? 'rtl' : 'ltr'}>
      <head>
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className="bg-black text-white antialiased">
        <AuthProviderWrapper>
          {children}
        </AuthProviderWrapper>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}

// Generate static params for all supported locales
export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'id' },
    { locale: 'he' },
    { locale: 'ar' },
    { locale: 'zh' },
  ];
}

