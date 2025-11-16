"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "./ErrorBoundary";

export function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ErrorBoundary>
  );
}
