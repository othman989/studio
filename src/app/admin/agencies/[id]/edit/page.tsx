
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Building, Mail, User, Phone, MapPin, Edit3Icon, Save } from 'lucide-react';
import { MOCK_ADMIN_AGENCIES } from '@/lib/constants';
import type { AdminAgency } from '@/types';

export default function AdminEditAgencyPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const agencyId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [initialAgencyData, setInitialAgencyData] = useState<AdminAgency | null>(null);

  // Form state
  const [agencyName, setAgencyName] = useState('');
  const [agencyEmail, setAgencyEmail] = useState('');
  const [agencyAddress, setAgencyAddress] = useState('');
  const [agencyDescription, setAgencyDescription] = useState('');
  const [agencyPhoneNumber, setAgencyPhoneNumber] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  

  useEffect(() => {
    if (agencyId) {
      const agencyToEdit = MOCK_ADMIN_AGENCIES.find(agency => agency.id === agencyId);
      if (agencyToEdit) {
        setInitialAgencyData(agencyToEdit);
        setAgencyName(agencyToEdit.name);
        setAgencyEmail(agencyToEdit.contactEmail);
        setAgencyAddress(agencyToEdit.agencyAddress || '');
        setAgencyDescription(agencyToEdit.description || '');
        setAgencyPhoneNumber(agencyToEdit.phoneNumber || '');
        setOwnerName(agencyToEdit.ownerName || '');
        setOwnerEmail(agencyToEdit.ownerEmail || '');
      } else {
        toast({ title: "Agence non trouvée", description: "Impossible de trouver les détails de l'agence à modifier.", variant: "destructive" });
        router.push('/admin/agencies');
      }
      setLoading(false);
    }
  }, [agencyId, router, toast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    if (!agencyName || !agencyEmail || !ownerName || !ownerEmail) {
      toast({ title: "Champs Obligatoires Manquants", description: "Veuillez remplir tous les champs marqués d'un *.", variant: "destructive" });
      setSubmitting(false);
      return;
    }

    const agencyIndex = MOCK_ADMIN_AGENCIES.findIndex(agency => agency.id === agencyId);
    if (agencyIndex === -1) {
        toast({ title: "Erreur", description: "Agence non trouvée pour la mise à jour.", variant: "destructive" });
        setSubmitting(false);
        return;
    }
    
    const updatedAgencyData: AdminAgency = {
        ...MOCK_ADMIN_AGENCIES[agencyIndex], // Preserve existing data like id, createdAt, listingsCount, status, permissions
        name: agencyName,
        contactEmail: agencyEmail,
        agencyAddress: agencyAddress,
        description: agencyDescription,
        phoneNumber: agencyPhoneNumber,
        ownerName: ownerName,
        ownerEmail: ownerEmail,
    };
    
    MOCK_ADMIN_AGENCIES[agencyIndex] = updatedAgencyData;

    console.log('Détails Agence Mis à Jour (simulation) :', updatedAgencyData);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSubmitting(false);
    toast({
      title: "Agence Mise à Jour !",
      description: `Les informations pour ${agencyName} ont été mises à jour (simulation côté client).`,
    });
    router.push(`/admin/agencies/${agencyId}`); 
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Chargement des informations de l'agence...</div>;
  }

  if (!initialAgencyData) {
    return <div className="container mx-auto px-4 py-12 text-center">Agence non trouvée.</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Button variant="outline" size="sm" asChild className="mb-6">
        <Link href={`/admin/agencies/${agencyId}`}> 
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux Détails de l'Agence
        </Link>
      </Button>

      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Edit3Icon className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-bold">Modifier l'Agence</CardTitle>
          </div>
          <CardDescription>
            Mettez à jour les informations pour l'agence : {initialAgencyData.name}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <section>
              <h3 className="text-xl font-semibold mb-4 border-b pb-2">Informations de l'Agence</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="agencyName" className="flex items-center gap-1 mb-1"><Building className="h-4 w-4 text-muted-foreground"/>Nom de l'Agence *</Label>
                  <Input id="agencyName" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} placeholder="ex. Locations Auto Rapides" required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="agencyEmail" className="flex items-center gap-1 mb-1"><Mail className="h-4 w-4 text-muted-foreground"/>Email de Contact de l'Agence *</Label>
                    <Input id="agencyEmail" type="email" value={agencyEmail} onChange={(e) => setAgencyEmail(e.target.value)} placeholder="contact@agence.com" required />
                  </div>
                   <div>
                    <Label htmlFor="agencyPhoneNumber" className="flex items-center gap-1 mb-1"><Phone className="h-4 w-4 text-muted-foreground"/>Téléphone de l'Agence</Label>
                    <Input id="agencyPhoneNumber" type="tel" value={agencyPhoneNumber} onChange={(e) => setAgencyPhoneNumber(e.target.value)} placeholder="01 23 45 67 89" />
                  </div>
                </div>
                 <div>
                    <Label htmlFor="agencyAddress" className="flex items-center gap-1 mb-1"><MapPin className="h-4 w-4 text-muted-foreground"/>Adresse de l'Agence</Label>
                    <Input id="agencyAddress" value={agencyAddress} onChange={(e) => setAgencyAddress(e.target.value)} placeholder="123 Rue Principale, Ville" />
                  </div>
                 <div>
                    <Label htmlFor="agencyDescription" className="flex items-center gap-1 mb-1">Description de l'Agence</Label>
                    <Textarea id="agencyDescription" value={agencyDescription} onChange={(e) => setAgencyDescription(e.target.value)} placeholder="Décrivez brièvement votre agence..." rows={3} />
                  </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 border-b pb-2">Informations du Propriétaire/Contact Principal</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ownerName" className="flex items-center gap-1 mb-1"><User className="h-4 w-4 text-muted-foreground"/>Nom Complet du Propriétaire *</Label>
                  <Input id="ownerName" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="ex. Jean Dupont" required />
                </div>
                 <div>
                    <Label htmlFor="ownerEmail" className="flex items-center gap-1 mb-1"><Mail className="h-4 w-4 text-muted-foreground"/>Email du Propriétaire *</Label>
                    <Input id="ownerEmail" type="email" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} placeholder="proprietaire@example.com" required />
                </div>
              </div>
            </section>
            
            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              <Save className="mr-2 h-5 w-5" />
              {submitting ? 'Sauvegarde en cours...' : 'Sauvegarder les Modifications'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Les champs marqués d'un * sont obligatoires.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

    