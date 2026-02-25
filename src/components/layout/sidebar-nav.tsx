
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  CreditCard,
  PanelLeft,
  HelpCircle,
  Headset,
  TicketPercent,
  ShieldAlert,
  Users,
  Wifi,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/auth-context";
import { useAdmin } from "@/hooks/use-admin";

type NavItem = {
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  adminOnly?: boolean;
};

const navItems: NavItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/reviews", icon: MessageSquare, label: "Reviews" },
  { href: "/billing", icon: CreditCard, label: "Billing" },
  { href: "/settings", icon: Settings, label: "Settings" },
  // Admin Items
  { href: "/admin", icon: ShieldAlert, label: "Admin", adminOnly: true },
  { href: "/admin/coupons", icon: TicketPercent, label: "Coupons", adminOnly: true },
  { href: "/admin/connections", icon: Wifi, label: "Connections", adminOnly: true },
];


export const helpItems = [
  { href: "/help", icon: HelpCircle, label: "Help Center" },
  { href: "/support", icon: Headset, label: "Contact Support" },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { isAdmin } = useAdmin();

  const visibleNavItems = navItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          {/* Logo / Home */}
          <Link
            href={isAdmin ? "/admin" : "/dashboard"}
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <PanelLeft className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">GBReplAi</span>
          </Link>

          <TooltipProvider>
            {visibleNavItems.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8",
                          active
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="sr-only">{item.label}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                );
              })}
          </TooltipProvider>
        </nav>

        {/* Help links at bottom */}
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            {helpItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8",
                        active
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="sr-only">{item.label}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </nav>
      </aside>

      {/* Mobile bottom nav: show both admin+client if admin */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t bg-background p-2 sm:hidden">
        {visibleNavItems.map(
          (item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground",
                  active ? "text-primary" : "",
                )}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          },
        )}
      </nav>
    </>
  );
}
