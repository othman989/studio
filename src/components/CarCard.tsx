import Image from 'next/image';
import Link from 'next/link';
import type { Car } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, DollarSign, CalendarDays, Fuel, Settings, Users } from 'lucide-react';

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="p-0 relative">
        <Link href={`/cars/${car.id}`} aria-label={`View details for ${car.make} ${car.model}`}>
          <Image
            src={car.imageUrl}
            alt={`${car.make} ${car.model}`}
            width={600}
            height={400}
            className="object-cover w-full h-48 sm:h-56 md:h-64 transition-transform duration-300 hover:scale-105"
            data-ai-hint={`${car.type} ${car.make}`}
            priority={car.id === '1' || car.id === '2'} // Prioritize LCP images
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
        <p className="text-sm text-muted-foreground mb-2">{car.year} &bull; <Badge variant="outline">{car.type}</Badge></p>
        
        <div className="space-y-1.5 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="truncate" title={car.location}>{car.location}</span>
          </div>
           {car.fuelType && (
            <div className="flex items-center gap-1.5">
              <Fuel className="h-4 w-4 text-primary" />
              <span>{car.fuelType}</span>
            </div>
          )}
          {car.transmission && (
            <div className="flex items-center gap-1.5">
              <Settings className="h-4 w-4 text-primary" />
              <span>{car.transmission}</span>
            </div>
          )}
          {car.seats && (
             <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-primary" />
              <span>{car.seats} Seats</span>
            </div>
          )}
        </div>

      </CardContent>
      <CardFooter className="p-4 border-t flex items-center justify-between">
        <div className="flex items-baseline">
          <DollarSign className="h-5 w-5 text-accent" />
          <span className="text-xl font-bold text-accent">{car.pricePerDay}</span>
          <span className="text-sm text-muted-foreground">/day</span>
        </div>
        <Button asChild size="sm">
          <Link href={`/cars/${car.id}/book`}>
            <CalendarDays className="mr-2 h-4 w-4" />
            Book Now
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
