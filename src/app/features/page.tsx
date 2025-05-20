
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Star, Zap, DollarSign, MessageSquare, ShieldCheckIcon } from 'lucide-react'; 
import { APP_NAME } from '@/lib/constants';

export default function FeaturesPage() {
  const features = [
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: 'Recherche Ultra-Rapide',
      description: 'Trouvez la voiture parfaite en quelques secondes grâce à notre moteur de recherche optimisé.',
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-accent" />,
      title: 'Annonces Vérifiées',
      description: 'Toutes les voitures et agences sont vérifiées pour votre tranquillité d\'esprit.',
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-400" />,
      title: 'Avis Transparents',
      description: 'Prenez des décisions éclairées grâce aux avis authentiques d\'autres utilisateurs.',
    },
    {
      icon: <DollarSign className="h-8 w-8 text-primary" />, 
      title: 'Réservation Instantanée (Bientôt)',
      description: 'Réservez votre voiture préférée instantanément sans attendre la confirmation de l\'agence.',
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8 text-accent" />, 
      title: 'Paiements Sécurisés',
      description: 'Vos informations de paiement sont traitées en toute sécurité par nos partenaires de confiance.',
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-yellow-400" />, 
      title: 'Support 24/7',
      description: 'Notre équipe de support dédiée est là pour vous aider à toute heure.',
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Fonctionnalités de {APP_NAME}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Découvrez pourquoi {APP_NAME} est la meilleure plateforme de location et de partage de voitures. Nous offrons une gamme de fonctionnalités conçues pour rendre votre expérience fluide et agréable.
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
