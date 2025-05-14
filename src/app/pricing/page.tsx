
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckIcon } from 'lucide-react';

const pricingTiers = [
  {
    name: 'Renter Basic',
    price: 'Free',
    description: 'Perfect for occasional renters.',
    features: [
      'Access to all listings',
      'Standard booking process',
      'Email support',
    ],
    cta: 'Sign Up to Rent',
    href: '/register/renter',
    popular: false,
  },
  {
    name: 'Agency Starter',
    price: '$49',
    priceSuffix: '/month',
    description: 'For new agencies getting started.',
    features: [
      'List up to 10 cars',
      'Basic analytics dashboard',
      'Standard messaging tools',
      'Email & Chat support',
    ],
    cta: 'Choose Starter',
    href: '/register/agency?plan=starter',
    popular: true,
  },
  {
    name: 'Agency Pro',
    price: '$99',
    priceSuffix: '/month',
    description: 'For growing agencies needing more.',
    features: [
      'List up to 50 cars',
      'Advanced analytics',
      'Priority messaging tools',
      'Featured listing options',
      'Phone, Email & Chat support',
    ],
    cta: 'Choose Pro',
    href: '/register/agency?plan=pro',
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Our Pricing Plans
        </h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that's right for you. Whether you're a renter or an agency, AutoPool offers flexible options to meet your needs.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {pricingTiers.map((tier) => (
          <Card key={tier.name} className={`flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 ${tier.popular ? 'border-primary border-2 relative' : ''}`}>
            {tier.popular && (
              <div className="absolute top-0 right-0 -mt-3 mr-3">
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-semibold bg-primary text-primary-foreground">
                  Most Popular
                </span>
              </div>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-semibold">{tier.name}</CardTitle>
              <div className="mt-2">
                <span className="text-4xl font-bold">{tier.price}</span>
                {tier.priceSuffix && <span className="text-muted-foreground">{tier.priceSuffix}</span>}
              </div>
              <CardDescription className="mt-1 h-12">{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-accent mr-2 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild size="lg" className="w-full" variant={tier.popular ? 'default' : 'outline'}>
                <a href={tier.href}>{tier.cta}</a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h3 className="text-2xl font-semibold mb-4">Questions?</h3>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          If you have any questions about our pricing or need a custom plan for a larger agency, please don't hesitate to contact us.
        </p>
        <Button size="lg" variant="default">
          <a href="/contact">Contact Sales</a>
        </Button>
      </div>
    </div>
  );
}
