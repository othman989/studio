"use client"; // This page will involve client-side form handling

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { SAMPLE_CARS as ALL_CARS } from '@/lib/constants';
import type { Car, Booking } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, DollarSign, User, Mail, Phone, ArrowLeft, CheckCircle } from 'lucide-react';
import { format, differenceInDays, addDays } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import type { DateRange } from "react-day-picker"


async function getCarDetails(id: string): Promise<Car | undefined> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 50));
  return ALL_CARS.find(car => car.id === id);
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const carId = params.id as string;

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 3),
  });
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const [totalPrice, setTotalPrice] = useState(0);
  const [numberOfDays, setNumberOfDays] = useState(0);

  useEffect(() => {
    if (carId) {
      getCarDetails(carId).then(data => {
        if (data) {
          setCar(data);
        }
        setLoading(false);
      });
    }
  }, [carId]);

  useEffect(() => {
    if (car && dateRange?.from && dateRange?.to) {
      const days = differenceInDays(dateRange.to, dateRange.from) + 1;
      setNumberOfDays(days > 0 ? days : 0);
      setTotalPrice(days > 0 ? days * car.pricePerDay : 0);
    } else {
      setNumberOfDays(0);
      setTotalPrice(0);
    }
  }, [car, dateRange]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!car || !dateRange?.from || !dateRange?.to) {
        toast({ title: "Error", description: "Please select valid dates and ensure car details are loaded.", variant: "destructive" });
        return;
    }
    
    setSubmitting(true);

    // Simulate API call for booking
    await new Promise(resolve => setTimeout(resolve, 1500));

    const bookingData: Partial<Booking> = {
      userId: 'current_user_id', // Replace with actual user ID
      carId: car.id,
      agencyId: car.agencyId || 'default_agency_id', // Replace with actual agency ID
      startDate: dateRange.from.toISOString(),
      endDate: dateRange.to.toISOString(),
      totalPrice,
      status: 'pending', // Initial status
    };
    
    console.log('Booking Submitted:', bookingData);
    // In a real app, you would send this data to your backend.

    setSubmitting(false);
    toast({
      title: "Booking Request Sent!",
      description: `Your request for the ${car.make} ${car.model} has been submitted. The agency will contact you shortly.`,
      action: <CheckCircle className="text-green-500" />,
    });
    // Potentially redirect to a confirmation page or user's bookings page
    router.push(`/cars/${car.id}?booking=success`); 
  };
  
  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading car details...</div>;
  }

  if (!car) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Car Not Found</h1>
        <p className="text-muted-foreground mb-6">The car you are trying to book is not available.</p>
        <Button asChild>
          <Link href="/cars">Back to Listings</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Button variant="outline" size="sm" asChild className="mb-6">
        <Link href={`/cars/${car.id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Car Details
        </Link>
      </Button>

      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Book Your Ride</h1>
      <p className="text-lg text-muted-foreground mb-8">Complete the form below to request a booking for the {car.make} {car.model}.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Car Summary and Price Details */}
        <div className="lg:col-span-1 order-last lg:order-first">
          <Card className="shadow-lg sticky top-24">
            <CardHeader className="p-0">
              <Image
                src={car.imageUrl}
                alt={`${car.make} ${car.model}`}
                width={600}
                height={400}
                className="object-cover w-full h-48 rounded-t-lg"
                data-ai-hint={`${car.type} ${car.make}`}
              />
            </CardHeader>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-1">{car.make} {car.model}</h2>
              <p className="text-md text-muted-foreground mb-4">{car.year} &bull; {car.type}</p>
              
              <Separator className="my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price per day:</span>
                  <span className="font-medium">${car.pricePerDay.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Selected dates:</span>
                  <span className="font-medium text-right">
                    {dateRange?.from ? format(dateRange.from, "LLL dd, y") : "Pick a start date"} - <br/>
                    {dateRange?.to ? format(dateRange.to, "LLL dd, y") : "Pick an end date"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Number of days:</span>
                  <span className="font-medium">{numberOfDays}</span>
                </div>
              </div>

              <Separator className="my-4" />
              
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Price:</span>
                <div className="flex items-baseline text-accent">
                  <DollarSign className="h-5 w-5" />
                  <span className="text-2xl font-bold">{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Form */}
        <div className="lg:col-span-2">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Your Information</CardTitle>
              <CardDescription>Please provide your details to complete the booking request.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="dates" className="block text-sm font-medium mb-1">Rental Dates</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="dates"
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal h-12"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y")} -{" "}
                              {format(dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) } // Disable past dates
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fullName" className="flex items-center gap-1 mb-1"><User className="h-4 w-4 text-muted-foreground"/>Full Name</Label>
                    <Input id="fullName" type="text" placeholder="e.g. John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="h-11" />
                  </div>
                  <div>
                    <Label htmlFor="email" className="flex items-center gap-1 mb-1"><Mail className="h-4 w-4 text-muted-foreground"/>Email Address</Label>
                    <Input id="email" type="email" placeholder="e.g. john.doe@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required  className="h-11"/>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phone" className="flex items-center gap-1 mb-1"><Phone className="h-4 w-4 text-muted-foreground"/>Phone Number (Optional)</Label>
                  <Input id="phone" type="tel" placeholder="e.g. (555) 123-4567" value={phone} onChange={(e) => setPhone(e.target.value)}  className="h-11"/>
                </div>

                <div>
                  <Label htmlFor="message" className="mb-1">Message to Agency (Optional)</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Any special requests or questions for the rental agency?" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                </div>
                
                <Button type="submit" size="lg" className="w-full" disabled={submitting || !dateRange?.from || !dateRange?.to}>
                  {submitting ? 'Submitting Request...' : 'Send Booking Request'}
                </Button>
              </form>
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground">
                    By submitting this request, you agree to our Terms of Service and Privacy Policy.
                    The rental agency will contact you to confirm availability and payment.
                </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
