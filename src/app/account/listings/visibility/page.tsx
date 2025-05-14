
"use client";

import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { EyeIcon, EyeOffIcon, ListFilter, ArrowLeft, CarIcon } from 'lucide-react';
import type { Car } from '@/types';
import { SAMPLE_CARS, APP_NAME } from '@/lib/constants'; 
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';

const fetchAgencyCars = async (): Promise<Car[]> => {
  return Promise.resolve(SAMPLE_CARS.filter(car => car.agencyId === 'agency1')); 
};

interface CarWithVisibility extends Car {
  isVisible: boolean;
}

const FleetVisibilityPage: NextPage = () => {
  const { toast } = useToast();
  const [agencyCars, setAgencyCars] = useState<CarWithVisibility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgencyCars().then(cars => {
      setAgencyCars(cars.map(car => ({ ...car, isVisible: car.isVisible !== undefined ? car.isVisible : true })));
      setLoading(false);
    });
  }, []);

  const handleVisibilityChange = (carId: string, newVisibility: boolean) => {
    setAgencyCars(prevCars =>
      prevCars.map(car =>
        car.id === carId ? { ...car, isVisible: newVisibility } : car
      )
    );
    const car = agencyCars.find(c => c.id === carId);
    toast({
      title: `Visibilité mise à jour pour ${car?.make} ${car?.model}`,
      description: `${car?.make} ${car?.model} est maintenant ${newVisibility ? 'visible et listée publiquement' : 'cachée des listes publiques'}.`,
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <ListFilter className="mx-auto h-12 w-12 text-muted-foreground mb-4 animate-pulse" />
        <p className="text-lg text-muted-foreground">Chargement de votre flotte...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Button variant="outline" size="sm" asChild className="mb-6">
        <Link href="/account/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour au Tableau de Bord
        </Link>
      </Button>

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <ListFilter className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Gestion de la Visibilité de la Flotte</h1>
        </div>
        <p className="text-muted-foreground">Contrôlez quelles voitures sont publiquement listées et découvrables sur {APP_NAME}.</p>
      </header>

      {agencyCars.length === 0 && !loading ? (
        <Card className="shadow-md">
          <CardContent className="p-6 text-center">
            <CarIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">Aucune Voiture dans Votre Flotte pour l'Instant</h3>
            <p className="text-muted-foreground mb-4">Ajoutez des voitures à votre flotte pour gérer leur visibilité.</p>
            <Button asChild>
              <Link href="/account/listings/new">Ajouter Nouvelle Voiture</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {agencyCars.map((car) => (
            <Card key={car.id} className="shadow-lg overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center">
                <div className="relative w-full sm:w-48 md:w-64 h-40 sm:h-auto flex-shrink-0 aspect-[3/2] sm:aspect-auto">
                  <Image
                    src={car.imageUrl || `https://placehold.co/600x400.png?text=${car.make}+${car.model}`}
                    alt={`${car.make} ${car.model}`}
                    layout="fill"
                    objectFit="cover"
                    className=""
                    data-ai-hint={`${car.type} ${car.make}`}
                  />
                </div>
                <CardContent className="p-4 sm:p-6 flex-grow w-full">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                      <CardTitle className="text-xl mb-1">{car.make} {car.model}</CardTitle>
                      <p className="text-sm text-muted-foreground">{car.year} &bull; {car.type}</p>
                      <p className="text-sm text-muted-foreground mt-1">{car.location}</p>
                    </div>
                    <div className="flex items-center space-x-3 pt-2 sm:pt-0">
                      {car.isVisible ? <EyeIcon className="h-5 w-5 text-green-600" /> : <EyeOffIcon className="h-5 w-5 text-red-600" />}
                      <Switch
                        id={`visibility-${car.id}`}
                        checked={car.isVisible}
                        onCheckedChange={(checked) => handleVisibilityChange(car.id, checked)}
                        aria-label={`Changer visibilité pour ${car.make} ${car.model}`}
                      />
                      <Label htmlFor={`visibility-${car.id}`} className="text-sm cursor-pointer whitespace-nowrap">
                        {car.isVisible ? 'Listée Publiquement' : 'Cachée'}
                      </Label>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    ID Voiture : {car.id}
                  </p>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
       <Card className="mt-8 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Besoin d'Ajouter Plus de Voitures ?</CardTitle>
            <CardDescription>Agrandissez votre flotte en ajoutant de nouvelles annonces de voitures, puis gérez leur visibilité ici.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
                <Link href="/account/listings/new">Ajouter Nouvelle Annonce de Voiture</Link>
            </Button>
          </CardContent>
      </Card>
    </div>
  );
};

export default FleetVisibilityPage;

declare module '@/types' {
  interface Car {
    isVisible?: boolean;
  }
}
