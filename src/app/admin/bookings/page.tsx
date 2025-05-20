
"use client";

import type { NextPage } from 'next';
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BookMarkedIcon, ArrowLeft, MoreHorizontal, EyeIcon, XCircleIcon, CheckCircle2Icon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Booking } from '@/types';
import { MOCK_BOOKINGS, SAMPLE_CARS } from '@/lib/constants'; // Assuming MOCK_BOOKINGS is in constants
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EnrichedBooking extends Booking {
  carMakeModel?: string;
  agencyNameDisplay?: string;
}

const AdminManageBookingsPage: NextPage = () => {
  const { toast } = useToast();
  
  const enrichedBookings: EnrichedBooking[] = MOCK_BOOKINGS.map(booking => {
    const car = SAMPLE_CARS.find(c => c.id === booking.carId);
    return {
      ...booking,
      carMakeModel: car ? `${car.make} ${car.model}` : 'Voiture inconnue',
      agencyNameDisplay: car?.agencyName || booking.agencyId,
    };
  });

  const [bookings, setBookings] = useState<EnrichedBooking[]>(enrichedBookings);

  const handleViewDetails = (bookingId: string) => {
    toast({ title: "Fonctionnalité à venir", description: `La visualisation des détails de la réservation ${bookingId} sera bientôt disponible.` });
  };
  
  const handleCancelBooking = (bookingId: string) => {
    toast({ title: "Fonctionnalité à venir", description: `L'annulation de la réservation ${bookingId} sera bientôt disponible.`, variant: "destructive"});
  };

  const getStatusBadgeVariant = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed': return 'default'; // green
      case 'pending': return 'secondary'; // yellow/gray
      case 'completed': return 'outline'; // blue/gray
      case 'cancelled':
      case 'declined': return 'destructive'; // red
      default: return 'secondary';
    }
  };

   const getStatusBadgeClass = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-green-600 hover:bg-green-700 text-primary-foreground';
      case 'pending': return 'bg-yellow-500 hover:bg-yellow-600 text-primary-foreground';
      default: return '';
    }
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
          <BookMarkedIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Gérer les Réservations (Vue Globale)</h1>
        </div>
        <CardDescription>Supervisez et gérez toutes les réservations sur la plateforme.</CardDescription>
      </header>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Toutes les Réservations de la Plateforme</CardTitle>
           <CardDescription>
            {bookings.length} réservation{bookings.length > 1 ? 's' : ''} trouvée{bookings.length > 1 ? 's' : ''}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
             <p className="text-muted-foreground text-center py-8">Aucune réservation sur la plateforme pour le moment.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Locataire</TableHead>
                    <TableHead className="hidden md:table-cell">Voiture</TableHead>
                    <TableHead className="hidden sm:table-cell">Agence</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead className="hidden lg:table-cell">Prix Total</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.renterName || 'N/A'}</TableCell>
                      <TableCell className="hidden md:table-cell">{booking.carMakeModel}</TableCell>
                      <TableCell className="hidden sm:table-cell">{booking.agencyNameDisplay}</TableCell>
                      <TableCell>
                        {format(new Date(booking.startDate), 'dd/MM/yy', { locale: fr })} - {format(new Date(booking.endDate), 'dd/MM/yy', { locale: fr })}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{booking.totalPrice.toFixed(2)}€</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(booking.status)} className={getStatusBadgeClass(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
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
                            <DropdownMenuItem onClick={() => handleViewDetails(booking.id)}>
                                <EyeIcon className="mr-2 h-4 w-4" /> Voir Détails
                            </DropdownMenuItem>
                            {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                <DropdownMenuItem 
                                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                    onClick={() => handleCancelBooking(booking.id)}
                                >
                                <XCircleIcon className="mr-2 h-4 w-4" /> Annuler Réservation
                                </DropdownMenuItem>
                            )}
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

export default AdminManageBookingsPage;
