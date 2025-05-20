
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookMarkedIcon, CarIcon, UserIcon, CalendarRangeIcon, DollarSignIcon, BuildingIcon, TagIcon, CheckCircle2Icon, XCircleIcon, MailIcon } from 'lucide-react';
import type { Booking, Car, ClientProfile } from '@/types'; 
import { MOCK_BOOKINGS, SAMPLE_CARS, MOCK_CLIENTS } from '@/lib/constants';
import { format, parseISO, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
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


export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [car, setCar] = useState<Car | null>(null);
  const [renter, setRenter] = useState<ClientProfile | { fullName: string; email: string; } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  useEffect(() => {
    const foundBooking = MOCK_BOOKINGS.find(b => b.id === bookingId);
    if (foundBooking) {
      setBooking(foundBooking);
      const foundCar = SAMPLE_CARS.find(c => c.id === foundBooking.carId);
      setCar(foundCar || null);
      
      const foundClient = MOCK_CLIENTS.find(client => client.id === (foundBooking.clientId || foundBooking.userId));
      if (foundClient) {
        setRenter(foundClient);
      } else if (foundBooking.renterName && foundBooking.renterEmail) {
        setRenter({ fullName: foundBooking.renterName, email: foundBooking.renterEmail });
      }
    }
    setLoading(false);
  }, [bookingId]);

  const updateBookingStatus = (newStatus: Booking['status']) => {
    if (!booking) return;
    const bookingIndex = MOCK_BOOKINGS.findIndex(b => b.id === booking.id);
    if (bookingIndex !== -1) {
      MOCK_BOOKINGS[bookingIndex].status = newStatus;
      setBooking({...MOCK_BOOKINGS[bookingIndex]}); 
      toast({
        title: `Réservation ${newStatus === 'cancelled' ? 'Annulée' : 'Confirmée'}`,
        description: `La réservation ${booking.id} a été ${newStatus === 'cancelled' ? 'annulée' : 'confirmée'}.`,
        variant: newStatus === 'cancelled' ? "destructive" : "default",
      });
    }
  };

  const handleOpenCancelDialog = () => setIsCancelDialogOpen(true);
  const handleConfirmCancelBooking = () => {
    updateBookingStatus('cancelled');
    setIsCancelDialogOpen(false);
  };
  
  const handleOpenConfirmDialog = () => setIsConfirmDialogOpen(true);
  const handleConfirmBooking = () => {
    updateBookingStatus('confirmed');
    setIsConfirmDialogOpen(false);
  };

  const handleContactAction = (target: 'Locataire' | 'Agence') => {
    toast({
      title: "Fonctionnalité à venir",
      description: `Contacter ${target === 'Locataire' ? (renter as ClientProfile)?.fullName || 'le locataire' : car?.agencyName || "l'agence"} sera bientôt disponible.`,
    });
  };

  const getStatusBadgeVariant = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed': return 'default'; 
      case 'pending': return 'secondary'; 
      case 'completed': return 'outline';
      case 'cancelled':
      case 'declined': return 'destructive'; 
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


  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Chargement des détails de la réservation...</div>;
  }

  if (!booking || !car) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-semibold mb-4">Réservation non trouvée</h1>
        <Button asChild variant="outline">
          <Link href="/admin/bookings"><ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste des réservations</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Button variant="outline" size="sm" asChild className="mb-6">
        <Link href="/admin/bookings">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste des réservations
        </Link>
      </Button>

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BookMarkedIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Détails de la Réservation #{booking.id}</h1>
        </div>
         <Badge variant={getStatusBadgeVariant(booking.status)} className={getStatusBadgeClass(booking.status)}>
            Statut : {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </Badge>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CalendarRangeIcon className="h-6 w-6 text-primary"/>Informations de Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><span className="font-semibold">Début :</span> {format(parseISO(booking.startDate), 'PPPP p', { locale: fr })}</p>
              <p><span className="font-semibold">Fin :</span> {format(parseISO(booking.endDate), 'PPPP p', { locale: fr })}</p>
              <p><span className="font-semibold">Durée :</span> {Math.max(1, differenceInDays(parseISO(booking.endDate), parseISO(booking.startDate)) +1 )} jours</p>
              <Separator className="my-3"/>
              <p className="text-lg"><span className="font-semibold">Prix Total :</span> <span className="text-accent font-bold">{booking.totalPrice.toFixed(2)} MAD</span></p>
              <p className="text-xs text-muted-foreground">Réservé le : {format(parseISO(booking.createdAt), 'PPP p', { locale: fr })}</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CarIcon className="h-6 w-6 text-primary"/>Voiture Louée</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><span className="font-semibold">Modèle :</span> {car.make} {car.model} ({car.year})</p>
              <p><span className="font-semibold">Type :</span> {car.type}</p>
              <p><span className="font-semibold">Lieu de prise en charge :</span> {car.location}</p>
              <p><span className="font-semibold">Agence :</span> {car.agencyName || booking.agencyId}</p>
               <Button variant="outline" size="sm" asChild className="mt-2">
                <Link href={`/cars/${car.id}`}>Voir l'Annonce de la Voiture</Link>
               </Button>
            </CardContent>
          </Card>
          
          {renter && (
            <Card className="shadow-lg">
                <CardHeader>
                <CardTitle className="flex items-center gap-2"><UserIcon className="h-6 w-6 text-primary"/>Informations du Locataire</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                <p><span className="font-semibold">Nom :</span> {renter.fullName}</p>
                <p><span className="font-semibold">Email :</span> {renter.email}</p>
                {(renter as ClientProfile).phone && <p><span className="font-semibold">Téléphone :</span> {(renter as ClientProfile).phone}</p>}
                {(renter as ClientProfile).licenseNumber && <p><span className="font-semibold">N° Permis :</span> {(renter as ClientProfile).licenseNumber}</p>}
                 <Button variant="outline" size="sm" asChild className="mt-2">
                    <Link href={`/admin/renters/${(renter as ClientProfile).id || booking.userId}`}>Voir Profil Locataire</Link>
                 </Button>
                </CardContent>
            </Card>
          )}
        </div>

        <div className="md:col-span-1 space-y-4">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Actions Admin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(booking.status === 'pending' || booking.status === 'confirmed') && (
                <Button className="w-full" variant="destructive" onClick={handleOpenCancelDialog}>
                  <XCircleIcon className="mr-2 h-4 w-4" /> Annuler la Réservation
                </Button>
              )}
              {booking.status === 'pending' && (
                 <Button className="w-full" variant="default" onClick={handleOpenConfirmDialog}>
                  <CheckCircle2Icon className="mr-2 h-4 w-4" /> Confirmer la Réservation
                </Button>
              )}
              <Button className="w-full" variant="outline" onClick={() => handleContactAction('Locataire')}>
                <MailIcon className="mr-2 h-4 w-4" /> Contacter le Locataire
              </Button>
               <Button className="w-full" variant="outline" onClick={() => handleContactAction('Agence')}>
                <BuildingIcon className="mr-2 h-4 w-4" /> Contacter l'Agence
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cancel Booking Dialog */}
      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer l'Annulation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir annuler cette réservation ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Non</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancelBooking} className={buttonVariants({variant: "destructive"})}>
              Oui, Annuler
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirm Booking Dialog */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la Réservation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir confirmer cette réservation ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Non</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmBooking}>
              Oui, Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
