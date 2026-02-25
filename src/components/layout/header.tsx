
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { PanelLeft, ShieldAlert, LayoutDashboard, MessageSquare, CreditCard, Settings, TicketPercent, Headset, Users, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserNav } from "@/components/layout/user-nav";
import { NotificationBell } from "@/components/layout/notification-bell";
import { useAuth } from "@/contexts/auth-context";
import { useAdmin } from "@/hooks/use-admin";
import { Button } from "@/components/ui/button";

export default function Header() {
  const pathname = usePathname();
  const { client } = useAuth();
  const { isAdmin } = useAdmin();
  const credits = client?.credits ?? 0;
  const plan = (client as any)?.plan ?? "free";
  const lowCredits = credits < 10;
  const showUpgrade = plan === "free" || lowCredits;

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", adminOnly: false },
    { href: "/reviews", icon: MessageSquare, label: "Reviews", adminOnly: false },
    { href: "/billing", icon: CreditCard, label: "Billing", adminOnly: false },
    { href: "/settings", icon: Settings, label: "Settings", adminOnly: false },
    { href: "/admin", icon: ShieldAlert, label: "Admin", adminOnly: true },
    { href: "/admin/coupons", icon: TicketPercent, label: "Coupons", adminOnly: true },
    { href: "/admin/connections", icon: Wifi, label: "Connections", adminOnly: true },
  ];

  const visibleNavItems = navItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Left: logo + primary nav (desktop) */}
        <div className="flex items-center gap-2">
          {/* Mobile menu */}
          <div className="sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-md border bg-background"
                >
                  <PanelLeft className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="mb-4 flex items-center gap-2">
                  <span className="rounded bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-400">
                    GB
                  </span>
                  <span className="text-sm font-semibold">GBReplAi</span>
                </div>
                <nav className="flex flex-col gap-1">
                  {visibleNavItems.map((item) => {
                    const active =
                      pathname === item.href ||
                      (item.href !== "/" && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors",
                          active
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo + desktop nav */}
          <Link href={isAdmin ? "/admin" : "/dashboard"} className="hidden items-center gap-2 sm:flex">
            <span className="rounded bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-400">
              GB
            </span>
            <span className="text-sm font-semibold">GBReplAi</span>
          </Link>

          <nav className="hidden items-center gap-3 text-sm sm:flex">
            {visibleNavItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 rounded-md px-2 py-1 transition-colors",
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: credits + upgrade + notifications + user */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1 rounded-full border px-3 py-1 text-xs text-muted-foreground sm:flex">
            <span>Credits:</span>
            <span className="font-semibold">{credits}</span>
          </div>

          {showUpgrade && (
            <Button
              asChild
              size="sm"
              variant="outline"
              className="hidden sm:inline-flex"
            >
              <a href="/billing">Upgrade</a>
            </Button>
          )}

          <NotificationBell />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
