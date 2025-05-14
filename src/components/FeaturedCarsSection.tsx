
import { SAMPLE_CARS } from '@/lib/constants';
import { CarCard } from '@/components/CarCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function FeaturedCarsSection() {
  const featuredCars = SAMPLE_CARS.slice(0, 3); 

  return (
    <section className="py-16 sm:py-24 bg-secondary/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Véhicules en Vedette
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez quelques-unes de nos voitures les plus populaires et les mieux notées disponibles à la location.
          </p>
        </div>
        
        {featuredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">Aucune voiture en vedette disponible pour le moment. Revenez bientôt !</p>
        )}

        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link href="/cars">
              Voir Toutes les Voitures
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
