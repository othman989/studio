
"use client"; // Convert to Client Component to fetch reviews dynamically

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { SAMPLE_CARS as ALL_CARS, CAR_TYPES as ALL_CAR_TYPES_CONST, MOCK_REVIEWS } from '@/lib/constants';
import type { Car, Review } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin, Star, DollarSign, CalendarDays, Fuel, Settings, Users, MessageSquare, CheckCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CarCard } from '@/components/CarCard';
import { fr } from 'date-fns/locale';
import { format, parseISO } from 'date-fns'; // Added parseISO


async function getCarDetails(id: string): Promise<Car | undefined> {
  await new Promise(resolve => setTimeout(resolve, 50)); // Simulate network delay
  return ALL_CARS.find(car => car.id === id);
}

async function getCarReviews(carId: string): Promise<Review[]> {
  await new Promise(resolve => setTimeout(resolve, 50)); // Simulate network delay
  return MOCK_REVIEWS.filter(review => review.targetId === carId && review.targetType === 'car').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

async function getRelatedCars(currentCar: Car): Promise<Car[]> {
  await new Promise(resolve => setTimeout(resolve, 50)); // Simulate network delay
  return ALL_CARS.filter(car => car.id !== currentCar.id && car.type === currentCar.type && car.isVisible).slice(0, 3);
}

export default function CarDetailsPage() {
  const params = useParams();
  const carId = params.id as string;

  const [car, setCar] = useState<Car | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedCars, setRelatedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    async function fetchData() {
      if (carId) {
        setLoading(true);
        const carData = await getCarDetails(carId);
        if (carData) {
          setCar(carData);
          const carReviewsData = await getCarReviews(carId);
          setReviews(carReviewsData);

          const avgRating = carReviewsData.length > 0 
            ? carReviewsData.reduce((sum, review) => sum + review.rating, 0) / carReviewsData.length 
            : carData.averageRating || 0;
          setAverageRating(avgRating);

          const relatedCarsData = await getRelatedCars(carData);
          setRelatedCars(relatedCarsData);
        }
        setLoading(false);
      }
    }
    fetchData();
  }, [carId]);
  

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-lg text-muted-foreground">Chargement des détails de la voiture...</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Voiture Non Trouvée</h1>
        <p className="text-muted-foreground mb-6">Désolé, la voiture que vous recherchez n'existe pas ou n'est plus disponible.</p>
        <Button asChild>
          <Link href="/cars">Retour aux Annonces</Link>
        </Button>
      </div>
    );
  }
  
  const carTypeLabel = ALL_CAR_TYPES_CONST.find(ct => ct.value === car.type)?.label || car.type;
  const carFeatures = car.features || [];
  const keySpecs = [
    { icon: Fuel, label: 'Type de Carburant', value: car.fuelType === 'Gasoline' ? 'Essence' : car.fuelType === 'Diesel' ? 'Diesel' : car.fuelType === 'Electric' ? 'Électrique' : car.fuelType === 'Hybrid' ? 'Hybride' : 'N/A' },
    { icon: Settings, label: 'Transmission', value: car.transmission === 'Automatic' ? 'Automatique' : car.transmission === 'Manual' ? 'Manuelle' : 'N/A' },
    { icon: Users, label: 'Sièges', value: car.seats ? `${car.seats} Sièges` : 'N/A' },
    { icon: MapPin, label: 'Lieu', value: car.location },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden shadow-xl">
            <CardHeader className="p-0">
              <Image
                src={car.imageUrl} 
                alt={`${car.make} ${car.model}`}
                width={1200}
                height={800}
                className="object-cover w-full h-64 sm:h-80 md:h-[500px]"
                priority
                data-ai-hint={`${car.type} ${car.make} exterior`}
              />
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">{car.make} {car.model}</h1>
                  <p className="text-lg text-muted-foreground">{car.year} &bull; <Badge variant="secondary">{carTypeLabel}</Badge></p>
                </div>
                {averageRating > 0 && (
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                    <span className="text-xl font-semibold">{averageRating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">({reviews.length} avis)</span>
                  </div>
                )}
              </div>

              {car.description && (
                <p className="text-muted-foreground mb-6">{car.description}</p>
              )}
              
              <Separator className="my-6" />

              <h2 className="text-2xl font-semibold mb-4">Spécifications Clés</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mb-6">
                {keySpecs.map(spec => (
                  <div key={spec.label} className="flex items-start gap-3 p-3 bg-muted/50 rounded-md">
                    <spec.icon className="h-6 w-6 text-primary mt-1 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{spec.label}</p>
                      <p className="text-md font-semibold text-foreground">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {carFeatures.length > 0 && (
                <>
                  <Separator className="my-6" />
                  <h2 className="text-2xl font-semibold mb-4">Équipements</h2>
                  <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 mb-6">
                    {carFeatures.map(feature => (
                      <li key={feature} className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="h-5 w-5 text-accent" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-lg sticky top-24">
            <CardHeader>
              <div className="flex items-baseline justify-center text-accent mb-2">
                <span className="text-4xl font-bold">{car.pricePerDay}</span>
                <span className="text-lg text-muted-foreground">MAD/jour</span>
              </div>
              <Button size="lg" className="w-full mt-4" asChild>
                <Link href={`/cars/${car.id}/book`}>
                  <CalendarDays className="mr-2 h-5 w-5" />
                  Demander à Réserver
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="text-sm text-center">
              <p className="text-muted-foreground">Les prix peuvent varier en fonction de la durée de location et de la disponibilité.</p>
              <div className="mt-4 flex items-center justify-center gap-2 text-green-600">
                <ShieldCheck className="h-5 w-5"/>
                <span>Réservation Sécurisée & Annulation Gratuite</span>
              </div>
            </CardContent>
          </Card>

          {car.agencyName && (
             <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Agence de Location</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="font-semibold text-lg mb-1">{car.agencyName || 'Agence Partenaire de Confiance'}</p>
                    <Button variant="outline" size="sm" className="w-full mt-3" asChild>
                        <Link href={`/account/chat?agency=${encodeURIComponent(car.agencyName)}`}>
                           <MessageSquare className="mr-2 h-4 w-4" /> Contacter l'Agence
                        </Link>
                    </Button>
                </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Separator className="my-10 md:my-12" />
      <div className="mb-10 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Avis des Clients</h2>
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map(review => (
              <Card key={review.id} className="p-2 sm:p-4">
                <CardContent className="p-2 sm:p-4">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={review.avatarUrl || `https://placehold.co/40x40.png?text=${review.userName.substring(0,1)}`} alt={review.userName} data-ai-hint="person avatar"/>
                      <AvatarFallback>{review.userName.substring(0,1)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-foreground">{review.userName}</p>
                        <div className="flex items-center">
                          {Array(review.rating).fill(0).map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          ))}
                          {Array(5-review.rating).fill(0).map((_,i)=> (
                            <Star key={`empty-${i}`} className="h-4 w-4 text-muted-foreground/30" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {format(parseISO(review.createdAt), 'dd MMMM yyyy', { locale: fr })}
                      </p>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Aucun avis pour cette voiture pour le moment. Soyez le premier à en laisser un !</p>
        )}
        <div className="mt-6 text-center">
            <Button variant="outline" asChild>
              <Link href={`/cars/${carId}/reviews/new`}>Laisser un Avis</Link>
            </Button>
        </div>
      </div>

      {relatedCars.length > 0 && (
        <>
          <Separator className="my-10 md:my-12" />
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">Vous Pourriez Aussi Aimer</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {relatedCars.map(relatedCar => (
                <CarCard key={relatedCar.id} car={relatedCar} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
