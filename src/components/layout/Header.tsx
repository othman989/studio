'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Briefcase, UserCircle, CarFront } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { LogoIcon } from '@/components/icons/LogoIcon';
import { NAV_LINKS_MAIN, NAV_LINKS_AUTH, APP_NAME } from '@/lib/constants';
import type { NavItem } from '@/types';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const NavLink = ({ href, label, className, onClick }: NavItem & { className?: string; onClick?: () => void }) => (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        pathname === href ? "text-primary" : "text-muted-foreground",
        className
      )}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label={`${APP_NAME} homepage`}>
          <LogoIcon />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {NAV_LINKS_MAIN.map((item) => (
            <NavLink key={item.label} {...item} />
          ))}
        </nav>

        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-3">
            {NAV_LINKS_AUTH.map((item) => (
              <Button key={item.label} variant={item.label === 'Sign Up' ? 'default' : 'outline'} size="sm" asChild>
                <Link href={item.href}>
                  {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                  {item.label}
                </Link>
              </Button>
            ))}
          </div>
          
          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open mobile menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs p-6">
              <div className="flex flex-col space-y-6">
                <div className="flex justify-between items-center">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                    <LogoIcon />
                  </Link>
                  <SheetClose asChild>
                     <Button variant="ghost" size="icon" aria-label="Close mobile menu">
                        <X className="h-6 w-6" />
                      </Button>
                  </SheetClose>
                </div>
                
                <nav className="flex flex-col space-y-4">
                  {NAV_LINKS_MAIN.map((item) => (
                     <NavLink key={item.label} {...item} onClick={() => setIsMobileMenuOpen(false)} className="text-base py-2" />
                  ))}
                </nav>
                <hr />
                <div className="flex flex-col space-y-3">
                   {NAV_LINKS_AUTH.map((item) => (
                    <Button key={item.label} variant={item.label === 'Sign Up' ? 'default' : 'outline'} className="w-full" asChild>
                       <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                        {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                        {item.label}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
