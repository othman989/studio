
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, UserIcon, MailIcon, PhoneIcon, FileTextIcon, CalendarDaysIcon, Edit3Icon, UserXIcon, UserCheckIcon, MapPinIcon, MessageSquareIcon } from 'lucide-react';
import type { ClientProfile } from '@/types';
import { MOCK_CLIENTS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function RenterDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const renterId = params.id as string;

  const [renter, setRenter] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBlacklistDialogOpen, setIsBlacklistDialogOpen] = useState(false);
  const [blacklistReasonInput, setBlacklistReasonInput] = useState("");

  useEffect(() => {
    const foundRenter = MOCK_CLIENTS.find(r => r.id === renterId);
    if (foundRenter) {
      setRenter(foundRenter);
    }
    setLoading(false);
  }, [renterId]);

  const handleToggleBlacklist = () => {
    if (!renter) return;

    if (!renter.isBlacklisted && !blacklistReasonInput.trim()) {
      toast({
        title: "Motif Requis",
        description: "Veuillez fournir un motif pour ajouter ce locataire à la liste noire.",
        variant: "destructive",
      });
      return;
    }

    const renterIndex = MOCK_CLIENTS.findIndex(r => r.id === renter.id);
    if (renterIndex !== -1) {
      const newBlacklistStatus = !MOCK_CLIENTS[renterIndex].isBlacklisted;
      MOCK_CLIENTS[renterIndex].isBlacklisted = newBlacklistStatus;
      MOCK_CLIENTS[renterIndex].blacklistReason = newBlacklistStatus ? blacklistReasonInput : undefined;
      
      setRenter({...MOCK_CLIENTS[renterIndex]}); // Update local state to re-render
      toast({
        title: `Statut du Locataire Mis à Jour`,
        description: `${renter.fullName} a été ${newBlacklistStatus ? 'ajouté à' : 'retiré de'} la liste noire.`,
      });
    }
    setIsBlacklistDialogOpen(false);
    setBlacklistReasonInput("");
  };

  const openBlacklistDialog = () => {
    if (!renter) return;
    setBlacklistReasonInput(renter.isBlacklisted ? renter.blacklistReason || "" : "");
    setIsBlacklistDialogOpen(true);
  };


  const handleContactRenter = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: `Contacter le locataire ${renter?.fullName} par message sera bientôt disponible.`,
    });
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Chargement des détails du locataire...</div>;
  }

  if (!renter) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-semibold mb-4">Locataire non trouvé</h1>
        <Button asChild variant="outline">
          <Link href="/admin/renters"><ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste des locataires</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Button variant="outline" size="sm" asChild className="mb-6">
        <Link href="/admin/renters">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste des locataires
        </Link>
      </Button>

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <UserIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">{renter.fullName}</h1>
        </div>
        {renter.isBlacklisted ? (
            <Badge variant={'destructive'} className="text-sm">Sur Liste Noire</Badge>
        ) : (
            <Badge variant={'default'} className="text-sm bg-green-600 hover:bg-green-700 text-primary-foreground">Actif</Badge>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Informations Personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center">
                <MailIcon className="h-5 w-5 mr-3 text-muted-foreground" />
                <p><span className="font-semibold">Email :</span> {renter.email}</p>
              </div>
              {renter.phone && (
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 mr-3 text-muted-foreground" />
                  <p><span className="font-semibold">Téléphone :</span> {renter.phone}</p>
                </div>
              )}
              {renter.licenseNumber && (
                <div className="flex items-center">
                  <FileTextIcon className="h-5 w-5 mr-3 text-muted-foreground" />
                  <p><span className="font-semibold">N° Permis :</span> {renter.licenseNumber}</p>
                </div>
              )}
              {renter.licenseIssueYear && (
                <div className="flex items-center">
                  <CalendarDaysIcon className="h-5 w-5 mr-3 text-muted-foreground" />
                  <p><span className="font-semibold">Année Permis :</span> {renter.licenseIssueYear}</p>
                </div>
              )}
               {renter.address && (
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-3 text-muted-foreground" />
                  <p><span className="font-semibold">Adresse :</span> {renter.address}</p>
                </div>
              )}
               {renter.notes && (
                <p className="text-sm text-muted-foreground"><span className="font-semibold">Notes Administrateur :</span> {renter.notes}</p>
              )}
              {renter.isBlacklisted && renter.blacklistReason && (
                 <div className="pt-2">
                    <p className="font-semibold text-destructive">Motif de la liste noire :</p>
                    <p className="text-sm text-destructive p-2 border border-destructive/30 rounded-md bg-destructive/10">{renter.blacklistReason}</p>
                 </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
             <CardHeader>
                <CardTitle>Historique des Réservations</CardTitle>
             </CardHeader>
             <CardContent>
                <p className="text-muted-foreground">L'historique des réservations pour {renter.fullName} sera affiché ici (fonctionnalité à venir).</p>
             </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-4">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Actions Administrateur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline" onClick={() => router.push(`/admin/renters/${renter.id}/edit`)}>
                <Edit3Icon className="mr-2 h-4 w-4" /> Modifier les Infos
              </Button>
              <Button 
                className="w-full" 
                variant={renter.isBlacklisted ? 'default' : 'destructive'} 
                onClick={openBlacklistDialog}
              >
                {renter.isBlacklisted ? (
                  <UserCheckIcon className="mr-2 h-4 w-4" />
                ) : (
                  <UserXIcon className="mr-2 h-4 w-4" />
                )}
                {renter.isBlacklisted ? "Retirer de la liste noire" : "Ajouter à la liste noire"}
              </Button>
               <Button className="w-full" variant="outline" onClick={handleContactRenter}>
                <MessageSquareIcon className="mr-2 h-4 w-4" /> Envoyer un Message
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Blacklist Dialog */}
      <AlertDialog open={isBlacklistDialogOpen} onOpenChange={(open) => {
          setIsBlacklistDialogOpen(open);
          if (!open) setBlacklistReasonInput(""); 
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer l'Action : {renter?.fullName}</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir {renter?.isBlacklisted ? 'retirer' : 'ajouter'} "{renter?.fullName}" {renter?.isBlacklisted ? 'de la' : 'à la'} liste noire ?
            </AlertDialogDescription>
          </AlertDialogHeader>
           {!renter?.isBlacklisted && (
            <div className="space-y-2 py-2">
              <Label htmlFor="blacklistReasonDialog" className="text-sm font-medium">
                Motif de la mise sur liste noire (obligatoire) :
              </Label>
              <Textarea
                id="blacklistReasonDialog"
                value={blacklistReasonInput}
                onChange={(e) => setBlacklistReasonInput(e.target.value)}
                placeholder="Expliquez pourquoi ce locataire est mis sur liste noire..."
                rows={3}
              />
            </div>
          )}
          {renter?.isBlacklisted && renter.blacklistReason && (
             <div className="py-2 text-sm">
                <p className="font-semibold">Motif actuel de la liste noire :</p>
                <p className="text-muted-foreground p-2 border rounded-md bg-muted/50">{renter.blacklistReason}</p>
             </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleToggleBlacklist} 
              className={renter?.isBlacklisted ? '' : buttonVariants({variant: "destructive"})}
            >
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
