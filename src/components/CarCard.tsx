
import Image from 'next/image';
import Link from 'next/link';
import type { Car } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, DollarSign, CalendarDays, Fuel, Settings, Users } from 'lucide-react';
import { CAR_TYPES } from '@/lib/constants';

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  const carTypeLabel = CAR_TYPES.find(ct => ct.value === car.type)?.label || car.type;
  const fuelTypeLabel = car.fuelType === 'Gasoline' ? 'Essence' : car.fuelType === 'Diesel' ? 'Diesel' : car.fuelType === 'Electric' ? 'Électrique' : car.fuelType === 'Hybrid' ? 'Hybride' : car.fuelType;
  const transmissionLabel = car.transmission === 'Automatic' ? 'Automatique' : car.transmission === 'Manual' ? 'Manuelle' : car.transmission;

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="p-0 relative">
        <Link href={`/cars/${car.id}`} aria-label={`Voir détails pour ${car.make} ${car.model}`}>
          <Image
            src={car.imageUrl}
            alt={`${car.make} ${car.model}`}
            width={600}
            height={400}
            className="object-cover w-full h-48 sm:h-56 md:h-64 transition-transform duration-300 hover:scale-105"
            data-ai-hint={`${car.type} ${car.make}`}
            priority={car.id === '1' || car.id === '2'} 
          />
        </Link>
        {car.averageRating && (
          <Badge variant="secondary" className="absolute top-2 right-2 flex items-center gap-1 bg-background/80 backdrop-blur-sm">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="font-semibold">{car.averageRating.toFixed(1)}</span>
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Link href={`/cars/${car.id}`} className="hover:text-primary transition-colors">
          <CardTitle className="text-xl font-semibold mb-1 truncate" title={`${car.make} ${car.model}`}>
            {car.make} {car.model}
          </CardTitle>
        </Link>
        <p className="text-sm text-muted-foreground mb-2">{car.year} &bull; <Badge variant="outline">{carTypeLabel}</Badge></p>
        
        <div className="space-y-1.5 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="truncate" title={car.location}>{car.location}</span>
          </div>
           {fuelTypeLabel && (
            <div className="flex items-center gap-1.5">
              <Fuel className="h-4 w-4 text-primary" />
              <span>{fuelTypeLabel}</span>
            </div>
          )}
          {transmissionLabel && (
            <div className="flex items-center gap-1.5">
              <Settings className="h-4 w-4 text-primary" />
              <span>{transmissionLabel}</span>
            </div>
          )}
          {car.seats && (
             <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-primary" />
              <span>{car.seats} Sièges</span>
            </div>
          )}
        </div>

      </CardContent>
      <CardFooter className="p-4 border-t flex items-center justify-between">
        <div className="flex items-baseline">
          <span className="text-xl font-bold text-accent">{car.pricePerDay}</span>
          <span className="text-sm text-muted-foreground">MAD/jour</span>
        </div>
        <Button asChild size="sm">
          <Link href={`/cars/${car.id}/book`}>
            <CalendarDays className="mr-2 h-4 w-4" />
            Réserver
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
