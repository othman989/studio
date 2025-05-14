
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
import Link from 'next/link';

// Mock Bookings Data (replace with actual data fetching)
const MOCK_BOOKINGS: Booking[] = [
  { id: 'booking1', userId: 'user1', carId: '1', agencyId: 'agency1', startDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), endDate: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString(), totalPrice: 450, status: 'confirmed', createdAt: new Date().toISOString(), renterName: "Alice Smith", renterEmail:"alice@example.com" },
  { id: 'booking2', userId: 'user2', carId: '2', agencyId: 'agency1', startDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(), endDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(), totalPrice: 360, status: 'pending', createdAt: new Date().toISOString(), renterName: "Bob Johnson", renterEmail:"bob@example.com" },
  { id: 'booking3', userId: 'user3', carId: '1', agencyId: 'agency1', startDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(), endDate: new Date(new Date().setDate(new Date().getDate() + 12)).toISOString(), totalPrice: 450, status: 'confirmed', createdAt: new Date().toISOString(), renterName: "Carol White", renterEmail:"carol@example.com" },
  { id: 'booking4', userId: 'user4', carId: '3', agencyId: 'agency1', startDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), endDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), totalPrice: 720, status: 'completed', createdAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(), renterName: "David Green", renterEmail:"david@example.com"},
];

const MOCK_BLOCKED_PERIODS: BlockedPeriod[] = [
    { id: 'block1', carId: '1', startDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(), endDate: new Date(new Date().setDate(new Date().getDate() + 16)).toISOString(), reason: "Scheduled Maintenance", createdAt: new Date().toISOString() },
    { id: 'block2', carId: '2', startDate: new Date(new Date().setDate(new Date().getDate() + 20)).toISOString(), endDate: new Date(new Date().setDate(new Date().getDate() + 21)).toISOString(), reason: "Owner Use", createdAt: new Date().toISOString() },
    { id: 'block3', carId: 'all', startDate: new Date(new Date().setDate(new Date().getDate() + 25)).toISOString(), endDate: new Date(new Date().setDate(new Date().getDate() + 25)).toISOString(), reason: "Agency Holiday", createdAt: new Date().toISOString() },
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
      color: 'hsl(var(--primary-foreground))', // Changed to foreground for better contrast on light bg
      fontWeight: 'bold',
    },
    agencyBlocked: {
      backgroundColor: 'hsl(var(--muted) / 0.7)',
      color: 'hsl(var(--muted-foreground))',
      // textDecoration: 'line-through',
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


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <CalendarDaysIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Agency Calendar</h1>
        </div>
        <p className="text-muted-foreground">Manage your car bookings and availability.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="shadow-xl">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>
                  {selectedCarId === 'all' ? 'All Cars View' : `${getCarById(selectedCarId)?.make} ${getCarById(selectedCarId)?.model}`}
                </CardTitle>
                <div className="w-full sm:w-auto min-w-[200px]">
                  <Label htmlFor="car-filter" className="sr-only">Filter by Car</Label>
                  <Select value={selectedCarId} onValueChange={(value) => {
                      setSelectedCarId(value);
                      setSelectedDate(undefined); // Reset selected date on filter change
                      setSelectedBookings([]);
                      setSelectedBlockedPeriods([]);
                  }}>
                    <SelectTrigger id="car-filter">
                      <SelectValue placeholder="Filter by car..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cars</SelectItem>
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
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-lg sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <InfoIcon className="h-6 w-6 text-primary" />
                Details for {selectedDate ? format(selectedDate, 'PPP') : 'Selected Date'}
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
                          Booking ID: {booking.id.substring(0,8)} ({booking.status})
                        </AlertTitle>
                        <AlertDescription className="space-y-1 text-sm">
                          {car && (
                            <p className="flex items-center gap-1"><CarIcon className="h-4 w-4 text-muted-foreground" /> {car.make} {car.model}</p>
                          )}
                          <p className="flex items-center gap-1"><UsersIcon className="h-4 w-4 text-muted-foreground" /> {booking.renterName}</p>
                          <p className="flex items-center gap-1"><DollarSignIcon className="h-4 w-4 text-muted-foreground" /> ${booking.totalPrice.toFixed(2)}</p>
                          <p className="flex items-center gap-1"><CalendarDaysIcon className="h-4 w-4 text-muted-foreground" /> 
                            {format(parseISO(booking.startDate), 'MMM d')} - {format(parseISO(booking.endDate), 'MMM d, yyyy')}
                          </p>
                           <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                             <Link href={`/account/bookings/${booking.id}`}>View Details</Link>
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
                          Agency Blocked: {period.reason || "Unavailable"}
                        </AlertTitle>
                        <AlertDescription className="space-y-1 text-sm">
                          {car && period.carId !== 'all' && (
                            <p className="flex items-center gap-1"><CarIcon className="h-4 w-4 text-muted-foreground" /> {car.make} {car.model}</p>
                          )}
                          {period.carId === 'all' && (
                             <p className="flex items-center gap-1"><CarIcon className="h-4 w-4 text-muted-foreground" /> All Cars</p>
                          )}
                          <p className="flex items-center gap-1"><CalendarDaysIcon className="h-4 w-4 text-muted-foreground" /> 
                            {format(parseISO(period.startDate), 'MMM d')} - {format(parseISO(period.endDate), 'MMM d, yyyy')}
                          </p>
                           {period.reason === "Scheduled Maintenance" && <p className="flex items-center gap-1"><WrenchIcon className="h-4 w-4 text-muted-foreground" /> {period.reason}</p>}
                        </AlertDescription>
                      </Alert>
                    );
                  })}
                </div>
              ) : selectedDate ? (
                <p className="text-muted-foreground">No bookings or blocks for this car on this date.</p>
              ) : (
                <p className="text-muted-foreground">Select a date on the calendar to see booking details or car availability.</p>
              )}
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="text-lg">Manage Availability</CardTitle>
                <CardDescription>Block out dates when cars are unavailable for maintenance or other reasons.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button className="w-full" disabled>Block Dates (Coming Soon)</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgencyCalendarPage;

// Extend Booking type for mock data
declare module '@/types' {
  interface Booking {
    renterName?: string;
    renterEmail?: string;
  }
}
