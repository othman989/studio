
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BuildingIcon, MailIcon, PhoneIcon, UserIcon, MapPinIcon, CalendarIcon, ListChecksIcon, ShieldCheckIcon, Edit3Icon, BanIcon } from 'lucide-react';
import type { AdminAgency } from '@/types';
import { MOCK_ADMIN_AGENCIES } from '@/lib/constants';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export default function AgencyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const agencyId = params.id as string;

  const [agency, setAgency] = useState<AdminAgency | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundAgency = MOCK_ADMIN_AGENCIES.find(a => a.id === agencyId);
    if (foundAgency) {
      setAgency(foundAgency);
    }
    setLoading(false);
  }, [agencyId]);

  const handlePlaceholderAction = (actionName: string) => {
    toast({
      title: "Fonctionnalité à venir",
      description: `${actionName} pour l'agence ${agency?.name} sera bientôt disponible.`,
    });
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Chargement des détails de l'agence...</div>;
  }

  if (!agency) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-semibold mb-4">Agence non trouvée</h1>
        <Button asChild variant="outline">
          <Link href="/admin/agencies"><ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste des agences</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Button variant="outline" size="sm" asChild className="mb-6">
        <Link href="/admin/agencies">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste des agences
        </Link>
      </Button>

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BuildingIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">{agency.name}</h1>
        </div>
        <Badge variant={
            agency.status === 'Approuvée' ? 'default' :
            agency.status === 'En attente' ? 'secondary' : 'destructive'
            } className={`text-sm ${agency.status === 'Approuvée' ? 'bg-green-600 hover:bg-green-700' : ''}`}>
            Statut : {agency.status}
        </Badge>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Informations Générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center">
                <MailIcon className="h-5 w-5 mr-3 text-muted-foreground" />
                <p><span className="font-semibold">Email de contact :</span> {agency.contactEmail}</p>
              </div>
              {agency.agencyAddress && (
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-3 text-muted-foreground" />
                  <p><span className="font-semibold">Adresse :</span> {agency.agencyAddress}</p>
                </div>
              )}
              {agency.phoneNumber && (
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 mr-3 text-muted-foreground" />
                  <p><span className="font-semibold">Téléphone :</span> {agency.phoneNumber}</p>
                </div>
              )}
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-3 text-muted-foreground" />
                <p><span className="font-semibold">Créée le :</span> {format(parseISO(agency.createdAt), 'PPP', { locale: fr })}</p>
              </div>
               <div className="flex items-center">
                <ListChecksIcon className="h-5 w-5 mr-3 text-muted-foreground" />
                <p><span className="font-semibold">Nombre d'annonces :</span> {agency.listingsCount}</p>
              </div>
              {agency.description && (
                <>
                  <Separator className="my-3"/>
                  <p className="text-sm text-muted-foreground"><span className="font-semibold">Description :</span> {agency.description}</p>
                </>
              )}
            </CardContent>
          </Card>

          {agency.ownerName && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Propriétaire / Contact Principal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                 <div className="flex items-center">
                    <UserIcon className="h-5 w-5 mr-3 text-muted-foreground" />
                    <p><span className="font-semibold">Nom :</span> {agency.ownerName}</p>
                  </div>
                {agency.ownerEmail && (
                  <div className="flex items-center">
                    <MailIcon className="h-5 w-5 mr-3 text-muted-foreground" />
                    <p><span className="font-semibold">Email :</span> {agency.ownerEmail}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="md:col-span-1 space-y-4">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Actions Administrateur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline" onClick={() => handlePlaceholderAction("Modifier les informations de l'agence")}>
                <Edit3Icon className="mr-2 h-4 w-4" /> Modifier l'Agence
              </Button>
              <Button className="w-full" variant="outline" onClick={() => router.push(`/admin/agencies/${agency.id}/permissions`)}>
                <ShieldCheckIcon className="mr-2 h-4 w-4" /> Gérer les Permissions
              </Button>
               <Button 
                className="w-full" 
                variant={agency.status === 'Suspendue' ? 'default' : 'destructive'}
                onClick={() => handlePlaceholderAction(agency.status === 'Suspendue' ? "Réactiver l'agence" : "Suspendre l'agence")}
              >
                <BanIcon className="mr-2 h-4 w-4" /> 
                {agency.status === 'Suspendue' ? "Réactiver l'Agence" : "Suspendre l'Agence"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
