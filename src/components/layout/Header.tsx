
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { LogoIcon } from '@/components/icons/LogoIcon';
import { NAV_LINKS_MAIN, NAV_LINKS_AUTH, APP_NAME, NAV_LINK_DASHBOARD, NAV_ACTION_LOGOUT } from '@/lib/constants';
import type { NavItem } from '@/types';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); 
  }, []);

  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      const loggedInStatus = window.localStorage.getItem('isLoggedIn');
      setIsLoggedIn(loggedInStatus === 'true');
    }
  }, [pathname, mounted]);


  const NavLink = ({ href, label, className, onClick, icon: Icon }: NavItem & { className?: string; onClick?: () => void }) => {
    const linkClasses = cn(
      "text-sm font-medium transition-colors hover:text-primary",
      mounted && pathname === href ? "text-primary" : "text-muted-foreground",
      className
    );

    // Always wrap in a span for consistent structure, Icon conditional rendering happens inside
    return (
      <Link href={href} onClick={onClick} className={linkClasses}>
        <span className={cn("flex items-center", Icon ? "gap-x-2" : "")}>
          {/* lg:hidden on icon means it's primarily for mobile, hidden on desktop */}
          {Icon && <Icon className="h-4 w-4 lg:hidden" />} 
          {label}
        </span>
      </Link>
    );
  };
  
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('isLoggedIn');
    }
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false); 
    router.push('/');
  };

  const mainLinksToDisplay = NAV_LINKS_MAIN.filter(link => {
    if (link.requiresAuth) {
      return mounted && isLoggedIn; 
    }
    if ((link.label === 'Fonctionnalités' || link.label === 'Tarifs')) {
        return !isLoggedIn || !mounted; 
    }
    return true; 
  });


  const renderDesktopNavLinks = () => {
    let linksToRender = [...mainLinksToDisplay];
    if (mounted && isLoggedIn) {
      linksToRender.unshift(NAV_LINK_DASHBOARD); // Add Dashboard to the beginning
    }
    return (
      <>
        {linksToRender.map((item) => (
          <NavLink key={item.label} {...item} />
        ))}
      </>
    );
  };

  const renderDesktopAuthSection = () => {
    if (!mounted) {
      // Fallback for initial render: non-interactive placeholders matching server
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
    }
    // If mounted AND isLoggedIn: Only show Logout button here, Dashboard is in main nav
    return (
      <>
        <Button variant="outline" size="sm" onClick={handleLogout}>
           {NAV_ACTION_LOGOUT.icon && <NAV_ACTION_LOGOUT.icon className="mr-2 h-4 w-4" />}
          {NAV_ACTION_LOGOUT.label}
        </Button>
      </>
    );
  };

  const renderMobileNavLinks = () => {
    let linksToRender = [...mainLinksToDisplay];
    if (mounted && isLoggedIn) {
      linksToRender.unshift(NAV_LINK_DASHBOARD); // Add Dashboard to the beginning
    }
    return (
      <>
        {linksToRender.map((item) => (
           <NavLink key={item.label} {...item} onClick={() => setIsMobileMenuOpen(false)} className="text-base py-2" />
        ))}
      </>
    );
  };

  const renderMobileAuthSection = () => {
    if (!mounted) {
      return NAV_LINKS_AUTH.map((item) => (
        <span 
            key={item.label} 
            className={cn(
                buttonVariants({variant: item.label === 'S\'inscrire' ? 'default' : 'outline', className: "w-full justify-start"}), 
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
        <Button key={item.label} variant={item.label === 'S\'inscrire' ? 'default' : 'outline'} className="w-full justify-start" asChild>
           <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
            {item.label}
          </Link>
        </Button>
      ));
    }
    // If mounted AND isLoggedIn: Only show Logout button here
    return (
      <>
        <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
          {NAV_ACTION_LOGOUT.icon && <NAV_ACTION_LOGOUT.icon className="mr-2 h-4 w-4" />}
          {NAV_ACTION_LOGOUT.label}
        </Button>
      </>
    );
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label={`${APP_NAME} page d'accueil`}>
          <LogoIcon />
        </Link>

        {/* Desktop Navigation - visible on lg screens and up */}
        <nav className="hidden lg:flex items-center space-x-6">
          {renderDesktopNavLinks()}
        </nav>

        <div className="flex items-center space-x-3">
          {/* Desktop Auth/User Section - visible on lg screens and up */}
          <div className="hidden lg:flex items-center space-x-3">
            {renderDesktopAuthSection()}
          </div>
          
          {/* Mobile Menu Trigger - visible on screens smaller than lg */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Ouvrir le menu mobile">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} aria-label={`${APP_NAME} page d'accueil`}>
                  <LogoIcon />
                </Link>
                <SheetClose asChild>
                   <Button variant="ghost" size="icon" aria-label="Fermer le menu mobile">
                      <X className="h-6 w-6" />
                    </Button>
                </SheetClose>
              </div>
              
              <nav className="flex flex-col space-y-4 flex-grow">
                {renderMobileNavLinks()}
              </nav>
              <hr className="my-4"/>
              <div className="flex flex-col space-y-3">
                 {renderMobileAuthSection()}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
