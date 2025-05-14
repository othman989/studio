
"use client";

import type { NextPage } from 'next';
import React, { useState, useEffect, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CarIcon, CalendarDaysIcon, InfoIcon, UsersIcon, DollarSignIcon, XCircleIcon, CheckCircleIcon, BanIcon, WrenchIcon } from 'lucide-react';
import type { Car, Booking, BlockedPeriod } from '@/types';
import { SAMPLE_CARS } from '@/lib/constants'; // Assuming these are the agency's cars
import { format, parseISO, isWithinInterval, eachDayOfInterval, isSameDay, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale'; // Import French locale for date-fns
import Link from 'next/link';

// Mock Bookings Data (replace with actual data fetching)
const MOCK_BOOKINGS: Booking[] = [
  { id: 'booking1', userId: 'user1', carId: '1', agencyId: 'agency1', startDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), endDate: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString(), totalPrice: 450, status: 'confirmed', createdAt: new Date().toISOString(), renterName: "Alice Dupont", renterEmail:"alice@example.com" },
  { id: 'booking2', userId: 'user2', carId: '2', agencyId: 'agency1', startDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(), endDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(), totalPrice: 360, status: 'pending', createdAt: new Date().toISOString(), renterName: "Bob Martin", renterEmail:"bob@example.com" },
  { id: 'booking3', userId: 'user3', carId: '1', agencyId: 'agency1', startDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(), endDate: new Date(new Date().setDate(new Date().getDate() + 12)).toISOString(), totalPrice: 450, status: 'confirmed', createdAt: new Date().toISOString(), renterName: "Carole Blanc", renterEmail:"carol@example.com" },
  { id: 'booking4', userId: 'user4', carId: '3', agencyId: 'agency1', startDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), endDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), totalPrice: 720, status: 'completed', createdAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(), renterName: "David Vert", renterEmail:"david@example.com"},
];

const MOCK_BLOCKED_PERIODS: BlockedPeriod[] = [
    { id: 'block1', carId: '1', startDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(), endDate: new Date(new Date().setDate(new Date().getDate() + 16)).toISOString(), reason: "Maintenance Programmée", createdAt: new Date().toISOString() },
    { id: 'block2', carId: '2', startDate: new Date(new Date().setDate(new Date().getDate() + 20)).toISOString(), endDate: new Date(new Date().setDate(new Date().getDate() + 21)).toISOString(), reason: "Utilisation Propriétaire", createdAt: new Date().toISOString() },
    { id: 'block3', carId: 'all', startDate: new Date(new Date().setDate(new Date().getDate() + 25)).toISOString(), endDate: new Date(new Date().setDate(new Date().getDate() + 25)).toISOString(), reason: "Férié Agence", createdAt: new Date().toISOString() },
];


const AgencyCalendarPage: NextPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedCarId, setSelectedCarId] = useState<string | 'all'>('all');
  
  const [agencyCars] = useState<Car[]>(SAMPLE_CARS.filter(c => c.agencyId === 'agency1' || c.agencyId === 'agency2')); // Simulating agency's cars
  const [bookings] = useState<Booking[]>(MOCK_BOOKINGS); 
  const [blockedPeriods] = useState<BlockedPeriod[]>(MOCK_BLOCKED_PERIODS);

  const [selectedBookings, setSelectedBookings] = useState<Booking[]>([]);
  const [selectedBlockedPeriods, setSelectedBlockedPeriods] = useState<BlockedPeriod[]>([]);


  const displayedBookings = useMemo(() => {
    return bookings.filter(booking => 
      (selectedCarId === 'all' || booking.carId === selectedCarId) && (booking.status === 'confirmed' || booking.status === 'pending')
    );
  }, [bookings, selectedCarId]);

  const displayedBlockedPeriods = useMemo(() => {
    return blockedPeriods.filter(period => 
      selectedCarId === 'all' || period.carId === selectedCarId || period.carId === 'all'
    );
  }, [blockedPeriods, selectedCarId]);

  const renterBookedDays = useMemo(() => {
    const days: Date[] = [];
    displayedBookings.forEach(booking => {
      const start = parseISO(booking.startDate);
      const end = parseISO(booking.endDate);
      if (start && end) {
        eachDayOfInterval({ start, end }).forEach(day => days.push(day));
      }
    });
    return days;
  }, [displayedBookings]);

  const agencyBlockedDays = useMemo(() => {
    const days: Date[] = [];
    displayedBlockedPeriods.forEach(period => {
      const start = parseISO(period.startDate);
      const end = parseISO(period.endDate);
      if (start && end) {
        eachDayOfInterval({ start, end }).forEach(day => days.push(day));
      }
    });
    return days;
  }, [displayedBlockedPeriods]);

  const modifiers = {
    booked: renterBookedDays,
    agencyBlocked: agencyBlockedDays,
    selected: selectedDate,
    today: new Date(),
  };

  const modifiersStyles = {
    booked: { 
      backgroundColor: 'hsl(var(--primary) / 0.2)', 
      color: 'hsl(var(--primary-foreground))',
      fontWeight: 'bold',
    },
    agencyBlocked: {
      backgroundColor: 'hsl(var(--muted) / 0.7)',
      color: 'hsl(var(--muted-foreground))',
      border: '1px dashed hsl(var(--muted-foreground))'
    },
    selected: { 
      backgroundColor: 'hsl(var(--accent))', 
      color: 'hsl(var(--accent-foreground))' 
    },
    today: {
        border: '2px solid hsl(var(--primary))',
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const bookingsOnDate = displayedBookings.filter(booking => {
        const bookingStart = parseISO(booking.startDate);
        const bookingEnd = parseISO(booking.endDate);
        return isWithinInterval(date, { start: bookingStart, end: bookingEnd });
      });
      setSelectedBookings(bookingsOnDate);

      const blockedOnDate = displayedBlockedPeriods.filter(period => {
        const periodStart = parseISO(period.startDate);
        const periodEnd = parseISO(period.endDate);
        return isWithinInterval(date, { start: periodStart, end: periodEnd });
      });
      setSelectedBlockedPeriods(blockedOnDate);

    } else {
      setSelectedBookings([]);
      setSelectedBlockedPeriods([]);
    }
  };

  const getCarById = (carId: string): Car | undefined => {
    return agencyCars.find(car => car.id === carId);
  };

  const getStatusText = (status: Booking['status']) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmée';
      case 'cancelled': return 'Annulée';
      case 'completed': return 'Terminée';
      case 'declined': return 'Refusée';
      default: return status;
    }
  };


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <CalendarDaysIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Calendrier de l'Agence</h1>
        </div>
        <p className="text-muted-foreground">Gérez les réservations de vos voitures et leur disponibilité.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="shadow-xl">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>
                  {selectedCarId === 'all' ? 'Vue Toutes Voitures' : `${getCarById(selectedCarId)?.make} ${getCarById(selectedCarId)?.model}`}
                </CardTitle>
                <div className="w-full sm:w-auto min-w-[200px]">
                  <Label htmlFor="car-filter" className="sr-only">Filtrer par Voiture</Label>
                  <Select value={selectedCarId} onValueChange={(value) => {
                      setSelectedCarId(value);
                      setSelectedDate(undefined); 
                      setSelectedBookings([]);
                      setSelectedBlockedPeriods([]);
                  }}>
                    <SelectTrigger id="car-filter">
                      <SelectValue placeholder="Filtrer par voiture..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les voitures</SelectItem>
                      {agencyCars.map(car => (
                        <SelectItem key={car.id} value={car.id}>
                          {car.make} {car.model} ({car.year})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                className="p-0 rounded-md border shadow-sm"
                numberOfMonths={1}
                disabled={(date) => date < startOfMonth(new Date()) && !isSameDay(date, new Date()) && !isWithinInterval(date, {start: startOfMonth(new Date()), end: new Date()}) } 
                locale={fr} // Add French locale to calendar
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-lg sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <InfoIcon className="h-6 w-6 text-primary" />
                Détails pour {selectedDate ? format(selectedDate, 'PPP', { locale: fr }) : 'Date Sélectionnée'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate && (selectedBookings.length > 0 || selectedBlockedPeriods.length > 0) ? (
                <div className="space-y-4">
                  {selectedBookings.map(booking => {
                    const car = getCarById(booking.carId);
                    return (
                      <Alert key={`booking-${booking.id}`} variant={booking.status === 'confirmed' ? 'default' : booking.status === 'pending' ? 'default' : 'destructive'} className={booking.status === 'confirmed' ? 'border-green-500' : booking.status === 'pending' ? 'border-yellow-500' : 'border-red-500'}>
                         {booking.status === 'confirmed' && <CheckCircleIcon className="h-4 w-4 text-green-600" />}
                         {booking.status === 'pending' && <InfoIcon className="h-4 w-4 text-yellow-600" />}
                         {booking.status === 'cancelled' && <XCircleIcon className="h-4 w-4 text-red-600" />}

                        <AlertTitle className="font-semibold">
                          Réservation ID: {booking.id.substring(0,8)} ({getStatusText(booking.status)})
                        </AlertTitle>
                        <AlertDescription className="space-y-1 text-sm">
                          {car && (
                            <p className="flex items-center gap-1"><CarIcon className="h-4 w-4 text-muted-foreground" /> {car.make} {car.model}</p>
                          )}
                          <p className="flex items-center gap-1"><UsersIcon className="h-4 w-4 text-muted-foreground" /> {booking.renterName}</p>
                          <p className="flex items-center gap-1"><DollarSignIcon className="h-4 w-4 text-muted-foreground" /> {booking.totalPrice.toFixed(2)}€</p>
                          <p className="flex items-center gap-1"><CalendarDaysIcon className="h-4 w-4 text-muted-foreground" /> 
                            {format(parseISO(booking.startDate), 'd MMM', { locale: fr })} - {format(parseISO(booking.endDate), 'd MMM, yyyy', { locale: fr })}
                          </p>
                           <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                             <Link href={`/account/bookings/${booking.id}`}>Voir Détails</Link>
                           </Button>
                        </AlertDescription>
                      </Alert>
                    );
                  })}
                  {selectedBlockedPeriods.map(period => {
                    const car = getCarById(period.carId);
                    return (
                      <Alert key={`block-${period.id}`} variant="default" className="border-slate-400">
                        <BanIcon className="h-4 w-4 text-slate-600" />
                        <AlertTitle className="font-semibold">
                          Bloqué par Agence: {period.reason || "Indisponible"}
                        </AlertTitle>
                        <AlertDescription className="space-y-1 text-sm">
                          {car && period.carId !== 'all' && (
                            <p className="flex items-center gap-1"><CarIcon className="h-4 w-4 text-muted-foreground" /> {car.make} {car.model}</p>
                          )}
                          {period.carId === 'all' && (
                             <p className="flex items-center gap-1"><CarIcon className="h-4 w-4 text-muted-foreground" /> Toutes les voitures</p>
                          )}
                          <p className="flex items-center gap-1"><CalendarDaysIcon className="h-4 w-4 text-muted-foreground" /> 
                            {format(parseISO(period.startDate), 'd MMM', { locale: fr })} - {format(parseISO(period.endDate), 'd MMM, yyyy', { locale: fr })}
                          </p>
                           {period.reason === "Maintenance Programmée" && <p className="flex items-center gap-1"><WrenchIcon className="h-4 w-4 text-muted-foreground" /> {period.reason}</p>}
                        </AlertDescription>
                      </Alert>
                    );
                  })}
                </div>
              ) : selectedDate ? (
                <p className="text-muted-foreground">Aucune réservation ou blocage pour cette voiture à cette date.</p>
              ) : (
                <p className="text-muted-foreground">Sélectionnez une date sur le calendrier pour voir les détails de réservation ou la disponibilité des voitures.</p>
              )}
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="text-lg">Gérer la Disponibilité</CardTitle>
                <CardDescription>Bloquez des dates lorsque les voitures sont indisponibles pour maintenance ou autres raisons.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button className="w-full" disabled>Bloquer Dates (Bientôt disponible)</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgencyCalendarPage;

declare module '@/types' {
  interface Booking {
    renterName?: string;
    renterEmail?: string;
  }
}
