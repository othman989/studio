
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, Users, DollarSign, ListChecks, Zap, ArrowRight, BarChart3, MessageCircle, CalendarDaysIcon } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Partner with ${APP_NAME} | List Your Car Rental Agency`,
  description: `Join ${APP_NAME} today to list your car rental fleet, reach more customers, and grow your business. Easy setup and free account creation for agencies.`,
};

const benefits = [
  {
    icon: <Users className="h-10 w-10 text-primary mb-4" />,
    title: 'Reach More Customers',
    description: `Showcase your fleet to thousands of potential renters on the ${APP_NAME} platform.`,
  },
  {
    icon: <DollarSign className="h-10 w-10 text-primary mb-4" />,
    title: 'Increase Bookings & Revenue',
    description: 'Boost your occupancy rates and grow your income with our targeted marketing and user base.',
  },
  {
    icon: <ListChecks className="h-10 w-10 text-primary mb-4" />,
    title: 'Effortless Fleet Management',
    description: 'Easily list cars, manage availability with our calendar, and control your listings\' visibility.',
  },
  {
    icon: <Zap className="h-10 w-10 text-primary mb-4" />,
    title: 'Quick & Easy Setup',
    description: 'Our simple application process gets your agency listed and ready for bookings in no time.',
  },
];

const howItWorksSteps = [
  {
    number: '1',
    title: 'Apply to Join',
    description: 'Submit our quick online application form with your agency details.',
  },
  {
    number: '2',
    title: 'Get Approved',
    description: `Our team will review your application and get back to you promptly.`,
  },
  {
    number: '3',
    title: 'List Your Cars',
    description: 'Add your vehicles with detailed descriptions, photos, and pricing.',
  },
  {
    number: '4',
    title: 'Start Earning',
    description: 'Receive booking requests, manage them easily, and grow your business!',
  },
];

const platformFeatures = [
    { icon: <ListChecks className="h-5 w-5 text-accent" />, name: "Easy Car Listings" },
    { icon: <CalendarDaysIcon className="h-5 w-5 text-accent" />, name: "Booking Calendar" },
    { icon: <MessageCircle className="h-5 w-5 text-accent" />, name: "Direct Renter Chat" },
    { icon: <BarChart3 className="h-5 w-5 text-accent" />, name: "Performance Analytics (Coming Soon)" },
    { icon: <Users className="h-5 w-5 text-accent" />, name: "Visibility Control" },
    { icon: <DollarSign className="h-5 w-5 text-accent" />, name: "Secure Payouts (Coming Soon)" },
];

export default function AgencySignUpLandingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-secondary to-background">
        <div className="absolute inset-0 opacity-10">
            <Image
            src="https://placehold.co/1920x1080.png?text=Modern+Car+Fleet"
            alt="Abstract background for agency sign up"
            layout="fill"
            objectFit="cover"
            priority
            data-ai-hint="business office"
            />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">
            Grow Your Rental Business with <span className="text-primary">{APP_NAME}</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Partner with us to expand your reach, streamline bookings, and increase your revenue. It's free to join and list your cars!
          </p>
          <Button size="lg" asChild className="shadow-lg hover:shadow-xl transition-shadow">
            <Link href="/register/agency">
              Create Your Free Agency Account <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Why Partner with {APP_NAME}?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide the tools and platform to help your car rental agency thrive.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="items-center">
                  {benefit.icon}
                  <CardTitle className="text-xl font-semibold">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Simple Steps to Get Started
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Joining {APP_NAME} as an agency partner is straightforward.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step) => (
              <Card key={step.title} className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                    <div className="flex items-center justify-center mb-3">
                        <span className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground text-xl font-bold">
                            {step.number}
                        </span>
                    </div>
                  <CardTitle className="text-xl font-semibold text-center">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Snapshot Section */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Powerful Platform Features
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Tools designed for agency success.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
              {platformFeatures.map((feature) => (
                <li key={feature.name} className="flex items-center space-x-3 p-2">
                  {feature.icon}
                  <span className="text-muted-foreground">{feature.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 sm:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
            Ready to Supercharge Your Agency?
          </h2>
          <p className="text-lg sm:text-xl text-primary-foreground/80 max-w-3xl mx-auto mb-10">
            Join hundreds of successful agencies on {APP_NAME}. Create your free account and start listing your cars today!
          </p>
          <Button asChild size="lg" variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg hover:shadow-xl transition-shadow">
            <Link href="/register/agency">
              Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}

    