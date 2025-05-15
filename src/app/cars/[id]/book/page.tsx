
"use client";

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
import { Calendar as CalendarIcon, User, Mail, Phone, ArrowLeft, CheckCircle } from 'lucide-react'; // Removed DollarSign
import { Separator } from '@/components/ui/separator';
import { format, differenceInDays, addDays } from 'date-fns';
import { fr } from 'date-fns/locale'; 
import { useToast } from "@/hooks/use-toast";
import type { DateRange } from "react-day-picker"


async function getCarDetails(id: string): Promise<Car | undefined> {
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
        toast({ title: "Erreur", description: "Veuillez sélectionner des dates valides et vous assurer que les détails de la voiture sont chargés.", variant: "destructive" });
        return;
    }
    
    setSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const bookingData: Partial<Booking> = {
      userId: 'current_user_id', 
      carId: car.id,
      agencyId: car.agencyId || 'default_agency_id',
      startDate: dateRange.from.toISOString(),
      endDate: dateRange.to.toISOString(),
      totalPrice,
      status: 'pending', 
      renterName: fullName, // Assuming this page is for renters
      renterEmail: email,
    };
    
    console.log('Réservation Soumise :', bookingData);

    setSubmitting(false);
    toast({
      title: "Demande de Réservation Envoyée !",
      description: `Votre demande pour la ${car.make} ${car.model} a été soumise. L'agence vous contactera sous peu.`,
      action: <CheckCircle className="text-green-500" />,
    });
    router.push(`/cars/${car.id}?booking=success`); 
  };
  
  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Chargement des détails de la voiture...</div>;
  }

  if (!car) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Voiture Non Trouvée</h1>
        <p className="text-muted-foreground mb-6">La voiture que vous essayez de réserver n'est pas disponible.</p>
        <Button asChild>
          <Link href="/cars">Retour aux Annonces</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Button variant="outline" size="sm" asChild className="mb-6">
        <Link href={`/cars/${car.id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux Détails de la Voiture
        </Link>
      </Button>

      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Réservez Votre Voiture</h1>
      <p className="text-lg text-muted-foreground mb-8">Complétez le formulaire ci-dessous pour demander une réservation pour la {car.make} {car.model}.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
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
                  <span className="text-muted-foreground">Prix par jour :</span>
                  <span className="font-medium">{car.pricePerDay.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dates sélectionnées :</span>
                  <span className="font-medium text-right">
                    {dateRange?.from ? format(dateRange.from, "dd LLL, y", { locale: fr }) : "Choisissez une date de début"} - <br/>
                    {dateRange?.to ? format(dateRange.to, "dd LLL, y", { locale: fr }) : "Choisissez une date de fin"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nombre de jours :</span>
                  <span className="font-medium">{numberOfDays}</span>
                </div>
              </div>

              <Separator className="my-4" />
              
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Prix Total :</span>
                <div className="flex items-baseline text-accent">
                  <span className="text-2xl font-bold">{totalPrice.toFixed(2)}</span>
                  <span className="ml-1">€</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Vos Informations</CardTitle>
              <CardDescription>Veuillez fournir vos détails pour compléter la demande de réservation.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="dates" className="block text-sm font-medium mb-1">Dates de Location</Label>
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
                              {format(dateRange.from, "dd LLL, y", { locale: fr })} -{" "}
                              {format(dateRange.to, "dd LLL, y", { locale: fr })}
                            </>
                          ) : (
                            format(dateRange.from, "dd LLL, y", { locale: fr })
                          )
                        ) : (
                          <span>Choisissez une période</span>
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
                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) } 
                        locale={fr}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fullName" className="flex items-center gap-1 mb-1"><User className="h-4 w-4 text-muted-foreground"/>Nom Complet</Label>
                    <Input id="fullName" type="text" placeholder="ex. Jean Dupont" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="h-11" />
                  </div>
                  <div>
                    <Label htmlFor="email" className="flex items-center gap-1 mb-1"><Mail className="h-4 w-4 text-muted-foreground"/>Adresse E-mail</Label>
                    <Input id="email" type="email" placeholder="ex. jean.dupont@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required  className="h-11"/>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phone" className="flex items-center gap-1 mb-1"><Phone className="h-4 w-4 text-muted-foreground"/>Numéro de Téléphone (Optionnel)</Label>
                  <Input id="phone" type="tel" placeholder="ex. 01 23 45 67 89" value={phone} onChange={(e) => setPhone(e.target.value)}  className="h-11"/>
                </div>

                <div>
                  <Label htmlFor="message" className="mb-1">Message à l'Agence (Optionnel)</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Des demandes spéciales ou questions pour l'agence de location ?" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                </div>
                
                <Button type="submit" size="lg" className="w-full" disabled={submitting || !dateRange?.from || !dateRange?.to}>
                  {submitting ? 'Envoi en cours...' : 'Envoyer la Demande de Réservation'}
                </Button>
              </form>
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground">
                    En soumettant cette demande, vous acceptez nos Conditions d'Utilisation et notre Politique de Confidentialité.
                    L'agence de location vous contactera pour confirmer la disponibilité et le paiement.
                </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
