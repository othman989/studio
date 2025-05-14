
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CarIcon, BuildingIcon } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export function CTASection() {
  return (
    <section className="py-16 sm:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
          Prêt à Commencer ?
        </h2>
        <p className="text-lg sm:text-xl text-primary-foreground/80 max-w-3xl mx-auto mb-10">
          Que vous cherchiez à louer une voiture ou à lister la flotte de votre agence, {APP_NAME} est votre partenaire sur la route.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
          <Button asChild size="lg" variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            <Link href="/cars">
              <CarIcon className="mr-2 h-5 w-5" />
              Trouver une Voiture
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
            <Link href="/register/agency">
              <BuildingIcon className="mr-2 h-5 w-5" />
              Inscrire Votre Agence
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
