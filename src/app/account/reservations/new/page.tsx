
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CarIcon, UserIcon, UsersIcon, CalendarIcon as LucideCalendarIcon, DollarSignIcon, InfoIcon, FileTextIcon, PhoneIcon, MailIcon, Check, ChevronsUpDown } from 'lucide-react';
import { APP_NAME, SAMPLE_CARS } from '@/lib/constants';
import type { Car, ClientProfile, Booking } from '@/types';
import { format, differenceInDays, addDays, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

const MOCK_CLIENTS: ClientProfile[] = [
    { id: 'client1', fullName: 'Alice Dupont', email: 'alice.d@example.com', phone: '0612345678', licenseNumber: 'AB123456', licenseIssueYear: 2018, agencyId: 'agency1', createdAt: new Date().toISOString() },
    { id: 'client2', fullName: 'Bob Martin', email: 'bob.m@example.com', phone: '0787654321', licenseNumber: 'CD654321', licenseIssueYear: 2015, agencyId: 'agency1', createdAt: new Date().toISOString() },
    { id: 'client3', fullName: 'Carole Petit', email: 'carole.p@example.com', phone: '0600112233', licenseNumber: 'EF789012', licenseIssueYear: 2020, agencyId: 'agency1', createdAt: new Date().toISOString() },
];

export default function NewReservationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [agencyCars] = useState<Car[]>(SAMPLE_CARS.filter(c => c.agencyId === 'agency1' || c.agencyId === 'agency2')); 
  const [existingClients, setExistingClients] = useState<ClientProfile[]>(MOCK_CLIENTS);

  const [selectedCarId, setSelectedCarId] = useState<string>('');
  const [clientType, setClientType] = useState<'existing' | 'new'>('existing');
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [rentalDates, setRentalDates] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 3),
  });

  // New Client Form State
  const [newClientFullName, setNewClientFullName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientLicenseNumber, setNewClientLicenseNumber] = useState('');
  const [newClientLicenseIssueYear, setNewClientLicenseIssueYear] = useState<number | ''>('');
  const [newClientNotes, setNewClientNotes] = useState('');

  // Combobox state
  const [openCombobox, setOpenCombobox] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedCar = useMemo(() => agencyCars.find(car => car.id === selectedCarId), [agencyCars, selectedCarId]);
  
  const numberOfDays = useMemo(() => {
    if (rentalDates?.from && rentalDates?.to) {
      const days = differenceInDays(rentalDates.to, rentalDates.from) + 1;
      return days > 0 ? days : 0;
    }
    return 0;
  }, [rentalDates]);

  const totalPrice = useMemo(() => {
    if (selectedCar && numberOfDays > 0) {
      return selectedCar.pricePerDay * numberOfDays;
    }
    return 0;
  }, [selectedCar, numberOfDays]);

  const filteredClients = useMemo(() => {
    if (!searchQuery) return existingClients;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return existingClients.filter(client => 
      client.fullName.toLowerCase().includes(lowerCaseQuery) ||
      (client.licenseNumber && client.licenseNumber.toLowerCase().includes(lowerCaseQuery)) ||
      client.fullName.toLowerCase().split(' ').some(part => part.includes(lowerCaseQuery)) // Basic last name check
    );
  }, [searchQuery, existingClients]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    if (!selectedCarId || (!rentalDates?.from || !rentalDates?.to)) {
      toast({ title: "Champs Manquants", description: "Veuillez sélectionner une voiture et des dates de location.", variant: "destructive" });
      setSubmitting(false);
      return;
    }

    let finalClientId = selectedClientId;
    let clientNameForToast = '';

    if (clientType === 'new') {
      if (!newClientFullName || !newClientEmail || !newClientLicenseNumber || !newClientLicenseIssueYear) {
        toast({ title: "Détails du Nouveau Client Manquants", description: "Veuillez remplir tous les champs obligatoires pour le nouveau client.", variant: "destructive" });
        setSubmitting(false);
        return;
      }
      const newClient: ClientProfile = {
        id: `client-${Date.now()}`,
        fullName: newClientFullName,
        email: newClientEmail,
        phone: newClientPhone,
        licenseNumber: newClientLicenseNumber,
        licenseIssueYear: Number(newClientLicenseIssueYear),
        notes: newClientNotes,
        agencyId: selectedCar?.agencyId || 'agency1', 
        createdAt: new Date().toISOString(),
      };
      console.log("Création d'un nouveau client simulée :", newClient);
      setExistingClients(prev => [...prev, newClient]); 
      finalClientId = newClient.id;
      clientNameForToast = newClient.fullName;
    } else {
        if(!selectedClientId) {
            toast({ title: "Client Manquant", description: "Veuillez sélectionner un client existant.", variant: "destructive" });
            setSubmitting(false);
            return;
        }
        clientNameForToast = existingClients.find(c => c.id === selectedClientId)?.fullName || 'Client';
    }
    
    const newBooking: Partial<Booking> = {
        carId: selectedCarId,
        clientId: finalClientId,
        agencyId: selectedCar?.agencyId || 'agency1',
        startDate: rentalDates.from.toISOString(),
        endDate: rentalDates.to.toISOString(),
        totalPrice: totalPrice,
        status: 'confirmed', 
        createdAt: new Date().toISOString(),
    };

    console.log('Nouvelle Réservation (Agence) Soumise :', newBooking);
    await new Promise(resolve => setTimeout(resolve, 1500));

    setSubmitting(false);
    toast({
      title: "Réservation Créée !",
      description: `La réservation pour ${clientNameForToast} avec ${selectedCar?.make} ${selectedCar?.model} a été créée.`,
    });
    router.push('/account/calendar'); 
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Button variant="outline" size="sm" asChild className="mb-6">
        <Link href="/account/dashboard"> 
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour au Tableau de Bord
        </Link>
      </Button>

      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <LucideCalendarIcon className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-bold">Créer une Nouvelle Réservation</CardTitle>
          </div>
          <CardDescription>Entrez les détails pour créer une nouvelle réservation pour un client.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section Sélection Voiture */}
            <section>
              <h3 className="text-xl font-semibold mb-4 border-b pb-2 flex items-center gap-2"><CarIcon className="h-5 w-5 text-primary"/>Sélection de la Voiture</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="car" className="mb-1">Voiture *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openCombobox}
                        className="w-full justify-between h-10"
                      >
                        {selectedCarId
                          ? agencyCars.find((car) => car.id === selectedCarId)?.make + " " + agencyCars.find((car) => car.id === selectedCarId)?.model
                          : "Choisissez une voiture..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Rechercher une voiture..." />
                        <CommandList>
                          <CommandEmpty>Aucune voiture trouvée.</CommandEmpty>
                          <CommandGroup>
                            {agencyCars.map((car) => (
                              <CommandItem
                                key={car.id}
                                value={`${car.make} ${car.model} ${car.year} ${car.id}`}
                                onSelect={() => {
                                  setSelectedCarId(car.id === selectedCarId ? "" : car.id);
                                  setOpenCombobox(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedCarId === car.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {car.make} {car.model} ({car.year}) - {car.pricePerDay}€/jour
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </section>

            {/* Section Informations Client */}
            <section>
              <h3 className="text-xl font-semibold mb-4 border-b pb-2 flex items-center gap-2"><UsersIcon className="h-5 w-5 text-primary"/>Informations Client</h3>
              <RadioGroup defaultValue="existing" value={clientType} onValueChange={(value) => setClientType(value as 'existing' | 'new')} className="mb-4 flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="existing" id="existingClient" />
                  <Label htmlFor="existingClient" className="cursor-pointer">Client Existant</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new" id="newClient" />
                  <Label htmlFor="newClient" className="cursor-pointer">Nouveau Client</Label>
                </div>
              </RadioGroup>

              {clientType === 'existing' && (
                <div>
                  <Label htmlFor="existingClientSelect" className="mb-1">Sélectionner Client *</Label>
                  <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openCombobox}
                        className="w-full justify-between h-10"
                      >
                        {selectedClientId
                          ? existingClients.find((client) => client.id === selectedClientId)?.fullName
                          : "Choisissez un client existant..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput 
                            placeholder="Rechercher (nom, N° permis)..." 
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                        />
                        <CommandList>
                          <CommandEmpty>Aucun client trouvé.</CommandEmpty>
                          <CommandGroup>
                            {filteredClients.map((client) => (
                              <CommandItem
                                key={client.id}
                                value={`${client.fullName} ${client.licenseNumber || ''} ${client.id}`}
                                onSelect={() => {
                                  setSelectedClientId(client.id === selectedClientId ? "" : client.id);
                                  setOpenCombobox(false);
                                  setSearchQuery("");
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedClientId === client.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {client.fullName} ({client.email}) {client.licenseNumber && `- ${client.licenseNumber}`}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {clientType === 'new' && (
                <div className="space-y-4 p-4 border rounded-md bg-muted/30">
                  <h4 className="text-md font-medium">Détails du Nouveau Client</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="newClientFullName" className="mb-1 flex items-center gap-1"><UserIcon className="h-4 w-4 text-muted-foreground"/>Nom Complet *</Label>
                      <Input id="newClientFullName" value={newClientFullName} onChange={e => setNewClientFullName(e.target.value)} placeholder="ex. Jean Dupont" required />
                    </div>
                    <div>
                      <Label htmlFor="newClientEmail" className="mb-1 flex items-center gap-1"><MailIcon className="h-4 w-4 text-muted-foreground"/>Adresse E-mail *</Label>
                      <Input id="newClientEmail" type="email" value={newClientEmail} onChange={e => setNewClientEmail(e.target.value)} placeholder="ex. jean@example.com" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="newClientPhone" className="mb-1 flex items-center gap-1"><PhoneIcon className="h-4 w-4 text-muted-foreground"/>Téléphone</Label>
                      <Input id="newClientPhone" type="tel" value={newClientPhone} onChange={e => setNewClientPhone(e.target.value)} placeholder="ex. 0612345678" />
                    </div>
                    <div>
                        <Label htmlFor="newClientLicenseNumber" className="mb-1 flex items-center gap-1"><FileTextIcon className="h-4 w-4 text-muted-foreground"/>N° Permis de Conduire *</Label>
                        <Input id="newClientLicenseNumber" value={newClientLicenseNumber} onChange={e => setNewClientLicenseNumber(e.target.value)} placeholder="ex. 12AB34567" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="newClientLicenseIssueYear" className="mb-1 flex items-center gap-1"><LucideCalendarIcon className="h-4 w-4 text-muted-foreground"/>Année Émission Permis *</Label>
                    <Input id="newClientLicenseIssueYear" type="number" value={newClientLicenseIssueYear} onChange={e => setNewClientLicenseIssueYear(Number(e.target.value))} placeholder="ex. 2015" required min="1900" max={new Date().getFullYear()} />
                  </div>
                  <div>
                    <Label htmlFor="newClientNotes" className="mb-1 flex items-center gap-1"><InfoIcon className="h-4 w-4 text-muted-foreground"/>Notes (Optionnel)</Label>
                    <Textarea id="newClientNotes" value={newClientNotes} onChange={e => setNewClientNotes(e.target.value)} placeholder="Notes additionnelles sur le client..." />
                  </div>
                </div>
              )}
            </section>

            {/* Section Dates et Prix */}
            <section>
              <h3 className="text-xl font-semibold mb-4 border-b pb-2 flex items-center gap-2"><LucideCalendarIcon className="h-5 w-5 text-primary"/>Dates de Location & Prix</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div>
                  <Label htmlFor="rentalDates" className="block text-sm font-medium mb-1">Dates de Location *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button id="rentalDates" variant={"outline"} className="w-full justify-start text-left font-normal h-10">
                        <LucideCalendarIcon className="mr-2 h-4 w-4" />
                        {rentalDates?.from ? (
                          rentalDates.to ? (
                            <>
                              {format(rentalDates.from, "dd LLL, y", { locale: fr })} -{" "}
                              {format(rentalDates.to, "dd LLL, y", { locale: fr })}
                            </>
                          ) : (
                            format(rentalDates.from, "dd LLL, y", { locale: fr })
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
                        defaultMonth={rentalDates?.from}
                        selected={rentalDates}
                        onSelect={setRentalDates}
                        numberOfMonths={2}
                        disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1))} 
                        locale={fr}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                {selectedCar && rentalDates?.from && rentalDates?.to && (
                  <Card className="p-4 bg-muted/50">
                    <CardTitle className="text-lg mb-2">Récapitulatif du Prix</CardTitle>
                    <div className="space-y-1 text-sm">
                      <p>Voiture: {selectedCar.make} {selectedCar.model}</p>
                      <p>Prix par jour: {selectedCar.pricePerDay.toFixed(2)}€</p>
                      <p>Nombre de jours: {numberOfDays}</p>
                      <p className="font-semibold text-md mt-2">Total Estimé: {totalPrice.toFixed(2)}€</p>
                    </div>
                  </Card>
                )}
              </div>
            </section>
            
            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? 'Création en cours...' : 'Créer la Réservation'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">
                La fonction d'évaluation du client après la location sera disponible ultérieurement.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}


