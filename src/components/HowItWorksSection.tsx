
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, CalendarCheck, Car, Smile } from "lucide-react";
import { APP_NAME } from '@/lib/constants';

const steps = [
  {
    icon: <Search className="h-10 w-10 text-primary mb-4" />,
    title: "Cherchez & Découvrez",
    description: "Trouvez la voiture parfaite en recherchant par lieu, dates, prix et type de voiture.",
  },
  {
    icon: <CalendarCheck className="h-10 w-10 text-primary mb-4" />,
    title: "Réservez en Toute Sécurité",
    description: "Sélectionnez votre voiture, précisez les dates de location et soumettez une demande de réservation à l'agence.",
  },
  {
    icon: <Car className="h-10 w-10 text-primary mb-4" />,
    title: "Récupérez & Partez",
    description: "Une fois confirmé, récupérez votre voiture à l'agence et profitez de votre voyage.",
  },
  {
    icon: <Smile className="h-10 w-10 text-primary mb-4" />,
    title: "Évaluez & Partagez",
    description: "Après votre location, laissez un avis sur la voiture et l'agence pour aider les autres.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Comment Fonctionne {APP_NAME}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Louer une voiture n'a jamais été aussi simple. Suivez ces étapes simples pour prendre la route.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="text-center shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="items-center">
                {step.icon}
                <CardTitle className="text-xl font-semibold">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
