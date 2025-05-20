
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
import { ArrowLeft, UserIcon, MailIcon, PhoneIcon, FileTextIcon, CalendarDaysIcon, Edit3Icon, Save, MapPinIcon } from 'lucide-react';
import { MOCK_CLIENTS } from '@/lib/constants';
import type { ClientProfile } from '@/types';

export default function AdminEditRenterPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const renterId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [initialRenterData, setInitialRenterData] = useState<ClientProfile | null>(null);

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseIssueYear, setLicenseIssueYear] = useState<number | ''>('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  

  useEffect(() => {
    if (renterId) {
      const renterToEdit = MOCK_CLIENTS.find(renter => renter.id === renterId);
      if (renterToEdit) {
        setInitialRenterData(renterToEdit);
        setFullName(renterToEdit.fullName);
        setEmail(renterToEdit.email);
        setPhone(renterToEdit.phone || '');
        setLicenseNumber(renterToEdit.licenseNumber || '');
        setLicenseIssueYear(renterToEdit.licenseIssueYear || '');
        setAddress(renterToEdit.address || '');
        setNotes(renterToEdit.notes || '');
      } else {
        toast({ title: "Locataire non trouvé", description: "Impossible de trouver les détails du locataire à modifier.", variant: "destructive" });
        router.push('/admin/renters');
      }
      setLoading(false);
    }
  }, [renterId, router, toast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    if (!fullName || !email ) {
      toast({ title: "Champs Obligatoires Manquants", description: "Le nom complet et l'email sont obligatoires.", variant: "destructive" });
      setSubmitting(false);
      return;
    }

    const renterIndex = MOCK_CLIENTS.findIndex(renter => renter.id === renterId);
    if (renterIndex === -1) {
        toast({ title: "Erreur", description: "Locataire non trouvé pour la mise à jour.", variant: "destructive" });
        setSubmitting(false);
        return;
    }
    
    const updatedRenterData: ClientProfile = {
        ...MOCK_CLIENTS[renterIndex], 
        fullName,
        email,
        phone: phone || undefined,
        licenseNumber: licenseNumber || undefined,
        licenseIssueYear: licenseIssueYear ? Number(licenseIssueYear) : undefined,
        address: address || undefined,
        notes: notes || undefined,
    };
    
    MOCK_CLIENTS[renterIndex] = updatedRenterData;

    console.log('Détails Locataire Mis à Jour (simulation) :', updatedRenterData);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSubmitting(false);
    toast({
      title: "Locataire Mis à Jour !",
      description: `Les informations pour ${fullName} ont été mises à jour (simulation côté client).`,
    });
    router.push(`/admin/renters/${renterId}`); 
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Chargement des informations du locataire...</div>;
  }

  if (!initialRenterData) {
    return <div className="container mx-auto px-4 py-12 text-center">Locataire non trouvé.</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Button variant="outline" size="sm" asChild className="mb-6">
        <Link href={`/admin/renters/${renterId}`}> 
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux Détails du Locataire
        </Link>
      </Button>

      <Card className="max-w-xl mx-auto shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Edit3Icon className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-bold">Modifier le Locataire</CardTitle>
          </div>
          <CardDescription>
            Mettez à jour les informations pour {initialRenterData.fullName}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="fullName" className="flex items-center gap-1 mb-1"><UserIcon className="h-4 w-4 text-muted-foreground"/>Nom Complet *</Label>
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="ex. Alice Merveille" required />
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="email" className="flex items-center gap-1 mb-1"><MailIcon className="h-4 w-4 text-muted-foreground"/>Email *</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alice@example.com" required />
                </div>
                <div>
                    <Label htmlFor="phone" className="flex items-center gap-1 mb-1"><PhoneIcon className="h-4 w-4 text-muted-foreground"/>Téléphone</Label>
                    <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="06 12 34 56 78" />
                </div>
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="licenseNumber" className="flex items-center gap-1 mb-1"><FileTextIcon className="h-4 w-4 text-muted-foreground"/>Numéro de Permis</Label>
                    <Input id="licenseNumber" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} placeholder="AB123456" />
                </div>
                <div>
                    <Label htmlFor="licenseIssueYear" className="flex items-center gap-1 mb-1"><CalendarDaysIcon className="h-4 w-4 text-muted-foreground"/>Année d'Émission du Permis</Label>
                    <Input id="licenseIssueYear" type="number" value={licenseIssueYear} onChange={(e) => setLicenseIssueYear(e.target.value ? parseInt(e.target.value) : '')} placeholder="ex. 2018" min="1900" max={new Date().getFullYear()} />
                </div>
            </div>
             <div>
                <Label htmlFor="address" className="flex items-center gap-1 mb-1"><MapPinIcon className="h-4 w-4 text-muted-foreground"/>Adresse</Label>
                <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Rue Imaginaire, Ville" />
            </div>
            <div>
                <Label htmlFor="notes" className="flex items-center gap-1 mb-1">Notes Administrateur</Label>
                <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes internes sur le locataire..." rows={3}/>
            </div>
            
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
