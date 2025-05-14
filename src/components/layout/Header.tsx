
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react'; // Added useEffect
import { Menu, X } from 'lucide-react'; // Removed unused icons Briefcase, UserCircle, CarFront
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { LogoIcon } from '@/components/icons/LogoIcon';
import { NAV_LINKS_MAIN, NAV_LINKS_AUTH, APP_NAME, NAV_LINK_DASHBOARD, NAV_ACTION_LOGOUT } from '@/lib/constants';
import type { NavItem } from '@/types';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulated auth state
  const pathname = usePathname();

  // Simulate login state change when navigating to /login (for demo purposes)
  // In a real app, this would be driven by an auth context/hook
  useEffect(() => {
    if (pathname === '/login' && !isLoggedIn) {
      // This is a crude way to simulate login on visiting the login page.
      // A real app would set isLoggedIn after successful login.
      // setIsLoggedIn(true); 
    }
  }, [pathname, isLoggedIn]);


  const NavLink = ({ href, label, className, onClick, icon: Icon }: NavItem & { className?: string; onClick?: () => void }) => (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
        pathname === href ? "text-primary" : "text-muted-foreground",
        className
      )}
    >
      {Icon && <Icon className="h-4 w-4 md:hidden" />} {/* Show icon on mobile for main links */}
      {label}
    </Link>
  );
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false); 
    // In a real app, you'd also clear tokens, redirect, etc.
  };

  const handleLoginNav = () => {
    // This is a placeholder. In a real app, actual login happens on the login page.
    // For demo, we toggle isLoggedIn state when "Sign In" is clicked.
    // This will be removed once actual login flow is implemented.
    // setIsLoggedIn(true); 
    setIsMobileMenuOpen(false);
  }

  const mainNavLinks = NAV_LINKS_MAIN.filter(link => !link.requiresAuth || isLoggedIn);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label={`${APP_NAME} homepage`}>
          <LogoIcon />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {mainNavLinks.map((item) => (
            <NavLink key={item.label} {...item} />
          ))}
        </nav>

        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-3">
            {!isLoggedIn ? (
              NAV_LINKS_AUTH.map((item) => (
                <Button key={item.label} variant={item.label === 'Sign Up' ? 'default' : 'outline'} size="sm" asChild>
                  <Link href={item.href} onClick={item.label === 'Sign In' ? () => {} : () => {}}> 
                    {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                    {item.label}
                  </Link>
                </Button>
              ))
            ) : (
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
            )}
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
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <LogoIcon />
                </Link>
                <SheetClose asChild>
                   <Button variant="ghost" size="icon" aria-label="Close mobile menu">
                      <X className="h-6 w-6" />
                    </Button>
                </SheetClose>
              </div>
              
              <nav className="flex flex-col space-y-4 flex-grow">
                {mainNavLinks.map((item) => (
                   <NavLink key={item.label} {...item} onClick={() => setIsMobileMenuOpen(false)} className="text-base py-2" />
                ))}
              </nav>
              <hr className="my-4"/>
              <div className="flex flex-col space-y-3">
                 {!isLoggedIn ? (
                    NAV_LINKS_AUTH.map((item) => (
                      <Button key={item.label} variant={item.label === 'Sign Up' ? 'default' : 'outline'} className="w-full" asChild>
                         <Link href={item.href} onClick={item.label === 'Sign In' ? handleLoginNav : () => setIsMobileMenuOpen(false)}>
                          {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                          {item.label}
                        </Link>
                      </Button>
                    ))
                  ) : (
                    <>
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link href={NAV_LINK_DASHBOARD.href} onClick={() => setIsMobileMenuOpen(false)}>
                          {NAV_LINK_DASHBOARD.icon && <NAV_LINK_DASHBOARD.icon className="mr-2 h-4 w-4" />}
                          {NAV_LINK_DASHBOARD.label}
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full" onClick={handleLogout}>
                        {NAV_ACTION_LOGOUT.icon && <NAV_ACTION_LOGOUT.icon className="mr-2 h-4 w-4" />}
                        {NAV_ACTION_LOGOUT.label}
                      </Button>
                    </>
                  )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
