
'use client';

import Link from 'next/link';
import React, { useState, useEffect, Fragment } from 'react';
import { Menu, X } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { LogoIcon } from '@/components/icons/LogoIcon';
import {
  NAV_LINKS_MAIN,
  NAV_LINKS_AUTH,
  APP_NAME,
  NAV_LINK_ACCOUNT_DASHBOARD,
  NAV_LINK_ADMIN_DASHBOARD,
  NAV_ACTION_LOGOUT,
  NAV_LINKS_AGENCY_MENU,
  NAV_LINKS_ADMIN_MENU
} from '@/lib/constants';
import type { NavItem } from '@/types';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const loggedInStatus = window.localStorage.getItem('isLoggedIn');
      const adminStatus = window.localStorage.getItem('isAdminLoggedIn');
      setIsLoggedIn(loggedInStatus === 'true');
      setIsAdmin(adminStatus === 'true');
    }
  }, [mounted, pathname]); // Re-check on mount and pathname change

  const NavLink = ({ href, label, className, onClick, icon: Icon }: NavItem & { className?: string; onClick?: () => void }) => {
    const linkClasses = cn(
      "text-sm font-medium transition-colors hover:text-primary",
      mounted && pathname === href ? "text-primary" : "text-muted-foreground",
      className
    );

    if (Icon) {
      return (
        <Link href={href} onClick={onClick} className={linkClasses}>
          <span className={cn("flex items-center", Icon ? "gap-x-2" : "")}>
            <Icon className="h-4 w-4 lg:hidden" />
            {label}
          </span>
        </Link>
      );
    }
    return (
      <Link href={href} onClick={onClick} className={linkClasses}>
        {label}
      </Link>
    );
  };


  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('isLoggedIn');
      window.localStorage.removeItem('isAdminLoggedIn');
    }
    setIsLoggedIn(false);
    setIsAdmin(false);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    router.push('/');
  };

  const renderDesktopNavLinks = () => {
    if (!mounted) {
      // Render placeholders or public links only for SSR consistency
      return NAV_LINKS_MAIN
        .filter(link => !link.requiresAuth && !link.hideWhenLoggedIn)
        .map((item) => (
          <span key={item.label} className={cn(buttonVariants({ variant: "ghost" }), "opacity-50 cursor-not-allowed text-sm font-medium")}>
            {item.label}
          </span>
        ));
    }

    const linksToRender: NavItem[] = [];

    if (isLoggedIn) {
      if (isAdmin) {
        linksToRender.push(NAV_LINK_ADMIN_DASHBOARD);
        // Add other admin-specific main links from NAV_LINKS_ADMIN_MENU if they're meant for desktop nav
        // For now, NAV_LINKS_ADMIN_MENU is more for the mobile sheet structure.
      } else { // Agency
        linksToRender.push(NAV_LINK_ACCOUNT_DASHBOARD);
        // Add agency-specific main links that are not the dashboard itself
        NAV_LINKS_MAIN
          .filter(link => link.isAgencyLink && link.requiresAuth && link.href !== NAV_LINK_ACCOUNT_DASHBOARD.href)
          .forEach(link => linksToRender.push(link));
        // "Trouver une voiture" should be available for logged-in agency too
        const findCarLink = NAV_LINKS_MAIN.find(link => link.href === '/cars');
        if (findCarLink && !linksToRender.some(l => l.href === findCarLink.href)) {
          linksToRender.push(findCarLink);
        }
      }
    } else { // Logged out
      NAV_LINKS_MAIN
        .filter(link => !link.requiresAuth && !link.hideWhenLoggedIn)
        .forEach(link => {
          if (!linksToRender.find(l => l.href === link.href)) { // Avoid duplicates
              linksToRender.push(link);
          }
        });
    }
    return (<>{linksToRender.map((item) => ( <NavLink key={`${item.href}-${item.label}`} {...item} /> ))}</>);
  };


  const renderDesktopAuthSection = () => {
    if (!mounted) {
      return NAV_LINKS_AUTH.map((item) => (
        <span
            key={item.label}
            className={cn(
                buttonVariants({variant: item.label === 'S\'inscrire' ? 'default' : 'outline', size: "sm"}),
                "opacity-50 cursor-not-allowed"
            )}
        >
            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
            {item.label}
        </span>
      ));
    }

    if (!isLoggedIn) {
      return NAV_LINKS_AUTH.map((item) => (
        <Button key={item.label} variant={item.label === 'S\'inscrire' ? 'default' : 'outline'} size="sm" asChild>
          <Link href={item.href}>
            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
            {item.label}
          </Link>
        </Button>
      ));
    } else { // User is logged in
      return (
        <Button variant="outline" size="sm" onClick={handleLogout}>
           {NAV_ACTION_LOGOUT.icon && <NAV_ACTION_LOGOUT.icon className="mr-2 h-4 w-4" />}
          {NAV_ACTION_LOGOUT.label}
        </Button>
      );
    }
  };

  const renderMobileNavLinks = () => {
    const links: NavItem[] = [];

    if (!mounted) {
       NAV_LINKS_MAIN.filter(link => !link.requiresAuth && !link.hideWhenLoggedIn).forEach(link => links.push(link));
    } else {
      if (isLoggedIn) {
        if (isAdmin) {
          NAV_LINKS_ADMIN_MENU.forEach(link => links.push(link));
        } else { // Agency
          NAV_LINKS_AGENCY_MENU.forEach(link => links.push(link));
        }
      } else { // Logged out
         NAV_LINKS_MAIN.filter(link => !link.requiresAuth && !link.hideWhenLoggedIn).forEach(link => {
            if (!links.find(l => l.href === link.href)) { // Avoid duplicates
                links.push(link);
            }
        });
      }
    }

    const renderedLinks = links.map((item) => (
      <NavLink
        key={`${item.href}-${item.label}-mobile`}
        href={item.href}
        label={item.label}
        icon={item.icon}
        onClick={() => setIsMobileMenuOpen(false)}
        className="text-base py-2"
      />
    ));

    // Add logout to the list if logged in and mounted
    if (mounted && isLoggedIn) {
      renderedLinks.push(
        <NavLink
          key={`${NAV_ACTION_LOGOUT.href}-${NAV_ACTION_LOGOUT.label}-mobile`}
          href={NAV_ACTION_LOGOUT.href}
          label={NAV_ACTION_LOGOUT.label}
          icon={NAV_ACTION_LOGOUT.icon}
          onClick={() => {
            handleLogout(); // This already closes the mobile menu
          }}
          className="text-base py-2"
        />
      );
    }
    return <>{renderedLinks}</>;
  };

  const renderMobileAuthSection = () => {
    if (!mounted) {
      return NAV_LINKS_AUTH.map((item) => (
        <span
            key={item.label}
            className={cn(
                buttonVariants({variant: item.label === "S'inscrire" ? 'default' : 'outline', className: "w-full justify-start"}),
                "opacity-50 cursor-not-allowed"
            )}
        >
           {item.icon && <item.icon className="mr-2 h-4 w-4" />}
           {item.label}
        </span>
      ));
    }
    if (!isLoggedIn) { // Only show Sign In/Sign Up if not logged in
      return NAV_LINKS_AUTH.map((item) => (
        <Button key={item.label} variant={item.label === "S'inscrire" ? 'default' : 'outline'} className="w-full justify-start" asChild>
           <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
            {item.label}
          </Link>
        </Button>
      ));
    }
    return null; // Don't show anything here if logged in, logout is in main links
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label={`${APP_NAME} page d'accueil`} onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}>
          <LogoIcon />
        </Link>

        <nav className="hidden lg:flex items-center space-x-6">
          {renderDesktopNavLinks()}
        </nav>

        <div className="flex items-center space-x-3">
          <div className="hidden lg:flex items-center space-x-3">
            {renderDesktopAuthSection()}
          </div>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Ouvrir le menu mobile">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs p-6 flex flex-col">
               <SheetHeader className="flex flex-row justify-between items-center mb-4">
                 <Link href="/" onClick={() => setIsMobileMenuOpen(false)} aria-label={`${APP_NAME} page d'accueil`}>
                  <LogoIcon />
                </Link>
                <SheetTitle className="sr-only">Menu principal</SheetTitle>
                <SheetClose asChild>
                   <Button variant="ghost" size="icon" aria-label="Fermer le menu mobile">
                      <X className="h-6 w-6" />
                    </Button>
                </SheetClose>
              </SheetHeader>

              <nav className="flex flex-col space-y-1 flex-grow overflow-y-auto">
                {renderMobileNavLinks()}
              </nav>

              {(!isLoggedIn && mounted) && (
                <>
                  <hr className="my-4"/>
                  <div className="flex flex-col space-y-3 mt-auto">
                    {renderMobileAuthSection()}
                  </div>
                </>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
