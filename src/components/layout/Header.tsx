
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, LogInIcon, UserPlusIcon, LayoutDashboardIcon, LogOutIcon } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
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

    if (Icon) {
      // For links with icons (typically in mobile menu or specific desktop links)
      return (
        <Link href={href} onClick={onClick} className={linkClasses}>
          <span className={cn("flex items-center", Icon ? "gap-x-2" : "")}>
            <Icon className="h-4 w-4 lg:hidden" /> {/* lg:hidden for icons primarily in mobile */}
            {label}
          </span>
        </Link>
      );
    }
    // For links without icons (typically main desktop nav links)
    return (
      <Link href={href} onClick={onClick} className={linkClasses}>
        {label}
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
    // Potentially show a toast notification for logout
  };

  const renderDesktopNavLinks = () => {
    const linksToRender: NavItem[] = [];
    
    if (mounted && isLoggedIn) {
      linksToRender.push(NAV_LINK_DASHBOARD);
      NAV_LINKS_MAIN.filter(link => link.requiresAuth).forEach(link => linksToRender.push(link));
    } else {
      // Logged out or not mounted: Show public links + Features/Pricing
      NAV_LINKS_MAIN.filter(link => !link.requiresAuth).forEach(link => linksToRender.push(link));
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
    // If mounted AND isLoggedIn: Only show Logout button here
    return (
      <Button variant="outline" size="sm" onClick={handleLogout}>
         {NAV_ACTION_LOGOUT.icon && <NAV_ACTION_LOGOUT.icon className="mr-2 h-4 w-4" />}
        {NAV_ACTION_LOGOUT.label}
      </Button>
    );
  };

  const renderMobileNavLinks = () => {
     const links: NavItem[] = [];

    if (mounted && isLoggedIn) {
      links.push(NAV_LINK_DASHBOARD);
      NAV_LINKS_MAIN.filter(link => link.requiresAuth === true).forEach(link => links.push(link));
      // Add logout as a nav item for mobile menu
      // The NavLink component will handle its onClick for logout
    } else if (mounted && !isLoggedIn) {
      // Show only public links and Features/Pricing when logged out and mounted
      NAV_LINKS_MAIN.filter(link => !link.requiresAuth).forEach(link => links.push(link));
    } else { // Not mounted yet, render placeholders or minimal public links
       NAV_LINKS_MAIN.filter(link => !link.requiresAuth).forEach(link => links.push(link));
    }

    return (
      <>
        {links.map((item) => (
           <NavLink
            key={item.label}
            href={item.href}
            label={item.label}
            icon={item.icon}
            onClick={() => {
              // Specific onClick for logout is handled by passing handleLogout below
              setIsMobileMenuOpen(false);
            }}
            className="text-base py-2"
          />
        ))}
        {/* Add Logout item specifically here for mobile menu list if logged in and mounted */}
        {mounted && isLoggedIn && (
          <NavLink
            key={NAV_ACTION_LOGOUT.label}
            href={NAV_ACTION_LOGOUT.href} // which is '#'
            label={NAV_ACTION_LOGOUT.label}
            icon={NAV_ACTION_LOGOUT.icon}
            onClick={() => {
              handleLogout(); // This executes the logout logic
              setIsMobileMenuOpen(false); // Then closes the menu
            }}
            className="text-base py-2"
          />
        )}
      </>
    );
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
    if (!isLoggedIn) {
      return NAV_LINKS_AUTH.map((item) => (
        <Button key={item.label} variant={item.label === "S'inscrire" ? 'default' : 'outline'} className="w-full justify-start" asChild>
           <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
            {item.label}
          </Link>
        </Button>
      ));
    }
    // If mounted AND isLoggedIn: This section now renders nothing for logout,
    // as logout is handled in renderMobileNavLinks.
    return null;
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label={`${APP_NAME} page d'accueil`}>
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
              <SheetHeader className="flex flex-row justify-between items-center mb-6">
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
              
              <nav className="flex flex-col space-y-1 flex-grow"> {/* Reduced space-y-4 to space-y-1 for tighter list */}
                {renderMobileNavLinks()}
              </nav>
              {/* Only render separator and auth section if not logged in or if there are items */}
              {(!isLoggedIn || !mounted) && (
                <>
                  <hr className="my-4"/>
                  <div className="flex flex-col space-y-3">
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
