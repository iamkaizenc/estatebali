"use client";

import { ProtectedRoute } from "./ProtectedRoute";

export function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["admin", "super_admin"]} redirectTo="/login">
      {children}
    </ProtectedRoute>
  );
}
