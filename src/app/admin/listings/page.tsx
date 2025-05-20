
"use client";

import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Button } from '@/components/ui/button';
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
import type { Car } from '@/types';
import { SAMPLE_CARS, CAR_TYPES } from '@/lib/constants';

const AdminManageListingsPage: NextPage = () => {
  const { toast } = useToast();
  const router = useRouter(); // Initialize useRouter
  const [allCars, setAllCars] = useState<Car[]>(SAMPLE_CARS); // Use all cars

  const carTypeLabel = (typeValue: Car['type']) => CAR_TYPES.find(ct => ct.value === typeValue)?.label || typeValue;

  const handleToggleVisibility = (carId: string) => {
    setAllCars(prevCars =>
      prevCars.map(car =>
        car.id === carId ? { ...car, isVisible: !car.isVisible } : car
      )
    );
    const car = allCars.find(c => c.id === carId);
    toast({
      title: `Visibilité mise à jour pour ${car?.make} ${car?.model}`,
      description: `${car?.make} ${car?.model} est maintenant ${!car?.isVisible ? 'visible' : 'cachée'}.`,
    });
  };
  
  const handleDeleteListing = (carId: string) => {
    toast({ title: "Fonctionnalité à venir", description: `La suppression de l'annonce ${carId} sera bientôt disponible.`, variant: "destructive" });
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
                                onClick={() => handleDeleteListing(car.id)}
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
    </div>
  );
};

export default AdminManageListingsPage;
