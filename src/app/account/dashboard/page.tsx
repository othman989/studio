
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LayoutDashboardIcon,
  CarIcon,
  ListIcon,
  PlusCircleIcon,
  CalendarDaysIcon,
  EyeIcon,
  MessageSquareIcon,
  SettingsIcon,
  ClockIcon,
  CheckCircle2Icon,
  BarChart3Icon,
  BookMarkedIcon
} from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

// Mock data for dashboard (replace with actual data fetching in a real app)
const dashboardStats = {
  totalListings: 15,
  activeListings: 12,
  pendingBookings: 3,
  unreadMessages: 5,
};

const quickLinks = [
  { href: '/account/listings', label: 'Manage My Listings', icon: ListIcon, description: "View, edit, or remove your car listings." },
  { href: '/account/listings/new', label: 'Add New Car', icon: PlusCircleIcon, description: "List a new vehicle in your fleet." },
  { href: '/account/calendar', label: 'Agency Calendar', icon: CalendarDaysIcon, description: "View bookings and manage car availability." },
  { href: '/account/listings/visibility', label: 'Fleet Visibility', icon: EyeIcon, description: "Control which cars are publicly visible." },
  { href: '/account/bookings', label: 'Booking Requests', icon: BookMarkedIcon, description: "Review and manage incoming booking requests." },
  { href: '/account/chat', label: 'Messages', icon: MessageSquareIcon, description: "Communicate with renters and platform users." },
];

const AccountDashboardPage = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <LayoutDashboardIcon className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Agency Dashboard</h1>
        </div>
        <p className="text-lg text-muted-foreground">Welcome back! Here's an overview of your {APP_NAME} agency account.</p>
      </header>

      {/* Stats Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">At a Glance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/account/listings" className="block hover:no-underline">
            <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
                <CarIcon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{dashboardStats.totalListings}</div>
                <p className="text-xs text-muted-foreground">cars in your fleet</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/account/listings/visibility" className="block hover:no-underline">
            <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                <CheckCircle2Icon className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{dashboardStats.activeListings}</div>
                <p className="text-xs text-muted-foreground">currently visible to renters</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/account/bookings" className="block hover:no-underline">
            <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
                <ClockIcon className="h-5 w-5 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{dashboardStats.pendingBookings}</div>
                <p className="text-xs text-muted-foreground">requests awaiting review</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/account/chat" className="block hover:no-underline">
            <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                <MessageSquareIcon className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{dashboardStats.unreadMessages}</div>
                <p className="text-xs text-muted-foreground">new inquiries and replies</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-6 text-foreground">Manage Your Agency</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickLinks.map((link) => (
            <Card key={link.href} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col group">
              <CardHeader className="pb-3">
                 <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <link.icon className="h-7 w-7" />
                    </div>
                    <div>
                        <CardTitle className="text-xl mb-1 group-hover:text-primary transition-colors">{link.label}</CardTitle>
                        <CardDescription className="text-sm leading-tight">{link.description}</CardDescription>
                    </div>
                 </div>
              </CardHeader>
              <CardContent className="flex-grow flex items-end pt-2">
                <Button asChild className="w-full mt-auto" variant="outline">
                  <Link href={link.href}>
                    Go to {link.label.replace("Manage ", "").replace("Agency ", "")}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Additional Sections (Placeholders) */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">More Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart3Icon className="h-6 w-6 text-primary"/>Performance Analytics</CardTitle>
              <CardDescription>Gain insights into your listings and bookings. (Coming Soon)</CardDescription>
            </CardHeader>
            <CardContent>
              <Button disabled variant="outline">View Analytics</Button>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><SettingsIcon className="h-6 w-6 text-primary"/>Account Settings</CardTitle>
              <CardDescription>Manage your profile, payment methods, and notification preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link href="/account/profile">Go to Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default AccountDashboardPage;
