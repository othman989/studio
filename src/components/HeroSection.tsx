
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowRight } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary/70 via-primary/50 to-background py-20 md:py-32">
      <div className="absolute inset-0">
        <Image
          src="https://picsum.photos/seed/carTravel/1920/1080"
          alt="Arrière-plan de voyage en voiture pittoresque"
          layout="fill"
          objectFit="cover"
          className="opacity-20"
          priority
          data-ai-hint="road trip"
        />
        <div className="absolute inset-0 bg-background/30"></div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">
          Trouvez Votre Trajet Idéal avec <span className="text-primary-foreground bg-primary px-2 rounded-md">{APP_NAME}</span>
        </h1>
        <p className="text-lg sm:text-xl text-foreground/80 max-w-3xl mx-auto mb-10">
          Découvrez et réservez des voitures auprès d'agences de location locales de confiance. Votre prochaine aventure commence ici.
        </p>
        
        <form className="max-w-xl mx-auto mb-10">
          <div className="flex flex-col sm:flex-row gap-2 items-center bg-background p-2 rounded-lg shadow-lg">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher par lieu, type de voiture, ou mot-clé..."
                className="pl-10 pr-4 py-3 w-full text-base"
                aria-label="Rechercher des voitures"
              />
            </div>
            <Button type="submit" size="lg" className="w-full sm:w-auto">
              Rechercher Voitures
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </form>

        <div className="flex justify-center space-x-4">
          <Button asChild variant="default" size="lg">
            <Link href="/cars">Parcourir Toutes les Voitures</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="bg-background/80 hover:bg-background">
            <Link href="/account/listings/new">Inscrire Votre Voiture</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
