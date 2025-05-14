
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, Users, DollarSign, ListChecks, Zap, ArrowRight, BarChart3, MessageCircle, CalendarDaysIcon } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `${APP_NAME} | Inscrivez Votre Agence de Location et Développez Votre Activité`,
  description: `Rejoignez ${APP_NAME} aujourd'hui pour lister votre flotte de voitures de location, atteindre plus de clients et développer votre activité. Configuration facile et création de compte gratuite pour les agences. Le leader du marché du covoiturage.`,
};

const benefits = [
  {
    icon: <Users className="h-10 w-10 text-primary mb-4" />,
    title: 'Atteignez Plus de Clients',
    description: `Présentez votre flotte à des milliers de locataires potentiels sur la plateforme ${APP_NAME}.`,
  },
  {
    icon: <DollarSign className="h-10 w-10 text-primary mb-4" />,
    title: 'Augmentez Réservations & Revenus',
    description: 'Boostez vos taux d\'occupation et augmentez vos revenus grâce à notre marketing ciblé et notre base d\'utilisateurs.',
  },
  {
    icon: <ListChecks className="h-10 w-10 text-primary mb-4" />,
    title: 'Gestion de Flotte Sans Effort',
    description: 'Listez facilement les voitures, gérez la disponibilité avec notre calendrier et contrôlez la visibilité de vos annonces.',
  },
  {
    icon: <Zap className="h-10 w-10 text-primary mb-4" />,
    title: 'Configuration Rapide & Facile',
    description: 'Notre processus de candidature simple permet à votre agence d\'être listée et prête pour les réservations en un rien de temps.',
  },
];

const howItWorksSteps = [
  {
    number: '1',
    title: 'Postulez pour Rejoindre',
    description: 'Soumettez notre formulaire de candidature en ligne rapide avec les détails de votre agence.',
  },
  {
    number: '2',
    title: 'Soyez Approuvé',
    description: `Notre équipe examinera votre candidature et vous répondra rapidement.`,
  },
  {
    number: '3',
    title: 'Listez Vos Voitures',
    description: 'Ajoutez vos véhicules avec des descriptions détaillées, des photos et des tarifs.',
  },
  {
    number: '4',
    title: 'Commencez à Gagner',
    description: 'Recevez des demandes de réservation, gérez-les facilement et développez votre activité !',
  },
];

const platformFeatures = [
    { icon: <ListChecks className="h-5 w-5 text-accent" />, name: "Annonces de Voitures Faciles" },
    { icon: <CalendarDaysIcon className="h-5 w-5 text-accent" />, name: "Calendrier de Réservation" },
    { icon: <MessageCircle className="h-5 w-5 text-accent" />, name: "Chat Direct avec Locataires" },
    { icon: <BarChart3 className="h-5 w-5 text-accent" />, name: "Analyses de Performance (Bientôt)" },
    { icon: <Users className="h-5 w-5 text-accent" />, name: "Contrôle de Visibilité" },
    { icon: <DollarSign className="h-5 w-5 text-accent" />, name: "Paiements Sécurisés (Bientôt)" },
];

export default function AgencySignUpLandingPage() {
  return (
    <>
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-secondary to-background">
        <div className="absolute inset-0 opacity-10">
            <Image
            src="https://placehold.co/1920x1080.png?text=Flotte+Moderne+Voitures"
            alt="Arrière-plan abstrait pour l'inscription d'agence"
            layout="fill"
            objectFit="cover"
            priority
            data-ai-hint="business office"
            />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">
            Développez Votre Entreprise de Location avec <span className="text-primary">{APP_NAME}</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Devenez notre partenaire pour étendre votre portée, simplifier les réservations et augmenter vos revenus. L'inscription et la publication de vos voitures sont gratuites !
          </p>
          <Button size="lg" asChild className="shadow-lg hover:shadow-xl transition-shadow">
            <Link href="/register/agency">
              Créez Votre Compte Agence Gratuit <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Pourquoi Devenir Partenaire {APP_NAME} ?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Nous fournissons les outils et la plateforme pour aider votre agence de location de voitures à prospérer.
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

      <section className="py-16 sm:py-24 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Étapes Simples pour Commencer
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Rejoindre {APP_NAME} en tant que partenaire agence est simple.
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
      
      <section className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Fonctionnalités Puissantes de la Plateforme
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Des outils conçus pour le succès des agences.
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

      <section className="py-16 sm:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
            Prêt à Booster Votre Agence ?
          </h2>
          <p className="text-lg sm:text-xl text-primary-foreground/80 max-w-3xl mx-auto mb-10">
            Rejoignez des centaines d'agences prospères sur {APP_NAME}. Créez votre compte gratuit et commencez à lister vos voitures dès aujourd'hui !
          </p>
          <Button asChild size="lg" variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg hover:shadow-xl transition-shadow">
            <Link href="/register/agency">
              Commencez Gratuitement <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
