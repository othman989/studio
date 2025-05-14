
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { UserPlus, Building, ArrowRight } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col items-center min-h-[calc(100vh-12rem)]">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Rejoindre {APP_NAME}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-xl mx-auto">
          Choisissez votre voie pour commencer avec la meilleure plateforme de location et de partage de voitures.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <CardHeader className="items-center text-center">
            <UserPlus className="h-12 w-12 text-primary mb-3" />
            <CardTitle className="text-2xl font-semibold">S'inscrire en tant que Locataire</CardTitle>
            <CardDescription className="mt-1 h-16">
              Trouvez et réservez des voitures parmi une large sélection de véhicules. Rapide, facile et sécurisé.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center">
          </CardContent>
          <CardFooter>
            <Button asChild size="lg" className="w-full">
              <Link href="/register/renter">
                S'inscrire comme Locataire <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <CardHeader className="items-center text-center">
            <Building className="h-12 w-12 text-accent mb-3" />
            <CardTitle className="text-2xl font-semibold">S'inscrire en tant qu'Agence</CardTitle>
            <CardDescription className="mt-1 h-16">
              Listez votre flotte, gérez les réservations et développez votre activité de location avec {APP_NAME}.
            </CardDescription>
          </CardHeader>
           <CardContent className="flex-grow flex items-center justify-center">
          </CardContent>
          <CardFooter>
            <Button asChild size="lg" variant="outline" className="w-full border-accent text-accent hover:bg-accent/10 hover:text-accent">
              <Link href="/register/agency">
                Inscrire Votre Agence <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
