
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { LogoIcon } from '@/components/icons/LogoIcon';
import { NAV_LINKS_MAIN, NAV_LINKS_AUTH, APP_NAME, NAV_LINK_DASHBOARD, NAV_ACTION_LOGOUT } from '@/lib/constants';
import type { NavItem } from '@/types';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation'; // Added useRouter

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter(); // Added for potential logout redirect

  useEffect(() => {
    // Check localStorage only on the client side
    if (typeof window !== 'undefined') {
      const loggedInStatus = window.localStorage.getItem('isLoggedIn');
      setIsLoggedIn(loggedInStatus === 'true');
    }
  }, [pathname]); // Rerun when pathname changes, e.g., after navigating from login


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
      {Icon && <Icon className="h-4 w-4 md:hidden" />}
      {label}
    </Link>
  );
  
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('isLoggedIn');
    }
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false); 
    router.push('/'); // Redirect to home on logout
  };

  const mainNavLinks = NAV_LINKS_MAIN.filter(link => !link.requiresAuth || isLoggedIn);
  const alwaysVisibleMainLinks = NAV_LINKS_MAIN.filter(link => !link.requiresAuth);
  const authRequiredMainLinks = NAV_LINKS_MAIN.filter(link => link.requiresAuth);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label={`${APP_NAME} homepage`}>
          <LogoIcon />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {alwaysVisibleMainLinks.map((item) => (
            <NavLink key={item.label} {...item} />
          ))}
          {isLoggedIn && authRequiredMainLinks.map((item) => (
            <NavLink key={item.label} {...item} />
          ))}
        </nav>

        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-3">
            {!isLoggedIn ? (
              NAV_LINKS_AUTH.map((item) => (
                <Button key={item.label} variant={item.label === 'Sign Up' ? 'default' : 'outline'} size="sm" asChild>
                  <Link href={item.href}> 
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
                {alwaysVisibleMainLinks.map((item) => (
                   <NavLink key={item.label} {...item} onClick={() => setIsMobileMenuOpen(false)} className="text-base py-2" />
                ))}
                {isLoggedIn && authRequiredMainLinks.map((item) => (
                   <NavLink key={item.label} {...item} onClick={() => setIsMobileMenuOpen(false)} className="text-base py-2" />
                ))}
              </nav>
              <hr className="my-4"/>
              <div className="flex flex-col space-y-3">
                 {!isLoggedIn ? (
                    NAV_LINKS_AUTH.map((item) => (
                      <Button key={item.label} variant={item.label === 'Sign Up' ? 'default' : 'outline'} className="w-full" asChild>
                         <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
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
