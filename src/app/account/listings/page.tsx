
"use client";

import type { NextPage } from 'next';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Moved import to the top
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ListChecksIcon, PlusCircle, Edit3, Trash2, ArrowLeft, CarIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import type { Car } from '@/types';
import { SAMPLE_CARS, CAR_TYPES, APP_NAME } from '@/lib/constants';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

// Simuler la récupération des voitures pour une agence spécifique
const fetchAgencyCars = async (agencyId: string): Promise<Car[]> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simuler un délai réseau
  return SAMPLE_CARS.filter(car => car.agencyId === agencyId);
};

const AgencyListingsPage: NextPage = () => {
  const router = useRouter(); // Initialized router instance
  const { toast } = useToast();
  const [agencyCars, setAgencyCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const agencyId = 'agency1'; // Simuler l'ID de l'agence connectée

  useEffect(() => {
    setLoading(true);
    fetchAgencyCars(agencyId).then(cars => {
      setAgencyCars(cars);
      setLoading(false);
    });
  }, [agencyId]);

  const handleEditCar = (carId: string) => {
    toast({
      title: "Fonctionnalité à venir",
      description: `La modification de la voiture ${carId} sera bientôt disponible.`,
    });
    // router.push(`/account/listings/${carId}/edit`);
  };

  const handleDeleteCar = (carId: string, carName: string) => {
     toast({
      title: "Fonctionnalité à venir",
      description: `La suppression de la voiture ${carName} sera bientôt disponible.`,
      variant: "destructive"
    });
    // Mettre en place la logique de suppression ici, par exemple avec une boîte de dialogue de confirmation
  };
  
  const carTypeLabel = (typeValue: Car['type']) => CAR_TYPES.find(ct => ct.value === typeValue)?.label || typeValue;


  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <ListChecksIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4 animate-pulse" />
        <p className="text-lg text-muted-foreground">Chargement de vos annonces...</p>
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
          <ListChecksIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Mes Annonces de Voitures</h1>
        </div>
        <CardDescription>Visualisez, modifiez et gérez vos annonces de voitures. Ajoutez de nouvelles voitures pour agrandir votre flotte.</CardDescription>
      </header>

      <div className="mb-6 text-right">
        <Button asChild>
          <Link href="/account/listings/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Ajouter une Nouvelle Voiture
          </Link>
        </Button>
      </div>

      {agencyCars.length === 0 ? (
        <Card className="shadow-md">
          <CardContent className="p-6 text-center">
            <CarIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">Aucune Voiture dans Votre Flotte pour l'Instant</h3>
            <p className="text-muted-foreground mb-4">Commencez par ajouter une voiture à votre flotte.</p>
            <Button asChild>
              <Link href="/account/listings/new">Ajouter une Nouvelle Voiture</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Votre Flotte de Voitures</CardTitle>
             <CardDescription>
              {agencyCars.length} voiture{agencyCars.length > 1 ? 's' : ''} actuellement dans votre flotte.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Marque & Modèle</TableHead>
                    <TableHead className="hidden sm:table-cell">Année</TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead>Prix/Jour</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agencyCars.map((car) => (
                    <TableRow key={car.id}>
                      <TableCell>
                        <Image
                          src={car.imageUrl || `https://placehold.co/100x67.png?text=${car.make}`}
                          alt={`${car.make} ${car.model}`}
                          width={60}
                          height={40}
                          className="rounded-md object-cover"
                          data-ai-hint={`${car.type} ${car.make}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {car.make} {car.model}
                         <p className="text-xs text-muted-foreground sm:hidden">{car.year} &bull; {carTypeLabel(car.type)}</p>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{car.year}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="secondary">{carTypeLabel(car.type)}</Badge>
                      </TableCell>
                      <TableCell>{car.pricePerDay.toFixed(2)}€</TableCell>
                      <TableCell>
                        <Badge variant={car.isVisible ? 'default' : 'outline'} className={car.isVisible ? 'bg-green-600/80 hover:bg-green-600 text-green-50' : ''}>
                           {car.isVisible ? <EyeIcon className="mr-1 h-3.5 w-3.5" /> : <EyeOffIcon className="mr-1 h-3.5 w-3.5" />}
                          {car.isVisible ? 'Visible' : 'Cachée'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Ouvrir menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditCar(car.id)}>
                              <Edit3 className="mr-2 h-4 w-4" /> Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/account/listings/visibility?highlight=${car.id}`)}>
                                <EyeIcon className="mr-2 h-4 w-4" /> Gérer Visibilité
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                onClick={() => handleDeleteCar(car.id, `${car.make} ${car.model}`)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AgencyListingsPage;

// Helper for routing, can be removed if not used elsewhere
// Already imported at the top
// import { useRouter } from 'next/navigation';

// Ensure car type is used in router.push for highlight
// ... (inside map function in AgencyListingsPage)
// const router = useRouter(); // This is now correctly initialized at the top of the component
// ...
// DropdownMenuItem onClick={() => router.push(`/account/listings/visibility?highlight=${car.id}`)}
// This ensures the router import is used.

