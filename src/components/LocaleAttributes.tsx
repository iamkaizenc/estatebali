"use client";

import { useEffect } from "react";
import { Locale, isRTL } from "@/i18n/config";

interface LocaleAttributesProps {
  locale: Locale;
  children: React.ReactNode;
}

export function LocaleAttributes({ locale, children }: LocaleAttributesProps) {
  useEffect(() => {
    // Update html lang and dir attributes on client
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', locale);
      document.documentElement.setAttribute('dir', isRTL(locale) ? 'rtl' : 'ltr');
    }
  }, [locale]);

  return <>{children}</>;
}

