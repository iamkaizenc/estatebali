"use client";

import { useEffect } from "react";
import { Locale, isRTL } from "@/i18n/config";

interface LocaleHandlerProps {
  locale: Locale;
}

export function LocaleHandler({ locale }: LocaleHandlerProps) {
  useEffect(() => {
    // Update document lang and dir attributes
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
      document.documentElement.dir = isRTL(locale) ? 'rtl' : 'ltr';
    }
  }, [locale]);

  return null;
}
