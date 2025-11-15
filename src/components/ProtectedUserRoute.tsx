"use client";

import { ProtectedRoute } from "./ProtectedRoute";

export function ProtectedUserRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["user", "owner", "agent", "customer"]} redirectTo="/login">
      {children}
    </ProtectedRoute>
  );
}

