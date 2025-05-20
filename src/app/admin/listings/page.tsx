
"use client";

import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CarIcon, ArrowLeft, MoreHorizontal, EyeIcon, Edit3, Trash2, EyeOffIcon } from 'lucide-react';
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
import type { Car } from '@/types';
import { SAMPLE_CARS, CAR_TYPES, MOCK_BOOKINGS } from '@/lib/constants';

const AdminManageListingsPage: NextPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [allCars, setAllCars] = useState<Car[]>(SAMPLE_CARS);
  const [carToModify, setCarToModify] = useState<Car | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const carTypeLabel = (typeValue: Car['type']) => CAR_TYPES.find(ct => ct.value === typeValue)?.label || typeValue;

  const handleToggleVisibility = (carId: string) => {
    const carIndex = SAMPLE_CARS.findIndex(car => car.id === carId);
    if (carIndex !== -1) {
      SAMPLE_CARS[carIndex].isVisible = !SAMPLE_CARS[carIndex].isVisible;
      setAllCars([...SAMPLE_CARS]);
      toast({
        title: `Visibilité mise à jour pour ${SAMPLE_CARS[carIndex].make} ${SAMPLE_CARS[carIndex].model}`,
        description: `${SAMPLE_CARS[carIndex].make} ${SAMPLE_CARS[carIndex].model} est maintenant ${SAMPLE_CARS[carIndex].isVisible ? 'visible' : 'cachée'}.`,
      });
    }
  };
  
  const openDeleteDialog = (car: Car) => {
    setCarToModify(car);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteListing = () => {
    if (!carToModify) return;
    const carIdToDelete = carToModify.id;

    // Remove car
    const carIndex = SAMPLE_CARS.findIndex(c => c.id === carIdToDelete);
    if (carIndex !== -1) {
        SAMPLE_CARS.splice(carIndex, 1);
    }

    // Remove associated bookings
    const bookingsToRemove = MOCK_BOOKINGS.filter(booking => booking.carId === carIdToDelete);
    bookingsToRemove.forEach(bookingToRemove => {
      const bookingIndex = MOCK_BOOKINGS.findIndex(booking => booking.id === bookingToRemove.id);
      if (bookingIndex !== -1) {
        MOCK_BOOKINGS.splice(bookingIndex, 1);
      }
    });
    
    setAllCars([...SAMPLE_CARS]);
    toast({ 
        title: "Annonce Supprimée (Simulation)", 
        description: `L'annonce pour ${carToModify.make} ${carToModify.model} et ses réservations associées ont été supprimées.`, 
        variant: "destructive" 
    });
    setIsDeleteDialogOpen(false);
    setCarToModify(null);
  };


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Button variant="outline" size="sm" asChild className="mb-6">
        <Link href="/admin/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour au Tableau de Bord Admin
        </Link>
      </Button>

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <CarIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Gérer les Annonces (Vue Globale)</h1>
        </div>
        <CardDescription>Supervisez et gérez toutes les annonces de voitures de la plateforme.</CardDescription>
      </header>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Toutes les Annonces de Voitures</CardTitle>
           <CardDescription>
            {allCars.length} annonce{allCars.length > 1 ? 's' : ''} de voiture actuellement sur la plateforme.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {allCars.length === 0 ? (
             <p className="text-muted-foreground text-center py-8">Aucune annonce de voiture sur la plateforme pour le moment.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Marque & Modèle</TableHead>
                    <TableHead className="hidden sm:table-cell">Agence</TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead>Prix/Jour</TableHead>
                    <TableHead>Visibilité</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allCars.map((car) => (
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
                        <p className="text-xs text-muted-foreground sm:hidden">{car.year}</p>
                      </TableCell>
                       <TableCell className="hidden sm:table-cell">{car.agencyName || 'N/A'}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="secondary">{carTypeLabel(car.type)}</Badge>
                      </TableCell>
                      <TableCell>{car.pricePerDay.toFixed(2)} MAD</TableCell>
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
                            <DropdownMenuLabel>Actions Admin</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`/cars/${car.id}`)}>
                                <EyeIcon className="mr-2 h-4 w-4" /> Voir l'Annonce
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleVisibility(car.id)}>
                                {car.isVisible ? <EyeOffIcon className="mr-2 h-4 w-4" /> : <EyeIcon className="mr-2 h-4 w-4" />}
                                {car.isVisible ? 'Cacher' : 'Rendre Visible'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                onClick={() => openDeleteDialog(car)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Supprimer l'Annonce
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Delete Listing Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer Suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer définitivement l'annonce pour {carToModify?.make} {carToModify?.model} ? Cette action est irréversible et supprimera également les réservations associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCarToModify(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteListing} className={buttonVariants({variant: "destructive"})}>
              Supprimer Définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminManageListingsPage;

    
