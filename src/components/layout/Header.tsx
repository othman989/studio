
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


  const NavLink = ({ href, label, className, onClick, icon: Icon }: NavItem & { className?: string; onClick?: () => void }) => (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary", // Base styles for the <a> tag
        mounted && pathname === href ? "text-primary" : "text-muted-foreground",
        className
      )}
    >
      <span className={Icon ? "flex items-center gap-x-2" : "flex items-center"}> {/* Inner span to group icon and label, conditional gap */}
        {/* md:hidden on icon means it's primarily for mobile, hidden on desktop */}
        {Icon && <Icon className="h-4 w-4 md:hidden" />} 
        {label}
      </span>
    </Link>
  );
  
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('isLoggedIn');
    }
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false); 
    router.push('/');
  };

  const alwaysVisibleMainLinks = NAV_LINKS_MAIN.filter(link => !link.requiresAuth);
  const authRequiredMainLinks = NAV_LINKS_MAIN.filter(link => link.requiresAuth);

  const renderDesktopNavLinks = () => {
    return (
      <>
        {alwaysVisibleMainLinks.map((item) => (
          <NavLink key={item.label} {...item} />
        ))}
        {mounted && isLoggedIn && authRequiredMainLinks.map((item) => (
          <NavLink key={item.label} {...item} />
        ))}
      </>
    );
  };

  const renderDesktopAuthSection = () => {
    if (!mounted) {
      // Fallback for initial render to match server (logged-out state)
      return NAV_LINKS_AUTH.map((item) => (
        <span 
            key={item.label} 
            className={cn(
                buttonVariants({variant: item.label === 'Sign Up' ? 'default' : 'outline', size: "sm"}), 
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
        <Button key={item.label} variant={item.label === 'Sign Up' ? 'default' : 'outline'} size="sm" asChild>
          <Link href={item.href}> 
            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
            {item.label}
          </Link>
        </Button>
      ));
    }
    return (
      <>
        <Button variant="ghost" size="sm" asChild>
          <Link href={NAV_LINK_DASHBOARD.href}>
            {NAV_LINK_DASHBOARD.icon && <NAV_LINK_DASHBOARD.icon className="mr-2 h-4 w-4" />}
            {NAV_LINK_DASHBOARD.label}
          </Link>
        </Button>
        <Button variant="outline" size="sm" onClick={handleLogout}>
           {NAV_ACTION_LOGOUT.icon && <NAV_ACTION_LOGOUT.icon className="mr-2 h-4 w-4" />}
          {NAV_ACTION_LOGOUT.label}
        </Button>
      </>
    );
  };

  const renderMobileNavLinks = () => {
    return (
      <>
        {alwaysVisibleMainLinks.map((item) => (
           <NavLink key={item.label} {...item} onClick={() => setIsMobileMenuOpen(false)} className="text-base py-2" />
        ))}
        {mounted && isLoggedIn && authRequiredMainLinks.map((item) => (
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
                buttonVariants({variant: item.label === 'Sign Up' ? 'default' : 'outline', className: "w-full justify-start"}), 
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
        <Button key={item.label} variant={item.label === 'Sign Up' ? 'default' : 'outline'} className="w-full justify-start" asChild>
           <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
            {item.label}
          </Link>
        </Button>
      ));
    }
    return (
      <>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href={NAV_LINK_DASHBOARD.href} onClick={() => setIsMobileMenuOpen(false)}>
            {NAV_LINK_DASHBOARD.icon && <NAV_LINK_DASHBOARD.icon className="mr-2 h-4 w-4" />}
            {NAV_LINK_DASHBOARD.label}
          </Link>
        </Button>
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
        <Link href="/" className="flex items-center gap-2" aria-label={`${APP_NAME} homepage`}>
          <LogoIcon />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {renderDesktopNavLinks()}
        </nav>

        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-3">
            {renderDesktopAuthSection()}
          </div>
          
          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open mobile menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} aria-label={`${APP_NAME} homepage`}>
                  <LogoIcon />
                </Link>
                <SheetClose asChild>
                   <Button variant="ghost" size="icon" aria-label="Close mobile menu">
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

