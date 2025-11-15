"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Redirect /admin/login to /login (unified login page)
export default function AdminLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Redirecting to login...</p>
      </div>
    </div>
  );
}
