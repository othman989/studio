
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Star, Zap } from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: 'Blazing Fast Search',
      description: 'Find the perfect car in seconds with our optimized search engine.',
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-accent" />,
      title: 'Verified Listings',
      description: 'All cars and agencies are verified for your peace of mind.',
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-400" />,
      title: 'Transparent Reviews',
      description: 'Make informed decisions with genuine reviews from other users.',
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: 'Instant Booking (Coming Soon)',
      description: 'Book your preferred car instantly without waiting for agency confirmation.',
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-accent" />,
      title: 'Secure Payments',
      description: 'Your payment information is handled securely through our trusted partners.',
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-400" />,
      title: '24/7 Support',
      description: 'Our dedicated support team is here to help you around the clock.',
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          AutoPool Features
        </h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover why AutoPool is the best platform for car rentals and sharing. We offer a range of features designed to make your experience seamless and enjoyable.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="items-center text-center">
              {feature.icon}
              <CardTitle className="mt-2 text-xl font-semibold">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
