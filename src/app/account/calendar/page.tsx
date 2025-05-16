
"use client";

import type { NextPage } from 'next';
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CarIcon, CalendarDaysIcon, WrenchIcon, ChevronLeftIcon, ChevronRightIcon, CalendarIcon as LucideCalendarIcon } from 'lucide-react';
import type { Car, Booking, BlockedPeriod } from '@/types';
import { SAMPLE_CARS } from '@/lib/constants'; 
import { 
  format, 
  parseISO, 
  isWithinInterval, 
  eachDayOfInterval, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  subDays, 
  isSameDay,
  isAfter,
  isBefore
} from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

// Mock Bookings Data (replace with actual data fetching)
const MOCK_BOOKINGS: Booking[] = [
  { id: 'booking1', userId: 'user1', carId: '1', agencyId: 'agency1', startDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), endDate: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString(), totalPrice: 450, status: 'confirmed', createdAt: new Date().toISOString(), renterName: "Alice Dupont", renterEmail:"alice@example.com" },
  { id: 'booking2', userId: 'user2', carId: '2', agencyId: 'agency1', startDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(), endDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(), totalPrice: 360, status: 'pending', createdAt: new Date().toISOString(), renterName: "Bob Martin", renterEmail:"bob@example.com" },
  { id: 'booking3', userId: 'user3', carId: '1', agencyId: 'agency1', startDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(), endDate: new Date(new Date().setDate(new Date().getDate() + 12)).toISOString(), totalPrice: 450, status: 'confirmed', createdAt: new Date().toISOString(), renterName: "Carole Blanc", renterEmail:"carol@example.com" },
];

const MOCK_BLOCKED_PERIODS: BlockedPeriod[] = [
    { id: 'block1', carId: '1', startDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(), endDate: new Date(new Date().setDate(new Date().getDate() + 16)).toISOString(), reason: "Maintenance Programmée", createdAt: new Date().toISOString() },
    { id: 'block2', carId: '2', startDate: new Date(new Date().setDate(new Date().getDate() + 20)).toISOString(), endDate: new Date(new Date().setDate(new Date().getDate() + 21)).toISOString(), reason: "Utilisation Propriétaire", createdAt: new Date().toISOString() },
    { id: 'block3', carId: 'all', startDate: new Date(new Date().setDate(new Date().getDate() + 25)).toISOString(), endDate: new Date(new Date().setDate(new Date().getDate() + 25)).toISOString(), reason: "Férié Agence", createdAt: new Date().toISOString() },
];


const AgencyCalendarPage: NextPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date()); // Used to determine the current week
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
  const [agencyCars] = useState<Car[]>(SAMPLE_CARS.filter(c => c.agencyId === 'agency1' || c.agencyId === 'agency2'));
  const [bookings] = useState<Booking[]>(MOCK_BOOKINGS); 
  const [blockedPeriods] = useState<BlockedPeriod[]>(MOCK_BLOCKED_PERIODS);

  const currentWeekStartDate = useMemo(() => startOfWeek(currentDate, { weekStartsOn: 1, locale: fr }), [currentDate]);
  const currentWeekEndDate = useMemo(() => endOfWeek(currentDate, { weekStartsOn: 1, locale: fr }), [currentDate]);

  const weekDays = useMemo(() => {
    return eachDayOfInterval({ start: currentWeekStartDate, end: currentWeekEndDate });
  }, [currentWeekStartDate, currentWeekEndDate]);

  const goToPreviousWeek = () => {
    setCurrentDate(subDays(currentWeekStartDate, 7));
  };

  const goToNextWeek = () => {
    setCurrentDate(addDays(currentWeekStartDate, 7));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setCurrentDate(date);
      setIsDatePickerOpen(false); // Close popover on date select
    }
  };

  const isCarAvailableOnDate = (carId: string, targetDate: Date): { available: boolean, reason?: string } => {
    const targetDayStart = new Date(targetDate.setHours(0, 0, 0, 0));

    // Check bookings
    const carBookings = bookings.filter(b => b.carId === carId && (b.status === 'confirmed' || b.status === 'pending'));
    for (const booking of carBookings) {
      const bookingStart = parseISO(booking.startDate);
      const bookingEnd = parseISO(booking.endDate);
      if (isWithinInterval(targetDayStart, { start: bookingStart, end: bookingEnd }) || isSameDay(targetDayStart, bookingStart) || isSameDay(targetDayStart, bookingEnd)) {
        return { available: false, reason: `Réservé (${booking.renterName})` };
      }
    }

    // Check blocked periods (car-specific)
    const carBlockedPeriods = blockedPeriods.filter(p => p.carId === carId);
    for (const period of carBlockedPeriods) {
      const periodStart = parseISO(period.startDate);
      const periodEnd = parseISO(period.endDate);
       if (isWithinInterval(targetDayStart, { start: periodStart, end: periodEnd }) || isSameDay(targetDayStart, periodStart) || isSameDay(targetDayStart, periodEnd)) {
        return { available: false, reason: period.reason || "Bloqué" };
      }
    }
    
    // Check blocked periods (all cars)
    const allCarsBlockedPeriods = blockedPeriods.filter(p => p.carId === 'all');
     for (const period of allCarsBlockedPeriods) {
      const periodStart = parseISO(period.startDate);
      const periodEnd = parseISO(period.endDate);
       if (isWithinInterval(targetDayStart, { start: periodStart, end: periodEnd }) || isSameDay(targetDayStart, periodStart) || isSameDay(targetDayStart, periodEnd)) {
        return { available: false, reason: period.reason || "Bloqué (toute l'agence)"};
      }
    }
    return { available: true }; 
  };


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <CalendarDaysIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Calendrier de Disponibilité de la Flotte</h1>
        </div>
        <p className="text-muted-foreground">Visualisez et gérez la disponibilité de vos voitures sur une base hebdomadaire.</p>
      </header>

      <Card className="shadow-xl mb-8">
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-6">
          <Button variant="outline" onClick={goToPreviousWeek} aria-label="Semaine précédente">
            <ChevronLeftIcon className="h-5 w-5" />
          </Button>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <CardTitle className="text-xl text-center order-2 sm:order-1">
              Semaine du {format(currentWeekStartDate, 'd LLLL yyyy', { locale: fr })}
            </CardTitle>
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[200px] sm:w-[240px] justify-start text-left font-normal order-1 sm:order-2",
                    !currentDate && "text-muted-foreground"
                  )}
                >
                  <LucideCalendarIcon className="mr-2 h-4 w-4" />
                  {currentDate ? format(currentDate, "MMMM yyyy", {locale: fr}) : <span>Choisir un mois</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={currentDate}
                  onSelect={handleDateSelect}
                  initialFocus
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button variant="outline" onClick={goToNextWeek} aria-label="Semaine suivante">
            <ChevronRightIcon className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent>
          {agencyCars.length > 0 ? (
            <div className="overflow-x-auto">
              <Table className="min-w-full border">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="sticky left-0 bg-muted/50 z-10 w-1/4 min-w-[150px] md:min-w-[200px] border-r">Voiture</TableHead>
                    {weekDays.map(day => (
                      <TableHead key={day.toISOString()} className="text-center border-l">
                        {format(day, 'EEE d MMM', { locale: fr })}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agencyCars.map(car => (
                    <TableRow key={car.id} className="hover:bg-muted/20">
                      <TableCell className="font-medium sticky left-0 bg-card border-r z-10">
                        {car.make} {car.model} <span className="text-xs text-muted-foreground">({car.year})</span>
                      </TableCell>
                      {weekDays.map(day => {
                        const availability = isCarAvailableOnDate(car.id, day);
                        const isPast = isBefore(day, new Date()) && !isSameDay(day, new Date());
                        const cellClassName = `h-16 text-center border-l ${
                          isPast ? 'bg-muted/30 cursor-not-allowed' :
                          availability.available ? 'hover:bg-green-100 dark:hover:bg-green-900/30 cursor-pointer' : 'bg-primary/20 cursor-not-allowed'
                        }`;
                        
                        return (
                          <TableCell key={day.toISOString()} className={cellClassName} title={!availability.available && !isPast ? availability.reason : undefined}>
                            {availability.available && !isPast ? (
                              <Link 
                                href={`/account/reservations/new?carId=${car.id}&startDate=${format(day, 'yyyy-MM-dd')}`}
                                className="w-full h-full flex items-center justify-center"
                                aria-label={`Réserver ${car.make} ${car.model} le ${format(day, 'PPP', {locale: fr})}`}
                              >
                                <span className="sr-only">Disponible</span>
                              </Link>
                            ) : (
                               <div className="w-full h-full flex items-center justify-center">
                                {isPast ? <span className="text-xs text-muted-foreground">Passé</span> : <span className="sr-only">Non disponible</span>}
                               </div>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">Aucune voiture dans votre flotte pour le moment.</p>
          )}
        </CardContent>
      </Card>
      
      <Card className="shadow-md">
        <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><WrenchIcon className="h-5 w-5 text-primary"/>Gérer la Disponibilité</CardTitle>
            <CardDescription>Bloquez des dates lorsque les voitures sont indisponibles pour maintenance ou autres raisons.</CardDescription>
        </CardHeader>
        <CardContent>
            <Button className="w-full sm:w-auto" disabled>Bloquer Dates (Bientôt disponible)</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgencyCalendarPage;

// Ensure Booking type includes renterName and renterEmail if you use them elsewhere.
// For this page, it's mainly about carId, startDate, endDate, status.
declare module '@/types' {
  interface Booking {
    renterName?: string;
    renterEmail?: string;
  }
}
    
