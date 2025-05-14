
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckIcon, DollarSign } from 'lucide-react'; // Added DollarSign
import { APP_NAME } from '@/lib/constants';

const pricingTiers = [
  {
    name: 'Locataire Basique',
    price: 'Gratuit',
    description: 'Parfait pour les locataires occasionnels.',
    features: [
      'Accès à toutes les annonces',
      'Processus de réservation standard',
      'Support par e-mail',
    ],
    cta: 'S\'inscrire pour Louer',
    href: '/register/renter',
    popular: false,
  },
  {
    name: 'Agence Débutant',
    price: '49€',
    priceSuffix: '/mois',
    description: 'Pour les nouvelles agences qui débutent.',
    features: [
      'Lister jusqu\'à 10 voitures',
      'Tableau de bord analytique de base',
      'Outils de messagerie standard',
      'Support par e-mail & chat',
    ],
    cta: 'Choisir Débutant',
    href: '/register/agency?plan=starter',
    popular: true,
  },
  {
    name: 'Agence Pro',
    price: '99€',
    priceSuffix: '/mois',
    description: 'Pour les agences en croissance ayant besoin de plus.',
    features: [
      'Lister jusqu\'à 50 voitures',
      'Analyses avancées',
      'Outils de messagerie prioritaires',
      'Options d\'annonces en vedette',
      'Support par téléphone, e-mail & chat',
    ],
    cta: 'Choisir Pro',
    href: '/register/agency?plan=pro',
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <header className="text-center mb-12">
        <div className="flex justify-center items-center gap-3 mb-4">
            <DollarSign className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Nos Plans Tarifaires
            </h1>
        </div>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Choisissez le plan qui vous convient. Que vous soyez locataire ou agence, {APP_NAME} offre des options flexibles pour répondre à vos besoins.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {pricingTiers.map((tier) => (
          <Card key={tier.name} className={`flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 ${tier.popular ? 'border-primary border-2 relative' : ''}`}>
            {tier.popular && (
              <div className="absolute top-0 right-0 -mt-3 mr-3">
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-semibold bg-primary text-primary-foreground">
                  Le Plus Populaire
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
        <h3 className="text-2xl font-semibold mb-4">Des Questions ?</h3>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Si vous avez des questions sur nos tarifs ou si vous avez besoin d'un plan personnalisé pour une agence plus grande, n'hésitez pas à nous contacter.
        </p>
        <Button size="lg" variant="default" asChild>
          <a href="/contact">Contacter le Service Commercial</a>
        </Button>
      </div>
    </div>
  );
}
