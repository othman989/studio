
"use client";

import type { NextPage } from 'next';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ListChecksIcon, PlusCircle, Edit3, Trash2, ArrowLeft, CarIcon, EyeIcon, EyeOffIcon, MoreHorizontal } from 'lucide-react';
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
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"


const fetchAgencyCars = async (agencyId: string): Promise<Car[]> => {
  await new Promise(resolve => setTimeout(resolve, 500)); 
  return SAMPLE_CARS.filter(car => car.agencyId === agencyId);
};

const AgencyListingsPage: NextPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [agencyCars, setAgencyCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const agencyId = 'agency1'; // Simuler l'ID de l'agence connectée

  useEffect(() => {
    setLoading(true);
    fetchAgencyCars(agencyId).then(cars => {
      setAgencyCars(cars);
      setLoading(false);
    });
  }, [agencyId]);

  const handleEditCar = (carId: string) => {
    router.push(`/account/listings/${carId}/edit`);
  };

  const openDeleteDialog = (car: Car) => {
    setCarToDelete(car);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDeleteCar = () => {
    if (!carToDelete) return;

    const carIndex = SAMPLE_CARS.findIndex(c => c.id === carToDelete.id && c.agencyId === agencyId);
    if (carIndex !== -1) {
        SAMPLE_CARS.splice(carIndex, 1);
    }
    // Re-fetch or filter local state
    setAgencyCars(prevCars => prevCars.filter(car => car.id !== carToDelete.id));

    toast({
      title: "Voiture Supprimée (Simulation)",
      description: `La voiture ${carToDelete.make} ${carToDelete.model} a été supprimée de vos annonces.`,
      variant: "destructive"
    });
    setIsDeleteDialogOpen(false);
    setCarToDelete(null);
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
                                onClick={() => openDeleteDialog(car)}
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

       {/* Delete Car Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la Suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'annonce pour {carToDelete?.make} {carToDelete?.model} ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCarToDelete(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDeleteCar} className={buttonVariants({variant: "destructive"})}>
              Supprimer Définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AgencyListingsPage;

    