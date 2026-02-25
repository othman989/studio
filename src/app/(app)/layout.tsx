// src/app/(app)/layout.tsx
"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import Header from "@/components/layout/header";
import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Prevent premature redirect during redirect-auth restoration races
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Always clear any pending redirect
    if (redirectTimerRef.current) {
      clearTimeout(redirectTimerRef.current);
      redirectTimerRef.current = null;
    }

    // While loading, do nothing (show spinner)
    if (loading) return;

    // If still no user AFTER a short grace period, then redirect
    if (!user) {
      redirectTimerRef.current = setTimeout(() => {
        router.replace("/login");
      }, 800); // 0.8s grace; adjust 300–1500ms if needed
    }

    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
        redirectTimerRef.current = null;
      }
    };
  }, [user, loading, router]);

  // While auth is initializing OR we're waiting out the grace period, show spinner
  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarNav />
      <div className="flex flex-col sm:pl-14">
        <Header />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 pb-20 sm:pb-4">
          {children}
        </main>
        <footer className="mt-auto border-t bg-background px-6 py-4 text-center text-xs text-muted-foreground hidden sm:block">
          © {new Date().getFullYear()} GBReplAi ·{" "}
          <Link href="/terms" className="underline">
            Terms of Service
          </Link>{" "}
          ·{" "}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
        </footer>
      </div>
    </div>
  );
}
